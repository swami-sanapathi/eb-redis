import { Injectable } from '@nestjs/common';

@Injectable()
export class ThreadService {
  blockMainThread() {
    console.time('blockMainThread');
    let result = 0;
    for (let i = 0; i < 10000000000; i++) {
      result += i;
    }
    console.timeEnd('blockMainThread');
    return result;
  }
}
