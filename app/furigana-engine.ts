export type FuriganaKanjiInfo = {
  literal: string;
  onyomi: string[];
  kunyomi: string[];
};

export const isKanji = (character: string) => /[々一-龯]/.test(character);

const kataToHira = (value: string) =>
  value.replace(/[ァ-ヶ]/g, (character) =>
    String.fromCharCode(character.charCodeAt(0) - 0x60),
  );

const readingStem = (value: string) =>
  kataToHira(value.replace(/^-/, "").split(".")[0].replaceAll("-", ""));

const okurigana = (value: string) =>
  kataToHira(value.includes(".") ? value.split(".").slice(1).join("") : "");

// KANJIDIC2には単語の文脈がないため、送り仮名が一致する訓読みを優先する。
// 一致しない場合、単漢字は代表的な訓読み、熟語は代表的な音読みを候補にする。
export function inferKanjiReading(
  info: FuriganaKanjiInfo | undefined,
  followingHiragana = "",
  preferKunyomi = false,
) {
  if (!info) return "";
  const matchedKun = info.kunyomi.find((reading) => {
    const suffix = okurigana(reading);
    return suffix && followingHiragana.startsWith(suffix[0]);
  });
  if (matchedKun) return readingStem(matchedKun);

  const ordered = preferKunyomi
    ? [...info.kunyomi, ...info.onyomi]
    : [...info.onyomi, ...info.kunyomi];
  return readingStem(ordered.find(Boolean) || "");
}

export function inferKanjiRun(
  word: string,
  dictionary: Record<string, FuriganaKanjiInfo>,
  followingHiragana = "",
) {
  let previous = "";
  return [...word]
    .map((character) => {
      if (character === "々") return previous;
      previous = inferKanjiReading(
        dictionary[character],
        word.length === 1 ? followingHiragana : "",
        word.length === 1 && !!followingHiragana,
      );
      return previous;
    })
    .join("");
}
