import { parseTitleAndAuthor } from './parseTitleAndAuthor';

describe('parseDateOfCreation', () => {
  test.each([
    [
      'The Effective Manager (Horstman, (Mark))',
      'The Effective Manager',
      'Horstman, (Mark)',
    ],
    [
      'The (Big) Book of Science Fiction',
      'The (Big) Book of Science Fiction',
      undefined,
    ],
    [
      '飘（上下） (外国文学名著名译丛书) ((美)米切尔)',
      '飘（上下） (外国文学名著名译丛书)',
      '(美)米切尔',
    ],
    [
      'Your P2K Articles (2021-04-02) (P2K)',
      'Your P2K Articles (2021-04-02)',
      'P2K',
    ],
  ])(
    'Parse "%s" to title "%s" and author "%s"',
    (input: string, title: string, author: string | undefined) => {
      const bookInfo = parseTitleAndAuthor(input);
      expect(bookInfo.title).toEqual(title);
      expect(bookInfo.author).toEqual(author);
    }
  );
});
