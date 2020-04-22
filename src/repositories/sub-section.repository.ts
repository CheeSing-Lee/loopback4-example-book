import {DefaultCrudRepository} from '@loopback/repository';
import {SubSection, SubSectionRelations} from '../models';
import {Db2DataSource} from '../datasources';
import {inject} from '@loopback/core';

export class SubSectionRepository extends DefaultCrudRepository<
  SubSection,
  typeof SubSection.prototype.id,
  SubSectionRelations
> {
  public constructor(@inject('datasources.db2') dataSource: Db2DataSource) {
    super(SubSection, dataSource);
  }
}
