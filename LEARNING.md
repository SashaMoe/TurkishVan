# Learning Swedish with Claude

Three ways Claude helps. Decided, none of them built yet. Listening and speaking
are what Sasha wants to push; grammar and writing are here because they feed
those two, not for their own sake.

## Grammar explanation — a skill

The job is the same shape every time, so it is worth fixing in a skill rather
than re-describing what is wanted at the start of every session: explanation
pitched at A1–A2, driven by whatever she is actually stuck on rather than by a
syllabus, and honest at the edges — an uncertain nuance is said to be uncertain
instead of invented.

## Correcting what she writes — a skill

The piece no app does, and it is wider than essays. The sentence she wanted to
say today and couldn't is written down and corrected the same way, which is how
speaking gets rehearsed in text.

## Subtitles and transcription — parked

Not being done now. Written down so the groundwork is not worked out twice.

Two halves of one job: material that already has Swedish subtitles gets
translated into a bilingual `.srt`; material without them has to be transcribed
first. Claude does the translating and none of the hearing.

Transcription would run through **KB-Whisper**, the Swedish National Library's
Whisper fine-tune — on HuggingFace under `KBLab/`, and better on Swedish than
the original. The exact model name is unverified. It writes timed `.srt`
directly, so the chain is audio → KB-Whisper → Swedish `.srt` → translation →
bilingual `.srt`. It runs on Sasha's own machine, not in a cloud session: the
weights are a couple of GB and the audio would have to be uploaded first.

Two things make it worth less than it sounds. Whisper invents lines over silence
and music, and a confidently wrong line is worse for a learner than a missing
one. And SVT Play's player cannot load an external subtitle file, so a bilingual
`.srt` is only usable against a local copy of the video.

## Conversation — ruled out

Claude Code has no audio path: it cannot hear her and cannot speak, so a spoken
conversation is not something to build here. The Claude app's voice mode can
hold one, but it reaches none of this and still has no ear for pronunciation — a
vowel held too short, a mangled `sj-`, a flat sentence melody all go past it.
That correction comes from people. Written down because it removes a whole
direction, not because it is a task.

## Vocabulary — a web page

TurkishVan becomes a small vocabulary site. `ordpatiens/` is the first thing in
it and already has the parts that are tedious to build: 308 A1–A2 words, a
layout that survives a phone, and `sv-SE` speech on tap.

What is missing is **state**. What makes a vocabulary app work is that it
remembers which word was wrong yesterday, and a conversation does not survive
between sessions — only a file in this repo does. `ordpatiens/PLAN.md` has the
same hole open under "Describe what progression should track".

## Keeping the material — a catalogue

Claude does not write the material. Sasha finds it — YouTube, word lists already
on the web — and Claude cuts it into usable pieces and keeps it in one place, so
that wanting to study does not begin with a search.

**A word list is the same job as the vocabulary page.** Sasha supplies the list;
Claude does not go looking for one. `ordpatiens`'s `BANK` is already
`[swedish, english, class, gender, theme]`, so whatever she hands over gets
converted into that shape and cut into sets of twenty or thirty.

**A video is half the job, because Claude cannot watch one.** What it can keep is
the link, the title, the length, the channel and whatever Sasha said about it
afterwards — which is already enough to end the searching. A video carrying its
own chapters can be cut by them, chapter titles being text. Pulling auto-captions
with `yt-dlp` would allow cutting by content, and may simply not work.

The catalogue does not belong on the Whiskerbase board. That board holds things
to do; this is material to reach for, and mixing the two spoils both.
