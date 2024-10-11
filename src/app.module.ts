import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';
import { ConfigModule } from '@nestjs/config';
import { ThreadService } from './thread/thread.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, RedisService, ThreadService],
})
export class AppModule {}
