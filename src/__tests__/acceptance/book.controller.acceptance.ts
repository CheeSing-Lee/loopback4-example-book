import {expect} from '@loopback/testlab';
import {ExpressServer} from '../..';
import {BookController} from '../../controllers';
import {
  BookRepository,
  ChapterRepository,
  PublicationInfoRepository,
  ReferenceRepository,
  SectionRepository,
  SubSectionRepository,
} from '../../repositories';
import {BookService} from '../../services';
import {
  expectedBookArrayData,
  expectedBookData,
  givenBookData,
  givenChapterData,
  givenPublicationInfoData,
  givenReferenceData,
  givenSectionData,
  givenSubSectionData,
} from './database.helpers';
import {setupApplication} from './test-helper';
import {testUtil} from './test-util';
import {testdb} from './testdb.datasource';

describe('BookController', () => {
  let server: ExpressServer;

  before('setupApplication', async () => {
    ({server} = await setupApplication());
  });

  after(async () => {
    await server.stop();
  });

  // init repository
  const subSectionRepository = new SubSectionRepository(testdb);

  const sectionRepository = new SectionRepository(
    testdb,
    async () => subSectionRepository,
  );

  const chapterRepository = new ChapterRepository(
    testdb,
    async () => sectionRepository,
  );

  const referenceRepository = new ReferenceRepository(testdb);

  const publicationInfoRepository = new PublicationInfoRepository(testdb);

  const bookRepository = new BookRepository(
    testdb,
    async () => chapterRepository,
    async () => referenceRepository,
    async () => publicationInfoRepository,
  );

  const bookService = new BookService();

  // create test data
  bookRepository.create(givenBookData()).catch(err => {
    throw err;
  });

  chapterRepository.create(givenChapterData()).catch(err => {
    throw err;
  });

  sectionRepository.create(givenSectionData()).catch(err => {
    throw err;
  });

  subSectionRepository.create(givenSubSectionData()).catch(err => {
    throw err;
  });

  referenceRepository.create(givenReferenceData()).catch(err => {
    throw err;
  });

  publicationInfoRepository.create(givenPublicationInfoData()).catch(err => {
    throw err;
  });

  it('invokes GET /books/bookId', async () => {
    const bookController = new BookController(bookService, bookRepository);
    const details = await bookController.retrieveBook(1);
    const errors = testUtil.verifyJsonResult(expectedBookData(), details);
    expect(errors).is.empty();
  });

  it('invokes GET /books/author', async () => {
    const bookController = new BookController(bookService, bookRepository);
    const details = await bookController.retrieveAuthor('Author 1');
    const errors = testUtil.verifyJsonResult(expectedBookArrayData(), details);
    expect(errors).is.empty();
  });
});
