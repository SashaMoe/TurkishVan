# The wall

Design notes for the dödläge wall: what shape it is, what that shape does to
the game, and what shape real mahjong layouts are. Everything here is
measured — against `index.html`'s own `buildWall` and `makeDeal` where
possible, and against fifty hand-crafted layouts and the dealing code of two
real mahjong games where not.

`README.md` describes the wall as it ships. This file is why it should not
stay that way.

## The covering rule only bites on half-steps

A card is covered by the cards in the row below it that overlap within
`0.99` of a card step. Every offset in `tall10` and `wide8` is a whole
number, so the gap between two cards in adjacent rows is always a whole
number too — and `< 0.99` then means *exactly zero*. Coverage is
same-column-only.

| wall | slots | free at start | most cards above one | most beside one | separate stacks |
|---|---|---|---|---|---|
| `tall10` | 36 | 8 | 1 | 1 | 8 — `10,10,4,4,2,2,2,2` |
| `wide8` | 36 | 9 | 1 | 1 | 9 — `8,8,8,2,2,2,2,2,2` |
| `tall8` | 28 | 4 | 2 | 2 | 1 — all 28 woven |
| `wide6` | 28 | 5 | 2 | 2 | 1 — all 28 woven |

So the two dödläge walls are not walls. They are eight and nine
**independent single-file stacks**, and clearing a card frees exactly the one
card beneath it, always, with nothing else touched. The stock walls use
half-step offsets and do weave properly; the two shapes carrying the mode
that needs topology are the two that have none.

The narrow `[2,1]` rows do produce eight free cards, but not by leaving the
row above them "in the open". They produce them by **severing columns 0 and
3 into three stubs each**, because `x = 0` and `x = 3` have no card below
them in a row that runs `x = 1, 2`.

## What the shape costs

Playing 3000 deals of `tall10`, counting the matches legally available each
turn:

| cards left | matches showing | turns with only one match |
|---|---|---|
| 36 | 3.1 | 3% |
| 28 | 2.3 | 20% |
| 20 | 1.7 | 47% |
| 16 | 1.4 | 67% |
| 12 | 1.2 | 87% |
| 8 | 1.0 | 96% |
| 4 | 1.0 | 99% |

Choice runs out around the halfway mark and never comes back. **76% of deals
end in a run of two or more consecutive no-choice moves; the typical tail is
seven moves long and the longest seen is fifteen.** That stretch is not
play, it is tapping.

Searching every deal to the end for a perfect line (cheap, because there are
so few moves) says how much of the deal is a game at all:

| board positions, by kind | share |
|---|---|
| every available move wins — nothing to decide | 67.2% |
| exactly one move exists — nothing to decide | 20.2% |
| some moves win and some lose — a real decision | 8.2% |
| no move wins — the deal is already lost | 4.4% |

And the deals that are lost are not lost visibly. **Every fatal move leaves
other moves available**, so a player looking one move ahead sees nothing
wrong: the mistake lands with a median of 28 cards still up, the dead end
arrives at 16, and the six moves in between are spent clearing a deal that
is already over. The +18 that `tools/simulate.js` reports for careful play
is therefore not foresight — it is the unmatchable-pair and no-moves-left
terms in the lookahead doing hygiene.

## The depth gap writes the deal out in plain sight

| column | cards | deepest sits under |
|---|---|---|
| 0 | 8 | 3 others |
| 1 | 10 | 9 others |
| 2 | 10 | 9 others |
| 3 | 8 | 3 others |

Nothing in the outer columns is more than three deep, so they are exhausted
long before the middle two can be. From that point the only two cards
reachable — by the player, and by the dealer building the deal backwards —
are the top of column 1 and the top of column 2. There is nowhere else a
partner can go, so a matched pair gets written across those two columns, then
the next row, then the next.

- **93% of the time, the eight cards in the bottom four rows of the middle
  columns have their partner among those same eight cards.**
- Counting runs of consecutive rows where the two middle columns hold a
  matched pair side by side: median **5 rungs**, and **78% of deals have four
  or more**. About one deal in ten runs eight rungs or longer, which is the
  whole middle of the wall solved on sight.

The pinch rows are the cause of both halves of this. They buy eight free
cards at the start by cutting the outer columns into stubs, and cutting the
outer columns into stubs is exactly what makes them finish early. The opening
choice and the forced ending are one decision, not a trade between two.

## What real mahjong layouts are

Measured against the fifty layouts shipped by KMahjongg, with its own free
rule (nothing above, and one of left or right clear) and its dealer.

**Layer counts used across all fifty: 2, 3, 4, 5.** Not one is deeper than
five. Real boards are wide and shallow, and the shallowest are among the
richest — `pillars` is 118 tiles in 2 layers with 48 reachable at once,
`checkered` and `mesh` are 144 tiles in 2 layers with 53 and 54, `chains` is
120 tiles in 3 layers with 60. Depth is not where a mahjong board gets its
game. `tall10` is ten deep.

Three things carry over, and one does not:

- **The dealer is the same.** Both KMahjongg and GNOME Mahjongg build a deal
  by playing a finished board backwards and then painting faces on, exactly
  as `solvable()` and `makeDeal()` do. Four tiles per face matching any other
  of the four is also the same idea as four cards per word. None of that is
  the problem.
- **KMahjongg refuses to place a dealt pair touching** — `selectPosition()`
  rejects a spot adjacent to the pair's first tile and draws again. Worth
  having, but small: it moves same-face tiles that touch from 1.7% to 1.3%,
  because on a 144-tile board with 40 reachable, adjacency is rare anyway.
- **Proportions here are already right.** Reachable share of the cards still
  standing is 32% across the real layouts and 24% in `tall10`; cards freed per
  removal is 1.37 there and 1.56 here. The wall is not structurally worse.
- **Scale is not the excuse.** Real mahjong fits 144 tiles on a phone because
  a tile is an icon; a Swedish word needs width to read. But the shallow real
  layouts show the game does not need the tile count — it needs the reachable
  count, and that comes from being wide, not from being small.

Choice on a real board, for contrast — matches available as it empties:

| layout | start | 20% gone | 40% | 60% | 80% | last fifth |
|---|---|---|---|---|---|---|
| `default` (the turtle) | 14.7 | 9.1 | 6.0 | 3.9 | 2.7 | 2.4 |
| `dragon` | 19.7 | 13.0 | 7.4 | 3.4 | 1.9 | 1.8 |
| `cat` | 20.3 | 12.2 | 8.2 | 4.8 | 3.0 | 2.5 |
| `castle` | 25.1 | 13.1 | 8.3 | 6.0 | 4.1 | 3.4 |
| `flowers` | 30.0 | 18.9 | 12.3 | 6.6 | 3.5 | 3.0 |

Their worst moment offers more choice than `tall10`'s best, and they never
reach one. Their reachable share also *rises* through the game, 32% to 59%,
because a real board's endgame is a wide flat bottom layer. `tall10` sits at
24–26% and then ends in two deep columns.

Difficulty is not what is wrong. Random play clears real layouts 13% to 53%
of the time; dödläge's 61% is easier than nearly all of them.

## Many short stacks

Same 36 cards, same dealer, same matching, only the stack lengths changed:

| stacks | free at start | matches showing | no-choice turns | random clears | careful clears | skill |
|---|---|---|---|---|---|---|
| `10,10,4,4,2,2,2,2` (now) | 8 | 2.6 | 21% | 63% | 79% | +16 |
| six of six | 6 | 2.1 | 25% | 46% | 68% | +23 |
| nine of four | 9 | 3.5 | 9% | 48% | 67% | +19 |
| twelve of three | 12 | 5.2 | 6% | 57% | 76% | +20 |
| fourteen, mixed threes and twos | 14 | 6.3 | 6% | 61% | 81% | +20 |
| eighteen of two | 18 | 9.0 | 6% | 78% | 90% | +12 |

Twelve to fourteen stacks is the band. Eighteen pairs is too easy.

A row of `[0,0]` is a gap — `buildWall` already handles it, since `children`
only looks one row down, so a zero-count row breaks every column that crosses
it. Twelve stacks of three is therefore a wall spec today, and through
`makeDeal` it measures:

```
threes: [[4,0],[4,0],[4,0],[0,0],[4,0],[4,0],[4,0],[0,0],[4,0],[4,0],[4,0]]
```

| | rows | free | matches | no-choice turns | ladder, median / worst | random | careful | skill |
|---|---|---|---|---|---|---|---|---|
| `tall10` | 10 | 8 | 2.6 | 21% | 5 / 10 | 63% | 81% | +18 |
| `threes` | 11 | 12 | 5.2 | 6% | 1 / 3 | 58% | 76% | +18 |

Twice the choice, a fifth of the no-choice turns, the ladder gone, and the
same difficulty and the same reward for playing well. It costs one extra row
of screen height and two thin breaks in the wall.

The fourteen-stack mix lands on today's difficulty exactly (61/81) with two
and a half times the choice, but needs a two-wide row or the 5-across laptop
wall to reach 36 slots, so it is a shape to work out rather than a drop-in.

## Claims elsewhere in the repo that this contradicts

- `buildWall`'s comment — "two in the middle of a wide row, one at its ragged
  edges" — is true of `tall8` and `wide6` and false of `tall10` and `wide8`.
- The `WALLS` comment and `README.md`'s Layout section explain the eight free
  cards as the pinch "leaving the ends of the row above in the open". The
  mechanism is column severing, and its price is the forced ending.
- The `WALLS` comment's "about one deal in six" is 21% measured, and the
  eighteen-point skill gap it cites is real but is not lookahead.
- `README.md` presents the ten-row wall as chosen by measurement. The search
  was real, but every candidate it could reach was a set of single-file
  stacks, so it chose a stack-length profile and never had weaving, width, or
  stack count on the table.
