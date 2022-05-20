import type { RawBlock } from './RawBlock';

export const EntryTypeTranslations = Object.freeze({
  NOTE: ['note', 'nota', '的笔记'],
  HIGHLIGHT: [
    'highlight',
    'subrayado', // Spanish
    'surlignement', // French
    '的标注', // Chinese
    'destaque', // Portugese
    'evidenziazione', // Italian
  ],
  BOOKMARK: ['bookmark', 'marcador', 'signet', '的书签'],
});

export type EntryType = 'NOTE' | 'HIGHLIGHT' | 'BOOKMARK' | 'UNKNOWN';

export type Range = {
  from?: number;
  to?: number;
  display: string;
};

const toNumber = (value: string): number | undefined => {
  return Number(value) || undefined;
};

export class ParsedBlock {
  public authors?: string;
  public title!: string;
  public page?: Range;
  public location?: Range;
  public dateOfCreation!: string;
  public type!: EntryType;
  public content!: string;

  constructor(private rawBlock: RawBlock) {
    this.parseTitleAndAuthor();
    this.parseMetadata();
    this.parseContent();
  }

  private parseContent(): void {
    if (this.rawBlock.contentLines.length === 0) {
      this.content = 'No content';
    } else if (this.type === 'BOOKMARK') {
      this.content = 'No content';
    } else {
      this.content = this.rawBlock.contentLines;
    }
  }

  private parseTitleAndAuthor() {
    const bookTitleAndAuthors: string = this.rawBlock.titleLine;

    const matches = bookTitleAndAuthors.match(/.*\(([^)]+)\)$/);

    // An author is specified "title (author)"
    if (matches) {
      const parenthesesIndex = bookTitleAndAuthors.indexOf(`(${matches[1]})`);

      this.title = bookTitleAndAuthors.substring(0, parenthesesIndex).trim();

      this.authors = matches[1];
    }
    // An author is not specified "title"
    else {
      this.title = bookTitleAndAuthors.trim();
    }
  }

  private parseMetadata() {
    const sections = this.rawBlock.metadataLine.split('|').map((s) => s.trim());

    // There must always be at least two sections separated by pipes
    if (sections.length < 2) {
      throw new Error(
        `Invalid metadata entry. Expected a page and/or location and created date entry: ${this.rawBlock.metadataLine}`
      );
    }

    const [firstSection, secondSection] = sections;

    // Type of entry is always defined in the first section
    this.type = this.parseEntryType(firstSection);

    // Date of creation is always defined in the last section
    this.dateOfCreation = this.parseDateOfCreation(
      sections[sections.length - 1]
    );

    if (sections.length === 3) {
      this.page = this.parseSectionForNumber(firstSection);
      this.location = this.parseSectionForNumber(secondSection);
    } // When author is not set, it is not an Amazon book and page will only be available
    else if (
      this.authors === undefined ||
      firstSection.toLowerCase().includes('page')
    ) {
      this.page = this.parseSectionForNumber(firstSection);
    } else {
      this.location = this.parseSectionForNumber(firstSection);
    }
  }

  private parseSectionForNumber(section: string): Range {
    // If string has any standalone numbers, the first occurrence will be a valid page number
    const matches1 = section.match(/(\d+)-?(\d+)?/);
    if (matches1) {
      const [, from, to] = matches1;
      return {
        from: toNumber(from),
        to: to == null ? toNumber(from) : toNumber(to),
        display: from,
      };
    }

    // Return the last word in the sentence. Works for roman literals (e.g. "... on page ix")
    const matches2 = section.match(/^.* (.*)$/);
    if (matches2) {
      const from = matches2[1].replace(/-.*/, '');
      return {
        from: toNumber(from),
        to: toNumber(from),
        display: from,
      };
    }

    throw new Error(`Can't parse page number from pageMetadataStr: ${section}`);
  }

  private parseDateOfCreation(dateMetadata: string) {
    return dateMetadata;
  }

  private parseEntryType(pageMetadata: string): EntryType {
    const pageMetaDate: string = pageMetadata.toLowerCase();

    const isTypeNote = EntryTypeTranslations.NOTE.some((token) =>
      pageMetaDate.includes(token)
    );

    const isTypeHighlight = EntryTypeTranslations.HIGHLIGHT.some((token) =>
      pageMetaDate.includes(token)
    );

    const isTypeBookmark = EntryTypeTranslations.BOOKMARK.some((token) =>
      pageMetaDate.includes(token)
    );

    if (isTypeNote) {
      return 'NOTE';
    } else if (isTypeHighlight) {
      return 'HIGHLIGHT';
    } else if (isTypeBookmark) {
      return 'BOOKMARK';
    }
    return 'UNKNOWN';
  }
}
