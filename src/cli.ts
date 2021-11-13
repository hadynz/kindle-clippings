import fs from "fs";

import { readKindleClipping } from ".";
import { parseKindleEntries } from "./parser";
import { organizeKindleEntriesByBooks } from "./organizer";

(async (): Promise<void> => {
  const file = "/Users/hady.osman/Desktop/My Clippings (hady).txt";

  // tslint:disable-next-line: no-console
  console.log("file", file);

  const clippingsFileContent = fs.readFileSync(file, "utf8");

  const rawRows = readKindleClipping(clippingsFileContent);
  const parsedEntries = parseKindleEntries(rawRows);
  const books = organizeKindleEntriesByBooks(parsedEntries);

  // tslint:disable-next-line: no-console
  console.log(books);
})();
