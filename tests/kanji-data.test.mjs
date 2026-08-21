import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const data = JSON.parse(
  await readFile(new URL("../app/data/school-kanji.json", import.meta.url), "utf8"),
);
const commonWords = JSON.parse(
  await readFile(new URL("../app/data/common-words.json", import.meta.url), "utf8"),
);

test("bundles the complete school and joyo kanji subset", () => {
  assert.equal(data.source, "KANJIDIC2");
  assert.equal(data.characterCount, 2136);
  assert.equal(data.characters.length, 2136);
  assert.deepEqual(data.includedGrades, [1, 2, 3, 4, 5, 6, 8]);
  assert.equal(new Set(data.characters.map(({ literal }) => literal)).size, 2136);
  assert.ok(data.characters.every(({ grade }) => data.includedGrades.includes(grade)));
});

test("includes readings for representative characters", () => {
  const byLiteral = Object.fromEntries(data.characters.map((item) => [item.literal, item]));
  assert.ok(byLiteral["学"].onyomi.includes("ガク"));
  assert.ok(byLiteral["校"].onyomi.includes("コウ"));
  assert.ok(byLiteral["読"].kunyomi.some((reading) => reading.startsWith("よ")));
});

test("bundles a substantial common-word dictionary", () => {
  assert.equal(commonWords.source, "JMdict_e");
  assert.ok(commonWords.wordCount >= 15_000);
  assert.equal(Object.keys(commonWords.words).length, commonWords.wordCount);
});

test("keeps lexical readings and compound sound changes", () => {
  assert.equal(commonWords.words["散歩"], "さんぽ");
  assert.equal(commonWords.words["貴重"], "きちょう");
  assert.equal(commonWords.words["慎重"], "しんちょう");
  assert.equal(commonWords.words["重要"], "じゅうよう");
  assert.equal(commonWords.words["大人"], "おとな");
  assert.notEqual(commonWords.words["貴重"], "きじゅう");
});

test("keeps alternative readings for context-sensitive words", () => {
  assert.ok(commonWords.ambiguousWordCount >= 2_000);
  assert.deepEqual(commonWords.readingCandidates["生物"].slice(0, 2), ["せいぶつ", "なまもの"]);
  assert.ok(commonWords.readingCandidates["一日"].includes("ついたち"));
  assert.ok(commonWords.readingCandidates["明日"].includes("あす"));
});
