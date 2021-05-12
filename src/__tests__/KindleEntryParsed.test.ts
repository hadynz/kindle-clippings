import { KindleEntry } from "../KindleEntry";
import { KindleEntryParsed, EntryType } from "../KindleEntryParsed";

interface DataEntry {
  entry: KindleEntry;
  titleParsed: string;
  author?: string;
  page?: string;
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
    page: "197",
    location: "2031",
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
    page: "14",
    location: "182",
    dateOfCreation: "Añadido el lunes, 25 de noviembre de 2019 0:43:38",
    type: EntryType.Highlight,
  },
  {
    entry: new KindleEntry(
      "Ｃｈａｏｓ；Ｃｈｉｌｄ　－Ｃｈｉｌｄｒｅｎ’ｓ　Ｒｅｖｉｖｅ－ (講談社ラノベ文庫) (ＭＡＧＥＳ．;Ｃｈｉｙｏ ｓｔ．ｉｎｃ;梅原英司)",
      "- Your Highlight on Location 35-36 | Added on Monday, July 20, 2020 12:58:07 AM",
      "軟禁状態であったことは事実なのだから、おそらく外の人間からすれば、人権を無視された酷い生活に見えたのだろう。"
    ),
    titleParsed:
      "Ｃｈａｏｓ；Ｃｈｉｌｄ　－Ｃｈｉｌｄｒｅｎ’ｓ　Ｒｅｖｉｖｅ－ (講談社ラノベ文庫)",
    author: "ＭＡＧＥＳ．;Ｃｈｉｙｏ ｓｔ．ｉｎｃ;梅原英司",
    location: "35",
    dateOfCreation: "Added on Monday, July 20, 2020 12:58:07 AM",
    type: EntryType.Highlight,
  },
  {
    entry: new KindleEntry(
      "Le Retour du roi (J.R.R. Tolkien)",
      "- Votre surlignement sur la page 200 | emplacement 3054-3056 | Ajouté le mercredi 16 août 2017 02:14:10",
      "Il ne nous appartient toutefois pas de rassembler toutes les marées du monde, mais de faire ce qui est en nous pour le secours des années dans lesquelles nous sommes placés, déracinant le mal dans les champs que nous connaissons, de sorte que ceux qui vivront après nous puissent avoir une terre propre à cultiver."
    ),
    titleParsed: "Le Retour du roi",
    author: "J.R.R. Tolkien",
    page: "200",
    location: "3054",
    dateOfCreation: "Ajouté le mercredi 16 août 2017 02:14:10",
    type: EntryType.Highlight,
  },
  {
    entry: new KindleEntry(
      "The Effective Manager (Horstman, Mark)",
      "- Your Highlight on page ix | location 247-248 | Added on Sunday, 18 February 2018 22:30:47",
      "It's about getting the most out of your direct reports,"
    ),
    titleParsed: "The Effective Manager",
    author: "Horstman, Mark",
    page: "ix",
    location: "247",
    dateOfCreation: "Added on Sunday, 18 February 2018 22:30:47",
    type: EntryType.Highlight,
  },
  {
    entry: new KindleEntry(
      "paulo-coehlo-the-devil-and-miss-prym  ",
      "- Your Highlight on page 14-14 | Added on Saturday, 23 December 2017 09:46:53",
      "Given the right circumstances, every human being on this earth would be willing to commit evil.'"
    ),
    titleParsed: "paulo-coehlo-the-devil-and-miss-prym",
    location: "14",
    dateOfCreation: "Added on Saturday, 23 December 2017 09:46:53",
    type: EntryType.Highlight,
  },
  {
    entry: new KindleEntry(
      "如何使用 Knotes",
      "- 您在第 1 页（位置 #1-1）的标注 | 添加于 2017年11月13日星期一 上午9:00:00",
      "📖 功能栏位于左上方"
    ),
    titleParsed: "如何使用 Knotes",
    location: "1",
    dateOfCreation: "添加于 2017年11月13日星期一 上午9:00:00",
    type: EntryType.Highlight,
  },

];

// eslint-disable-next-line no-undef
describe("KindleEntryParsed", () => {
  describe("parseAuthor", () => {
    test("Obtains author", () => {
      // AAA
      sampleEntries.forEach((sampleEntry) => {
        // Arrange
        const kindleParsed: KindleEntryParsed = new KindleEntryParsed(
          sampleEntry.entry
        );

        // Act
        kindleParsed.parseAuthor();

        // Assert
        expect(kindleParsed.authors).toBe(sampleEntry.author);
      });
    });
  });

  describe("parseBook", () => {
    test("Obtains book title", () => {
      sampleEntries.forEach((sampleEntry) => {
        // Arrange
        const kindleParsed: KindleEntryParsed = new KindleEntryParsed(
          sampleEntry.entry
        );

        // Act
        kindleParsed.parseBookTitle();

        // Assert
        expect(kindleParsed.bookTitle).toBe(sampleEntry.titleParsed);
      });
    });
  });

  describe("parseEntryType", () => {
    test("Obtains correct entry type", () => {
      sampleEntries.forEach((sampleEntry) => {
        // Arrange
        const kindleParsed: KindleEntryParsed = new KindleEntryParsed(
          sampleEntry.entry
        );

        // Act
        let entryTypeObtained: EntryType = kindleParsed.parseEntryType(
          sampleEntry.entry.metdataClipp
        );

        // Assert
        expect(entryTypeObtained).toBe(sampleEntry.type);
      });
    });
  });

  describe("parseMetadata", () => {
    test("Obtains correct page", () => {
      sampleEntries.forEach((sampleEntry) => {
        // Arrange
        const kindleParsed: KindleEntryParsed = new KindleEntryParsed(
          sampleEntry.entry
        );
        // Act
        kindleParsed.parseMetadata();

        // Assert
        expect(kindleParsed.page).toBe(sampleEntry.page);
      });
    });

    test("Obtains correct location", () => {
      sampleEntries.forEach((sampleEntry) => {
        // Arrange
        const kindleParsed: KindleEntryParsed = new KindleEntryParsed(
          sampleEntry.entry
        );
        // Act
        kindleParsed.parseMetadata();

        // Assert
        expect(kindleParsed.location).toBe(sampleEntry.location);
      });
    });

    test("Obtains correct date of creation", () => {
      sampleEntries.forEach((sampleEntry) => {
        // Arrange
        const kindleParsed: KindleEntryParsed = new KindleEntryParsed(
          sampleEntry.entry
        );
        // Act
        kindleParsed.parseMetadata();

        // Assert
        expect(kindleParsed.dateOfCreation).toBe(sampleEntry.dateOfCreation);
      });
    });
  });
});
