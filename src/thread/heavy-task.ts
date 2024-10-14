import { parentPort } from 'worker_threads';

function blockMainThread(): number {
  let result = 0;
  for (let i = 0; i < 1_000_000_000; i++) {
    result += i;
  }
  return result;
}

if (parentPort) {
  const result = blockMainThread();
  parentPort.postMessage(result);
}
