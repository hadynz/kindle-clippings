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
  authors: string;
  bookTile: string;
  page: number;
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
    let ocurrenceIndex: number = bookTitleAndAuthors.indexOf("(");

    if (ocurrenceIndex === -1) {
      throw new Error(
        `Could not parse author from bookTitleAndAuthors of KindleEntry: ${bookTitleAndAuthors}`
      );
    }

    let nextOcurrenceIndex: number = bookTitleAndAuthors.indexOf(
      "(",
      ocurrenceIndex + 1
    );
    for (
      ;
      nextOcurrenceIndex !== -1 &&
      nextOcurrenceIndex < bookTitleAndAuthors.length;

    ) {
      ocurrenceIndex = nextOcurrenceIndex;
      nextOcurrenceIndex = bookTitleAndAuthors.indexOf("(", ocurrenceIndex + 1);
    }

    const closingParenthesesIndex: number = bookTitleAndAuthors.indexOf(
      ")",
      ocurrenceIndex
    );
    const authors: string = bookTitleAndAuthors.substring(
      ocurrenceIndex + 1,
      closingParenthesesIndex
    );
    // Save authors
    this.authors = authors;
  }

  parseBook() {
    const bookTitleAndAuthors: string = this.kindleEntry.bookTitleAndAuthors;
    let firstOccurrenceIndex: number = bookTitleAndAuthors.indexOf("(");
    let nextOccurrenceIndex: number = bookTitleAndAuthors.indexOf(
      "(",
      firstOccurrenceIndex + 1
    );
    let lastIndex: number = firstOccurrenceIndex;
    for (; nextOccurrenceIndex !== -1; ) {
      lastIndex = firstOccurrenceIndex;
      firstOccurrenceIndex = bookTitleAndAuthors.indexOf(
        "(",
        firstOccurrenceIndex + 1
      );
      if (firstOccurrenceIndex === -1) {
        firstOccurrenceIndex = lastIndex;
      }
      nextOccurrenceIndex = bookTitleAndAuthors.indexOf(
        "(",
        firstOccurrenceIndex + 1
      );
    }
    const bookTile: string = bookTitleAndAuthors.substring(
      0,
      firstOccurrenceIndex
    );
    this.bookTile = bookTile.trim();
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
    } else {
      this.page = 0;
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
    const matchPage: RegExpExecArray | null | undefined = /\d+/.exec(
      pageMetadata
    );
    if (!matchPage) {
      throw new Error(
        `Can't parse page number from pageMetadataStr: ${pageMetadata}`
      );
    }
    const page = Number(matchPage[0]);
    if (isNaN(page)) {
      throw new Error(
        `Can't parse page number of: matchPage: ${matchPage} from pageMetadataStr: ${pageMetadata}`
      );
    }
    return page;
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
      bookTile: this.bookTile,
      page: this.page,
      location: this.location,
      dateOfCreation: this.dateOfCreation,
      content: this.content,
      type: this.type,
    };
  }
}
