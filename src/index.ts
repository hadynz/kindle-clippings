import { ParsedBlock } from './blocks/ParsedBlock';
import {
  parseRawBlocks,
  readMyClippingsFile as readFile,
} from './parsers/blockParser';

export const readMyClippingsFile = (fileContent: string): ParsedBlock[] => {
  const rawBlocks = readFile(fileContent);
  return parseRawBlocks(rawBlocks);
};

export { groupToBooks, Book, Annotation } from './parsers/bookParser';
