import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from '../redis.service';
import { EMPLOYEE_UPDATE } from 'src/interfaces/employee';

@Injectable()
export class Subscriber {
  subscriber: Redis;
  constructor(private readonly redisService: RedisService) {
    this.subscriber = new Redis({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    });

    this.subscriber.subscribe(EMPLOYEE_UPDATE, (err) => {
      if (err) {
        console.log('Error while subscribing `EMPLOYEE_UPDATE` -->', err);
        return;
      }
    });

    this.subscriber.on('message', (channel: string, message: string) => {
      if (channel === EMPLOYEE_UPDATE) {
        // update `employees` cache
        this.redisService.updateEmployees(JSON.parse(message));
      }
    });
  }
}
