import fs from "fs";

import { readKindleClipping } from ".";

(async (): Promise<void> => {
  const file = "/Users/hady.osman/Desktop/My Clippings (hady).txt";
  console.log("file", file);

  const clippingsFileContent = fs.readFileSync(file, "utf8");

  const rawRows = readKindleClipping(clippingsFileContent);
  console.log(rawRows);
})();
