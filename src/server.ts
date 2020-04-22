import {ApplicationConfig} from '@loopback/core';
import {RestBindings} from '@loopback/rest';
import express from 'express';
import * as https from 'https';
import pEvent from 'p-event';
import {SampleApplication} from './application';
import {ServerConfig} from './server-config';
import {SslConfig} from './sslconfig';

const createGracefulShutdownMiddleware = require('express-graceful-shutdown');
const PORT = process.env.PORT ?? 3000;
const HOST = process.env.HOST ?? '0.0.0.0';

export class ExpressServer {
  public app: express.Application;
  public readonly lbApp: SampleApplication;
  private server?: https.Server;

  public constructor(
    options: ApplicationConfig = {
      rest: {
        openApiSpec: {
          disabled: true, // disable openapi
        },
        expressSettings: {
          'x-powered-by': false,
          env: 'production',
        },
        port: PORT,
        host: HOST,
        // The `gracePeriodForClose` provides a graceful close for http/https
        // servers with keep-alive clients. The default value is `Infinity`
        // (don't force-close). If you want to immediately destroy all sockets
        // upon stop, set its value to `0`.
        // See https://www.npmjs.com/package/stoppable
        gracePeriodForClose: 5000, // 5 seconds
        listenOnStart: false,
        path: `https://${HOST}:${PORT}`,
      },
    },
  ) {
    this.app = express();
    this.lbApp = new SampleApplication(options);
    ServerConfig.getInstance().load(this.app);

    // base url
    this.app.use('/api', this.lbApp.requestHandler);

    // body parser limits
    this.lbApp.bind(RestBindings.REQUEST_BODY_PARSER_OPTIONS).to({
      json: {
        strict: true,
        limit: '4MB',
      },
      urlencoded: {
        extended: true,
        limit: '4MB',
      },
    });
  }

  public async boot() {
    await this.lbApp.boot();
  }

  public async start() {
    await this.lbApp.start();
    const port = this.lbApp.restServer.config.port;
    const host = this.lbApp.restServer.config.host;

    const httpsOptions = {
      key: SslConfig.privateKey,
      cert: SslConfig.certificate,
      secureProtocol: 'TLSv1_2_method',
      honorCipherOrder: true,
      ciphers: 'EECDH:EDH:!NULL:!SSLv2:!RC4:!aNULL:!3DES:!IDEA',
    };

    this.server = https.createServer(httpsOptions, this.app);
    this.server.listen(port, host);

    // gracefule shut down
    this.app.use(
      createGracefulShutdownMiddleware(this.server, {forceTimeout: 30000}),
    );

    await pEvent(this.server, 'listening');
  }

  public async stop() {
    if (!this.server) return;
    await this.lbApp.stop();
    this.server.close();
    await pEvent(this.server, 'close');
    this.server = undefined;
  }
}
