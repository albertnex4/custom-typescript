const fs = require("fs");
const path = require("path");

// __dirname disponible automáticamente en CJS
const translationsPath = path.resolve(__dirname, "../shared/translations");
const outputFile = path.resolve(__dirname, "../shared/translation.types.ts");

const keys = new Set();

for (const file of fs.readdirSync(translationsPath)) {
  if (!file.endsWith(".json")) continue;

  const json = JSON.parse(
    fs.readFileSync(path.join(translationsPath, file), "utf8")
  );

  for (const key in json) keys.add(key);
}

const typeDef =
  `export type TranslationKey =\n` +
  Array.from(keys)
    .map((k) => `  | "${k}"`)
    .join("\n") +
  ";\n";

fs.writeFileSync(outputFile, typeDef);
console.log("✔ translation.types.ts generado con éxito!");
