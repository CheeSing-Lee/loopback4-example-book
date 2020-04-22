import {AnyObject} from '@loopback/repository';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import csp from 'helmet-csp';
import noCache from 'nocache';
import path from 'path';

export class ServerConfig {
  private environmentVariable: AnyObject;

  private static instance: ServerConfig;

  private constructor() {
    const secureEnv = require('secure-env');

    this.environmentVariable = secureEnv({
      secret: process.env.SK,
      path: path.join(__dirname, '../.env.enc'),
    });

    if (!this.environmentVariable) {
      throw new Error('Failed to load environment variables');
    }
  }

  public static getInstance(): ServerConfig {
    return !ServerConfig.instance ? new ServerConfig() : ServerConfig.instance;
  }

  public getEnvVariable(name: string) {
    return this.environmentVariable[name];
  }

  public load(app: express.Application) {
    app.use(compression());

    // CORS configuration
    app.use(
      cors({
        origin: true,
        methods: 'GET,POST',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        maxAge: 600,
        credentials: true,
      }),
    );

    // Helmet configuration
    app.use(helmet());
    app.use(noCache());
    app.use(
      helmet({
        frameguard: {
          action: 'deny',
        },
      }),
    );

    app.use(
      helmet.hsts({
        maxAge: 600,
      }),
    );

    app.use(helmet.referrerPolicy({policy: 'no-referrer'}));

    // CSP configuration
    app.use(
      csp({
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
        },
        browserSniff: false,
      }),
    );

    // Remove additional header tag
    app.use(
      express.static(path.join(__dirname, '../public'), {
        etag: false,
        lastModified: false,
      }),
    );
  }
}
