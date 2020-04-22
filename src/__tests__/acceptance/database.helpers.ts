import {AnyObject} from '@loopback/repository';

export function givenBookData(data?: AnyObject) {
  return Object.assign(
    {
      id: 1,
      name: 'My First Book',
      author1: 'Author 1',
      author2: 'Author 2',
    },
    data,
  );
}

export function givenChapterData(data?: AnyObject) {
  return Object.assign(
    {
      id: 1,
      bookId: 1,
      author: 'Author 1',
      title: 'First Chapter',
    },
    data,
  );
}

export function givenSectionData(data?: AnyObject) {
  return Object.assign(
    {
      id: 1,
      chapterId: 1,
      title: 'First Section',
      text: 'Random Text 1',
    },
    data,
  );
}

export function givenSubSectionData(data?: AnyObject) {
  return Object.assign(
    {
      id: 1,
      sectionId: 1,
      title: 'First Sub Section',
      text: 'Random Text 1',
    },
    data,
  );
}

export function givenReferenceData(data?: AnyObject) {
  return Object.assign(
    {
      id: 1,
      bookId: 1,
      text: 'First References',
    },
    data,
  );
}

export function givenPublicationInfoData(data?: AnyObject) {
  return Object.assign(
    {
      id: 1,
      bookId: 1,
      publisher: 'Publisher A',
      datePublish: '2018-01-10 08:30:00.000',
    },
    data,
  );
}

export function expectedBookData(data?: AnyObject) {
  return Object.assign(
    {
      author1: 'Author 1',
      author2: 'Author 2',
      name: 'My First Book',
      chapters: [
        {
          author: 'Author 1',
          bookId: 1,
          title: 'First Chapter',
          sections: [
            {
              chapterId: 1,
              text: 'Random Text 1',
              title: 'First Section',
              subSections: [
                {
                  sectionId: 1,
                  text: 'Random Text 1',
                  title: 'First Sub Section',
                },
              ],
            },
          ],
        },
      ],
      references: [
        {
          bookId: 1,
          text: 'First References',
        },
      ],
      publicationInfo: {
        bookId: 1,
        datePublish: '2018-01-10 08:30:00.000',
        publisher: 'Publisher A',
      },
    },
    data,
  );
}

export function expectedBookArrayData(data?: AnyObject) {
  return Object.assign(
    [
      {
        author1: 'Author 1',
        author2: 'Author 2',
        name: 'My First Book',
        chapters: [
          {
            author: 'Author 1',
            bookId: 1,
            title: 'First Chapter',
            sections: [
              {
                chapterId: 1,
                text: 'Random Text 1',
                title: 'First Section',
                subSections: [
                  {
                    sectionId: 1,
                    text: 'Random Text 1',
                    title: 'First Sub Section',
                  },
                ],
              },
            ],
          },
        ],
        references: [
          {
            bookId: 1,
            text: 'First References',
          },
        ],
        publicationInfo: {
          bookId: 1,
          datePublish: '2018-01-10 08:30:00.000',
          publisher: 'Publisher A',
        },
      },
    ],
    data,
  );
}
