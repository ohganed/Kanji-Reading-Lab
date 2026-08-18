import { gunzipSync } from "node:zlib";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_URL = "https://www.edrdg.org/kanjidic/kanjidic2.xml.gz";
const INCLUDED_GRADES = new Set([1, 2, 3, 4, 5, 6, 8]);
const EXPECTED_CHARACTER_COUNT = 2136;
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(projectRoot, "app/data/school-kanji.json");

function decodeXml(value = "") {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#([0-9]+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&");
}

function first(block, tag) {
  return decodeXml(block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1]?.trim());
}

function all(block, pattern) {
  return [...block.matchAll(pattern)].map((match) => decodeXml(match[1].trim()));
}

const response = await fetch(SOURCE_URL, {
  headers: { "User-Agent": "Kanji-Reading-Lab dictionary updater" },
});
if (!response.ok) throw new Error(`KANJIDIC2 download failed: ${response.status}`);

const xml = gunzipSync(Buffer.from(await response.arrayBuffer())).toString("utf8");
const sourceUpdatedAt = response.headers.get("last-modified");
const characters = [];

for (const match of xml.matchAll(/<character>([\s\S]*?)<\/character>/g)) {
  const block = match[1];
  const grade = Number(first(block, "grade"));
  if (!INCLUDED_GRADES.has(grade)) continue;

  characters.push({
    literal: first(block, "literal"),
    grade,
    onyomi: all(block, /<reading\s+r_type="ja_on"[^>]*>([\s\S]*?)<\/reading>/g),
    kunyomi: all(block, /<reading\s+r_type="ja_kun"[^>]*>([\s\S]*?)<\/reading>/g),
    meanings: all(block, /<meaning(?![^>]*\bm_lang=)[^>]*>([\s\S]*?)<\/meaning>/g),
  });
}

if (characters.length !== EXPECTED_CHARACTER_COUNT) {
  throw new Error(`Expected ${EXPECTED_CHARACTER_COUNT} characters, found ${characters.length}. Source format may have changed.`);
}
if (new Set(characters.map(({ literal }) => literal)).size !== characters.length) {
  throw new Error("Duplicate characters found in generated data.");
}

const data = {
  source: "KANJIDIC2",
  sourceUrl: SOURCE_URL,
  licenceUrl: "https://www.edrdg.org/edrdg/licence.html",
  sourceUpdatedAt: sourceUpdatedAt ? new Date(sourceUpdatedAt).toISOString() : null,
  databaseVersion: first(xml, "database_version"),
  fileVersion: first(xml, "file_version"),
  characterCount: characters.length,
  includedGrades: [...INCLUDED_GRADES],
  characters,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`Wrote ${characters.length} characters to ${outputPath}`);
