import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ThreadService } from './thread/thread.service';
import { Worker } from 'node:worker_threads';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redis: RedisService,
    private readonly threadService: ThreadService,
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
    const filePath = path.join(
      process.cwd(),
      'src',
      'constants',
      'employees.json',
    );
    // const filePath = path.join(__dirname, 'constants', 'employees.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    await this.redis.setEmployees(data);
    return 'Employee data set';
  }

  @Get('employee/delete')
  async deleteEmployee(): Promise<string> {
    await this.redis.deleteEmployee();
    return 'Employee data deleted';
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
