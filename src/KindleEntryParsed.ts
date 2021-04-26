import { KindleEntry } from "./KindleEntry";

const LocationRegex = Object.freeze(/\d+-?\d*/);

export const EntryTypeTranslations = Object.freeze({
  NOTE: ["note", "nota"],
  HIGHLIGHT: ["highlight", "subrayado", "surlignement"],
  BOOKMARK: ["bookmark", "marcador", "signet"],
});

export enum EntryType {
  Note = "NOTE",
  Highlight = "HIGHLIGHT",
  Bookmark = "BOOKMARK",
}

export class KindleEntryParsed {
  private kindleEntry: KindleEntry;
  authors?: string;
  bookTitle: string;
  page: string;
  location: string;
  dateOfCreation: string;
  type: EntryType;
  content: string;

  constructor(kindleEntry: KindleEntry) {
    this.kindleEntry = kindleEntry;
    if (kindleEntry.contentClipp.length === 0) {
      this.content = "No content";
    } else {
      this.content = kindleEntry.contentClipp;
    }
    this.parseAuthor();
    this.parseBook();
    this.parseMetadata();
    if (this.type === EntryType.Bookmark) {
      // Add placeholer for the content
      this.content = "No content";
    }
  }

  parseAuthor(): void {
    const bookTitleAndAuthors: string = this.kindleEntry.bookTitleAndAuthors;

    const matches = bookTitleAndAuthors.match(/.*\(([^)]+)\)$/);

    // Not all books will always have book meta data
    if (matches) {
      this.authors = matches[1];
    }
  }

  parseBook() {
    const bookTitleAndAuthors: string = this.kindleEntry.bookTitleAndAuthors;

    const matches = bookTitleAndAuthors.match(/.*\(([^)]+)\)$/);

    // An author is specified "title (author)"
    if (matches) {
      const parenthesesIndex = bookTitleAndAuthors.indexOf(`(${matches[1]})`);
      this.bookTitle = bookTitleAndAuthors
        .substring(0, parenthesesIndex)
        .trim();
    }
    // An author is not specified "title"
    else {
      this.bookTitle = bookTitleAndAuthors.trim();
    }
  }

  parseMetadata() {
    const metadata = this.kindleEntry.metdataClipp;
    const indexOfFirstSeparator = metadata.indexOf("|");
    const indexOfSecondSeparator = metadata.indexOf(
      "|",
      indexOfFirstSeparator + 1
    );

    const hasPageMetadata = indexOfSecondSeparator !== -1;

    let pageMetadata: string;
    let locationMetadata: string;
    let dateOfCreation: string;

    if (indexOfFirstSeparator === -1) {
      throw new Error(`Could not parse metadata of: ${metadata}`);
    }

    // Obtaining separated strings
    if (!hasPageMetadata) {
      // Doesnt have page count
      locationMetadata = metadata.substring(0, indexOfFirstSeparator).trim();
      dateOfCreation = metadata.substring(indexOfFirstSeparator + 1).trim();
    } else {
      pageMetadata = metadata.substring(0, indexOfFirstSeparator).trim();
      locationMetadata = metadata
        .substring(indexOfFirstSeparator + 1, indexOfSecondSeparator)
        .trim();
      dateOfCreation = metadata.substring(indexOfSecondSeparator + 1).trim();
    }

    // Page parsing
    if (hasPageMetadata) {
      this.page = this.parsePage(pageMetadata);
    }

    // location parsing
    this.location = this.parseLocation(locationMetadata);

    // Date of creation parsing
    this.dateOfCreation = this.parseDateOfCreation(dateOfCreation);

    // Type of entry parsing
    if (hasPageMetadata) {
      this.type = this.parseEntryType(pageMetadata);
    } else {
      this.type = this.parseEntryType(locationMetadata);
    }
  }

  parsePage(pageMetadata: string) {
    const matches = pageMetadata.match(/^.* (.*)$/);

    if (matches) {
      return matches[1];
    }

    throw new Error(
      `Can't parse page number from pageMetadataStr: ${pageMetadata}`
    );
  }

  parseLocation(locationMetadata: string) {
    const matchLocation:
      | RegExpExecArray
      | null
      | undefined = LocationRegex.exec(locationMetadata);
    if (!matchLocation) {
      throw new Error(
        `Can't parse location from locationMetadataStr: ${locationMetadata}`
      );
    }
    const location: string = matchLocation[0];
    return location;
  }

  parseDateOfCreation(dateMetadata: string) {
    return dateMetadata;
  }

  parseEntryType(pageMetadata: string): EntryType {
    const pageMetaddataLowerCase: string = pageMetadata.toLowerCase();
    let isTypeNote: boolean = false;
    let isTypeHighlight: boolean = false;
    let isTypeBookmark: boolean = false;
    for (const noteTranslation of EntryTypeTranslations.NOTE) {
      if (pageMetaddataLowerCase.includes(noteTranslation)) {
        isTypeNote = true;
        break;
      }
    }

    if (isTypeNote) {
      return EntryType.Note;
    }

    for (const highlightTranslation of EntryTypeTranslations.HIGHLIGHT) {
      if (pageMetaddataLowerCase.includes(highlightTranslation)) {
        isTypeHighlight = true;
        break;
      }
    }

    if (isTypeHighlight) {
      return EntryType.Highlight;
    }

    for (const bookMarkTranslation of EntryTypeTranslations.BOOKMARK) {
      if (pageMetaddataLowerCase.includes(bookMarkTranslation)) {
        isTypeBookmark = true;
        break;
      }
    }

    if (isTypeBookmark) {
      return EntryType.Bookmark;
    } else {
      throw new Error(
        `Couldn't parse type of Entry: pageMetadataStr: ${pageMetadata}`
      );
    }
  }

  toJSON() {
    return {
      authors: this.authors,
      bookTile: this.bookTitle,
      page: this.page,
      location: this.location,
      dateOfCreation: this.dateOfCreation,
      content: this.content,
      type: this.type,
    };
  }
}
