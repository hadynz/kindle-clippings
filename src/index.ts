import { ParsedBlock } from './blocks/ParsedBlock';
import {
  readMyClippingsFile as readFile,
  parseRawBlocks,
} from './parsers/blockParser';

export const readMyClippingsFile = (fileContent: string): ParsedBlock[] => {
  const rawBlocks = readFile(fileContent);
  return parseRawBlocks(rawBlocks);
};

export { groupToBooks, Book, Annotation } from './parsers/bookParser';
