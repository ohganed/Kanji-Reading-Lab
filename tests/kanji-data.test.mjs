import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const data = JSON.parse(
  await readFile(new URL("../app/data/school-kanji.json", import.meta.url), "utf8"),
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

test("keeps common compound sound changes in the built-in word dictionary", async () => {
  const pageSource = await readFile(
    new URL("../app/page.tsx", import.meta.url),
    "utf8",
  );
  assert.match(pageSource, /"散歩":"さんぽ"/);
  assert.doesNotMatch(pageSource, /"散歩":"さんほ"/);
});
