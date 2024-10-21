import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ThreadService } from './thread/thread.service';
import { Worker } from 'node:worker_threads';
import { Employee } from './interfaces/employee';
import { Publisher } from './redis/pub-sub/publisher';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redis: RedisService,
    private readonly publisher: Publisher,
    private readonly threadService: ThreadService,
    private readonly employeeService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('employees/:id')
  async getEmployee(@Param() params: any) {
    return (await this.redis.getEmployee(params.id)) ?? 'Employee not found';
  }

  @Post('employee/set')
  async setEmployee(): Promise<string> {
    const filePath = path.join(
      process.cwd(),
      'src',
      'constants',
      'employees_30000_with_50_fields.json',
    );
    // const filePath = path.join(__dirname, 'constants', 'employees.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    await this.redis.setEmployees([
      {
        emp_id: 9,
        first_name: 'Julie',
        last_name: 'James',
        email: 'alicia.bright@company.com',
        phone_number: '539-545-3487',
        dob: '1991-06-27',
        gender: 'Other',
        marital_status: 'Widowed',
        designation: 'Product Manager',
        department: 'IT',
        employee_band: 'A2',
        employee_type: 'Contract',
        status: 'Inactive',
        location: 'Chicago',
        doj: '2018-06-20',
        work_shift: 'Rotational',
        salary: 54799,
        bonus: 4738.68,
        benefits: ['Health Insurance', 'Gym Membership', 'Childcare Support'],
        stock_options: 111,
        overtime_eligibility: true,
        annual_leave_balance: 17,
        sick_leave_balance: 9,
        experience: 2,
        performance_rating: 2.9,
        last_promotion_date: null,
        years_since_last_promotion: 0,
        performance_goal_completion: 98.64,
        project_completion_rate: 77.48,
        manager_id: 8,
        team_size: 18,
        direct_reports: 3,
        project_allocations: 3,
        education: 'Diploma',
        certifications: [
          'Scrum Master',
          'AWS Certified',
          'Google Cloud Certified',
        ],
        skills: [
          'Customer Relations',
          'Cloud Computing',
          'Data Analysis',
          'Project Management',
          'Leadership',
        ],
        languages_spoken: ['Mandarin', 'English'],
        training_completed: false,
        professional_memberships: ['CFA'],
        office_floor: 17,
        cubicle_number: 'C-538',
        parking_spot: null,
        remote_work: true,
        preferred_work_location: 'Seattle',
        tax_id: '050-31-0317',
        bank_account_number: 'GB91ZUSN58025374676804',
        payroll_type: 'Monthly',
        insurance_coverage: 'Health Insurance',
        retirement_plan: 'Pension',
        monthly_deductions: 663,
        employee_id_card: 'ID-00009',
        computer_serial_number: '1503455332775',
        vpn_access: true,
        email_quota: '95GB',
        system_access_level: 'User',
        last_system_login: '2024-03-22 21:15:04',
        is_on_call: false,
      },
    ]);
    return 'Employee data set';
  }

  @Post('employee/update')
  async updateEmployee(@Body() data: Employee): Promise<string> {
    await this.employeeService.updateEmployeeCache(data);
    return 'Employee data updated';
  }

  @Get('employee/delete')
  async deleteEmployee(): Promise<string> {
    await this.redis.deleteEmployee();
    return 'Employee data deleted';
  }

  @Post('load-script')
  async loadScript(): Promise<string> {
    return this.redis.loadScriptInRedis();
  }

  @Get('evaluate')
  async evaluateEligibilityBuilderRules(): Promise<string> {
    await this.redis.executeDynamicRules();
    // await this.redis.executeEligibilityBuilderRules();
    return 'Eligibility builder rules executed';
  }

  @Get('heavy-task')
  async blockMainThread(): Promise<string> {
    await this.threadService.blockMainThread();
    return 'Main thread blocked';
  }

  @Get('heavy-task/thread')
  async blockThread() {
    const workerPath = path.join(__dirname, 'thread', 'heavy-task.js');
    const worker = new Worker(workerPath);

    worker.on('message', (result) => {
      console.log('Worker thread message:', result);
    });

    worker.on('error', (error) => {
      console.error('Worker thread error:', error);
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker thread stopped with exit code ${code}`);
      } else {
        console.log('Worker thread terminated successfully');
      }
    });

    worker.postMessage('start');
  }
}
