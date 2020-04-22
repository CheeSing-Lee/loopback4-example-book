import {inject} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {get, param} from '@loopback/rest';
import {BookRepository} from '../repositories';
import {BookService} from '../services';

export class BookController {
  public constructor(
    @inject('services.BookService')
    protected bookService: BookService,
    @repository(BookRepository) protected bookRepository: BookRepository,
  ) {}

  @get('/books/id', {
    responses: {
      '200': {
        description: 'Find book by id',
        content: {
          'application/json': {},
        },
      },
    },
  })
  public async retrieveBook(
    @param.query.number('bookId') bookId: number,
  ): Promise<AnyObject> {
    const book = await this.bookRepository.retrieveByBookId(bookId);
    return this.bookService.formatObject(book);
  }

  @get('/books/authors', {
    responses: {
      '200': {
        description: 'Find all books by author',
        content: {
          'application/json': {},
        },
      },
    },
  })
  public async retrieveAuthor(
    @param.query.string('author') author: string,
  ): Promise<AnyObject> {
    const book = await this.bookRepository.retrieveByAuthor(author);
    return this.bookService.formatObject(book);
  }
}
