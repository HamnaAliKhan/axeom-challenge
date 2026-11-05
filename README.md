# Axeom Challenge, pack 78

**Live app:** https://axeom-804e5c.netlify.app. Open it on a phone; no login needed.

| Read this | For |
|---|---|
| [writeup.md](writeup.md) | How I found each answer, how the system works, what doesn't work yet, the Jev job, next 2 weeks |
| [answers.json](answers.json) | The filled-in template (generated from the engine, not typed by hand) |
| [assumptions.md](assumptions.md) | Questions I'd have asked, and what I assumed instead |
| [daily_log.md](daily_log.md) | What I did each session, what changed, what went wrong |

## How it fits together

- **`app/engine.js`:** one file that does all the work. It reads the raw files, links every record to the right client, reconciles the money, finds lost requests and ranks the suggestions. It runs in the browser (the live app) and in Node (answers.json), so the two can't disagree.
- **`app/index.html` and `app/app.js`:** the phone screen. "Add new files" re-runs the engine on uploaded files in the browser.
- **`data/`:** the pack, untouched. All cleaning happens in code.
- **`scripts/`:**
  - `make_answers.js` builds answers.json.
  - `build.js` bundles the data for the site.
  - `analyze.js` prints check reports: `node scripts/analyze.js data <clusters|money|requests|lost|insights|namemap>`.
  - `jev_triage.js` is the Jev job (designed and coded; not run, because TypeSafe needs paid credit, see `evidence/`).
- **`out/name_map.txt`:** every name, spelling and sender in the data, and the client it was matched to. I read all 384 rows by hand.

## Run it

```bash
node scripts/make_answers.js            # regenerate answers.json
node scripts/build.js                   # then deploy the app/ folder as-is (static, no server)
```

Requires Node 18 or later. Nothing else is needed to run the engine; the Jev script needs `npm install` and a `TYPESAFE_API_KEY` in `.env`.
