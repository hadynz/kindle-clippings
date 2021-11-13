import { RawBlock } from './RawBlock';

interface TestData {
  lines: string[];
  entry: RawBlock;
}

const testData: TestData[] = [
  {
    lines: [
      '1984 (Orwell, George)',
      '- Your Highlight on page 4 | location 76-77 | Added on Monday, 4 September 2017 01:51:18',
      '',
      'WAR IS PEACE',
      'FREEDOM IS SLAVERY',
      'IGNORANCE IS STRENGTH. The Ministry of Truth contained,',
    ],
    entry: new RawBlock(
      '1984 (Orwell, George)',
      '- Your Highlight on page 4 | location 76-77 | Added on Monday, 4 September 2017 01:51:18',
      `WAR IS PEACE\nFREEDOM IS SLAVERY\nIGNORANCE IS STRENGTH. The Ministry of Truth contained,`
    ),
  },
  {
    lines: [
      '',
      'Thinking, Fast and Slow (Kahneman, Daniel)',
      '- Your Highlight on Location 4823-4827 | Added on Tuesday, September 16, 2014 9:29:00 PM',
      '',
      'making against claims of bias and is typically hostile to algorithms',
    ],
    entry: new RawBlock(
      'Thinking, Fast and Slow (Kahneman, Daniel)',
      '- Your Highlight on Location 4823-4827 | Added on Tuesday, September 16, 2014 9:29:00 PM',
      `making against claims of bias and is typically hostile to algorithms`
    ),
  },
];

// eslint-disable-next-line no-undef
describe('RawBlock', () => {
  describe('Parsing My Clipping data to Raw Blocks', () => {
    const t = testData.map((entry, index) =>
      Object.assign(entry, {
        toString: () => `${index} - ${entry.entry.titleLine}`,
      })
    );

    test.each(t)("Parse Raw Block entry '%s'", (data: TestData) => {
      const rawBlock = RawBlock.parse(data.lines);
      expect(rawBlock).toStrictEqual(data.entry);
    });
  });
});
