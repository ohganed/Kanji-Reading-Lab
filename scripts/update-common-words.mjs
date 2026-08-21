import { gunzipSync } from "node:zlib";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_URL = "https://www.edrdg.org/pub/Nihongo/JMdict_e.gz";
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(projectRoot, "app/data/common-words.json");
const priorityWeights = {
  ichi1: 1000, news1: 950, spec1: 900, gai1: 850,
  ichi2: 500, news2: 450, spec2: 400, gai2: 350,
};

function decodeXml(value = "") {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#([0-9]+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replaceAll("&lt;", "<").replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"').replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&");
}

function first(block, tag) {
  return decodeXml(block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1]?.trim());
}

function all(block, tag) {
  return [...block.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "g"))]
    .map((match) => decodeXml(match[1].trim()));
}

function priorityScore(tags) {
  return tags.reduce((score, rawTag) => {
    const tag = rawTag.replace(/^&|;$/g, "");
    if (priorityWeights[tag]) return Math.max(score, priorityWeights[tag]);
    const frequency = tag.match(/^nf(\d\d)$/)?.[1];
    return frequency ? Math.max(score, 300 - Number(frequency)) : score;
  }, 0);
}

const response = await fetch(SOURCE_URL, {
  headers: { "User-Agent": "Kanji-Reading-Lab common-word dictionary updater" },
});
if (!response.ok) throw new Error(`JMdict download failed: ${response.status}`);

const xml = gunzipSync(Buffer.from(await response.arrayBuffer())).toString("utf8");
const selected = new Map();
const alternatives = new Map();

for (const match of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
  const entry = match[1];
  const spellings = [...entry.matchAll(/<k_ele>([\s\S]*?)<\/k_ele>/g)].map((item) => {
    const block = item[1];
    return { text: first(block, "keb"), score: priorityScore(all(block, "ke_pri")) };
  });
  if (!spellings.some(({ score }) => score > 0)) continue;

  const readings = [...entry.matchAll(/<r_ele>([\s\S]*?)<\/r_ele>/g)].map((item) => {
    const block = item[1];
    return {
      text: first(block, "reb"),
      restrictedTo: new Set(all(block, "re_restr")),
      score: priorityScore(all(block, "re_pri")),
    };
  });

  for (const spelling of spellings) {
    if (!/[々一-龯]/.test(spelling.text) || /[・＝=\s]/.test(spelling.text)) continue;
    for (const reading of readings) {
      if (reading.restrictedTo.size && !reading.restrictedTo.has(spelling.text)) continue;
      const score = spelling.score + reading.score;
      if (!score) continue;
      const candidates = alternatives.get(spelling.text) || new Map();
      candidates.set(reading.text, Math.max(candidates.get(reading.text) || 0, score));
      alternatives.set(spelling.text, candidates);
      const current = selected.get(spelling.text);
      if (!current || score > current.score) selected.set(spelling.text, { reading: reading.text, score });
    }
  }
}

const words = Object.fromEntries(
  [...selected.entries()]
    .sort(([left], [right]) => left.localeCompare(right, "ja"))
    .map(([word, { reading }]) => [word, reading]),
);
const readingCandidates = Object.fromEntries(
  [...alternatives.entries()]
    .map(([word, candidates]) => [word, [...candidates.entries()]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "ja"))
      .map(([reading]) => reading)
      .slice(0, 6)])
    .filter(([, candidates]) => candidates.length > 1)
    .sort(([left], [right]) => left.localeCompare(right, "ja")),
);

if (Object.keys(words).length < 15_000) {
  throw new Error(`Only ${Object.keys(words).length} common words were generated; JMdict parsing may have changed.`);
}
for (const [word, expected] of [["散歩", "さんぽ"], ["貴重", "きちょう"], ["慎重", "しんちょう"], ["今日", "きょう"]]) {
  if (words[word] !== expected) throw new Error(`Unexpected reading for ${word}: ${words[word]}`);
}

const data = {
  source: "JMdict_e",
  sourceUrl: SOURCE_URL,
  licenceUrl: "https://www.edrdg.org/edrdg/licence.html",
  sourceUpdatedAt: response.headers.get("last-modified")
    ? new Date(response.headers.get("last-modified")).toISOString()
    : null,
  selection: "JMdict entries with common-word priority tags; highest-priority compatible reading per spelling",
  wordCount: Object.keys(words).length,
  ambiguousWordCount: Object.keys(readingCandidates).length,
  words,
  readingCandidates,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`Wrote ${data.wordCount} common words to ${outputPath}`);
