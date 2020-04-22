import {Entity, model, property, hasMany} from '@loopback/repository';
import {Section} from './section.model';

@model({settings: {idInjection: false, db2: {schema: 'TMP', table: 'CHAPTER'}}})
export class Chapter extends Entity {
  @property({
    type: 'string',
    required: true,
    length: 255,
    scale: 0,
    db2: {
      columnName: 'AUTHOR',
      dataType: 'VARCHAR',
      dataLength: 255,
      dataPrecision: undefined,
      dataScale: 0,
      nullable: 'N',
    },
  })
  author: string;

  @property({
    type: 'number',
    required: true,
    length: 4,
    scale: 0,
    db2: {
      columnName: 'BOOK_ID',
      dataType: 'INTEGER',
      dataLength: 4,
      dataPrecision: undefined,
      dataScale: 0,
      nullable: 'N',
    },
  })
  bookId: number;

  @property({
    type: 'number',
    required: true,
    length: 4,
    scale: 0,
    id: 1,
    db2: {
      columnName: 'ID',
      dataType: 'INTEGER',
      dataLength: 4,
      dataPrecision: undefined,
      dataScale: 0,
      nullable: 'N',
    },
  })
  id: number;

  @property({
    type: 'string',
    required: true,
    length: 255,
    scale: 0,
    db2: {
      columnName: 'TITLE',
      dataType: 'VARCHAR',
      dataLength: 255,
      dataPrecision: undefined,
      dataScale: 0,
      nullable: 'N',
    },
  })
  title: string;

  @hasMany(() => Section)
  sections: Section[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Chapter>) {
    super(data);
  }
}

export interface ChapterRelations {
  // describe navigational properties here
}

export type ChapterWithRelations = Chapter & ChapterRelations;
