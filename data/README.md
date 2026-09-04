# Koree content data

## The pipeline: 5 agents

- **koree-orchestrator** — entry point for anything that spans multiple stages ("카드 만들어서 사이트에 올려줘"). Never does the work itself — only delegates to the four specialists below and reports one-line progress per step.
- **koree-content-collector** — gathers content (user-supplied or researched) → writes `verified:false` drafts.
- **koree-content-reviewer** — QAs, dedupes, fact-checks, cleans up → moves entries to `verified:true` (only with your confirmation).
- **koree-content-publisher** — takes `verified:true` content and wires it into the right pages/sections on the live site.
- **koree-web-builder** — everything else about the site's code (layout, styling, nav, bug fixes) — not content data.

Ask for a single stage directly ("카드 모아줘" → collector, "검수해줘" → reviewer, "사이트에 반영해줘" → publisher), or hand a multi-step request to the orchestrator and let it route.

## For the user: reviewing data as a spreadsheet

`.json` files are what the site code reads — not meant for hand-browsing. Alongside each one is a **CSV mirror** you can open in Excel/Numbers/Google Sheets to review, sort, filter, and mark things up:

- `cards.csv` ↔ `cards.json`
- `quiz-questions.csv` ↔ `quiz.json` (`questions` only — `types`, the 5 fixed personas, rarely change and are listed in the table below)

The JSON stays the source of truth the site actually uses; the CSV is regenerated from it every time an agent adds/changes cards or questions, so it's always safe to just re-open and re-check. If you edit the CSV directly (e.g. correct a typo, flip `verified` to `TRUE`), tell Claude to "sync the CSV changes back into the JSON" and the agent will reconcile them.

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
| `verified` | no | `true` once `koree-content-reviewer` + you have confirmed the expression/meaning/nuance is accurate. `koree-content-collector` always adds new entries as `false`. Absent = also treat as unverified. |

Cards get added by `koree-content-collector` (whether you hand it raw data or ask it to research/draft new content), always as `verified: false`. `koree-content-reviewer` then checks the batch and flips entries to `true` once you confirm. Only `verified: true` cards get wired onto the live site by `koree-content-publisher`.

## `quiz.json` — Play "what kind of Korean learner are you" quiz

Two top-level keys:

- `types` — the 5 result personas (`id`, `name`, `description`). Fixed set, taken from the type-cards already on `play/index.html`; only edit if the user explicitly wants to change the personas themselves.
- `questions` — array of `{ id, text, options: [{ text, type }] }`. Each option's `type` must match a `types[].id` — that's how an answer counts toward a result. The prototype currently ships only `q1`; the quiz UI implies 5 questions total (2-3 options each), so more need to be collected.

To add quiz questions: paste raw data (question + its answer choices, and which persona each choice should point to), or ask `koree-content-collector` to draft new ones — it appends to `questions` in this schema. If an option's persona isn't specified, it asks rather than guessing, since that mapping drives the actual quiz result. `koree-content-reviewer` checks new questions before they're treated as final; `koree-content-publisher` wires the confirmed set into `play/index.html`'s actual quiz logic.
