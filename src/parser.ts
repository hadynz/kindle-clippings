import { KindleEntry } from "./KindleEntry";
import { KindleEntryParsed } from "./KindleEntryParsed";

/**
 * Read a string line by line returns an Array of KindleEntry
 * @param kindleClipping
 */
export function readKindleClipping(kindleClipping: string): Array<KindleEntry> {
  const buffer: Array<string> = [];
  const kindleClipps: Array<KindleEntry> = [];
  let totalLines: number = 0;
  let lines: Array<string> = kindleClipping.split("\n");

  for (const line of lines) {
    try {
      if (line.includes("==========")) {
        // console.log(buffer);

        kindleClipps.push(KindleEntry.createKindleClipp(buffer));
        buffer.splice(0);
      } else {
        buffer.push(line.trim());
      }
      totalLines++;
    } catch (err) {
      throw new Error(`Error parsing on line: ${totalLines}`);
    }
  }

  return kindleClipps;
}

/**
 * Takes and array of KindleEntry and perses de data into an Array of KindleEntryParsed
 * @param kindleEntries
 */
export function parseKindleEntries(
  kindleEntries: Array<KindleEntry>
): Array<KindleEntryParsed> {
  const kindleEntriesParsed: Array<KindleEntryParsed> = [];

  kindleEntries.forEach((entry) => {
    try {
      kindleEntriesParsed.push(new KindleEntryParsed(entry));
    } catch (error) {
      console.error("Could not parse entry in clippings file", entry);
      throw new Error(error);
    }
  });

  return kindleEntriesParsed;
}
