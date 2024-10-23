import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { Employee } from 'src/interfaces/employee';
import * as fs from 'fs';
import * as path from 'path';

Injectable();

export class RedisService {
  private readonly redisClient: Redis;
  constructor() {
    // this.redisClient = createClient({ url: process.env.REDIS_URL });
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    });
  }

  getConnection() {
    return this.redisClient;
  }

  async getEmployee(id: string) {
    const empData = await this.redisClient.hget('employees', id);
    // const empData = await this.redisClient.hgetall('employees');
    return empData;
  }

  // set employees using hash data structure
  async setEmployees(data: Employee[]): Promise<void> {
    data.forEach((emp) => {
      this.redisClient.hset('employees', emp.emp_id, JSON.stringify(emp));
    });
  }

  async updateEmployees(emp: Employee): Promise<void> {
    this.redisClient.hset('employees', emp.emp_id, JSON.stringify(emp));
  }

  async loadScriptInRedis() {
    const luaScript = path.join(
      process.cwd(),
      'src',
      'redis',
      'evaluate-rules.lua',
    );

    const sha1Hash = await this.redisClient.script(
      'LOAD',
      fs.readFileSync(luaScript, 'utf-8'),
    );

    // set the SHA1 hash in the cache
    await this.redisClient.set('LUA_HASH', sha1Hash as string);
    console.log({ sha1Hash });
    await this.storeRulesAndEmployees();

    return sha1Hash as string;
  }

  async deleteEmployee(): Promise<void> {
    this.redisClient.del('employees');
  }

  async executeDynamicRules(employees?: string[]): Promise<any> {
    const employeeIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    // Create a pipeline to execute multiple commands in a single round trip to Redis
    const pipeline = this.redisClient.pipeline();
    pipeline.get('LUA_HASH'); // Retrieve the cached Lua script SHA1 hash
    pipeline.setex('PROCESS_EMPLOYEES', 120, JSON.stringify(employeeIds));
    const [[, results]] = await pipeline.exec();

    const evaluateAllRules = 'true'; // Default behavior: stop after the first satisfied rule

    const luaArguments = [
      '1', // Rule Group as JSON string
      evaluateAllRules, // optional
    ];

    const redisKeys = ['PROCESS_EMPLOYEES'];

    const response = await this.redisClient.evalsha(
      results as string,
      redisKeys.length,
      ...redisKeys,
      ...luaArguments,
    );

    // Write the response to a file
    fs.writeFileSync(
      path.join(process.cwd(), 'src', 'constants', 'eligible-employees.json'),
      JSON.stringify(response),
    );

    return response;
  }

  async storeRulesAndEmployees(): Promise<any> {
    // Storing rules in Redis
    const ruleGroups = {
      1: {
        1: '(emp.experience > 10) and (emp.experience < 20) and (emp.performance_rating > 4.0)',
        2: "(emp.designation == 'Chief Architect') and (emp.department == 'HR')",
        3: '(emp.salary > 70000) and (emp.bonus > 5000)',
        4: '(emp.project_completion_rate > 95) and (emp.performance_goal_completion > 80)',
        5: '(emp.years_since_last_promotion < 3) and (emp.training_completed == true)',
        6: "(emp.preferred_work_location == 'Chicago') and (emp.remote_work == false)",
        7: '(emp.education == "Bachelor\'s")',
        8: "(emp.skills ~= nil and emp.languages_spoken ~= nil and emp.skills[1] == 'SQL' and emp.languages_spoken[1] == 'English')",
        9: "(emp.marital_status == 'Single') and (emp.gender == 'Female')",
        10: '(emp.performance_rating >= 4.5) and (emp.salary < 80000)',
        11: "(emp.designation == 'Software Engineer') and (emp.experience >= 5) and (emp.experience <= 15)",
        12: '(emp.experience > 5) and (emp.experience < 10) and (emp.salary > 50000)',
        13: "(emp.department == 'IT') and (emp.performance_rating > 4.0) or (emp.department == 'HR') and (emp.performance_rating > 4.5)",
        14: "emp.gender == 'Female' or emp.marital_status == 'Single'",
        15: "(emp.designation == 'Manager' or emp.designation == 'Business Analyst' or emp.designation == 'Product Manager' or emp.designation == 'Business Analyst' or emp.designation == 'Product Manager' or emp.designation == 'Business Analyst' or emp.designation == 'Product Manager' or emp.designation == 'Business Analyst' or emp.designation == 'Product Manager' or emp.designation == 'Business Analyst' or emp.designation == 'Product Manager' or emp.designation == 'Business Analyst' or emp.designation == 'Product Manager' or emp.designation == 'Business Analyst' or emp.designation == 'Product Manager' or emp.designation == 'Business Analyst' or emp.designation == 'Product Manager' or emp.designation == 'Business Analyst' or emp.designation == 'Product Manager' or emp.designation == 'Business Analyst' or emp.designation == 'Product Manager') and not_in_list(emp.skills, {'Python'})",
        16: "in_list(emp.skills, {'SQL'}) and not_in_list(emp.designation, {'SQL'})",
      },
      2: {
        1: '(emp.experience > 10) and (emp.experience < 20) and (emp.performance_rating > 4.0)',
        2: "(emp.designation == 'Chief Architect') and (emp.department == 'HR')",
        3: '(emp.salary > 70000) and (emp.bonus > 5000)',
        4: '(emp.project_completion_rate > 95) and (emp.performance_goal_completion > 80)',
        5: '(emp.years_since_last_promotion < 3) and (emp.training_completed == true)',
        6: "(emp.preferred_work_location == 'Chicago') and (emp.remote_work == false)",
        7: '(emp.education == "Bachelor\'s")',
        8: "(emp.skills ~= nil and emp.languages_spoken ~= nil and emp.skills[1] == 'SQL' and emp.languages_spoken[1] == 'English')",
        9: "(emp.marital_status == 'Single') and (emp.gender == 'Female')",
        10: '(emp.performance_rating >= 4.5) and (emp.salary < 80000)',
        11: "(emp.designation == 'Software Engineer') and (emp.experience >= 5) and (emp.experience <= 15)",
        12: '(emp.experience > 5) and (emp.experience < 10) and (emp.salary > 50000)',
        13: "(emp.department == 'IT') and (emp.performance_rating > 4.0) or (emp.department == 'HR') and (emp.performance_rating > 4.5)",
        14: "emp.gender == 'Female' or emp.marital_status == 'Single'",
        15: "(emp.designation == 'Manager' or emp.designation == 'Business Analyst' or emp.designation == 'Product Manager' or emp.designation == 'Business Analyst' or emp.designation == 'Product Manager' or emp.designation == 'Business Analyst' or emp.designation == 'Product Manager' or emp.designation == 'Business Analyst' or emp.designation == 'Product Manager' or emp.designation == 'Business Analyst' or emp.designation == 'Product Manager' or emp.designation == 'Business Analyst' or emp.designation == 'Product Manager' or emp.designation == 'Business Analyst' or emp.designation == 'Product Manager' or emp.designation == 'Business Analyst' or emp.designation == 'Product Manager' or emp.designation == 'Business Analyst' or emp.designation == 'Product Manager' or emp.designation == 'Business Analyst' or emp.designation == 'Product Manager') and not_in_list(emp.skills, {'Python'})",
        16: "in_list(emp.skills, {'SQL'}) and not_in_list(emp.designation, {'SQL'})",
      },
    };

    // Convert the rule groups to a JSON string since Redis doesn't support nested objects directly
    const serializedRuleGroups = JSON.stringify(ruleGroups);

    // Store in Redis as a string
    // Iterate over each ruleGroupId and store each group in Redis hash
    for (const ruleGroupId in ruleGroups) {
      const ruleGroup = ruleGroups[ruleGroupId];
      await this.redisClient.hset(
        'rules',
        ruleGroupId,
        JSON.stringify(ruleGroup),
      );
    }
  }
}
