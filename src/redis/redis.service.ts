import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { Employee } from 'src/interfaces/employee';
import * as fs from 'fs';
import * as path from 'path';

Injectable();

export class RedisService {
  private readonly redisClient: RedisClientType;
  constructor() {
    this.redisClient = createClient({ url: process.env.REDIS_URL });
  }

  async onModuleInit() {
    await this.redisClient.connect();
  }

  async onModuleDestroy() {
    await this.redisClient.disconnect();
  }

  async getEmployee(id: string) {
    const empData = await this.redisClient.HGET('employees', '1');
    return empData;
  }

  // set employees using hash data structure
  async setEmployees(data: Employee[]): Promise<void> {
    data.forEach((emp) => {
      this.redisClient.hSet('employees', emp.emp_id, JSON.stringify(emp));
    });
  }

  async deleteEmployee(): Promise<void> {
    this.redisClient.del('employees');
  }

  // execute eligibility builder rules on employee data using redis lua script, and then
  // return the satisfied employee id with eligibility status
  async executeEligibilityBuilderRules(): Promise<any> {
    const luaScript = `
local currentTimestamp = tonumber(ARGV[1])
local sixMonthsAgo = currentTimestamp - (6 * 30 * 24 * 60 * 60)

local employees = redis.call('HGETALL', 'employees')
local eligibleEmployees = {}

for i = 1, #employees, 2 do
  local emp = cjson.decode(employees[i+1])
  local satisfiedRules = {}

  -- Rule 1: Experience and Performance Rating
  if emp.experience and emp.performance_rating and emp.experience > 10 and emp.experience < 20 and emp.performance_rating > 4.0 then
    table.insert(satisfiedRules, 1)
  end

  -- Rule 2: Designation and Department
  if emp.designation == 'Chief Architect' and emp.department == 'HR' then
    table.insert(satisfiedRules, 2)
  end

  -- Rule 3: Salary and Bonus
  if emp.salary and emp.bonus and emp.salary > 70000 and emp.bonus > 5000 then
    table.insert(satisfiedRules, 3)
  end

  -- Rule 4: Project Completion Rate and Performance Goal Completion
  if emp.project_completion_rate and emp.performance_goal_completion and emp.project_completion_rate > 95 and emp.performance_goal_completion > 80 then
    table.insert(satisfiedRules, 4)
  end

  -- Rule 5: Years Since Last Promotion and Training Completed
  if emp.years_since_last_promotion and emp.training_completed and emp.years_since_last_promotion < 3 and emp.training_completed == true then
    table.insert(satisfiedRules, 5)
  end

  -- Rule 6: Preferred Work Location and Remote Work
  if emp.preferred_work_location == 'Chicago' and emp.remote_work == false then
    table.insert(satisfiedRules, 6)
  end

  -- Rule 7: Education and Certifications
  if emp.education == "Bachelor's" and emp.certifications then
    for _, cert in ipairs(emp.certifications) do
      if cert == 'PMP' or cert == 'Scrum Master' then
        table.insert(satisfiedRules, 7)
        break
      end
    end
  end

  -- Rule 9: Skills and Languages Spoken
  if emp.skills and emp.languages_spoken then
    local hasSQL, speaksEnglish = false, false
    for _, skill in ipairs(emp.skills) do
      if skill == 'SQL' then
        hasSQL = true
        break
      end
    end
    for _, language in ipairs(emp.languages_spoken) do
      if language == 'English' then
        speaksEnglish = true
        break
      end
    end
    if hasSQL and speaksEnglish then
      table.insert(satisfiedRules, 9)
    end
  end

  -- Rule 10: Marital Status and Gender
  if emp.marital_status == 'Single' and emp.gender == 'Female' then
    table.insert(satisfiedRules, 10)
  end

  -- Rule 11: Performance Rating and Salary
  if emp.performance_rating and emp.salary and emp.performance_rating >= 4.5 and emp.salary < 80000 then
    table.insert(satisfiedRules, 11)
  end

  -- Rule 12: Designation and Experience
  if emp.designation == 'Software Engineer' and emp.experience and emp.experience >= 5 and emp.experience <= 15 then
    table.insert(satisfiedRules, 12)
  end

  -- If any rules are satisfied, add the employee to the result
  if #satisfiedRules > 0 then
    table.insert(eligibleEmployees, {id = employees[i], rules_satisfied = satisfiedRules})
  end
end

return cjson.encode(eligibleEmployees)

`;

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const response = await this.redisClient.eval(luaScript, {
      keys: [],
      arguments: [currentTimestamp.toString()],
    });

    // Write the response to a file
    fs.writeFileSync(
      path.join(process.cwd(), 'src', 'constants', 'eligible-employees.json'),
      JSON.stringify(response),
    );

    return response;
  }
  async executeDynamicRules(): Promise<any> {
    const luaScript = `
    local currentTimestamp = tonumber(ARGV[1])
    local batchSize = tonumber(ARGV[2])
    local eligibleEmployees = {}
  
    -- Pre-compile rules once
    local ruleCount = tonumber(ARGV[3])
    local compiledRules = {}
  
    for ruleIndex = 1, ruleCount do
      local rule = ARGV[3 + ruleIndex]
      local ruleFunc, err = loadstring("return " .. rule)
      if ruleFunc then
        table.insert(compiledRules, ruleFunc) -- Store precompiled rule
      else
        redis.log(redis.LOG_NOTICE, "Error loading rule: " .. err)
      end
    end
  
    -- Fetch employees in batches
    local cursor = "0"
    repeat
      -- Fetch a batch of employees using HSCAN to avoid fetching everything at once
      local result = redis.call('HSCAN', 'employees', cursor, 'COUNT', batchSize)
      cursor = result[1]
      local employees = result[2]
  
      -- Process each employee in the batch
      for i = 1, #employees, 2 do
        local emp = cjson.decode(employees[i+1])
        local satisfiedRules = {}
  
        -- Evaluate precompiled rules for the employee
        for ruleIndex, ruleFunc in ipairs(compiledRules) do
          -- Set the employee environment
          local env = { emp = emp }
          setfenv(ruleFunc, env)
  
          -- Safely execute the precompiled rule
          local success, result = pcall(ruleFunc)
          if success and result then
            table.insert(satisfiedRules, ruleIndex) -- Rule is satisfied
          end
        end
  
        -- If any rules are satisfied, add the employee to the result
        if #satisfiedRules > 0 then
          table.insert(eligibleEmployees, {id = employees[i], rules_satisfied = satisfiedRules})
        end
      end
    until cursor == "0"  -- Continue until the end of the hash
  
    -- Return eligible employees with satisfied rule indices
    return cjson.encode(eligibleEmployees)
    `;

    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Define dynamic rules as an array of strings
    const rules = [
      '(emp.experience > 10) and (emp.experience < 20) and (emp.performance_rating > 4.0)',
      "(emp.designation == 'Chief Architect') and (emp.department == 'HR')",
      '(emp.salary > 70000) and (emp.bonus > 5000)',
      '(emp.project_completion_rate > 95) and (emp.performance_goal_completion > 80)',
      '(emp.years_since_last_promotion < 3) and (emp.training_completed == true)',
      "(emp.preferred_work_location == 'Chicago') and (emp.remote_work == false)",
      '(emp.education == "Bachelor\'s")',
      "(emp.skills ~= nil and emp.languages_spoken ~= nil and emp.skills[1] == 'SQL' and emp.languages_spoken[1] == 'English')",
      "(emp.marital_status == 'Single') and (emp.gender == 'Female')",
      '(emp.performance_rating >= 4.5) and (emp.salary < 80000)',
      "(emp.designation == 'Software Engineer') and (emp.experience >= 5) and (emp.experience <= 15)",
      "(emp.experience > 5) and (emp.experience < 10) and (emp.salary > 50000)",
      "(emp.department == 'Engineering') and (emp.performance_rating > 4.0) or (emp.department == 'HR') and (emp.performance_rating > 4.5)",
      "emp.gender = 'female' or emp.marital_status = 'single'",
    ];

    // Pass the current timestamp, batch size, and rules to the Lua script
    const batchSize = 100; // Process 100 employees at a time
    const luaArguments = [
      currentTimestamp.toString(),
      batchSize.toString(),
      rules.length.toString(),
      ...rules,
    ];

    const response = await this.redisClient.eval(luaScript, {
      keys: [],
      arguments: luaArguments,
    });

    // Write the response to a file
    fs.writeFileSync(
      path.join(process.cwd(), 'src', 'constants', 'eligible-employees.json'),
      JSON.stringify(response),
    );

    return response;
  }
}
