import { EntryType, KindleEntryParsed } from "./KindleEntryParsed";

export type Entry = {
  content: string;
  type: EntryType;
  page: string;
  location: string;
  note?: string;
};

export type Book = {
  title: string;
  author: string;
  entries: Entry[];
};

/**
 * Organize the data into an array of Books with embedded array of entiies
 * @param entriesParsed
 */
export function organizeKindleEntriesByBooks(
  entriesParsed: Array<KindleEntryParsed>
): Book[] {
  const result: Book[] = [];

  /**
   * First loop (reducer):
   * - Skip any "duplicate" highlight. Duplicates are identified by being on the same location
   * - Assumption: Entries are ordered by location
   * Second loop (forEach):
   * - Group entries inside books
   */
  entriesParsed
    .reduce((accumulator, currentValue, currentIndex, list) => {
      if (currentValue.location === list[currentIndex + 1]?.location) {
        return accumulator;
      }
      return [...accumulator, currentValue];
    }, [])
    .forEach((entry) => {
      let book: Book = result.find((r) => r.title === entry.bookTitle);

      if (!book) {
        book = {
          title: entry.bookTitle,
          author: entry.authors,
          entries: [],
        };

        result.push(book);
      }

      if (entry.type === EntryType.Note) {
        const previousEntry = book.entries[book.entries.length - 1];

        if (previousEntry) {
          previousEntry.note = entry.content;
          return;
        }

        console.warn(
          "Note was not preceded by highlight. Skipping",
          entry.content
        );
      }

      book.entries.push({
        content: entry.content,
        type: entry.type,
        page: entry.page,
        location: entry.location,
      });
    });

  return result;
}
