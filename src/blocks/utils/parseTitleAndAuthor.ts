type BookInfo = {
  title: string;
  author: string | undefined;
};

type Segment = {
  text: string;
  level: number;
  startIndex: number;
};

const createSegmentStack = (input: string): Segment[] => {
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

  return stack;
};

export const parseTitleAndAuthor = (input: string): BookInfo => {
  const stack = createSegmentStack(input);

  let author: string | undefined = undefined;

  if (stack[stack.length - 1].level === 1) {
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
