-- Helper function to evaluate a condition
local function evaluate_condition(emp, field, operator, value)
    local emp_value = emp[field]

    -- Handle different operators
    if operator == "==" then
        return emp_value == value
    elseif operator == "!=" then
        return emp_value ~= value
    elseif operator == ">" then
        return tonumber(emp_value) > tonumber(value)
    elseif operator == "<" then
        return tonumber(emp_value) < tonumber(value)
    elseif operator == ">=" then
        return tonumber(emp_value) >= tonumber(value)
    elseif operator == "<=" then
        return tonumber(emp_value) <= tonumber(value)
    elseif operator == "CONTAINS" then
        return emp_value and string.find(emp_value, value) ~= nil
    elseif operator == "IN" then
        -- value is expected to be a table
        for _, v in ipairs(value) do
            if emp_value == v then
                return true
            end
        end
        return false
    else
        return false -- Unknown operator
    end
end

-- Helper function to evaluate a group of conditions using AND or OR logic
local function evaluate_conditions(emp, conditions, logic_operator)
    if logic_operator == "AND" then
        -- All conditions must be true
        for _, condition in ipairs(conditions) do
            if not evaluate_condition(emp, condition.field, condition.operator, condition.value) then
                return false
            end
        end
        return true
    elseif logic_operator == "OR" then
        -- At least one condition must be true
        for _, condition in ipairs(conditions) do
            if evaluate_condition(emp, condition.field, condition.operator, condition.value) then
                return true
            end
        end
        return false
    else
        return false -- Unknown logic operator
    end
end

-- Parse input arguments
local rules = {
    -- Rule 1: gender = 'Male' AND location = 'Tokyo' AND salary > 50000 AND (performance_rating > 1.0 OR annual_leave_balance > 15)
    {
        logic_operator = "AND",
        conditions = {
            { field = "gender", operator = "==", value = "Male" },
            { field = "location", operator = "==", value = "Tokyo" },
            { field = "salary", operator = ">", value = "50000" },
            { logic_operator = "OR", conditions = {
                { field = "performance_rating", operator = ">", value = "1.0" },
                { field = "annual_leave_balance", operator = ">", value = "15" }
            }}
        }
    },

    -- Rule 2: employee_type = 'Permanent' AND (location = 'Chicago' OR location = 'New York') AND experience > 5
    {
        logic_operator = "AND",
        conditions = {
            { field = "employee_type", operator = "==", value = "Permanent" },
            { logic_operator = "OR", conditions = {
                { field = "location", operator = "==", value = "Chicago" },
                { field = "location", operator = "==", value = "New York" }
            }},
            { field = "experience", operator = ">", value = "5" }
        }
    },

    -- Rule 3: (department = 'HR' OR department = 'Finance') AND project_completion_rate > 90 AND (performance_goal_completion > 70 OR direct_reports > 5)
    {
        logic_operator = "AND",
        conditions = {
            { logic_operator = "OR", conditions = {
                { field = "department", operator = "==", value = "HR" },
                { field = "department", operator = "==", value = "Finance" }
            }},
            { field = "project_completion_rate", operator = ">", value = "90" },
            { logic_operator = "OR", conditions = {
                { field = "performance_goal_completion", operator = ">", value = "70" },
                { field = "direct_reports", operator = ">", value = "5" }
            }}
        }
    },

    -- Rule 4: (skills CONTAINS 'Python' OR skills CONTAINS 'Java') AND languages_spoken CONTAINS 'English' AND training_completed = true AND status = 'Active'
    {
        logic_operator = "AND",
        conditions = {
            { logic_operator = "OR", conditions = {
                { field = "skills", operator = "CONTAINS", value = "Python" },
                { field = "skills", operator = "CONTAINS", value = "Java" }
            }},
            { field = "languages_spoken", operator = "CONTAINS", value = "English" },
            { field = "training_completed", operator = "==", value = "true" },
            { field = "status", operator = "==", value = "Active" }
        }
    },

    -- Rule 5: work_shift = 'Night' AND (location = 'Tokyo' OR location = 'London') AND (overtime_eligibility = true OR annual_leave_balance > 10)
    {
        logic_operator = "AND",
        conditions = {
            { field = "work_shift", operator = "==", value = "Night" },
            { logic_operator = "OR", conditions = {
                { field = "location", operator = "==", value = "Tokyo" },
                { field = "location", operator = "==", value = "London" }
            }},
            { logic_operator = "OR", conditions = {
                { field = "overtime_eligibility", operator = "==", value = "true" },
                { field = "annual_leave_balance", operator = ">", value = "10" }
            }}
        }
    }
}

local employee_keys = redis.call('KEYS', 'employee:*') -- Get all employee keys
local result = {}

-- Iterate over each employee
for _, emp_key in ipairs(employee_keys) do
    -- Get the employee hash
    local emp = redis.call('HGETALL', emp_key)
    local emp_data = {}

    -- Convert the flat HGETALL result into a table
    for i = 1, #emp, 2 do
        emp_data[emp[i]] = emp[i + 1]
    end

    -- Check each rule
    for rule_id, rule in ipairs(rules) do
        -- Evaluate the conditions using the rule's logic operator (AND/OR)
        local all_conditions_met = evaluate_conditions(emp_data, rule.conditions, rule.logic_operator)

        -- If all conditions are met, add the rule_id and employee_id to the result
        if all_conditions_met then
            local emp_id = string.gsub(emp_key, 'employee:', '') -- Extract employee ID
            table.insert(result, { rule_id = rule_id, emp_id = emp_id })
        end
    end
end

-- Return the result
return cjson.encode(result)
