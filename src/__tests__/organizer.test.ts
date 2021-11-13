import { KindleEntry } from '../KindleEntry';
import { KindleEntryParsed } from '../KindleEntryParsed';
import { organizeKindleEntriesByBooks } from '../organizer';

describe('organizeKindleEntriesByBooks', () => {
  it('groups by books', () => {
    const standardMyClippings: KindleEntry[] = [
      new KindleEntry(
        "Elantris: Tenth Anniversary Author's Definitive Edition (Sanderson, Brandon)",
        '- Your Highlight on page 27 | location 398-399 | Added on Thursday, 24 August 2017 22:31:50',
        '—anything to keep from acknowledging what she was: a lanky, brusque'
      ),
      new KindleEntry(
        "Elantris: Tenth Anniversary Author's Definitive Edition (Sanderson, Brandon)",
        '- Your Highlight on page 30 | location 481-484 | Added on Thursday, 24 August 2017 23:34:25',
        'Sarene took a calming breath, telling herself to be patient. She couldn’t blame the queen for being the way she was; Domi taught that all people’s personalities were gifts to be enjoyed. The queen was charming, in her own meandering way. Unfortunately, after meeting both king and queen, Sarene was beginning to suspect that she would have trouble finding political allies in Arelon.'
      ),
      new KindleEntry(
        "Elantris: Tenth Anniversary Author's Definitive Edition (Sanderson, Brandon)",
        '- Your Highlight on page 31 | location 483-484 | Added on Thursday, 24 August 2017 23:34:29',
        'Arelon. Something else bothered Sarene—something'
      ),
      new KindleEntry(
        '1984 (Orwell, George)',
        '- Your Highlight on page 41 | location 737-738 | Added on Saturday, 9 September 2017 13:27:00',

        'Don’t you see that the whole aim of Newspeak is to narrow the range of thought? In the end we shall make thoughtcrime literally impossible, because there will be no words in which to express'
      ),
      new KindleEntry(
        '1984 (Orwell, George)',
        '- Your Highlight on page 41 | location 737-738 | Added on Saturday, 9 September 2017 13:27:09',
        '“Don’t you see that the whole aim of Newspeak is to narrow the range of thought? In the end we shall make thoughtcrime literally impossible, because there will be no words in which to express it.'
      ),
      new KindleEntry(
        '1984 (Orwell, George)',
        '- Your Note at location 1971 | Added on Wednesday, 6 January 2021 14:22:58',
        'Airplane Accidents - also how software projects go wrong'
      ),
    ];

    // AAA
    // Arrange
    const parsedEntries = standardMyClippings.map((sampleEntry) => {
      return new KindleEntryParsed(sampleEntry);
    });

    // Act
    const books = organizeKindleEntriesByBooks(parsedEntries);

    // Assert
    const firstBook = books[0];
    const secondBook = books[1];

    expect(books).toHaveLength(2);

    expect(firstBook.title).toBe(
      "Elantris: Tenth Anniversary Author's Definitive Edition"
    );
    expect(firstBook.entries).toHaveLength(3);
    expect(firstBook.entries[0].location).toBe('398');
    expect(firstBook.entries[1].location).toBe('481');

    expect(secondBook.title).toBe('1984');
    expect(secondBook.entries).toHaveLength(1); // Duplicate highlights on location are stripped
    expect(secondBook.entries[0].note).toBe(
      'Airplane Accidents - also how software projects go wrong'
    );
  });
});
