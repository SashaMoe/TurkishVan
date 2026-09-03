# Ordpatiens

Swedish word solitaire — pyramid patience for an English speaker learning
Swedish at A1–A2.

Open `index.html`. That is the whole thing: one file, no build, no network
needed (it pulls two webfonts if it can and falls back cleanly if it can't).

Published as an Artifact, so it plays on the phone without the repo:
<https://claude.ai/code/artifact/03eb37f5-2e8f-4c0c-a333-cb45d53a147c>
(Add to home screen for an icon and full screen.) The Artifact is built by
stripping everything outside the `ARTIFACT-START` / `ARTIFACT-END` markers
in `index.html`, so the file here stays the single source.

## The game

Classic pyramid patience, with one substitution: instead of clearing two
cards that sum to 13, you clear **a Swedish word and its English
translation**.

- A card is **free** when nothing lies on top of it. The face-up waste card
  is always free.
- Tap a free card, then tap the card that translates it. Right pair: both
  leave the table, +100 and a streak bonus. Wrong pair: −25 and the streak
  resets.
- **Stock** deals a new face-up word; when it runs out it turns over again
  for −30, as often as you like.
- **Hint** with a card selected reveals that card's translation; with
  nothing selected it points at a pair on the table. −50 either way.
- Clearing the pyramid pays a speed bonus and lists every pair you matched.

Each card's corner mark is its word class, written the way a dictionary
would: `en` / `ett` for the two noun genders, `att` for verbs, `adj`, `fras`
on the Swedish side; `n.` `v.` `adj.` `ph.` on the English side. Swedish
cards carry a falu-red rail, English cards a spruce-green one.

Swedish words are spoken aloud on tap and on match, using whatever `sv-SE`
voice the device has. The 🔊 button turns that off.

## Every deal can be cleared

The deal is constructed, not dealt blind:

- Most pyramid cards have their partner in the stock. The stock recycles
  without limit, so those cards can always be matched once uncovered.
- A few pairs sit entirely inside the pyramid. Those are placed so that no
  pair blocks another in a cycle — `acyclic()` rejects any placement where
  pair A must be cleared before pair B and B before A.

So there is no such thing as a dead deal here; the only pressure is the
vocabulary, the clock, and the cost of hints. 16,000 generated deals were
simulated to check this holds.

## The words

308 A1–A2 words in `BANK`, each `[swedish, english, class, gender,
theme]`. Themes are selectable from the toolbar: everyday phrases, food and
home, people and body, nature and animals, town and travel, verbs,
adjectives. A single deal never repeats a Swedish word or an English
meaning.

Adding words means adding rows to `BANK` — nothing else needs to change.

## Layout

The pyramid is six rows on a wide screen, five on a phone. Card size is
derived from the strip that stays visible above the row covering it, so a
covered card never hides its own word, and the type is measured and shrunk
until the longest word fits on one line.
