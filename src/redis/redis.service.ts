import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { Employee } from 'src/interfaces/employee';

Injectable();

export class RedisService {
  private readonly client: RedisClientType;
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });

    this.client
      .on('error', (err) => {
        console.log('Redis error: ', err);
      })
      .connect();
  }

  async getEmployee(id: string) {
    const empData = await this.client.HGETALL(id);
    console.log('Employee data: ', empData);
    return empData;
  }

  // set employees using hash data structure
  async setEmployees(data: Employee[]): Promise<void> {
    data.forEach((emp) => {
      this.client.hSet('employees', emp.id, JSON.stringify(emp));
    });
  }

  async deleteEmployee(): Promise<void> {
    this.client.del('employees');
  }

  // execute eligibility builder rules on employee data using redis lua script
  async executeEligibilityBuilderRules(): Promise<void> {
    const script = `
      local employees = redis.call('HGETALL', 'employees')
      for i = 1, #employees, 2 do
        local emp = cjson.decode(employees[i + 1])
        if emp.designation == 'Software Engineer' then
          emp.eligible = true
        end
        redis.call('HSET', 'employees', employees[i], cjson.encode(emp))
      end
    `;
    const response = await this.client.eval(script, {});
    console.log('Eligibility builder rules executed: ', response);
  }
}
