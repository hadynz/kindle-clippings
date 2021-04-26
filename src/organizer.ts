import { EntryType, KindleEntryParsed } from "./KindleEntryParsed";

/**
 * Organize the data into a Map<string, Array<KindleEntryParsed>>
 * where each key represents the Book title
 * @param entriesParsed
 */
export function organizeKindleEntriesByBookTitle(
  entriesParsed: Array<KindleEntryParsed>,
  kindleEntriesOrganized?: Map<string, Array<KindleEntryParsed>>
): Map<string, Array<KindleEntryParsed>> {
  let newKindleEntriesOrganized: Map<
    string,
    Array<KindleEntryParsed>
  > | null = null;

  if (entriesParsed.length === 0) {
    throw new Error("entriesParsed empty");
  }

  if (kindleEntriesOrganized) {
    newKindleEntriesOrganized = kindleEntriesOrganized;
  } else {
    newKindleEntriesOrganized = new Map();
  }

  entriesParsed.forEach((entry) => {
    let bookTitle = entry.bookTile;
    if (newKindleEntriesOrganized.has(bookTitle)) {
      newKindleEntriesOrganized.get(bookTitle).push(entry);
    } else {
      newKindleEntriesOrganized.set(bookTitle, [entry]);
    }
  });

  return newKindleEntriesOrganized;
}

/**
 * Organize the data into a Map<string, Array<KindleEntryParsed>>
 * where each key represents the authors
 * @param entriesParsed
 */
export function organizeKindleEntriesByAuthors(
  entriesParsed: Array<KindleEntryParsed>,
  kindleEntriesOrganized?: Map<string, Array<KindleEntryParsed>>
): Map<string, Array<KindleEntryParsed>> {
  let newKindleEntriesOrganized: Map<
    string,
    Array<KindleEntryParsed>
  > | null = null;

  if (entriesParsed.length === 0) {
    throw new Error("entriesParsed empty");
  }

  if (kindleEntriesOrganized) {
    newKindleEntriesOrganized = kindleEntriesOrganized;
  } else {
    newKindleEntriesOrganized = new Map();
  }

  entriesParsed.forEach((entry) => {
    let authors = entry.authors;
    if (newKindleEntriesOrganized.has(authors)) {
      newKindleEntriesOrganized.get(authors).push(entry);
    } else {
      newKindleEntriesOrganized.set(authors, [entry]);
    }
  });

  return newKindleEntriesOrganized;
}

type Entry = {
  content: string;
  type: EntryType;
  page: number;
  location: string;
};

type Book = {
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

  entriesParsed.forEach((entry) => {
    const book: Book = result.find((r) => r.title === entry.bookTile) || {
      title: entry.bookTile,
      author: entry.authors,
      entries: [],
    };

    book.entries.push({
      content: entry.content,
      type: entry.type,
      page: entry.page,
      location: entry.location,
    });

    result.push(book);
  });

  return result;
}
