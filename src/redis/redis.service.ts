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

  async loadScriptInRedis() {
    const luaScript = path.join(
      process.cwd(),
      'src',
      'redis',
      'readability.lua',
    );

    const sha1Hash = await this.redisClient.scriptLoad(
      fs.readFileSync(luaScript, 'utf-8'),
    );

    // set the SHA1 hash in the cache
    await this.redisClient.set('LUA_HASH', sha1Hash);
    console.log({ sha1Hash });
    await this.storeRulesAndEmployees();

    return sha1Hash;
  }

  async deleteEmployee(): Promise<void> {
    this.redisClient.del('employees');
  }

  async executeDynamicRules(employees?: string[]): Promise<any> {
    const luaHash = await this.redisClient.get('LUA_HASH'); // Retrieve the cached Lua script SHA1 hash

    const evaluateAllRules = 'true'; // Default behavior: stop after the first satisfied rule

    const luaArguments = [
      JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]), // Rules JSON string
      evaluateAllRules, // optional
    ];

    const response = await this.redisClient.evalSha(luaHash, {
      keys: [],
      arguments: luaArguments,
    });

    // Write the response to a file
    // fs.writeFileSync(
    //   path.join(process.cwd(), 'src', 'constants', 'eligible-employees.json'),
    //   JSON.stringify(response),
    // );

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
      13: "(emp.department == 'Engineering') and (emp.performance_rating > 4.0) or (emp.department == 'HR') and (emp.performance_rating > 4.5)",
      14: "emp.gender == 'Female' or emp.marital_status == 'Single'",
    };

    // Prepare the arguments for MSET in the format ['key1', 'value1', 'key2', 'value2', ...]
    const msetArgs = [];
    Object.keys(rules).forEach((ruleId) => {
      msetArgs.push(`rules:${ruleId}`, rules[ruleId]);
    });

    // Use MSET to store all rules in one Redis command
    this.redisClient
      .MSET(msetArgs)
      .then(() => {
        console.log('All rules stored successfully in one step');
      })
      .catch((err) => {
        console.error('Error storing rules:', err);
      });

    // Employee IDs to store in PROCESS_EMPLOYEES
    const employeeIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

    // Store employee IDs as a list in PROCESS_EMPLOYEES
    this.redisClient
      .set('PROCESS_EMPLOYEES', JSON.stringify(employeeIds))
      .then(() => {
        console.log('PROCESS_EMPLOYEES stored successfully');
      })
      .catch((err) => {
        console.error('Error setting PROCESS_EMPLOYEES:', err);
      });
    return 'Rules and employees stored successfully';
  }
}
