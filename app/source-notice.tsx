import schoolKanjiData from "./data/school-kanji.json";
import commonWordsData from "./data/common-words.json";
import kanjiComponentsData from "./data/kanji-components.json";

type Lang = "ja"|"en"|"ru"|"fr"|"es";
const copy = {
  summary:["辞書の出典とライセンス","Dictionary sources and licences","Источники и лицензии словаря","Sources et licences du dictionnaire","Fuentes y licencias del diccionario"],
  description:["漢字情報にはKANJIDIC2の常用漢字2,136字を、一般語の読みにはJMdict_eから抽出した{count}語を同梱しています。いずれもElectronic Dictionary Research and Development Group（EDRDG）のデータです。外部APIへの送信はありません。","The app bundles 2,136 jōyō kanji from KANJIDIC2 and {count} common word readings extracted from JMdict_e. Both datasets are maintained by the Electronic Dictionary Research and Development Group (EDRDG). No data is sent to an external API.","Приложение включает 2 136 кандзи дзёё из KANJIDIC2 и {count} чтений общеупотребительных слов, извлечённых из JMdict_e. Оба набора данных поддерживаются Electronic Dictionary Research and Development Group (EDRDG). Данные не отправляются во внешние API.","L’application contient 2 136 kanji jōyō issus de KANJIDIC2 et {count} lectures de mots courants extraites de JMdict_e. Les deux jeux de données sont maintenus par l’Electronic Dictionary Research and Development Group (EDRDG). Aucune donnée n’est envoyée à une API externe.","La aplicación incluye 2.136 kanji jōyō de KANJIDIC2 y {count} lecturas de palabras comunes extraídas de JMdict_e. Ambos conjuntos son mantenidos por el Electronic Dictionary Research and Development Group (EDRDG). No se envían datos a ninguna API externa."],
  updated:["公式データ更新日：{date}。読みは候補であり、文脈に合う読みを確認してください。更新は毎月自動確認します。","Official data updated: {date}. Readings are suggestions; check that they fit the context. Updates are checked automatically each month.","Дата обновления официальных данных: {date}. Чтения являются вариантами; проверьте их соответствие контексту. Обновления проверяются автоматически каждый месяц.","Mise à jour des données officielles : {date}. Les lectures sont des suggestions ; vérifiez qu’elles correspondent au contexte. Les mises à jour sont contrôlées automatiquement chaque mois.","Actualización de los datos oficiales: {date}. Las lecturas son sugerencias; comprueba que se ajusten al contexto. Las actualizaciones se revisan automáticamente cada mes."],
  components:["漢字の部首・構成要素にはKanjiVGの{count}字分の字形データを使用しています。構成要素の意味は、暗記を助ける短い一般的なイメージです。語源の断定ではありません。","Kanji radicals and components use KanjiVG shape data for {count} characters. Component meanings are short general memory cues, not claims about etymology.","Для ключей и компонентов используются данные KanjiVG о форме {count} знаков. Значения компонентов — краткие подсказки для запоминания, а не утверждения об этимологии.","Les clés et composants utilisent les données de forme KanjiVG pour {count} caractères. Leur sens est un repère mnémotechnique général, et non une affirmation étymologique.","Los radicales y componentes usan datos de forma de KanjiVG para {count} caracteres. Sus significados son pistas generales para memorizar, no afirmaciones etimológicas."],
  unknown:["不明","Unknown","Неизвестно","Inconnue","Desconocida"]
} as const;

export default function SourceNotice({lang="ja"}:{lang?:Lang}){
  const index={ja:0,en:1,ru:2,fr:3,es:4}[lang];
  const updated = schoolKanjiData.sourceUpdatedAt
    ? new Date(schoolKanjiData.sourceUpdatedAt).toLocaleDateString(lang)
    : copy.unknown[index];
  return (
    <details className="source-notice">
      <summary>{copy.summary[index]}</summary>
      <p>{copy.description[index].replace("{count}",commonWordsData.wordCount.toLocaleString(lang))}</p>
      <p>{copy.components[index].replace("{count}",kanjiComponentsData.characterCount.toLocaleString(lang))}</p>
      <p>
        <a href="https://www.edrdg.org/wiki/KANJIDIC_Project.html" target="_blank" rel="noreferrer">KANJIDIC Project</a>
        {" · "}
        <a href="https://www.edrdg.org/edrdg/licence.html" target="_blank" rel="noreferrer">EDRDG General Dictionary Licence</a>
        {" · "}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>
        {" · "}
        <a href="https://github.com/KanjiVG/kanjivg" target="_blank" rel="noreferrer">KanjiVG</a>
        {" · "}
        <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">CC BY-SA 3.0</a>
      </p>
      <small>{copy.updated[index].replace("{date}",updated)}</small>
    </details>
  );
}
