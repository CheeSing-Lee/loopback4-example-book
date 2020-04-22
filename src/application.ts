import {
  AuthenticationBindings,
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {HealthBindings, HealthComponent} from '@loopback/extension-health';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {BasicAuthenticationStrategy} from './authentication-strategies/basic-strategy';
import {LdapAuthenticationStrategy} from './authentication-strategies/ldap-strategy';
import {MySequence} from './sequence';

const AUTH_STRATEGY = process.env.AUTH ?? LdapAuthenticationStrategy.strategy;

export class SampleApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  public constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // TODO: Disable in production
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.configure(HealthBindings.COMPONENT).to({
      healthPath: '/health',
    });
    this.component(HealthComponent);

    // load the authentication component
    this.component(AuthenticationComponent);

    // register custom authentication strategy
    registerAuthenticationStrategy(
      this,
      AUTH_STRATEGY === BasicAuthenticationStrategy.strategy
        ? BasicAuthenticationStrategy
        : LdapAuthenticationStrategy,
    );

    this.configure(AuthenticationBindings.COMPONENT).to({
      defaultMetadata: {
        strategy: AUTH_STRATEGY,
      },
    });

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
