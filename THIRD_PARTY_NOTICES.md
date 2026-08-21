# Third-party notices

## KANJIDIC2 data

The bundled file `app/data/school-kanji.json` is a filtered and reformatted subset of KANJIDIC2 maintained by the Electronic Dictionary Research and Development Group (EDRDG). It contains the 2,136 characters marked as Japanese school grades 1–6 or grade 8 (the remaining Jōyō kanji).

- [KANJIDIC Project](https://www.edrdg.org/wiki/KANJIDIC_Project.html)
- [EDRDG General Dictionary Licence Statement](https://www.edrdg.org/edrdg/licence.html)
- [Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

Copyright over the covered dictionary files is held by James William Breen and the Electronic Dictionary Research and Development Group. See the EDRDG licence statement for the complete attribution, redistribution, update, warranty, and special-data conditions.

The source data is checked monthly by `.github/workflows/update-kanji-data.yml`. A detected change is proposed as a Pull Request so it can be reviewed before publication.

## JMdict_e data

The bundled file `app/data/common-words.json` is a filtered and reformatted subset of JMdict_e maintained by EDRDG. It contains Japanese spellings and readings for entries marked with JMdict common-word priority tags. The app uses this lexical dictionary before falling back to per-kanji reading suggestions.

- [JMdict/EDICT Project](https://www.edrdg.org/wiki/JMdict-EDICT_Dictionary_Project.html)
- [EDRDG General Dictionary Licence Statement](https://www.edrdg.org/edrdg/licence.html)
- [Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

The generated subset preserves attribution and source metadata in the JSON file. Run `npm run dictionary:update-words` to regenerate it from the current JMdict_e distribution.

## KanjiVG component data

The bundled file `app/data/kanji-components.json` is a filtered and reformatted subset of KanjiVG. It contains radical and graphic-component metadata for the 2,136 jōyō kanji used by this app. Copyright © 2009–2013 Ulrich Apel and the KanjiVG contributors.

- [KanjiVG project](https://github.com/KanjiVG/kanjivg)
- [Creative Commons Attribution-ShareAlike 3.0](https://creativecommons.org/licenses/by-sa/3.0/)

This derived component-data file is distributed under CC BY-SA 3.0. The short multilingual learning cues in `app/component-meanings.ts` were written for this app and are not intended as complete historical etymologies. Run `npm run dictionary:update-components` to regenerate the component data from the latest official KanjiVG XML release.
