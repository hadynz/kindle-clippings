import { ParsedBlock } from '../blocks/ParsedBlock';
import { RawBlock } from '../blocks/RawBlock';

/**
 * Read a string line by line returns an Array of KindleEntry
 * @param fileContent
 */
export function readMyClippingsFile(fileContent: string): RawBlock[] {
  const lines = fileContent.split('\n');

  const blocks: RawBlock[] = [];

  let blockLinesBuffer: string[] = [];

  lines.forEach((line, index) => {
    try {
      if (line.includes('==========')) {
        blocks.push(RawBlock.parse(blockLinesBuffer));
        blockLinesBuffer = [];
      } else {
        blockLinesBuffer.push(line.trim());
      }
    } catch (error) {
      console.error(`Error parsing on line: ${index + 1}`);
      throw error;
    }
  });

  return blocks.filter((b) => b.titleLine != null);
}

/**
 * Takes and array of KindleEntry and perses de data into an Array of KindleEntryParsed
 * @param rawBlocks
 */
export function parseRawBlocks(rawBlocks: RawBlock[]): ParsedBlock[] {
  const parsedBlocks: ParsedBlock[] = [];

  rawBlocks.forEach((entry) => {
    try {
      parsedBlocks.push(new ParsedBlock(entry));
    } catch (error) {
      console.error('Could not parse entry in clippings file', entry);
      throw error;
    }
  });

  return parsedBlocks;
}
