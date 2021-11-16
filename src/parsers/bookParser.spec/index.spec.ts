import fs from 'fs';
import path from 'path';

import { groupToBooks } from './../bookParser';
import { readMyClippingsFile } from '../../index';

const readFile = (filePath: string) => {
  const scenarioFile = fs.readFileSync(
    path.resolve(__dirname, filePath),
    'utf8'
  );
  return readMyClippingsFile(scenarioFile);
};

describe('bookParser', () => {
  it('Group some parsed blocks to books', () => {
    // Arrange
    const parsedBlocks = readFile('./scenarios/first-scenario.txt');

    // Act
    const books = groupToBooks(parsedBlocks);

    // Assert
    const firstBook = books[0];
    const secondBook = books[1];

    expect(books).toHaveLength(2);

    expect(firstBook.title).toEqual(
      "Elantris: Tenth Anniversary Author's Definitive Edition"
    );
    expect(firstBook.annotations).toHaveLength(3);
    expect(firstBook.annotations[0].location?.from).toEqual(398);
    expect(firstBook.annotations[1].location?.from).toEqual(481);
    expect(firstBook.annotations[2].location?.from).toEqual(483);

    expect(secondBook.title).toEqual('1984');
    expect(secondBook.annotations).toHaveLength(1); // Duplicate highlights on location are stripped
    expect(secondBook.annotations[0].content).toEqual(
      '“Don’t you see that the whole aim of Newspeak is to narrow the range of thought?' // The deprecated dupe is stripped out
    );
    expect(secondBook.annotations[0].note).toEqual(
      'The ABC model - key for growth and happiness'
    );
  });

  it('Group unordered clippings to books', () => {
    const parsedBlocks = readFile('./scenarios/unordered-scenario.txt');

    // Act
    const books = groupToBooks(parsedBlocks);

    // Assert
    expect(books).toHaveLength(1);
    expect(books[0].annotations).toHaveLength(3);
    expect(books[0].annotations[0].note).toEqual('Hollow 1');
    expect(books[0].annotations[1].note).toEqual('Few more');
    expect(books[0].annotations[2].note).toEqual('Hollow 3');
  });

  it('Distinct books with same location are seen as the independent books they are', () => {
    const parsedBlocks = readFile('./scenarios/dup-location-scenario.txt');

    // Act
    const books = groupToBooks(parsedBlocks);

    // Assert
    expect(books).toHaveLength(3);
    books.forEach((book) => expect(book.annotations).toHaveLength(1));
  });
});
