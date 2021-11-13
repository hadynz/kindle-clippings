import fs from 'fs';

import { readMyClippingsFile } from '.';
import { parseRawBlocks } from './parsers/parser';
import { organizeKindleEntriesByBooks } from './parsers/organizer';

(async (): Promise<void> => {
  const file = '/Users/hady.osman/Desktop/My Clippings (hady).txt';

  // tslint:disable-next-line: no-console
  console.log('file', file);

  const clippingsFileContent = fs.readFileSync(file, 'utf8');

  const rawBlocks = readMyClippingsFile(clippingsFileContent);
  const parsedBlocks = parseRawBlocks(rawBlocks);
  const books = organizeKindleEntriesByBooks(parsedBlocks);

  // tslint:disable-next-line: no-console
  console.log(books);
})();
