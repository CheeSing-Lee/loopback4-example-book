import {Getter, inject} from '@loopback/core';
import {
  AnyObject,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';
import {Db2DataSource} from '../datasources';
import {
  Book,
  BookRelations,
  Chapter,
  PublicationInfo,
  Reference,
} from '../models';
import {ChapterRepository} from './chapter.repository';
import {PublicationInfoRepository} from './publication-info.repository';
import {ReferenceRepository} from './reference.repository';

export class BookRepository extends DefaultCrudRepository<
  Book,
  typeof Book.prototype.id,
  BookRelations
> {
  public readonly chapters: HasManyRepositoryFactory<
    Chapter,
    typeof Book.prototype.id
  >;

  public readonly references: HasManyRepositoryFactory<
    Reference,
    typeof Book.prototype.id
  >;

  public readonly publicationInfo: HasOneRepositoryFactory<
    PublicationInfo,
    typeof Book.prototype.id
  >;

  public constructor(
    @inject('datasources.db2') dataSource: Db2DataSource,
    @repository.getter('ChapterRepository')
    protected chapterRepositoryGetter: Getter<ChapterRepository>,
    @repository.getter('ReferenceRepository')
    protected referenceRepositoryGetter: Getter<ReferenceRepository>,
    @repository.getter('PublicationInfoRepository')
    protected publicationInfoRepositoryGetter: Getter<
      PublicationInfoRepository
    >,
  ) {
    super(Book, dataSource);
    this.publicationInfo = this.createHasOneRepositoryFactoryFor(
      'publicationInfo',
      publicationInfoRepositoryGetter,
    );
    this.registerInclusionResolver(
      'publicationInfo',
      this.publicationInfo.inclusionResolver,
    );
    this.references = this.createHasManyRepositoryFactoryFor(
      'references',
      referenceRepositoryGetter,
    );
    this.registerInclusionResolver(
      'references',
      this.references.inclusionResolver,
    );
    this.chapters = this.createHasManyRepositoryFactoryFor(
      'chapters',
      chapterRepositoryGetter,
    );
    this.registerInclusionResolver('chapters', this.chapters.inclusionResolver);
  }

  public async retrieveByAuthor(author: string): Promise<AnyObject> {
    const bookFilter = {
      where: {
        author1: author,
      },
      include: [
        {
          relation: 'chapters',
          scope: {
            include: [
              {
                relation: 'sections',
                scope: {
                  include: [
                    {
                      relation: 'subSections',
                      scope: {
                        fields: {
                          sectionId: true,
                          title: true,
                          text: true,
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'publicationInfo',
        },
        {
          relation: 'references',
        },
      ],
    };

    const found = await this.find(bookFilter);
    return found;
  }

  public async retrieveByBookId(bookId: number): Promise<AnyObject> {
    const bookFilter = {
      include: [
        {
          relation: 'chapters',
          scope: {
            include: [
              {
                relation: 'sections',
                scope: {
                  include: [
                    {
                      relation: 'subSections',
                      scope: {
                        fields: {
                          sectionId: true,
                          title: true,
                          text: true,
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'publicationInfo',
        },
        {
          relation: 'references',
        },
      ],
    };

    const found = await this.findById(bookId, bookFilter);
    return found;
  }
}
