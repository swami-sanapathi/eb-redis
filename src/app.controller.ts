import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';
import { employees } from './constants/employees';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('employees')
  async getEmployee() {
    return (await this.redis.getEmployee('employees')) ?? 'Employee not found';
  }

  @Post('employee/set')
  async setEmployee(): Promise<string> {
    await this.redis.setEmployees(employees);
    return 'Employee data set';
  }

  @Get('employee/delete')
  async deleteEmployee(): Promise<string> {
    await this.redis.deleteEmployee();
    return 'Employee data deleted';
  }

  @Get('evaluate')
  async evaluateEligibilityBuilderRules(): Promise<string> {
    await this.redis.executeEligibilityBuilderRules();
    return 'Eligibility builder rules executed';
  }
}
