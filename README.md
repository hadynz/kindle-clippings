# KindleClippings 

_A fork of [DarylSerrano/KindleClippings][1]. Modified to fix bugs and add extra functionaliy:_
_* Parse highligihts that span multiple lines_
_* Organise highlights into an array of books with a nested array of entries_

Package for parsing a MyClippings.txt file obtained from a Kindle and organizing it

For now, it only parses clippings made on a Kindle with language set on **English, Spanish or French**

## Installing and using it in your code
`npm i @darylserrano/kindle-clippings`

In your javascript file require the package and use it
```javascript
const kindleClippings = require('@darylserrano/kindle-clippings');

const exampleEntry = `非オタの彼女が俺の持ってるエロゲに興味津々なんだが…… (滝沢　慧;睦茸)
- La subrayado en la página 6 | posición 36-40 | Añadido el lunes, 30 de septiembre de 2019 18:00:39

ひどく緊張したような、上擦った声
==========`;

let entries = kindleClippings.readKindleClipping(exampleEntry);
let parsedEntries = kindleClippings.parseKindleEntries(entries); 
console.log(JSON.stringify(parsedEntries[0].toJSON()));
var entriesParsed = kindleClippings.organizeKindleEntriesByBookTitle(parsedEntries);
```

[1]: https://github.com/DarylSerrano/KindleClippings