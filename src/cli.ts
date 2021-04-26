import fs from "fs";

import { readKindleClipping } from ".";
import { parseKindleEntries } from "./parser";
import { organizeKindleEntriesByBooks } from "./organizer";

(async (): Promise<void> => {
  const file = "/Users/hady.osman/Desktop/My Clippings (hady).txt";
  console.log("file", file);

  const clippingsFileContent = fs.readFileSync(file, "utf8");

  const rawRows = readKindleClipping(clippingsFileContent);
  const parsedEntries = parseKindleEntries(rawRows);
  const books = organizeKindleEntriesByBooks(parsedEntries);
  console.log(books);
})();
