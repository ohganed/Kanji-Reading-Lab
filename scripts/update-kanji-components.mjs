import { gunzipSync } from "node:zlib";
import { readFile, writeFile } from "node:fs/promises";

const releaseApi = "https://api.github.com/repos/KanjiVG/kanjivg/releases/latest";
const outputUrl = new URL("../app/data/kanji-components.json", import.meta.url);
const schoolUrl = new URL("../app/data/school-kanji.json", import.meta.url);

const release = await fetch(releaseApi, { headers: { "User-Agent": "Kanji-Reading-Lab" } });
if (!release.ok) throw new Error(`KanjiVG release lookup failed: ${release.status}`);
const metadata = await release.json();
const asset = metadata.assets.find(({ name }) => name.endsWith(".xml.gz"));
if (!asset) throw new Error("KanjiVG XML release asset was not found");
const response = await fetch(asset.browser_download_url, { headers: { "User-Agent": "Kanji-Reading-Lab" } });
if (!response.ok) throw new Error(`KanjiVG download failed: ${response.status}`);
const xml = gunzipSync(Buffer.from(await response.arrayBuffer())).toString("utf8");
const school = JSON.parse(await readFile(schoolUrl, "utf8"));
const included = new Set(school.characters.map(({ literal }) => literal));

const attr = (source, name) => {
  const value = source.match(new RegExp(`(?:^|\\s)${name}=(?:"([^"]*)"|'([^']*)')`));
  return value ? (value[1] ?? value[2]).replaceAll("&amp;", "&") : undefined;
};
const parseGroups = (block) => {
  const roots = [];
  const stack = [];
  for (const token of block.matchAll(/<g\b([^>]*)>|<\/g>/g)) {
    if (token[0] === "</g>") { stack.pop(); continue; }
    const attributes = token[1];
    const node = {
      element: attr(attributes, "kvg:element"),
      original: attr(attributes, "kvg:original"),
      position: attr(attributes, "kvg:position"),
      radical: attr(attributes, "kvg:radical"),
      children: [],
    };
    if (stack.length) stack.at(-1).children.push(node); else roots.push(node);
    stack.push(node);
  }
  return roots[0];
};
const firstNamed = (node) => {
  if (node.element) return [node];
  return node.children.flatMap(firstNamed);
};
const findRadical = (node) => {
  if (!node) return undefined;
  if (node.radical === "general") return node.original || node.element;
  for (const child of node.children) {
    const found = findRadical(child);
    if (found) return found;
  }
};

const characters = [];
for (const match of xml.matchAll(/<kanji\b[^>]*>([\s\S]*?)<\/kanji>/g)) {
  const root = parseGroups(match[1]);
  if (!root?.element || !included.has(root.element)) continue;
  const components = root.children.flatMap(firstNamed)
    .filter(({ element }) => element && element !== root.element)
    .map(({ element, original, position }) => ({ display: element, base: original || element, position }))
    .filter((item, index, all) => all.findIndex(({ display, position }) => display === item.display && position === item.position) === index);
  characters.push({ literal: root.element, radical: findRadical(root), components });
}
characters.sort((a, b) => a.literal.codePointAt(0) - b.literal.codePointAt(0));

await writeFile(outputUrl, `${JSON.stringify({
  source: "KanjiVG",
  sourceUrl: "https://github.com/KanjiVG/kanjivg",
  sourceRelease: metadata.tag_name,
  sourceUpdatedAt: metadata.published_at,
  licence: "CC BY-SA 3.0",
  characterCount: characters.length,
  characters,
}, null, 2)}\n`);
console.log(`Wrote ${characters.length} kanji component records from ${metadata.tag_name}`);
