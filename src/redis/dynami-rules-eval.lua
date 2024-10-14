local employees = redis.call('HGETALL', 'employees')
local eligibleEmployees = {}

-- Number of dynamic rules passed
local ruleCount = tonumber(ARGV[2])

-- Loop through each employee
for i = 1, #employees, 2 do
  local emp = cjson.decode(employees[i+1])
  local satisfiedRules = {}

  -- Loop through each rule and evaluate it dynamically
  for ruleIndex = 1, ruleCount do
    local rule = ARGV[2 + ruleIndex]

    -- Create a local environment for the employee
    local env = {
      emp = emp
    }

    -- Load and evaluate the rule with the employee environment
    local ruleFunc, err = load("return " .. rule, "rule", "t", env)

    if ruleFunc then
      local success, result = pcall(ruleFunc)
      if success and result then
        table.insert(satisfiedRules, ruleIndex) -- Rule is satisfied
      end
    else
      -- Handle errors (e.g., malformed rules)
      redis.log(redis.LOG_NOTICE, "Error loading rule: " .. err)
    end
  end

  -- If any rules are satisfied, add the employee to the result
  if #satisfiedRules > 0 then
    table.insert(eligibleEmployees, {id = employees[i], rules_satisfied = satisfiedRules})
  end
end

-- Return eligible employees with satisfied rule indices
return cjson.encode(eligibleEmployees)
