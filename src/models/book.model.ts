import {Entity, model, property, hasMany, hasOne} from '@loopback/repository';
import {Chapter} from './chapter.model';
import {Reference} from './reference.model';
import {PublicationInfo} from './publication-info.model';

@model({settings: {idInjection: false, db2: {schema: 'TMP', table: 'BOOK'}}})
export class Book extends Entity {
  @property({
    type: 'string',
    required: true,
    length: 255,
    scale: 0,
    db2: {
      columnName: 'AUTHOR1',
      dataType: 'VARCHAR',
      dataLength: 255,
      dataPrecision: undefined,
      dataScale: 0,
      nullable: 'N',
    },
  })
  author1: string;

  @property({
    type: 'string',
    length: 255,
    scale: 0,
    db2: {
      columnName: 'AUTHOR2',
      dataType: 'VARCHAR',
      dataLength: 255,
      dataPrecision: undefined,
      dataScale: 0,
      nullable: 'Y',
    },
  })
  author2?: string;

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
      columnName: 'NAME',
      dataType: 'VARCHAR',
      dataLength: 255,
      dataPrecision: undefined,
      dataScale: 0,
      nullable: 'N',
    },
  })
  name: string;

  @hasMany(() => Chapter)
  chapters: Chapter[];

  @hasMany(() => Reference)
  references: Reference[];

  @hasOne(() => PublicationInfo)
  publicationInfo: PublicationInfo;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Book>) {
    super(data);
  }
}

export interface BookRelations {
  // describe navigational properties here
}

export type BookWithRelations = Book & BookRelations;
