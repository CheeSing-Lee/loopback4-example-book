import basicAuth from 'basic-auth';
import fs from 'fs';
import LdapAuth from 'ldapauth-fork';
import {ServerConfig} from '../server-config';

const LDAP_CERT_FILE = ServerConfig.getInstance().getEnvVariable('LDAP_CERT');
const LDAP_KEY_FILE = ServerConfig.getInstance().getEnvVariable('LDAP_KEY');
const LDAP_DHPARAM_FILE = ServerConfig.getInstance().getEnvVariable(
  'LDAP_DHPARAM',
);
const LDAP_CA_FILE = ServerConfig.getInstance().getEnvVariable('LDAP_CA');

export class Ldap {
  private ldap: LdapAuth;

  public constructor() {
    this.ldap = new LdapAuth({
      url: ServerConfig.getInstance().getEnvVariable('LDAP_URL') ?? '',
      bindDN: ServerConfig.getInstance().getEnvVariable('LDAP_BIND_DN'),
      bindCredentials: ServerConfig.getInstance().getEnvVariable(
        'LDAP_BIND_CRED',
      ),
      searchBase:
        ServerConfig.getInstance().getEnvVariable('LDAP_SEARCH_BASE') ?? '',
      searchFilter:
        ServerConfig.getInstance().getEnvVariable('LDAP_SEARCH_FILTER') ?? '',
      reconnect: true,
      tlsOptions: {
        ca: fs.readFileSync(LDAP_CA_FILE).toString(),
        cert: fs.readFileSync(LDAP_CERT_FILE).toString(),
        key: fs.readFileSync(LDAP_KEY_FILE).toString(),
        dhparam: fs.readFileSync(LDAP_DHPARAM_FILE).toString(),
        secureProtocol: 'TLSv1_2_method',
        honorCipherOrder: true,
        ciphers: 'EECDH:EDH:!NULL:!SSLv2:!RC4:!aNULL:!3DES:!IDEA',
      },
    });
  }

  public close() {
    this.ldap.close();
  }

  public validate(credentials: basicAuth.BasicAuthResult) {
    return new Promise((resolve, reject) => {
      this.ldap.authenticate(credentials.name, credentials.pass, function (
        err,
      ) {
        resolve(err ? false : true);
      });
    });
  }
}
