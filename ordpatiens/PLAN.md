# Ordpatiens — plan

Forward-looking build state. What the game *is* lives in `README.md`.

## Where it runs

Two tracks, on purpose:

- **Now — Claude artifact.** Good enough for demos and testing while the game is
  still changing. One page, sandboxed, no setup.
- **Later — GitHub Pages.** The real home, once there is enough here to be worth
  publishing. `SashaMoe/TurkishVan` is public, so Pages is free.

## Stack

| Layer | Choice |
|---|---|
| Hosting | GitHub Pages |
| Database | Cloud Firestore, called straight from the browser |
| Identity | Firebase Auth, Sign in with Google |
| Audio | Plain files committed to the repo |
| Cost | Free. Firebase Spark plan, no card required |

Firestore holds the record of progress, keyed to the Google account, so the
laptop and the phone see the same thing.

Spark plan limits, verified 2026-09: 1 GiB Firestore storage, 50K reads and 20K
writes a day, 50K monthly active users on Auth. Firebase **Cloud Storage** is the
one piece that needs a card — which is why audio lives in the repo instead.

## Deliberately not supported

Offline play, opening `index.html` off the disk, and playing without signing in.
The published game needs a network and a signed-in Google account.

## Open questions

- **What progression tracks.** Undesigned. Words seen, words mastered, per-word
  difficulty, streaks, review scheduling — this decides the data model, so it
  comes before any Firebase work.
- **Audio in the artifact.** The artifact sandbox blocks external media, so every
  sound has to be inlined into the page and counts against a 16 MB cap. A small
  set of effects is fine; a full pronunciation library is not. The GitHub Pages
  build has no such limit.

## Todo

- [ ] Describe what progression should track
- [ ] Install the Firebase toolchain (node/npm + `firebase-tools`), cleanly
- [ ] Create the Firebase project, enable Google sign-in
- [ ] Keep `firestore.rules` in this folder as the source of truth
- [ ] Enable GitHub Pages on the repo
- [ ] Update the "open the file and it runs" line in the root `CLAUDE.md` — it is
      still accurate today, and stops being true when Firebase lands
