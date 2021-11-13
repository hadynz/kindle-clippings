import { EntryType, ParsedBlock } from '../blocks/ParsedBlock';

export type Annotation = {
  content: string;
  type: EntryType;
  page: string;
  location: string;
  note?: string;
};

export type Book = {
  title: string;
  author?: string;
  annotations: Annotation[];
};

/**
 * Organize the data into an array of Books with embedded array of entities
 * @param parsedBlocks
 */
export function groupToBooks(parsedBlocks: ParsedBlock[]): Book[] {
  const result: Book[] = [];

  /**
   * First loop (reducer):
   * - Skip any "duplicate" highlight. Duplicates are identified by being on the same location
   * - Assumption: Entries are ordered by location
   * Second loop (forEach):
   * - Group entries inside books
   */
  parsedBlocks
    .reduce((accumulator, currentValue, currentIndex, list) => {
      if (currentValue.location === list[currentIndex + 1]?.location) {
        return accumulator;
      }
      return [...accumulator, currentValue];
    }, [] as ParsedBlock[])
    .forEach((entry: ParsedBlock) => {
      let book = result.find((r) => r.title === entry.bookTitle) as Book;

      if (book == null) {
        book = {
          title: entry.bookTitle,
          author: entry.authors,
          annotations: [],
        };

        result.push(book);
      }

      if (entry.type === 'NOTE') {
        const previousEntry = book.annotations[book.annotations.length - 1];

        if (previousEntry) {
          previousEntry.note = entry.content;
          return;
        }

        // tslint:disable-next-line: no-console
        console.warn(
          'Note was not preceded by highlight. Skipping',
          entry.content
        );
      }

      book.annotations.push({
        content: entry.content,
        type: entry.type,
        page: entry.page,
        location: entry.location,
      });
    });

  return result;
}
