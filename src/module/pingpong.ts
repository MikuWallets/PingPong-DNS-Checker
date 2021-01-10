import * as http from "http";
import { CloudFlareApi } from './cloudflare';

export class PingPong {
  private readonly scheme = "http://";
  private readonly mainIp = '125.138.122.239';
  private readonly subIp = '61.98.188.123';

  private readonly attemptLimit: number = 4;
  private isMain = true;

  private errCount: number = 0;
  private resCount: number = 0;

  private cloudflare: CloudFlareApi;

  public constructor () {
    this.cloudflare = new CloudFlareApi();
  }

  public pingpong() {
    http.get(this.scheme+this.mainIp, (res) => {
      // console.log('ok');
      if (!this.isMain) {
        console.info(`Received response from main ip, ${++this.resCount} times`);
        if (this.resCount === this.attemptLimit) {
          this.errCount = 0;
          this.isMain = true;
          // recover dns to main
          this.fallBackMain();
        }
      }
      else {
        this.errCount = 0;
      }
    })
    .on('error', (e) => {
      if (this.isMain) {
        console.warn(`Failed to connect with main ip, ${++this.errCount} times`);
        this.resCount = 0;
        if (this.errCount >= this.attemptLimit) {
          this.failOverSub();
        }
      }
    });
  }

  private fallBackMain() {
    console.log(`Let's fallback!`);
    this.cloudflare.updateDnsRecords(this.mainIp);
  }

  private failOverSub() {
    // update dns records to subip when receive response successfully
    const req = http.get(this.scheme+this.subIp, (res) => {
      // change dns to sub
      console.log(`FAILOVER`);
      this.isMain = false;
      this.cloudflare.updateDnsRecords(this.subIp);
    }).on('error', (e) => {
      console.log('Failed to test connection using sub ip');
    });
  }
}
