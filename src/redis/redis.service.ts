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

  async getEmployee(id: string) {
    const empData = await this.redisClient.hget('employees', id);
    return empData;
  }

  // set employees using hash data structure
  async setEmployees(data: Employee[]): Promise<void> {
    data.forEach((emp) => {
      this.redisClient.hset('employees', emp.emp_id, JSON.stringify(emp));
    });
  }

  async updateEmployees(data: Employee[]): Promise<void> {
    data.forEach((emp) => {
      this.redisClient.hset('employees', emp.emp_id, JSON.stringify(emp));
    });
  }

  async loadScriptInRedis() {
    const luaScript = path.join(
      process.cwd(),
      'src',
      'redis',
      'readability.lua',
    );

    const sha1Hash = await this.redisClient.script(
      'LOAD',
      fs.readFileSync(luaScript, 'utf-8'),
    );

    console.log(sha1Hash);
    console.log(typeof sha1Hash);

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
    const luaHash = await this.redisClient.get('LUA_HASH'); // Retrieve the cached Lua script SHA1 hash

    // Employee IDs to store in PROCESS_EMPLOYEES
    const employeeIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

    // Store employee IDs as a list in PROCESS_EMPLOYEES
    this.redisClient
      .setex('PROCESS_EMPLOYEES', 120, JSON.stringify(employeeIds))
      .then(() => {
        console.log('PROCESS_EMPLOYEES stored successfully');
      })
      .catch((err) => {
        console.error('Error setting PROCESS_EMPLOYEES:', err);
      });

    const evaluateAllRules = 'true'; // Default behavior: stop after the first satisfied rule

    const luaArguments = [
      JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]), // Rules JSON string
      evaluateAllRules, // optional
    ];

    const redisKeys = ['PROCESS_EMPLOYEES'];

    const response = await this.redisClient.evalsha(
      luaHash,
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
    const rules = {
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
    };

    // Prepare the arguments for MSET in the format ['key1', 'value1', 'key2', 'value2', ...]
    const msetArgs = [];
    Object.keys(rules).forEach((ruleId) => {
      msetArgs.push(`rules:${ruleId}`, rules[ruleId]);
    });

    // Use MSET to store all rules in one Redis command
    this.redisClient
      .mset(msetArgs)
      .then(() => {
        console.log('All rules stored successfully in one step');
      })
      .catch((err) => {
        console.error('Error storing rules:', err);
      });

    return 'Rules and employees stored successfully';
  }
}
