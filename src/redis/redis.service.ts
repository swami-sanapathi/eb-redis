import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { Employee } from 'src/interfaces/employee';
import * as fs from 'fs';

Injectable();

export class RedisService {
  private readonly client: RedisClientType;
  constructor() {
    // this.client = createClient({
    //   url: process.env.REDIS_URL,
    // });

    // this.client
    //   .on('error', (err) => {
    //     console.log('Redis error: ', err);
    //   })
    //   .connect();
  }

  async getEmployee(id: string) {
    const empData = await this.client.HGET('employees', '1');
    return empData;
  }

  // set employees using hash data structure
  async setEmployees(data: Employee[]): Promise<void> {
    data.forEach((emp) => {
      this.client.hSet('employees', emp.emp_id, JSON.stringify(emp));
    });
  }

  async deleteEmployee(): Promise<void> {
    this.client.del('employees');
  }

  // execute eligibility builder rules on employee data using redis lua script
  async executeEligibilityBuilderRules() {
    const script = fs.readFileSync(
      'src/redis/eligibility-builder.lua',
      'utf-8',
    );
    const response = await this.client.eval(script, {});
    return response;
  }
}
