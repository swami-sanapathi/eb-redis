import { Controller, Get } from '@nestjs/common';
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

  @Get('employee')
  async getEmployee() {
    return (await this.redis.getEmployee('employees')) ?? 'Employee not found';
  }

  @Get('employee/set')
  async setEmployee(): Promise<string> {
    await this.redis.setEmployees(employees);
    return 'Employee data set';
  }

  @Get('evaluate')
  async evaluateEligibilityBuilderRules(): Promise<string> {
    await this.redis.executeEligibilityBuilderRules();
    return 'Eligibility builder rules executed';
  }
}
