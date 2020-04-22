import {Client, expect} from '@loopback/testlab';
import {ExpressServer} from '../..';
import {setupApplication} from './test-helper';

describe('HomePage', () => {
  let server: ExpressServer;
  let client: Client;

  before('setupApplication', async () => {
    ({server, client} = await setupApplication());
  });

  after(async () => {
    await server.stop();
  });

  it('exposes a default home page', async () => {
    await client
      .get('/')
      .expect(200)
      .expect('Content-Type', /text\/html/);
  });

  it('exposes self-hosted explorer', async () => {
    await client.get('/api/explorer/').expect(200);
  });

  it('exposes health check', async () => {
    const res = await client.get('/api/health/').expect(200);
    expect(res.body).to.have.property('status').to.be.containEql('UP');
  });
});
