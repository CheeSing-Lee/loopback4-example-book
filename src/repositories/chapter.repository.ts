import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {Db2DataSource} from '../datasources';
import {Chapter, ChapterRelations, Section} from '../models';
import {SectionRepository} from './section.repository';

export class ChapterRepository extends DefaultCrudRepository<
  Chapter,
  typeof Chapter.prototype.id,
  ChapterRelations
> {
  public readonly sections: HasManyRepositoryFactory<
    Section,
    typeof Chapter.prototype.id
  >;

  public constructor(
    @inject('datasources.db2') dataSource: Db2DataSource,
    @repository.getter('SectionRepository')
    protected sectionRepositoryGetter: Getter<SectionRepository>,
  ) {
    super(Chapter, dataSource);
    this.sections = this.createHasManyRepositoryFactoryFor(
      'sections',
      sectionRepositoryGetter,
    );
    this.registerInclusionResolver('sections', this.sections.inclusionResolver);
  }
}
