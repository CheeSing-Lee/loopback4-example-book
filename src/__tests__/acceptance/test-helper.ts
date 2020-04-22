import {Client, givenHttpServerConfig, supertest} from '@loopback/testlab';
import {ExpressServer} from '../..';
import {SampleApplication} from '../../application';

export async function setupApplication(): Promise<AppWithClient> {
  const server = new ExpressServer({rest: givenHttpServerConfig()});
  await server.boot();
  await server.start();

  const lbApp = server.lbApp;

  const client = supertest(server.app);

  return {server, client, lbApp};
}

export interface AppWithClient {
  server: ExpressServer;
  client: Client;
  lbApp: SampleApplication;
}
