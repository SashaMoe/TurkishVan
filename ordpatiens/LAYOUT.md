# The wall

The dödläge wall is ten cards deep where no real mahjong layout is deeper
than five, so it starves: eight cards reachable, 2.6 matches on the table,
and a fifth of every deal spent on turns with only one legal move.

This file is what to build instead. Measured against `index.html`'s own
`buildWall` and `makeDeal`, and against the fifty hand-crafted layouts
KMahjongg ships, played under its own free rule and dealer.

## What a good wall does

Choice is the whole product. A turn is only a decision if more than one
match is showing, and the number of matches showing grows *faster* than the
number of cards reachable — double what a player can reach and you roughly
quadruple what they can do with it. So every rule below is really one rule:
**keep a lot of cards reachable, and keep it that way to the last move.**

Reachable cards come from width and from gaps, not from depth. Real layouts
are wide, shallow and full of holes — a lattice or a frame, never a solid
block, and never a deep one.

1. **Keep a third of the cards reachable, and hold it.** The real layouts
   average 32% of the cards still standing, and the best hold 40–48% from
   first move to last. A wall whose reachable share sags in the middle is a
   wall that stops being a game in the middle.

2. **No stack deeper than three.** Depth buys nothing. A card under nine
   others cannot be reached until the deal is nearly over, which means it
   can only ever pair with the few other cards in the same position.

3. **Many small pieces, not a few big ones.** Twelve to fourteen separate
   stacks over 36 cards. Six is too few — choice collapses. Eighteen pairs
   is too many — nothing can go wrong any more.

4. **Every piece must run out at the same time.** This is the one that bites
   hardest. If some stacks are much deeper than others, the shallow ones
   empty first and the deep ones are left with nothing to pair with but each
   other — and because the dealer builds a deal by playing it backwards, it
   is forced to write those pairs side by side, in a readable ladder down the
   wall. Equal stacks, no ladder.

Two things do **not** need changing, both confirmed against the real games:

- **The dealer.** KMahjongg and GNOME Mahjongg both build a deal by playing
  a finished board backwards and painting faces on afterwards, exactly as
  `solvable()` and `makeDeal()` do. Four cards per word matching across the
  pair is the same idea as four tiles per face.
- **The proportions.** Cards freed per removal is 1.56 here against 1.37 in
  the real layouts. The covering rule is not the weak part; the shape is.

One refinement worth copying if pairs ever land adjacent: KMahjongg's
`selectPosition()` refuses to place a dealt pair touching its partner and
draws again. It is a small effect on a large board — same-face tiles that
touch go from 1.7% to 1.3% — but free to have.

## Reference layouts

The four shallowest layouts KMahjongg ships, which are also among its
richest. Reachable share is measured across the deal, first fifth to last.

| layout | tiles | layers | reachable at start | matches showing | reachable share through the deal | random clears |
|---|---|---|---|---|---|---|
| `mesh` | 144 | 2 | 54 | 34.8 | 42% 47% 47% 41% 46% | 42% |
| `chains` | 120 | 3 | 60 | 50.9 | 48% 43% 41% 39% 51% | 33% |
| `pillars` | 118 | 2 | 48 | 35.7 | 37% 33% 31% 31% 52% | 33% |
| `checkered` | 144 | 2 | 53 | 38.2 | 32% 24% 22% 32% 62% | 29% |

`mesh` and `chains` are the models: their reachable share barely moves from
start to finish. `checkered` sags to 22% in the middle, which is the same
fault the current wall has, and it is the weakest of the four to play.

`mesh` — a lattice with holes punched through it, two layers, the upper one
nearly as full as the lower:

```
  layer 0 (76 tiles)          layer 1 (68 tiles)
  # # # . # # # . # # # . # # #     # # # . # # # . # # # . # # #
  # . # . # . # . # . # . # . #     # . # . # . # . # . # . # . #
  # # # # # # # # # # # # # # #     # # # . # # # . # # # . # # #
  . . # . # . # . # . # . # . .     . . . . # . # . # . # . . . .
  # # # # # # # # # # # # # # #     # # # . # # # . # # # . # # #
  # . # . # . # . # . # . # . #     # . # . # . # . # . # . # . #
  # # # . # # # . # # # . # # #     # # # . # # # . # # # . # # #
```

`chains` — a solid frame around interlocking rings, then two sparse layers
of pillars sitting on the corners:

```
  layer 0 (80 tiles)                 layer 1 (24)      layer 2 (16)
  # # # # # # # # # # # # # # # #    # . . . # . . . # . . . #
  . .#. . . .#. . . .#. . . .#. .    # . . . # . . . # . . . #
   #   #   #   #   #   #   #   #     . . . . . . . . . . . . .
  . . . . . . . . . . . . . . . .    # . . . # . . . # . . . #
   #   #   #   #   #   #   #   #     # . . . # . . . # . . . #
  . .#. . . .#. . . .#. . . .#. .    . . . . . . . . . . . . .
  . .#. . . .#. . . .#. . . .#. .    # . . . # . . . # . . . #
   #   #   #   #   #   #   #   #     # . . . # . . . # . . . #
  . . . . . . . . . . . . . . . .
   #   #   #   #   #   #   #   #
  . .#. . . .#. . . .#. . . .#. .
  # # # # # # # # # # # # # # # #
```

A mahjong tile is free when nothing is on top of it **and** one of its left
or right sides is clear, so those in-plane holes are what keep the reachable
count up without any depth at all. Ordpatiens has no side rule — a card is
free when nothing is on top of it, full stop — so the same holes have to run
the other way: **gaps between stacks, not gaps within a layer.** Same
principle, rotated ninety degrees.

## Building one here

A row of `[0,0]` is a gap. `buildWall` already handles it, because
`children` only looks one row down, so a zero-count row severs every column
crossing it and costs one row step of screen height. That is the whole
mechanism — no code change needed to try any of this.

Twelve stacks of three on the phone, thirteen on the laptop:

```js
/* phone, no stock — eleven rows, four across, 36 slots / 18 matches */
tall11: [[4,0],[4,0],[4,0],[0,0],[4,0],[4,0],[4,0],[0,0],[4,0],[4,0],[4,0]],
/* laptop, no stock — ten rows, five across, 36 slots */
wide10: [[5,0],[5,0],[5,0],[0,0],[5,0],[5,0],[5,0],[0,0],[3,1],[3,1]],
```

Both through `makeDeal`, 2500 deals each:

| wall | rows | stacks | reachable | matches | one-move turns | reachable share through the deal | worst ladder | random | careful | skill |
|---|---|---|---|---|---|---|---|---|---|---|
| `tall10` now | 10 | 8 | 8 | 2.6 | 21% | 24% 28% 30% 39% 81% | 10 | 64% | 81% | +17 |
| `tall11` threes | 11 | 12 | 12 | 5.2 | 6% | 37% 48% 63% 79% 97% | 3 | 57% | 75% | +17 |
| `wide8` now | 8 | 9 | 9 | 3.0 | 16% | 27% 32% 34% 47% 86% | 7 | 58% | 77% | +20 |
| `wide10` threes | 10 | 13 | 13 | 5.7 | 6% | 40% 52% 67% 82% 97% | 3 | 60% | 78% | +18 |

Twice the choice, a third of the no-move turns, the ladder cut from ten
rungs to three, and the reachable share now climbing the way a real layout's
does instead of sagging. Difficulty and the reward for playing well are
unchanged. The phone wall costs one extra row of height, the laptop wall
two, plus a thin visible break at each gap.

The stack-length sweep behind the "twelve to fourteen" rule, same 36 cards
and same dealer, shape only:

| stacks | reachable | matches | one-move turns | random | careful | skill |
|---|---|---|---|---|---|---|
| `10,10,4,4,2,2,2,2` now | 8 | 2.6 | 21% | 63% | 79% | +16 |
| six of six | 6 | 2.1 | 25% | 46% | 68% | +23 |
| nine of four | 9 | 3.5 | 9% | 48% | 67% | +19 |
| twelve of three | 12 | 5.2 | 6% | 57% | 76% | +20 |
| fourteen, threes and twos | 14 | 6.3 | 6% | 61% | 81% | +20 |
| eighteen of two | 18 | 9.0 | 6% | 78% | 90% | +12 |

Fourteen mixed is the best of them — today's difficulty exactly, with two
and a half times the choice — but it needs a two-wide row to reach 36 slots,
so it is a shape to draw rather than a spec to paste.

## How to check a wall

`tools/simulate.js` already reports the clear rates and the skill gap. The
numbers it does not yet report are the ones that matter most, and they are
what any new shape should be judged on:

| what to measure | target |
|---|---|
| matches showing, averaged over the deal | 4 or more |
| turns with only one legal move | under 10% |
| reachable share of the cards still standing | 35% or more, and rising, never sagging |
| deepest stack | 3 |
| separate stacks | 12 to 14 |
| longest run of side-by-side matched pairs down the wall | 3 or fewer |
| careful play clears / random play clears | about 80% / about 60% |
| skill worth | +18 or better |

Difficulty is not the thing to tune. Random play clears the real layouts
13% to 53% of the time, so dödläge at 60% is already harder to lose than
most real mahjong; what it lacks is anything to decide.
