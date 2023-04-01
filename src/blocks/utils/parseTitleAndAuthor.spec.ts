type BookInfo = {
  title: string;
  author: string | undefined;
};

type Segment = {
  text: string;
  level: number;
  startIndex: number;
};

export const parseTitleAndAuthor = (input: string): BookInfo => {
  const stack: Segment[] = [];
  let word = '';
  let level = 0;
  let lastStartIndex = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === '(') {
      if (level === 0) {
        stack.push({ text: word.trim(), level, startIndex: lastStartIndex });
        lastStartIndex = i;
        word = '';
      }
      word += char;
      level++;
    } else if (char === ')') {
      word += char;
      if (level === 1) {
        stack.push({ text: word.trim(), level, startIndex: lastStartIndex });
        word = '';
      }
      level--;
    } else {
      word += char;
    }
  }

  if (word.length > 0) {
    stack.push({ text: word.trim(), level, startIndex: lastStartIndex });
  }

  console.log(stack.filter((s) => s.text.length > 0));

  let author: string | undefined = undefined;

  const hasAuthor = stack[stack.length - 1].level === 1;

  if (hasAuthor) {
    const lastSegment = stack.pop();
    author = lastSegment?.text.replace(/^\(/, '').replace(/\)$/, '');
  }

  return {
    title: stack
      .map((s) => s.text)
      .join(' ')
      .trim(),
    author,
  };
};

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
