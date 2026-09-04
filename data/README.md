# Koree content data

## `cards.json` — learning cards

Content source for Play/Discover's learning-card & question-bank features. Each entry:

| field | required | notes |
|---|---|---|
| `id` | yes | unique slug, e.g. `gwaenchanha-01` |
| `korean` | yes | the Korean word/expression |
| `romanization` | no | revised romanization |
| `meaning` | yes | plain-English meaning/explanation |
| `nuance` | no | context notes — when it lands differently than the dictionary meaning |
| `example_ko` | no | example sentence in Korean |
| `example_en` | no | translation of the example |
| `source` | no | e.g. "K-drama", "K-pop", "slang" |
| `category` | no | tag used for filtering (nuance, slang, idiom, grammar, ...) |
| `difficulty` | no | `beginner` / `intermediate` / `advanced` |
| `audio_text` | no | text passed to the TTS player (`data-audio` in script.js); defaults to `korean` if omitted |
| `verified` | no | `true` once a human has confirmed the expression/meaning/nuance is accurate. Agent-drafted cards (from koree-card-writer) are added as `false` — flip to `true` after reviewing. Absent = also treat as unverified. |

Two ways cards get added:
- **You already have the data** (list, table, screenshots-as-text, spreadsheet export) → paste it to Claude, `koree-web-builder` normalizes it into this schema and appends.
- **You want new content researched/drafted** (e.g. "카드 몇 개 만들어줘", expressions from a specific drama/song) → `koree-card-writer` researches and drafts cards, marks them `verified: false`, and appends — review and confirm accuracy before treating them as final.

## `quiz.json` — Play "what kind of Korean learner are you" quiz

Two top-level keys:

- `types` — the 5 result personas (`id`, `name`, `description`). Fixed set, taken from the type-cards already on `play/index.html`; only edit if the user explicitly wants to change the personas themselves.
- `questions` — array of `{ id, text, options: [{ text, type }] }`. Each option's `type` must match a `types[].id` — that's how an answer counts toward a result. The prototype currently ships only `q1`; the quiz UI implies 5 questions total (2-3 options each), so more need to be collected.

To add quiz questions: paste raw data (question + its answer choices, and which persona each choice should point to) — the koree-web-builder agent appends to `questions` in this schema, then commits/pushes. If an option's persona isn't specified, ask rather than guessing — it directly drives the quiz result.
