import fs from 'fs';
import path from 'path';

import { readMyClippingsFile } from '../blockParser';

const readFile = (filePath: string) => {
  return fs.readFileSync(path.resolve(__dirname, filePath), 'utf8');
};

describe('blockParser - readMyClippingsFile', () => {
  it('Reads a standard clippings file correctly', () => {
    // Arrange
    const fileContent = readFile('./scenarios/simple.txt');

    // Act
    const rawBlocks = readMyClippingsFile(fileContent);

    // Assert
    expect(rawBlocks).toHaveLength(3);
  });

  it('Reads a clippings file with a trailing separator at start of file', () => {
    // Arrange
    const fileContent = readFile('./scenarios/trailing-separator-start.txt');

    // Act
    const rawBlocks = readMyClippingsFile(fileContent);

    // Assert
    expect(rawBlocks).toHaveLength(2);
  });
});
