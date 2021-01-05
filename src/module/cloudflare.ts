import * as https from "https";
import * as key from '../key.json';
import { DNSEntry } from "../types/DnsEntry";

export class CloudFlareApi {

  private apiInfo: DNSEntry[];
  private apiKey: string;
  private email: string;

  public constructor() {
    this.apiInfo = key.domains;
    this.apiKey = key.apiKey;
    this.email = key.email;
  }

  public updateDnsRecords(ip: string) {
    this.apiInfo.forEach((i) => {
      const body = JSON.stringify({
        type: "A",
        name: i.domain,
        content: ip,
        proxied: true
      });
      const options = {
        hostname: "api.cloudflare.com",
        port: 443,
        path: "/client/v4/zones/" + i.zoneid + "/dns_records/" + i.identifier,
        method: "PUT",
        headers: {
          'X-Auth-Email': this.email,
          'X-Auth-Key': this.apiKey,
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': body.length
        }
      };


      const req = https.request(options, (res) => {
        console.log(`${options.method} ${res.statusCode} - Update A record of ${i.domain} to ${ip}`);
        res.on('data', (data) => {
          console.log(data.toString('utf8'));
        })
      }).on('error', (e) => {
        console.error(e.message);
      });

      req.write(body);
      req.end();
    });
  }
}