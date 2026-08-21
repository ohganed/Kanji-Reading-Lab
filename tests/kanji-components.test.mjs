import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const data = JSON.parse(
  await readFile(new URL("../app/data/kanji-components.json", import.meta.url), "utf8"),
);
const byLiteral = Object.fromEntries(data.characters.map((item) => [item.literal, item]));

test("bundles KanjiVG structures for every included joyo kanji", () => {
  assert.equal(data.source, "KanjiVG");
  assert.equal(data.licence, "CC BY-SA 3.0");
  assert.equal(data.characterCount, 2136);
  assert.equal(data.characters.length, 2136);
});

test("keeps formal radicals and representative components", () => {
  assert.equal(byLiteral["明"].radical, "日");
  assert.deepEqual(byLiteral["明"].components.map(({ display }) => display), ["日", "月"]);
  assert.equal(byLiteral["休"].radical, "人");
  assert.deepEqual(byLiteral["休"].components.map(({ display }) => display), ["亻", "木"]);
  assert.equal(byLiteral["学"].radical, "子");
  assert.ok(byLiteral["学"].components.some(({ display }) => display === "冖"));
});

test("preserves base forms for variant components", () => {
  const person = byLiteral["休"].components.find(({ display }) => display === "亻");
  assert.equal(person.base, "人");
});
