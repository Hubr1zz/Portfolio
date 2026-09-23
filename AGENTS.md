# Portfolio repository instructions

## Bilingual content requirements

1. Every user-facing string must have both English and Simplified Chinese copy. This includes navigation, headings, body copy, buttons, form labels, placeholders, loading/error/empty states, dialog text, image `alt` text, and accessibility labels.
2. Do not add hard-coded user-facing copy directly to React components. Shared interface copy belongs in `app/translations.ts` and must use a stable semantic key.
3. Project content is addressed by stable semantic paths derived from project, article, and section IDs. Never use a complete English sentence as a translation key.
4. When adding or changing English content in `app/portfolio-data.ts`, update both `contentMessages.en` and `contentMessages.zh` in `app/translations.ts` in the same change. The English entry is intentionally checked against the source data so an existing translation cannot silently become stale.
5. Product names, project names, APIs, and established technical terms such as Unity, GitHub, OpenSpec, UGUI, and HLSL may intentionally remain in English. Register intentional exceptions in `scripts/check-i18n.mjs`; do not rely on an unreviewed fallback.
6. Before completing any content or UI change, run `npm run i18n:check`, `npm run lint`, and `npm run build`. Also switch languages in the affected page at least once when browser verification is available.
7. A missing Chinese translation is a defect even if the runtime safely falls back to English.
