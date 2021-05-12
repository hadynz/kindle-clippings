import { KindleEntry } from "./KindleEntry";

const LocationRegex = Object.freeze(/\d+-?\d*/);

export const EntryTypeTranslations = Object.freeze({
  NOTE: ["note", "nota"],
  HIGHLIGHT: ["highlight", "subrayado", "surlignement", "的标注"],
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

    this.parseAuthor();
    this.parseBookTitle();
    this.parseMetadata();
    this.parseContent();
  }

  parseContent(): void {
    if (this.kindleEntry.contentClipp.length === 0) {
      this.content = "No content";
    } else if (this.type === EntryType.Bookmark) {
      this.content = "No content";
    } else {
      this.content = this.kindleEntry.contentClipp;
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

  parseBookTitle() {
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
    const sections = this.kindleEntry.metdataClipp
      .split("|")
      .map((s) => s.trim());

    if (sections.length === 0) {
      throw new Error(
        `Could not parse metadata of: ${this.kindleEntry.metdataClipp}`
      );
    }

    if (sections.length === 3) {
      const pageSection = sections.shift();
      this.page = this.parsePage(pageSection);
      this.type = this.parseEntryType(pageSection);
    }

    const [locationSection, dateSection] = sections;

    this.location = this.parseLocation(locationSection);
    this.dateOfCreation = this.parseDateOfCreation(dateSection);

    if (!this.type) {
      this.type = this.parseEntryType(locationSection);
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
    const matchLocation: RegExpExecArray | null | undefined =
      LocationRegex.exec(locationMetadata);
    if (!matchLocation) {
      throw new Error(
        `Can't parse location from locationMetadataStr: ${locationMetadata}`
      );
    }
    const location: string = matchLocation[0];
    return location?.replace(/-.*/, "");
  }

  parseDateOfCreation(dateMetadata: string) {
    return dateMetadata;
  }

  parseEntryType(pageMetadata: string): EntryType {
    const pageMetaddataLowerCase: string = pageMetadata.toLowerCase();

    const isTypeNote = EntryTypeTranslations.NOTE.some((token) =>
      pageMetaddataLowerCase.includes(token)
    );

    const isTypeHighlight = EntryTypeTranslations.HIGHLIGHT.some((token) =>
      pageMetaddataLowerCase.includes(token)
    );

    const isTypeBookmark = EntryTypeTranslations.BOOKMARK.some((token) =>
      pageMetaddataLowerCase.includes(token)
    );

    if (isTypeNote) {
      return EntryType.Note;
    } else if (isTypeHighlight) {
      return EntryType.Highlight;
    } else if (isTypeBookmark) {
      return EntryType.Bookmark;
    }

    throw new Error(
      `Couldn't parse type of Entry: pageMetadataStr: ${pageMetadata}`
    );
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
