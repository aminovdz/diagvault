const fs = require('fs');
const path = './src/pages/diagnostic/[...slug].astro';
let content = fs.readFileSync(path, 'utf8');

// Add the methodologieEntries declaration
content = content.replace(
  "const ecuEntries = await getCollection('ecu');",
  "const ecuEntries = await getCollection('ecu');\n  const methodologieEntries = await getCollection('methodologie');"
);

// Add methodologieEntries to allEntries array
content = content.replace(
  "...ecuEntries",
  "...ecuEntries,\n    ...methodologieEntries"
);

fs.writeFileSync(path, content);
