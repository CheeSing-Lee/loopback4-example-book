import {DefaultCrudRepository} from '@loopback/repository';
import {PublicationInfo, PublicationInfoRelations} from '../models';
import {Db2DataSource} from '../datasources';
import {inject} from '@loopback/core';

export class PublicationInfoRepository extends DefaultCrudRepository<
  PublicationInfo,
  typeof PublicationInfo.prototype.id,
  PublicationInfoRelations
> {
  public constructor(@inject('datasources.db2') dataSource: Db2DataSource) {
    super(PublicationInfo, dataSource);
  }
}
