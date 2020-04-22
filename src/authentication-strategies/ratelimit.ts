import {HttpErrors} from '@loopback/rest';

const {RateLimiterMemory} = require('rate-limiter-flexible');
const maxWrongAttemptsByIP = 5;
const maxConsecutiveFailsByUsernameAndIP = 10;
const blockDuration = 1800; // 30 minutes

export class RateLimit {
  private limiterSlowBruteByIP = new RateLimiterMemory({
    keyPrefix: 'login_fail_ip',
    points: maxWrongAttemptsByIP,
    duration: 1, // Reset after 1 second
    blockDuration: blockDuration,
  });

  private limiterConsecutiveFailsByUsernameAndIP = new RateLimiterMemory({
    keyPrefix: 'login_fail_consecutive_username_and_ip',
    points: maxConsecutiveFailsByUsernameAndIP,
    duration: blockDuration,
    blockDuration: blockDuration,
  });

  private static instance: RateLimit;

  private constructor() {}

  static getInstance(): RateLimit {
    return !RateLimit.instance ? new RateLimit() : RateLimit.instance;
  }

  public updateRateLimitOfIp(ipAddress: string) {
    return new Promise((resolve, reject) => {
      RateLimit.getInstance()
        .rejectFailsByIP(ipAddress)
        .then(() => {
          resolve(new HttpErrors.Unauthorized('Access denied'));
        })
        .catch(rlRejected => {
          if (rlRejected instanceof Error) {
            throw rlRejected;
          }
          resolve(new HttpErrors.TooManyRequests('Too many requests'));
        });
    });
  }

  public updateRateLimitOfUserNameIpPair(usernameIPkey: string) {
    return new Promise((resolve, reject) => {
      RateLimit.getInstance()
        .rejectFailsByUsernameAndIp(usernameIPkey)
        .then(() => {
          resolve(new HttpErrors.Unauthorized('Access denied'));
        })
        .catch(rlRejected => {
          if (rlRejected instanceof Error) {
            resolve(rlRejected);
          } else {
            resolve(new HttpErrors.TooManyRequests('Too many requests'));
          }
        });
    });
  }

  public removeRateLimit(usernameIPkey: string) {
    return new Promise((resolve, reject) => {
      RateLimit.getInstance()
        .removeLimits(usernameIPkey)
        .then(() => resolve(undefined))
        .catch(error => {
          resolve(error);
        });
    });
  }

  public getUsernameIPkey(username: string, ip: string) {
    return `${username}_${ip}`;
  }

  private async rejectFailsByIP(ipAddress: string | undefined) {
    await this.limiterSlowBruteByIP.consume(ipAddress);
  }

  private async rejectFailsByUsernameAndIp(usernameIPkey: string) {
    await this.limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey);
  }

  private async removeLimits(usernameIPkey: string) {
    await this.limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
  }
}
