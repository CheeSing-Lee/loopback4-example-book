import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {Section, SectionRelations, SubSection} from '../models';
import {Db2DataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {SubSectionRepository} from './sub-section.repository';

export class SectionRepository extends DefaultCrudRepository<
  Section,
  typeof Section.prototype.id,
  SectionRelations
> {
  public readonly subSections: HasManyRepositoryFactory<
    SubSection,
    typeof Section.prototype.id
  >;

  public constructor(
    @inject('datasources.db2') dataSource: Db2DataSource,
    @repository.getter('SubSectionRepository')
    protected subSectionRepositoryGetter: Getter<SubSectionRepository>,
  ) {
    super(Section, dataSource);
    this.subSections = this.createHasManyRepositoryFactoryFor(
      'subSections',
      subSectionRepositoryGetter,
    );
    this.registerInclusionResolver(
      'subSections',
      this.subSections.inclusionResolver,
    );
  }
}
