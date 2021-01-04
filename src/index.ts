import { PingPong } from './module/pingpong';

const interval = 5000;
const pingpong = new PingPong();

const loopFunc = () => {
  pingpong.pingpong();
}
console.log('start pingpong checker...');
setInterval(loopFunc, interval);
