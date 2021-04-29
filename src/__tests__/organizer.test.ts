import { KindleEntry } from "../KindleEntry";
import { KindleEntryParsed, EntryType } from "../KindleEntryParsed";
import {
  organizeKindleEntriesByAuthors,
  organizeKindleEntriesByBookTitle,
  organizeKindleEntriesByBooks,
} from "../organizer";

interface DataEntry {
  entry: KindleEntry;
  titleParsed: string;
  author: string;
  page: number;
  location: string;
  dateOfCreation: string;
  type: EntryType;
}

const sampleEntries: Array<DataEntry> = [
  {
    entry: new KindleEntry(
      "非オタの彼女が俺の持ってるエロゲに興味津々なんだが…… (滝沢　慧;睦茸)",
      "- La subrayado en la página 197 | posición 2031-2035 | Añadido el sábado, 12 de octubre de 2019 0:37:31",
      "この部室は内側から施錠できるし、覗き窓みたいなものもない。"
    ),
    titleParsed: "非オタの彼女が俺の持ってるエロゲに興味津々なんだが……",
    author: "滝沢　慧;睦茸",
    page: 197,
    location: "2031-2035",
    dateOfCreation: "Añadido el sábado, 12 de octubre de 2019 0:37:31",
    type: EntryType.Highlight,
  },
  {
    entry: new KindleEntry(
      "僕が七不思議になったわけ (メディアワークス文庫) (小川 晴央)",
      "- La subrayado en la página 14 | posición 182-183 | Añadido el lunes, 25 de noviembre de 2019 0:43:38",
      "彼女は椅子から立ち上がると、落ち葉の様なスピードでゆっくりと床に降りた。着地の際に足元の埃が舞うだけで、音は一切しない。"
    ),
    titleParsed: "僕が七不思議になったわけ (メディアワークス文庫)",
    author: "小川 晴央",
    page: 14,
    location: "182-183",
    dateOfCreation: "Añadido el lunes, 25 de noviembre de 2019 0:43:38",
    type: EntryType.Highlight,
  },
];

const sampleEntries2: KindleEntry[] = [
  new KindleEntry(
    "Elantris: Tenth Anniversary Author's Definitive Edition (Sanderson, Brandon)",
    "- Your Highlight on page 27 | location 398-399 | Added on Thursday, 24 August 2017 22:31:50",
    "—anything to keep from acknowledging what she was: a lanky, brusque"
  ),
  new KindleEntry(
    "Elantris: Tenth Anniversary Author's Definitive Edition (Sanderson, Brandon)",
    "- Your Highlight on page 30 | location 481-484 | Added on Thursday, 24 August 2017 23:34:25",
    "Sarene took a calming breath, telling herself to be patient. She couldn’t blame the queen for being the way she was; Domi taught that all people’s personalities were gifts to be enjoyed. The queen was charming, in her own meandering way. Unfortunately, after meeting both king and queen, Sarene was beginning to suspect that she would have trouble finding political allies in Arelon."
  ),
  new KindleEntry(
    "Elantris: Tenth Anniversary Author's Definitive Edition (Sanderson, Brandon)",
    "- Your Highlight on page 31 | location 483-484 | Added on Thursday, 24 August 2017 23:34:29",
    "Arelon. Something else bothered Sarene—something"
  ),
  new KindleEntry(
    "1984 (Orwell, George)",
    "- Your Highlight on page 41 | location 737-738 | Added on Saturday, 9 September 2017 13:27:00",

    "Don’t you see that the whole aim of Newspeak is to narrow the range of thought? In the end we shall make thoughtcrime literally impossible, because there will be no words in which to express"
  ),
  new KindleEntry(
    "1984 (Orwell, George)",
    "- Your Highlight on page 41 | location 737-738 | Added on Saturday, 9 September 2017 13:27:09",
    "“Don’t you see that the whole aim of Newspeak is to narrow the range of thought? In the end we shall make thoughtcrime literally impossible, because there will be no words in which to express it."
  ),
  new KindleEntry(
    "1984 (Orwell, George)",
    "- Your Note at location 1971 | Added on Wednesday, 6 January 2021 14:22:58",
    "Airplane Accidents - also how software projects go wrong"
  ),
];

const firstTitle = "非オタの彼女が俺の持ってるエロゲに興味津々なんだが……";
const firstAuthor = "滝沢　慧;睦茸";
const secondTitle = "僕が七不思議になったわけ (メディアワークス文庫)";
const secondAuthor = "小川 晴央";

describe("organizeKindleEntriesByAuthors", () => {
  it("organizes by authors", () => {
    // AAA
    // Arrange
    let parsedEntries = sampleEntries.map((sampleEntry) => {
      return new KindleEntryParsed(sampleEntry.entry);
    });

    // Act
    const organizedByAuthors = organizeKindleEntriesByAuthors(parsedEntries);

    // Assert
    let numEntries = organizedByAuthors.size;
    let entriesFirstAuthor = organizedByAuthors.get(firstAuthor);
    let entriesSecondAuthor = organizedByAuthors.get(secondAuthor);

    expect(numEntries).toBe(2);
    expect(entriesFirstAuthor).toHaveLength(1);
    expect(entriesSecondAuthor).toHaveLength(1);
  });
});

describe("organizeKindleEntriesByBookTitle", () => {
  it("organizes by book title", () => {
    // AAA
    // Arrange
    let parsedEntries = sampleEntries.map((sampleEntry) => {
      return new KindleEntryParsed(sampleEntry.entry);
    });

    // Act
    const organizedByBookTitle = organizeKindleEntriesByBookTitle(
      parsedEntries
    );

    // Assert
    let numEntries = organizedByBookTitle.size;
    let entriesFirstTitle = organizedByBookTitle.get(firstTitle);
    let entriesSecondTitle = organizedByBookTitle.get(secondTitle);

    expect(numEntries).toBe(2);
    expect(entriesFirstTitle).toHaveLength(1);
    expect(entriesSecondTitle).toHaveLength(1);
  });
});

describe("organizeKindleEntriesByBooks", () => {
  it("groups by books", () => {
    // AAA
    // Arrange
    let parsedEntries = sampleEntries2.map((sampleEntry) => {
      return new KindleEntryParsed(sampleEntry);
    });

    // Act
    const books = organizeKindleEntriesByBooks(parsedEntries);

    // Assert
    let firstBook = books[0];
    let secondBook = books[1];

    expect(books).toHaveLength(2);

    expect(firstBook.title).toBe(
      "Elantris: Tenth Anniversary Author's Definitive Edition"
    );
    expect(firstBook.entries).toHaveLength(3);
    expect(firstBook.entries[0].location).toBe('398')
    expect(firstBook.entries[1].location).toBe('481')

    expect(secondBook.title).toBe("1984");
    expect(secondBook.entries).toHaveLength(1); // Duplicate highlights on location are stripped
    expect(secondBook.entries[0].note).toBe(
      "Airplane Accidents - also how software projects go wrong"
    );
  });
});
