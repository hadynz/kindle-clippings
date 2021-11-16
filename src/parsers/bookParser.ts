import _ from 'lodash';

import { EntryType, ParsedBlock, Range } from '../blocks/ParsedBlock';

export type Annotation = {
  content: string;
  type: EntryType;
  page?: Range;
  location?: Range;
  note?: string;
};

export type Book = {
  title: string;
  author?: string;
  annotations: Annotation[];
};

const toBooks = (blocks: ParsedBlock[]): Book[] => {
  return blocks.reduce((acc: Book[], block) => {
    const book = acc.find((b) => b.title === block.bookTitle) as Book;

    if (book == null) {
      return [
        ...acc,
        {
          title: block.bookTitle,
          author: block.authors,
          annotations: [],
        },
      ];
    }

    return acc;
  }, []);
};

const inBetween = (
  value: number | undefined,
  range: Range | undefined
): boolean => {
  if (value == null || range?.from == null || range.to == null) {
    return false;
  }
  return value >= range.from && value <= range.to;
};

/**
 * Organize the data into an array of Books with embedded array of entities
 * @param parsedBlocks
 */
export function groupToBooks(parsedBlocks: ParsedBlock[]): Book[] {
  const books = toBooks(parsedBlocks);

  /**
   * Dedupe blocks that start at the same location. Always take latest occurrence.
   * We achieve this by reversing array, de-duping, and then reversing again
   */
  const reversedBlocks = _.reverse(_.clone(parsedBlocks));

  const dedupedBlocks = _.uniqWith(reversedBlocks, (block1, block2) => {
    return (
      block1.bookTitle === block2.bookTitle &&
      block1.type === block2.type &&
      block1.location?.from === block2.location?.from
    );
  });

  _.reverse(dedupedBlocks);

  // Add all blocks (that are not of type note) to their associated book
  dedupedBlocks
    .filter((b) => b.type !== 'NOTE')
    .forEach((block) => {
      const book = books.find((r) => r.title === block.bookTitle) as Book;
      book.annotations.push({
        content: block.content,
        type: block.type,
        page: block.page,
        location: block.location,
      });
    });

  dedupedBlocks
    .filter((b) => b.type === 'NOTE')
    .forEach((noteBlock) => {
      const book = books.find((r) => r.title === noteBlock.bookTitle) as Book;

      const annotation = book.annotations.find((a) =>
        inBetween(noteBlock.location?.from, a.location)
      );

      // No guarding. Override duplicate notes for the same annotation
      if (annotation != null) {
        annotation.note = noteBlock.content;
      }
    });

  return books;
}
