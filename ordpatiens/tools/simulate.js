/* ------------------------------------------------------------------
   Deal checker.  Run with:  node ordpatiens/tools/simulate.js [deals]

   It lifts the word bank and the dealing code straight out of
   index.html — everything from `const BANK` down to the PURE-LOGIC-END
   marker — so there is no second copy of the rules to drift.

   What it asserts:
   - ova / misstag: a deal can be cleared from any order of play.  It
     plays each deal out with random choices and demands an empty wall.
   - dodlage: the order the dealer built is a legal clearing order, so a
     perfect player can always win.  It then reports how often random
     play and careful play strand the board anyway, because that number
     is the whole point of the mode — and how far apart the two are,
     which is whether skill buys you anything.
------------------------------------------------------------------- */
"use strict";
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const code = src.slice(src.indexOf('const BANK = ['),
                       src.indexOf('/* PURE-LOGIC-END */'));
const load = new Function(code + '\nreturn { BANK, THEMES, MODES, WALLS, buildWall, solvable, makeDeal, shuffle };');
const { BANK, THEMES, MODES, WALLS, buildWall, solvable, makeDeal, shuffle } = load();

const DEALS = Number(process.argv[2] || 4000);
const THEME_KEYS = Object.keys(THEMES);
const pick = a => a[Math.floor(Math.random() * a.length)];

const isFree  = (W, board, i) => !!board[i] && W.children[i].every(j => !board[j]);
const matches = (a, b) => a && b && a.pid === b.pid && a.lang !== b.lang;

function moves(W, board, wasteTop){
  const free = [];
  for (let i = 0; i < W.N; i++) if (isFree(W, board, i)) free.push(i);
  const out = [];
  for (let a = 0; a < free.length; a++)
    for (let b = a + 1; b < free.length; b++)
      if (matches(board[free[a]], board[free[b]])) out.push([free[a], free[b]]);
  if (wasteTop) for (const i of free) if (matches(board[i], wasteTop)) out.push([i, 'w']);
  return out;
}

/* play a stock deal out, choosing at random, and report whether it cleared */
function playWithStock(W, board, stock){
  board = board.slice(); stock = stock.slice();
  let waste = [], acts = 0;
  const top = () => waste.length ? waste[waste.length - 1] : null;
  while (board.some(Boolean) && acts++ < 4000){
    const mv = moves(W, board, top());
    if (mv.length){
      const [a, b] = pick(mv);
      board[a] = null;
      if (b === 'w') waste.pop(); else board[b] = null;
    } else if (stock.length){
      waste.push(stock.pop());
    } else if (waste.length){
      stock = waste.reverse(); waste = [];
    } else return false;
  }
  return !board.some(Boolean);
}

/* Play a no-stock deal out.  'random' takes any legal move; 'careful'
   looks one move ahead the way a person would — free as many cards as you
   can, keep your options open, never leave two cards of the same word on
   the same side, and never walk into a board with no moves at all. */
function playNoStock(W, board, strategy){
  board = board.slice();
  let acts = 0;
  while (board.some(Boolean) && acts++ < 400){
    const mv = moves(W, board, null);
    if (!mv.length) return false;
    let choice;
    if (strategy === 'careful'){
      let best = -Infinity;
      for (const m of mv){
        const t = board.slice();
        t[m[0]] = null; t[m[1]] = null;
        let score = 0;
        for (let i = 0; i < W.N; i++)
          if (t[i] && !isFree(W, board, i) && isFree(W, t, i)) score += 3;
        const rest = {};
        for (let i = 0; i < W.N; i++) if (t[i]) (rest[t[i].pid] = rest[t[i].pid] || []).push(t[i].lang);
        for (const k in rest){
          const r = rest[k];
          if (r.length === 2 && r[0] === r[1]) score -= 20;   /* unmatchable */
        }
        const on = moves(W, t, null).length;
        if (!on && t.some(Boolean)) score -= 100; else score += on;
        if (score > best){ best = score; choice = m; }
      }
    } else choice = pick(mv);
    board[choice[0]] = null; board[choice[1]] = null;
  }
  return !board.some(Boolean);
}

/* replay the dealer's own order and check every step was legal */
function orderIsLegal(W, board){
  const live = new Set();
  for (let i = 0; i < W.N; i++) if (board[i]) live.add(i);
  const order = solvable(W, [...live]);
  if (!order) return false;
  for (const [a, b] of order){
    const freeNow = i => live.has(i) && W.children[i].every(j => !live.has(j));
    if (!freeNow(a) || !freeNow(b)) return false;
    live.delete(a); live.delete(b);
  }
  return live.size === 0;
}

let fail = 0;
function check(cond, msg){ if (!cond){ fail++; console.log('  FAIL  ' + msg); } }

console.log('walls');
for (const [name, rows] of Object.entries(WALLS)){
  const W = buildWall(rows);
  const free = [];
  for (let i = 0; i < W.N; i++) if (W.children[i].length === 0) free.push(i);
  const cov = W.slots.map((_, i) => W.children[i].length);
  console.log('  %s  %d rows, %d slots, %d across, %d free at start, coverage %s',
    name.padEnd(7), W.depth, W.N, W.width, free.length,
    [0,1,2].map(n => n + ':' + cov.filter(c => c === n).length).join(' '));
  check(W.N % 2 === 0, name + ' has an odd number of slots');
  check(free.length >= 3, name + ' starts with fewer than 3 free cards');
}

console.log('\n%d deals per mode', DEALS);
for (const mode of Object.keys(MODES)){
  const M = MODES[mode];
  const shapes = M.stock ? ['tall8', 'wide6'] : ['tall10', 'wide8'];
  for (const shape of shapes){
    let cleared = 0, careful = 0, nulls = 0, words_ = 0, total_ = 0, firstMoves = 0;
    for (let n = 0; n < DEALS; n++){
      const maxLen = shape.startsWith('tall') ? 11 : 15;
      const deal = makeDeal(mode, shape, pick(THEME_KEYS), maxLen);
      if (!deal){ nulls++; continue; }
      const { W, board, stock, words } = deal;
      words_ += words.length; total_ += deal.total;
      firstMoves += moves(W, board, null).length;

      const svs = new Set(words.map(w => w[0])), ens = new Set(words.map(w => w[1]));
      check(svs.size === words.length && ens.size === words.length, 'a deal repeats a word');
      check(board.every(Boolean), 'a deal left a slot empty');

      if (M.stock){
        if (playWithStock(W, board, stock)) cleared++;
      } else {
        check(orderIsLegal(W, board), 'the dealt order is not a legal clearing order');
        if (playNoStock(W, board, 'random')) cleared++;
        if (playNoStock(W, board, 'careful')) careful++;
      }
    }
    const pc = n => (100 * n / DEALS).toFixed(1) + '%';
    console.log('  %s / %s  %s matches over %s words,  %s moves on the opening board',
      mode.padEnd(7), shape.padEnd(6), (total_ / DEALS).toFixed(1),
      (words_ / DEALS).toFixed(1), (firstMoves / DEALS).toFixed(1));
    if (M.stock){
      console.log('            random play clears %s', pc(cleared));
      check(cleared === DEALS, mode + '/' + shape + ' did not always clear');
    } else {
      console.log('            random play clears %s, careful play clears %s, skill worth %s',
        pc(cleared), pc(careful), '+' + (100 * (careful - cleared) / DEALS).toFixed(0));
      check(cleared > 0 && cleared < DEALS, 'dodlage random play should sometimes win and sometimes lose');
      check(careful < DEALS, 'dodlage careful play should still lose sometimes');
      check(careful > cleared, 'dodlage should reward playing well');
    }
    check(nulls === 0, shape + ' failed to deal ' + nulls + ' times');
  }
}

console.log(fail ? '\n%d FAILURES' : '\nall checks passed', fail || '');
process.exit(fail ? 1 : 0);
