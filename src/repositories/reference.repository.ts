import {DefaultCrudRepository} from '@loopback/repository';
import {Reference, ReferenceRelations} from '../models';
import {Db2DataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ReferenceRepository extends DefaultCrudRepository<
  Reference,
  typeof Reference.prototype.id,
  ReferenceRelations
> {
  public constructor(@inject('datasources.db2') dataSource: Db2DataSource) {
    super(Reference, dataSource);
  }
}
