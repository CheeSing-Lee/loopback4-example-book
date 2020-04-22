import {AuthenticationStrategy} from '@loopback/authentication';
import {HttpErrors, Request} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import basicAuth from 'basic-auth';
import {Ldap} from './ldap-auth';
import {RateLimit} from './ratelimit';

const STRATEGY_NAME = 'ldap';

export class LdapAuthenticationStrategy implements AuthenticationStrategy {
  public static strategy = STRATEGY_NAME;
  private ldapAuth = new Ldap();

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
    const err = await this.ldapAuth.validate(credentials);
    this.ldapAuth.close();

    if (!err) {
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
}
