# Daily log

## Day 1 (2026-11-05)

- **Session 1. What I did:** Read both PDFs and every row of the 8 data files before writing code. Noted the traps I could see by eye: same names for different businesses (two Sullivans, Red Oak vs Redoak, two Darnells, two Pauls, three Carmens, two Novaks), one business under many names (Cypress / Cypress DFW / Cypress Media Team / Pastor Reggie Price), a payer that is not a client (Tallgrass Digital), a rename (Sunset Fitness → Sunset Athletics), a typo email (`sullivandental.con`), and two date formats (bookings MM/DD, payments DD/MM).
- Picked plain JavaScript for one engine file (`app/engine.js`) that runs both in Node (to make answers.json) and in the browser (for the "Add new files" button). This means the live app and my answers can't disagree.
- Built parsing plus identity resolution. Lead rows link email to phone. A business is keyed by its email domain, so the `.con` typo merges with `.com`. Booking names override the booking email only when the name shares nothing with the email's business (the agency case).
- **What went wrong, and how I fixed it:** In the first version the fuzzy name matcher put Sullivan Family Law's bookings under Zamora Law, because "law" was the only distinctive word. It also put "Novak Detailing" under Hale Auto Detailing, because of "detailing". I replaced "any distinctive token wins" with scored token overlap, added initials ("PT" = Physical Therapy), and only override a booking email when the name has nothing in common with that email's business. A second bug: the label "Tallgrass - Glow" was saved as a Glow alias, so the word "tallgrass" pointed at Glow. Fixed by keeping "A - B" labels for exact matches only.
- **How I checked it:** Dumped every distinct (file, name, email) → client mapping (315 rows) and reviewed all of it line by line with my AI assistant (Claude Code). Result: 29 clients plus 1 payer (Tallgrass), and every row is correct.
- **Where the AI was wrong:** I misread a phone number at first (I thought a voice note from "Nina" came from another lead's number). The engine output showed the number really is ABC Homecare's, so I dropped that "trap".

- **Session 2. What I did:** Money reconciliation. Payments are matched to invoices in three passes:
  1. The invoice number in the reference.
  2. Month memos like "Tallgrass Jul invoices" or "august sessions".
  3. Same payer and the same amount.

  Invoices are linked to bookings by `B0xx` memos, then "Reels Pack 7/16" memos, then same client, price and nearby date. Retainers are checked month by month.
  - Results:
    - $8,890 overdue across 8 invoices.
    - $9,750 never billed: 5 shoots plus the May retainers for Magnolia and Ibarra.
    - 8 invoices where the billing tool is wrong. For example, Trinity's INV-1096 says paid but no money came in, and Faith & Fire's 3 August invoices say unpaid but were paid by one Zelle transfer.
    - We owe Evergreen $900 (INV-1078 paid twice) and Red Oak $1,500 (paid for the cancelled shoot B140).
- Lost requests: wrote a message classifier and a matcher that links each request to its board video, then checked whether each request's note ever reached the board.
  - **49 of 111 requests were lost.** Voice notes 37/37 lost, Instagram 6/6, WhatsApp text 3/28, email 2/39.
  - The lost rate went from 25% in May to 65% in June, right after Axeom's own 2026-06-04 broadcast told clients to send edit notes as voice notes.
- Leads, churn and profit:
  - 17 leads never got a reply, 3 of them existing clients (including Magnolia's contract message).
  - Leads answered the same day won 75% of the time; after 4+ days, 0%.
  - Magnolia is the top churn risk.
  - Wrote `scripts/make_answers.js` so answers.json is generated from the engine, never typed by hand.
- **What I changed my mind about:** The best marketing channel. Instagram has the highest profit per client, so I first leaned Instagram. Then I saw it rests on two retainers: Greenway already left and Magnolia is about to. Per lead, Referral wins clearly (9/9 closed, $1,751 profit per lead), so I switched to Referral and wrote down why.
- **What went wrong, and how I fixed it:**
  - "Desk posture fix: add the line 'walk-ins welcome'" matched the video *titled* "Walk-ins welcome". Fixed by ignoring quoted text when searching for titles.
  - Follow-ups ("still not fixed on client story") were chasing the newest video with that title, and 5 of them found no original request. They now chase the earlier request with that title, which also tells us which video a vague "the one we shot last week" request meant.
  - Red Oak: INV-1126 was billed for the cancelled shoot, and the only matching $1,500 payment came after the cancellation. I can't tell from the data whether Joy's "we already paid" is right. Treated it as $1,500 we owe (carry it to the rescheduled B165) and noted it as an assumption.
- **Where the AI was wrong, and how I caught it:**
  - The draft answer said Instagram was "the next best channel" per lead after Referral. The printed table showed Website form ($1,107) ahead of Instagram ($1,063). Caught by reading the generated sentence against the numbers; the runner-up is now computed, not hard-coded.
  - The fuzzy-matching bugs from Session 1 were also AI-written code. They were caught by reviewing the full 315-row name map line by line instead of trusting the summary.
- **How I checked it:** confirmed the data files were never edited (same timestamps as the unzip, no git changes). All cleaning happens in code, which is what makes uploads of unseen files work.

- **Session 3. What I did:**
  - **Built the phone app** (`app/`): one "Do this first" card, 4 next items, 3 tiles, client search, client pages, and "Add new files".
    - Every suggestion is yes/no, and "Yes" opens an editable draft that I send myself.
    - Checked with headless-browser screenshots at 390px phone width.
  - **Deployed it** on Netlify (free) at https://axeom-804e5c.netlify.app.
  - **Tested uploads with files the app had never seen.** New payments cleared invoices, "Pauls Roofing Co" matched, a new voice note was flagged as lost on the right video, and a "we'd like to pause" message created a call card.
  - **Read the Jev docs** and designed the Jev job (message triage, 4 typed questions per message). Wrote `scripts/jev_triage.js`, with a cache and an accuracy report against my 187 hand labels.
  - **Wrote** writeup.md and assumptions.md.
- **What I changed my mind about:**
  - The first version told me to chase Magnolia's $2,500 right after saying they might leave. Money cards for an at-risk client now say to wait until after the call.
  - I planned to run Jev, and skipped it once I hit the paywall. TypeSafe won't create an API key at a $0 balance, and the Playground says "out of funds" (screenshots in `evidence/`). The brief says "free tools only", so I wrote the Jev job up as designed and coded, but not run.
- **What went wrong, and how I fixed it:**
  - "We'd like to pause our videos" wasn't caught, because the churn rule only knew "we'll pause". I broadened it and retested.
  - The churn card had a hard-coded first name. It now uses whoever sent the warning message.
  - Headless Chrome wouldn't go below about 500px wide. I tested inside a 390px frame instead.
- **Where the AI was wrong, and how I caught it:**
  - The AI said 3 of the 6 vague "the one we shot last week" requests were confirmed by a follow-up. A check showed 4. The code only marked the cases where the follow-up *changed* the guess, not the ones where it agreed. Fixed the code and corrected the docs.
  - The AI's first writeup draft said the rules were "100% right". They were 185 of 187, since I corrected 2 labels by hand. Changed it.
