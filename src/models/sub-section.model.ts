import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {idInjection: false, db2: {schema: 'TMP', table: 'SUB_SECTION'}},
})
export class SubSection extends Entity {
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
    type: 'number',
    required: true,
    length: 4,
    scale: 0,
    db2: {
      columnName: 'SECTION_ID',
      dataType: 'INTEGER',
      dataLength: 4,
      dataPrecision: undefined,
      dataScale: 0,
      nullable: 'N',
    },
  })
  sectionId: number;

  @property({
    type: 'string',
    required: true,
    length: 255,
    scale: 0,
    db2: {
      columnName: 'TEXT',
      dataType: 'VARCHAR',
      dataLength: 255,
      dataPrecision: undefined,
      dataScale: 0,
      nullable: 'N',
    },
  })
  text: string;

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

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<SubSection>) {
    super(data);
  }
}

export interface SubSectionRelations {
  // describe navigational properties here
}

export type SubSectionWithRelations = SubSection & SubSectionRelations;
