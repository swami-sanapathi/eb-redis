local rulesJson = ARGV[1]                  -- JSON string containing rule IDs
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

-- Decode the rules argument
local ruleIds = cjson.decode(rulesJson)

-- Prepare rule keys for MGET
local ruleKeys = {}
for _, ruleId in ipairs(ruleIds) do
  table.insert(ruleKeys, "rules:" .. ruleId)
end

-- Fetch all rules from Redis using MGET
local rules = redis.call('MGET', unpack(ruleKeys))

-- Check if all rules were fetched successfully
for i, rule in ipairs(rules) do
  if not rule then
    local ruleId = ruleIds[i]
    redis.log(redis.LOG_NOTICE, "Rule not found for ID: " .. ruleId)
    return redis.error_reply("Rule not found for ID: " .. ruleId)
  end
end

-- Pre-compile rules with rule IDs as keys
local compiledRules = {}
for i, rule in ipairs(rules) do
  local ruleFunc, err = loadstring("return " .. rule)
  if ruleFunc then
    local ruleId = ruleIds[i]        -- Get the corresponding ruleId
    compiledRules[ruleId] = ruleFunc -- Store rule function with ruleId as key
  else
    redis.log(redis.LOG_NOTICE, "Compilation error: " .. err)
    return redis.error_reply("Compilation error: " .. err)
  end
end

-- Helper function to process each employee batch directly with employee data
local function processEmployees(employeeDataBatch)
  -- Process each employee in the batch directly with data
  for _, empData in ipairs(employeeDataBatch) do
    if empData then
      local emp = cjson.decode(empData)
      local satisfiedRules = {}

      -- Evaluate precompiled rules for each employee using ruleId
      for ruleId, ruleFunc in pairs(compiledRules) do -- Use pairs here for ruleId
        local env = { emp = emp, in_list = in_list, not_in_list = not_in_list }
        setfenv(ruleFunc, env)                        -- Set environment for rule execution

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
        table.insert(eligibleEmployees, { emp_id = emp.emp_id, rules_satisfied = satisfiedRules }) -- Use emp.emp_id
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
  -- Decode cached employee IDs
  local employeeIds = cjson.decode(employeeIdsData)
  local employeeCount = #employeeIds

  -- Process in batches if there are more than batchSize employees
  for i = 1, employeeCount, batchSize do
    -- Fetch a batch of employee IDs (batchSize or the remaining employees if < batchSize)
    local batch = {}
    for j = i, math.min(i + batchSize - 1, employeeCount) do
      table.insert(batch, employeeIds[j])
    end

    -- Fetch employee data for the current batch from the `employees` hash
    local employeeDataBatch = redis.call('HMGET', 'employees', unpack(batch))

    -- Process the current batch of employees directly with data
    processEmployees(employeeDataBatch)
  end
else
  -- If `KEYS[1]` cache is empty, use HSCAN to fetch employees and their data in batches
  local cursor = "0"
  repeat
    -- Fetch a batch of employee IDs and their data using HSCAN
    local result = redis.call('HSCAN', 'employees', cursor, 'COUNT', batchSize)
    cursor = result[1]
    local employees = result[2]

    -- Prepare batch keys and data to be processed directly
    local batchKeys = {}
    local employeeDataBatch = {}
    for i = 1, #employees, 2 do
      local empKey = employees[i]
      local empData = employees[i + 1]
      table.insert(batchKeys, empKey)
      table.insert(employeeDataBatch, empData) -- Directly collect employee data
    end

    -- Process the current batch of employees directly with their data
    processEmployees(employeeDataBatch)
  until cursor == "0" -- Continue until all employees are processed
end

-- Return eligible employees with satisfied rule indices
return cjson.encode(eligibleEmployees)
