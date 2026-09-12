# Ordpatiens

Swedish word solitaire — a wall of cards cleared by pairing each Swedish
word with its English translation. For an English speaker learning Swedish
at A1–A2.

Open `index.html`. That is the whole thing: one file, no build, no network
needed (it pulls two webfonts if it can and falls back cleanly if it can't).

Published as an Artifact, so it plays on the phone without the repo:
<https://claude.ai/code/artifact/03eb37f5-2e8f-4c0c-a333-cb45d53a147c>
(Add to home screen for an icon and full screen.) Build the Artifact page
with `node ordpatiens/tools/build-artifact.js out.html` — it takes what is
between the `ARTIFACT-START` / `ARTIFACT-END` markers and drops the document
scaffolding, which the Artifact host supplies itself. `index.html` stays the
single source and nothing generated is kept in the repo.

## The game

A card is **free** when nothing lies on top of it. Tap a free card, then tap
the card that translates it. Right pair: both leave the wall, +100 and a
streak bonus. Wrong pair: −25 and the streak resets.

Each card's corner mark is its word class, written the way a dictionary
would: `en` / `ett` for the two noun genders, `att` for verbs, `adj`, `fras`
on the Swedish side; `n.` `v.` `adj.` `ph.` on the English side. Swedish
cards carry a falu-red rail, English cards a spruce-green one.

Swedish words are spoken aloud on tap and on match, using whatever `sv-SE`
voice the device has. The 🔊 button turns that off.

## Three modes

The toolbar picks one. They are different games, not difficulty settings.

### Dödläge — dead ends

Every pair is on the wall and **there is no stock**. Each word gets **four
cards** — two svenska and two english — and any Swedish card clears against
any English card of the same word. That choice is the whole mode: pair the
wrong two and you bury the other two.

Nine words, eighteen matches, ten rows. The deal is always winnable, because
it is built by running a game backwards; but you are free to play a
different order, and some orders strand the rest of the wall. Run out of
moves and the deal is lost. **Blanda om** re-lays what is left in an order
known to come apart — twice per deal, 100 each. There is no undo.

The move counter in the scorebar is the thing to watch.

### Misstag — five lives

The pyramid game, with teeth: **five lives, three hints, no undo**. A wrong
pair costs a life; at zero the deal is over. Twenty words, twenty matches,
and most cards keep their partner in the stock, which recycles for ever — so
the *wall* can always be cleared. The pressure is entirely on you.

### Öva — free play

The original. Unlimited undo and hints, the stock recycles for ever, and
nothing can end the deal but clearing it.

## What can and cannot be lost

The two stock modes cannot dead-lock, and that is constructed, not hoped for:

- Most cards have their partner in the stock. The stock recycles without
  limit, so those cards can always be matched once uncovered.
- The pairs that sit entirely inside the wall are placed so that no pair
  blocks another in a cycle — `acyclic()` rejects any placement where pair A
  must be cleared before pair B and B before A.

Dödläge deliberately gives that up. `tools/simulate.js` is what keeps the
claim honest; run it with `node ordpatiens/tools/simulate.js`. It lifts the
dealing code straight out of `index.html`, so there is no second copy of the
rules to drift, then plays thousands of deals out:

| | random play clears | careful play clears |
|---|---|---|
| Öva / Misstag | 100% | 100% |
| Dödläge, ten-row wall | 61% | 81% |
| Dödläge, eight-row wall | 56% | 76% |

Careful play is a one-move lookahead — free as many cards as you can, never
leave two cards of the same word on the same side, never walk into a board
with no moves. Losing about one deal in five while playing well, and one in
two-and-a-half while not thinking, is the point; so is the twenty-point gap
between the two, which is what makes it a game of skill rather than a coin
flip.

The first cut of Dödläge gave each word only two cards, and the simulator
caught that it cleared **every** deal: with one card per word there is no
choice to make, only an order to execute, and the order was all but forced.
Four cards per word is what put the risk in.

## Layout

The board is a **wall**: a list of rows, each with a card count and a
horizontal offset measured in card steps. A card is covered by the cards in
the row below that overlap it. Rows can be any width, which is the whole
reason ten rows fit a phone — a pyramid ten deep would be ten cards across
and 33px each.

```
tall10  [[4,0],[4,0],[2,1],[4,0],[4,0],[4,0],[4,0],[2,1],[4,0],[4,0]]
```

The two narrow rows pinch the wall, leaving the ends of the row above them
in the open, so eight cards are free at once instead of four — enough choice
to go wrong with. That shape was chosen by measurement, not by eye: the
search that picked it is the same simulator, scoring walls by how often
careful play still dead-ends and by how much better careful play does than
random.

Four walls, so a deal is 36 cards on any screen and scores compare:

| | phone | laptop |
|---|---|---|
| Dödläge | 10 rows × 4 | 8 rows × 5 |
| Öva / Misstag | 8 rows × 4 | 6 rows × 5 |

Stock modes get a shallower wall because the stock and waste piles need the
room the rows would otherwise take.

Card size is solved in both directions. Width comes from the row: as wide as
fits, capped. Height comes from what is left of the screen — the page
measures everything that is not the wall and hands the wall the rest, which
is what decides whether a word gets one line or two. Type is then measured
and shrunk until the longest word fits without breaking.

## The words

308 A1–A2 words in `BANK`, each `[swedish, english, class, gender, theme]`.
Themes are selectable from the toolbar: everyday phrases, food and home,
people and body, nature and animals, town and travel, verbs, adjectives. A
single deal never repeats a Swedish word or an English meaning.

On a phone, words longer than ten characters are left out of the deal — at
four cards across there is no font size at which `congratulations` is worth
reading. That excludes 7 of the 308. On a laptop nothing is excluded. Where
a card's partner is in the stock, the shorter of the two sides goes on the
wall, where the card is clipped, and the longer one goes in the stock, where
the whole card shows.

Adding words means adding rows to `BANK` — nothing else needs to change.
