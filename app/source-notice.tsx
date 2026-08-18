import schoolKanjiData from "./data/school-kanji.json";

export default function SourceNotice(){
  const updated = schoolKanjiData.sourceUpdatedAt
    ? new Date(schoolKanjiData.sourceUpdatedAt).toLocaleDateString("ja-JP")
    : "不明";
  return (
    <details className="source-notice">
      <summary>辞書の出典とライセンス</summary>
      <p>
        漢字情報には、Electronic Dictionary Research and Development Group（EDRDG）のKANJIDIC2から、
        義務教育で学ぶ常用漢字2,136字を抽出したデータを同梱しています。外部APIへの送信はありません。
      </p>
      <p>
        <a href="https://www.edrdg.org/wiki/KANJIDIC_Project.html" target="_blank" rel="noreferrer">KANJIDIC Project</a>
        {" · "}
        <a href="https://www.edrdg.org/edrdg/licence.html" target="_blank" rel="noreferrer">EDRDG General Dictionary Licence</a>
        {" · "}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>
      </p>
      <small>公式データ更新日：{updated}。読みは候補であり、文脈に合う読みを確認してください。更新は毎月自動確認します。</small>
    </details>
  );
}
