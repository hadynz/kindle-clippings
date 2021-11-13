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

    expect(firstBook.title).toBe(
      "Elantris: Tenth Anniversary Author's Definitive Edition"
    );
    expect(firstBook.annotations).toHaveLength(3);
    expect(firstBook.annotations[0].location).toBe('398');
    expect(firstBook.annotations[1].location).toBe('481');

    expect(secondBook.title).toBe('1984');
    expect(secondBook.annotations).toHaveLength(1); // Duplicate highlights on location are stripped
    expect(secondBook.annotations[0].note).toBe(
      'Airplane Accidents - also how software projects go wrong'
    );
  });
});
