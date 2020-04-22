import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    db2: {schema: 'TMP', table: 'PUBLICATION_INFO'},
  },
})
export class PublicationInfo extends Entity {
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
    type: 'date',
    required: true,
    length: 10,
    scale: 6,
    db2: {
      columnName: 'DATE_PUBLISH',
      dataType: 'TIMESTAMP',
      dataLength: 10,
      dataPrecision: undefined,
      dataScale: 6,
      nullable: 'N',
    },
  })
  datePublish: Date;

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
      columnName: 'PUBLISHER',
      dataType: 'VARCHAR',
      dataLength: 255,
      dataPrecision: undefined,
      dataScale: 0,
      nullable: 'N',
    },
  })
  publisher: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PublicationInfo>) {
    super(data);
  }
}

export interface PublicationInfoRelations {
  // describe navigational properties here
}

export type PublicationInfoWithRelations = PublicationInfo &
  PublicationInfoRelations;
