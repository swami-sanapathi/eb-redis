import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';
import { ConfigModule } from '@nestjs/config';
import { ThreadService } from './thread/thread.service';
import { Publisher } from './redis/pub-sub/publisher';
import { Subscriber } from './redis/pub-sub/subscriber';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, RedisService, ThreadService, Publisher, Subscriber],
})
export class AppModule {}
