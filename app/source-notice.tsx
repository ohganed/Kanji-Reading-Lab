export default function SourceNotice(){
  return (
    <details className="source-notice">
      <summary>辞書の出典とライセンス</summary>
      <p>
        漢字情報の表示には、MITライセンスの{" "}
        <a href="https://github.com/eidoriantan/kanji.js" target="_blank" rel="noreferrer">kanji.js</a>
        {" "}と、Electronic Dictionary Research and Development Group（EDRDG）のKANJIDIC由来データを使用しています。
      </p>
      <p>
        <a href="https://www.edrdg.org/wiki/index.php/KANJIDIC_Project" target="_blank" rel="noreferrer">KANJIDIC Project</a>
        {" · "}
        <a href="https://www.edrdg.org/edrdg/licence.html" target="_blank" rel="noreferrer">EDRDG General Dictionary Licence</a>
        {" · "}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>
      </p>
      <small>辞書の読みは正確性を保証するものではありません。文脈に合う読みを確認してください。</small>
    </details>
  );
}
