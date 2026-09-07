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

### Live view in Google Sheets

There's no Google account connected to this project, so there's no fully automatic two-way sync — but since this repo is public, Google Sheets can pull the CSVs directly with `IMPORTDATA`, refreshing automatically without any manual re-upload:

```
=IMPORTDATA("https://raw.githubusercontent.com/kayla-koree/koree-multipage-v0.2/main/data/cards.csv")
```

Put that in cell A1 of one sheet/tab, and the same pattern with `quiz-questions.csv` in another tab:

```
=IMPORTDATA("https://raw.githubusercontent.com/kayla-koree/koree-multipage-v0.2/main/data/quiz-questions.csv")
```

Notes:
- This is **read-only from Sheets' side** — it re-pulls from GitHub, it doesn't push edits back. Google Sheets refreshes `IMPORTDATA` automatically every couple hours, or force it sooner via the sheet's *Data → Data connectors → Refresh all* (or delete/retype the formula).
- The CSVs are saved with a UTF-8 BOM specifically so Korean text renders correctly through `IMPORTDATA` (plain UTF-8 without BOM can show as mojibake in Sheets).
- If you edit values in the Sheet, those edits live only in Sheets until you tell Claude about them — paste/describe the change and ask to "sync the CSV changes back," same as editing the local CSV directly.
- If a first-party Google Sheets/Drive connector is ever added to this Claude account, true two-way sync (Claude writing directly into a Sheet) becomes possible — none was available when this was set up.

## `content-pipeline.csv` — editorial strategy layer (not site content)

A separate, non-production file that scores every `cards.json` entry for **content-development priority** — which cards are worth turning into a blog post/YouTube script/quiz/short next, as opposed to which are fine sitting in the raw dataset. It never feeds the live site; it's purely for deciding what to develop.

Important distinction: this is **not** a real search-keyword dataset (no actual search volume/CPC/competition exists for this project), so it does not attempt real keyword clustering or demand-based prioritization. Instead each row scores the *content itself* — its `content_pillar` (P1 Real Korean / P2 Korean Nuance / P3 Slang & Internet Language / P4 K-Content Korean / P5 Korean Culture / P6 Practical Korean), `koree_fit` (0-5, how core to Koree's brand) and `content_potential` (0-5, how much a card could expand into multiple content formats), derived from real structural signals already in the card (its `source`, `category`, and whether it has a `nuance`/`example_ko`) — not fabricated demand data.

Key findings from the first pass (regenerate anytime by re-running the classifier against the current `cards.json`):
- 85% of all cards (1,999) come from one source (the KNU idiom dictionary) and lack `nuance`/example content — they score as solid "Real Korean" (P1) reference material but not Koree's core differentiator.
- The richest, highest-priority content is concentrated in the smaller, later batches: Piece of K-ode (P2, all scored 5/5), the r/KDRAMA and r/kpop glossaries and variety-show catchphrases (P4), and neologisms with a real backstory/nuance note.
- Terms flagged in `cards.json`'s `nuance` field as derogatory/sensitive are deliberately capped below top priority and marked `NEEDS_REVIEW` here — a card scoring well structurally doesn't mean it's safe to rush into content without a human editorial call, especially for sensitive terms. The keyword-based sensitivity check here is a first pass, not exhaustive — recheck manually for topics like bullying/profanity that don't literally say "derogatory" in their nuance text.
- `priority`: P1 = worth developing now, P2 = next batch, P3 = archive/revisit later — this mirrors the source pipeline doc's own P1/P2/P3 tiers, not to be confused with `content_pillar`'s P1-P6 labels (unfortunate naming overlap in the original spec — kept as specified).

Not yet done (would need more work, flagged rather than faked): semantic keyword-cluster grouping of near-duplicate concepts (e.g. "가게를 내다" vs "가게를 열다"), and a refined human-review queue beyond the basic sensitivity flag.

## `content-briefs/` — Content Brief stage (Keyword → Topic → Master Content pipeline)

Following on from `content-pipeline.csv`'s priority scoring, `content-briefs/batch-01.md` is the first Content Brief batch (per `Koree_Content_Generation_Pipeline.md`'s section 3 format) — 15 test topics, reusing `cards.json` `id`s as Topic IDs (no separate keyword-ID layer exists, since there's no real keyword/search-volume dataset). Each brief proposes representative English search phrasings (explicitly flagged as hypotheses, not measured demand), a content pillar, core question, key insight drawn from the card's own `nuance` field, related expressions for cross-linking, and which formats (Blog/YouTube/Short/Quiz) look viable.

This is Content Brief only — no Master Content (blog drafts, scripts) has been written yet; that's a deliberately separate next stage.

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
