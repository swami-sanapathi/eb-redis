import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from '../redis.service';

@Injectable()
export class Publisher {
  constructor(private redisService: RedisService) {}

  async publishMessage(channel: string, message: string): Promise<void> {
    await this.redisService.getConnection().publish(channel, message);
  }
}
