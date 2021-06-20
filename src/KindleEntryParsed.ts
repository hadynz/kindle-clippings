import { KindleEntry } from "./KindleEntry";

export const EntryTypeTranslations = Object.freeze({
  NOTE: ["note", "nota", "的笔记"],
  HIGHLIGHT: [
    "highlight",
    "subrayado", // Spanish
    "surlignement", // French
    "的标注", // Chinese
    "destaque", // Portugese
    "evidenziazione", // Italian
  ],
  BOOKMARK: ["bookmark", "marcador", "signet", "的书签"],
});

export enum EntryType {
  Note = "NOTE",
  Highlight = "HIGHLIGHT",
  Bookmark = "BOOKMARK",
  Unknown = "UNKNOWN",
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

    // There must always be at least two sections separated by pipes
    if (sections.length < 2) {
      throw new Error(
        `Invalid metadata entry. Expected a page and/or location and created date entry: ${this.kindleEntry.metdataClipp}`
      );
    }

    // Type of entry is always defined in the first section
    this.type = this.parseEntryType(sections[0]);

    // Date of creation is always defined in the last section
    this.dateOfCreation = this.parseDateOfCreation(
      sections[sections.length - 1]
    );

    if (sections.length === 3) {
      this.page = this.parseSectionForNumber(sections[0]);
      this.location = this.parseSectionForNumber(sections[1]);
    } // When author is not set, it is not an Amazon book and page will only be available
    else if (this.authors === undefined) {
      this.page = this.parseSectionForNumber(sections[0]);
    } else {
      this.location = this.parseSectionForNumber(sections[0]);
    }
  }

  parseSectionForNumber(section: string) {
    // If string has any standalone numbers, the first occurence will be a valid page number
    const matches1 = section.match(/(\d+)/);
    if (matches1) {
      return matches1[0];
    }

    // Return the last word in the sentence. Works for roman literals (e.g. "... on page ix")
    const matches2 = section.match(/^.* (.*)$/);
    if (matches2) {
      return matches2[1].replace(/-.*/, "");
    }

    throw new Error(`Can't parse page number from pageMetadataStr: ${section}`);
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
    return EntryType.Unknown;
  }
}
