'use strict';
import fs from 'fs';
import {ServerConfig} from './server-config';

const SSL_CERT_FILE = ServerConfig.getInstance().getEnvVariable('SSL_CERT');
const SSL_KEY_FILE = ServerConfig.getInstance().getEnvVariable('SSL_KEY');

export class SslConfig {
  public static readonly privateKey = fs.readFileSync(SSL_KEY_FILE).toString();
  public static readonly certificate = fs
    .readFileSync(SSL_CERT_FILE)
    .toString();
}
