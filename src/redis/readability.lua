local rulesJson = ARGV[1] -- JSON string containing rule IDs
local evaluateAllRules = ARGV[2] == "true" -- Optional flag to evaluate all rules or stop after the first match
local eligibleEmployees = {}
local batchSize = 100 -- Default batch size

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

-- Pre-compile rules once
local compiledRules = {}
for _, rule in ipairs(rules) do
  local ruleFunc, err = loadstring("return " .. rule)
  if ruleFunc then
    table.insert(compiledRules, ruleFunc) -- Store the precompiled rule function
  else
    redis.log(redis.LOG_NOTICE, "Compilation error: " .. err)
    return redis.error_reply("Compilation error: " .. err)
  end
end

-- Function to process each employee batch
local function processEmployees(batch)
  -- Fetch employee data for the current batch from the `employees` hash
  local employeeDataBatch = redis.call('HMGET', 'employees', unpack(batch))

  -- Process each employee in the batch
  for k, empData in ipairs(employeeDataBatch) do
    if empData then
      local emp = cjson.decode(empData)
      local satisfiedRules = {}

      -- Evaluate precompiled rules for each employee
      for ruleIndex, ruleFunc in ipairs(compiledRules) do
        local env = { emp = emp }
        setfenv(ruleFunc, env) -- Set environment for rule execution

        -- Safely execute the precompiled rule with the employee context
        local success, result = pcall(ruleFunc)
        if success and result then
          table.insert(satisfiedRules, ruleIndex) -- Rule satisfied

          -- Stop checking if evaluateAllRules is false (stop at first satisfied rule)
          if not evaluateAllRules then
            break
          end
        end
      end

      -- If any rules are satisfied, add the employee to the result
      if #satisfiedRules > 0 then
        table.insert(eligibleEmployees, { id = batch[k], rules_satisfied = satisfiedRules })
      end
    end
  end
end

-- Check if `PROCESS_EMPLOYEES` key exists in the cache
local employeeIdsData = redis.call('GET', 'PROCESS_EMPLOYEES')

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

    -- Process the current batch of employees
    processEmployees(batch)
  end

else
  -- If `PROCESS_EMPLOYEES` cache is empty, use HSCAN to fetch employees in batches
  local cursor = "0"
  repeat
    -- Fetch a batch of employee IDs using HSCAN
    local result = redis.call('HSCAN', 'employees', cursor, 'COUNT', batchSize)
    cursor = result[1]
    local employees = result[2]

    -- Process each employee in the batch
    local batch = {}
    for i = 1, #employees, 2 do
      local empKey = employees[i]
      table.insert(batch, empKey)
    end

    -- Process the current batch of employees
    processEmployees(batch)
  until cursor == "0" -- Continue until all employees are processed
end

-- Return eligible employees with satisfied rule indices
return cjson.encode(eligibleEmployees)
