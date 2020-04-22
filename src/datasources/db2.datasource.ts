import {
  lifeCycleObserver,
  LifeCycleObserver,
  ValueOrPromise,
} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {ServerConfig} from '../server-config';

@lifeCycleObserver('datasource')
export class Db2DataSource extends juggler.DataSource
  implements LifeCycleObserver {
  private static dataSourceName = 'db2';

  public constructor(
    dsConfig: object = {
      name: 'db2',
      connector: 'db2',
      host: ServerConfig.getInstance().getEnvVariable('DB2_HOST'),
      port: ServerConfig.getInstance().getEnvVariable('DB2_PORT'),
      user: ServerConfig.getInstance().getEnvVariable('DB2_USER'),
      password: ServerConfig.getInstance().getEnvVariable('DB2_PASS'),
      database: ServerConfig.getInstance().getEnvVariable('DB2_DATABASE'),
      schema: ServerConfig.getInstance().getEnvVariable('DB2_SCHEMA'),
    },
  ) {
    super(dsConfig);
  }

  /**
   * Start the datasource when application is started
   */
  public start(): ValueOrPromise<void> {
    // Add your logic here to be invoked when the application is started
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  public stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}
