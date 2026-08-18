declare module "kanji.js" {
  export type KanjiDetail = {
    literal: string;
    grade: number;
    onyomi: string[];
    kunyomi: string[];
    meanings: string[];
    stroke_count: number;
    freq?: number;
    jlpt?: number;
  };

  const Kanji: {
    dump(): KanjiDetail[];
    getDetails(character: string): KanjiDetail | null;
    search(query: Record<string, unknown>): KanjiDetail[];
  };

  export default Kanji;
}
