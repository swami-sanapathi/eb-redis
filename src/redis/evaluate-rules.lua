local ruleGroupId = ARGV[1]                -- ruleGroupId passed as an argument
local evaluateAllRules = ARGV[2] == "true" -- Optional flag to evaluate all rules or stop after the first match
local eligibleEmployees = {}
local batchSize = 100                      -- Default batch size

-- Helper function to convert a list to a set (table with values as keys)
local function list_to_set(list)
  local set = {}
  for _, value in ipairs(list) do
    set[value] = true
  end
  return set
end

-- Helper function to check if any value in emp_value_list is in the rule_list
local function in_list(emp_value_list, rule_list)
  local rule_set = list_to_set(rule_list) -- Convert rule_list to a set for O(1) lookup
  for _, emp_value in ipairs(emp_value_list) do
    if rule_set[emp_value] then
      return true -- Found a match, return true
    end
  end
  return false -- No match found
end

-- Helper function to check if none of the values in emp_value_list are in rule_list
local function not_in_list(emp_value_list, rule_list)
  return not in_list(emp_value_list, rule_list) -- Simply negate the result of in_list
end


-- Fetch the specific ruleGroup by ruleGroupId from Redis
local ruleGroupJson = redis.call('HGET', 'rules', ruleGroupId)
if not ruleGroupJson then
  return redis.error_reply("Rule group not found for ID: " .. ruleGroupId)
end

-- Decode the fetched rule group JSON
local success, ruleGroup = pcall(cjson.decode, ruleGroupJson)
if not success then
  redis.log(redis.LOG_NOTICE, "JSON decoding error: " .. ruleGroupJson)
  return redis.error_reply("Failed to decode rule group JSON")
end

-- Pre-compile the rules in the rule group
local compiledRules = {}
for ruleId, rule in pairs(ruleGroup) do
  local ruleFunc, err = loadstring("return " .. rule)
  if ruleFunc then
    compiledRules[ruleId] = ruleFunc
  else
    redis.log(redis.LOG_NOTICE, "Compilation error: " .. err)
    return redis.error_reply("Compilation error: " .. err)
  end
end

-- Helper function to process each employee batch directly with employee data
local function processEmployees(employeeDataBatch)
  for _, empData in ipairs(employeeDataBatch) do
    if empData then
      local emp = cjson.decode(empData)
      local satisfiedRules = {}

      -- Evaluate precompiled rules for each employee using ruleId
      for ruleId, ruleFunc in pairs(compiledRules) do
        local env = { emp = emp, in_list = in_list, not_in_list = not_in_list }
        setfenv(ruleFunc, env) -- Set environment for rule execution

        -- Safely execute the precompiled rule with the employee context
        local success, result = pcall(ruleFunc)
        if success and result then
          table.insert(satisfiedRules, ruleId) -- Store ruleId, not ruleIndex

          -- Stop checking if evaluateAllRules is false (stop at first satisfied rule)
          if not evaluateAllRules then
            break
          end
        end
      end

      -- If any rules are satisfied, add the employee to the result using emp.emp_id
      if #satisfiedRules > 0 then
        table.insert(eligibleEmployees, { emp_id = emp.emp_id, rules_satisfied = satisfiedRules })
      end
    end
  end
end

-- Check if `PROCESS_EMPLOYEES` key exists in the cache
local employeeIdsData
if #KEYS > 0 then
  employeeIdsData = redis.call('GET', KEYS[1])
end
if employeeIdsData then
  local employeeIds = cjson.decode(employeeIdsData)
  local employeeCount = #employeeIds

  -- Process employees in batches
  for i = 1, employeeCount, batchSize do
    local batch = {}
    for j = i, math.min(i + batchSize - 1, employeeCount) do
      table.insert(batch, employeeIds[j])
    end

    -- Fetch employee data for the current batch from Redis
    local employeeDataBatch = redis.call('HMGET', 'employees', unpack(batch))

    -- Process the current batch of employees
    processEmployees(employeeDataBatch)
  end
else
  -- If no employee data is cached, fetch all employees using HSCAN
  local cursor = "0"
  repeat
    local result = redis.call('HSCAN', 'employees', cursor, 'COUNT', batchSize)
    cursor = result[1]
    local employees = result[2]

    local employeeDataBatch = {}
    for i = 1, #employees, 2 do
      table.insert(employeeDataBatch, employees[i + 1])
    end

    -- Process the current batch of employees
    processEmployees(employeeDataBatch)
  until cursor == "0" -- Continue until all employees are processed
end

-- Return eligible employees with satisfied rule IDs
return cjson.encode(eligibleEmployees)
