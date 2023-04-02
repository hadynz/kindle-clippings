import * as fs from 'fs';

import { groupToBooks } from './parsers/bookParser';
import { readMyClippingsFile } from '.';

const run = () => {
  const file = '/Users/hady.osman/Desktop/My Clippings (hady).txt';

  // tslint:disable-next-line: no-console
  console.log('file', file);

  const clippingsFileContent = fs.readFileSync(file, 'utf8');

  const parsedBlocks = readMyClippingsFile(clippingsFileContent);
  const books = groupToBooks(parsedBlocks);

  // tslint:disable-next-line: no-console
  console.log(books);
};

run();
