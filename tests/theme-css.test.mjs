import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("applies theme text color inside the app scope", () => {
  assert.match(css, /\.app\{[^}]*color:var\(--ink\)/);
  assert.match(css, /\.app\.dark\{[^}]*--ink:#e8eeee/);
});
