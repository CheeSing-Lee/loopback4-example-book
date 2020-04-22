import {Db2DataSource} from '../../datasources';

export const testdb: Db2DataSource = new Db2DataSource({
  name: 'db',
  connector: 'memory',
});
