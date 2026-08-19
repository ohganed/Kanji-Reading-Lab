import assert from "node:assert/strict";
import test from "node:test";
import { inferKanjiReading, inferKanjiRun } from "../app/furigana-engine.ts";

const dictionary = {
  大: { literal: "大", onyomi: ["ダイ"], kunyomi: ["おお.きい"] },
  学: { literal: "学", onyomi: ["ガク"], kunyomi: ["まな.ぶ"] },
  食: { literal: "食", onyomi: ["ショク"], kunyomi: ["く.う", "た.べる"] },
  語: { literal: "語", onyomi: ["ゴ"], kunyomi: ["かた.る"] },
};

test("infers a compound from representative onyomi", () => {
  assert.equal(inferKanjiRun("大学", dictionary), "だいがく");
});

test("uses matching okurigana to select a kunyomi stem", () => {
  assert.equal(inferKanjiReading(dictionary["食"], "べました", true), "た");
  assert.equal(inferKanjiRun("食", dictionary, "べました"), "た");
});

test("does not mistake a following particle for okurigana", () => {
  assert.equal(inferKanjiRun("語", dictionary, "を"), "ご");
});
