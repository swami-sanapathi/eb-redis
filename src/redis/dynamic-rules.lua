local batchSize = tonumber(ARGV[1])
local evaluateAllRules = ARGV[2] == "true" -- If "true", evaluate all rules; default is to stop after first match
local eligibleEmployees = {}

-- Pre-compile rules once
local ruleCount = tonumber(ARGV[3])
local compiledRules = {}

for ruleIndex = 1, ruleCount do
  local rule = ARGV[3 + ruleIndex]

  -- Use loadstring to compile the rule (Lua 5.1 compatible)
  local ruleFunc, err = loadstring("return " .. rule)

  if ruleFunc then
    table.insert(compiledRules, ruleFunc) -- Store the precompiled rule function
  else
    redis.log(redis.LOG_NOTICE, "Compilation error: " .. err)
  end
end

-- Optional employees argument
local employeeCount = tonumber(ARGV[3 + ruleCount + 1])

if employeeCount > 0 then
  -- If employees are provided, evaluate only those employees
  for i = 1, employeeCount do
    local empKey = ARGV[3 + ruleCount + 1 + i]
    local empData = redis.call('HGET', 'employees', empKey)

    if empData then
      local emp = cjson.decode(empData)
      local satisfiedRules = {}

      -- Evaluate precompiled rules for the employee
      for ruleIndex, ruleFunc in ipairs(compiledRules) do
        -- Set the employee environment using setfenv (Lua 5.1 compatible)
        local env = { emp = emp }
        setfenv(ruleFunc, env) -- Use setfenv to set the environment

        -- Safely execute the precompiled rule with the employee context
        local success, result = pcall(ruleFunc)

        if success and result then
          table.insert(satisfiedRules, ruleIndex) -- Rule is satisfied

          -- Default behavior: stop checking if one rule is satisfied
          if not evaluateAllRules then
            break -- Exit loop if we're only evaluating until the first satisfied rule
          end
        end
      end

      -- If any rules are satisfied, add the employee to the result
      if #satisfiedRules > 0 then
        table.insert(eligibleEmployees, { id = empKey, rules_satisfied = satisfiedRules })
      end
    end
  end
else
  -- If no employees are provided, evaluate all employees using HSCAN
  local cursor = "0"
  repeat
    -- Fetch a batch of employees using HSCAN
    local result = redis.call('HSCAN', 'employees', cursor, 'COUNT', batchSize)
    cursor = result[1]
    local employees = result[2]

    -- Process each employee in the batch
    for i = 1, #employees, 2 do
      local empKey = employees[i]
      local empData = employees[i + 1]

      if empData then
        local emp = cjson.decode(empData)
        local satisfiedRules = {}

        -- Evaluate precompiled rules for the employee
        for ruleIndex, ruleFunc in ipairs(compiledRules) do
          -- Set the employee environment using setfenv (Lua 5.1 compatible)
          local env = { emp = emp }
          setfenv(ruleFunc, env) -- Use setfenv to set the environment

          -- Safely execute the precompiled rule with the employee context
          local success, result = pcall(ruleFunc)

          if success and result then
            table.insert(satisfiedRules, ruleIndex) -- Rule is satisfied

            -- Default behavior: stop checking if one rule is satisfied
            if not evaluateAllRules then
              break -- Exit loop if we're only evaluating until the first satisfied rule
            end
          end
        end

        -- If any rules are satisfied, add the employee to the result
        if #satisfiedRules > 0 then
          table.insert(eligibleEmployees, { id = empKey, rules_satisfied = satisfiedRules })
        end
      end
    end
  until cursor == "0" -- Continue until the end of the hash
end

-- Return eligible employees with satisfied rule indices
return cjson.encode(eligibleEmployees)
