// Dad Joke Showdown (Node 22, standard library only).
//
// The entry is a single dad joke, at most 200 characters. This program
// carries it to the judge: it loads LINE.txt from the repository root,
// makes sure the text is one clean line of 1 to 200 characters, and
// writes it to /output/entry.txt, where the scorer reads it.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const SOURCE = join(BOT_DIR, "LINE.txt");
const TARGET = join(OUTPUT_DIR, "entry.txt");

function fail(message) {
  throw new Error(`dad joke rejected: ${message}`);
}

function loadJoke() {
  if (!existsSync(SOURCE)) fail("LINE.txt is missing from the repository root");
  const raw = readFileSync(SOURCE, "utf8");
  const joke = raw.replace(/\r?\n$/, "");
  if (joke.length < 1 || joke.length > 200) {
    fail(`must be 1 to 200 characters, got ${joke.length}`);
  }
  if (joke.trim().length === 0) fail("must not be only white space");
  // One joke, one line: a leftover newline inside the text would make it
  // two lines, and the judge only reads the first.
  if (/[\r\n]/.test(joke)) fail("must be a single line");
  // No control characters: the judge reads plain text, and a stray control
  // byte would make the entry unreadable instead of funny.
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(joke)) {
    fail("must not contain control characters");
  }
  return joke;
}

const joke = loadJoke();
mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(TARGET, joke);
const written = readFileSync(TARGET, "utf8");
if (written !== joke) {
  fail("round-trip check failed: output bytes differ from LINE.txt");
}
console.log(`dad joke (${joke.length} chars): ${joke}`);
