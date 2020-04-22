import {AuthenticationStrategy} from '@loopback/authentication';
import {HttpErrors, Request} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import basicAuth from 'basic-auth';
import {ServerConfig} from '../server-config';
import {RateLimit} from './ratelimit';

const STRATEGY_NAME = 'basic';

export class BasicAuthenticationStrategy implements AuthenticationStrategy {
  public static strategy = STRATEGY_NAME;

  name = STRATEGY_NAME;

  public async authenticate(
    request: Request,
  ): Promise<UserProfile | undefined> {
    // ensure ip address is given
    const ipAddress = request.connection.remoteAddress;
    if (!ipAddress) {
      throw new HttpErrors.Forbidden('Access forbidden');
    }

    // validate credentials in authorization header
    const credentials = basicAuth(request);
    if (!credentials) {
      throw await RateLimit.getInstance().updateRateLimitOfIp(ipAddress);
    }

    const usernameIPkey = RateLimit.getInstance().getUsernameIPkey(
      credentials.name,
      ipAddress,
    );

    // validate user credentials
    if (!this.validate(credentials)) {
      throw await RateLimit.getInstance().updateRateLimitOfUserNameIpPair(
        usernameIPkey,
      );
    }

    const error = await RateLimit.getInstance().removeRateLimit(usernameIPkey);
    if (error) {
      throw error;
    }

    return {[securityId]: credentials.name};
  }

  private validate(credentials: basicAuth.BasicAuthResult) {
    return (
      credentials.name ===
        ServerConfig.getInstance().getEnvVariable('USERNAME') &&
      credentials.pass === ServerConfig.getInstance().getEnvVariable('SECRET')
    );
  }
}
