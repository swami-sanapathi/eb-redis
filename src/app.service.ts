import { Injectable } from '@nestjs/common';
import { Publisher } from './redis/pub-sub/publisher';
import { Employee, EMPLOYEE_UPDATE } from './interfaces/employee';

@Injectable()
export class AppService {
  constructor(private readonly publisher: Publisher) {}

  getHello(): string {
    return 'Hello World!';
  }

  updateEmployeeCache(employee: Employee): void {
    this.publisher.publishMessage(EMPLOYEE_UPDATE, JSON.stringify(employee));
  }
}
