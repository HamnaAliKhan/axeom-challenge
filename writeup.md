# Axeom: what I found and what I built

**Live:** https://axeom-804e5c.netlify.app · **Data "today":** 2026-10-06. Every number here comes from code ([app/engine.js](app/engine.js)) run on the untouched pack files; `node scripts/make_answers.js` rebuilds answers.json.

## 1. How I found each answer

**Clients: 29, plus 1 payer who is not a client.**
- **How records are linked:** lead rows tie emails to phones. A business is identified by its email domain, so the `sullivandental.con` typo is the same business. Names are matched by scored word overlap, with prefixes ("Ins" = Insurance) and initials ("PT" = Physical Therapy).
- **Checked by hand:** I read all 315 name-to-client matches (`out/name_map.txt`).
- **Kept apart:** Sullivan Dental and Sullivan Family Law, Red Oak Realty and Redoak Realty Group, the two Darnells, the two Pauls, the two Novaks.
- **Merged:** Cypress Church, Cypress DFW, Cypress Media Team and "Pastor Reggie Price" are one client, and so are Sunset Fitness and Sunset Athletics (renamed).
- **The payer:** Tallgrass Digital pays for Prime Pediatrics and Glow PT.

**Money.** Payments are matched to invoices by the invoice number in the reference, then by month memos ("Tallgrass Jul invoices", "august sessions"), then by the same payer and amount. Invoices are matched to bookings by `B0xx` memos, then date memos, then client + price + date. Retainers are checked month by month.

| | Total | Detail |
|---|---|---|
| Overdue | **$8,890** | 8 invoices. Oldest: Luis's Roofing $450 (46 days late, half paid), Redoak $1,500 (39), Trinity $900 (36) |
| Never billed | **$9,750** | Shoots B074, B086, B110, B118, B124, plus the May retainers for Magnolia and Ibarra (they had a shoot that month but no invoice) |
| We owe | **$2,400** | Evergreen paid INV-1078 twice ($900). Red Oak paid INV-1126 ($1,500) for B140, a cancelled shoot |
| Tool is wrong | **8 invoices** | INV-1096 says paid, but no money arrived. INV-1088, 1095 and 1109 say unpaid, but Angela's $900 "august sessions" Zelle paid them. INV-1084 is $2,250; every other retainer is $2,500 |

**Lost requests.** For each edit request, I found the video it is about and checked whether its note ever reached `notes_on_board`.

| Channel | Lost |
|---|---|
| Voice notes | **37 of 37** |
| Instagram DMs | **6 of 6** |
| WhatsApp text | 3 of 28 |
| Email | 2 of 39 |
| **All requests** | **49 of 111** |

- The 5 losses by WhatsApp text and email were either written in Spanish or said "the one we shot last week" instead of naming the video.
- **It got worse in June 2026,** when the lost rate went from 25% to 65%. That was just after Axeom's own 2026-06-04 broadcast: *"you can now just send edit notes as a voice note"*. Voice-note requests went from 2 in May to 11 in June.
- That is what "edits come back wrong" really means: the client's note never reached the editor. Clients sent 28 "did anyone see my message?" follow-ups.

**Most likely to leave: Magnolia Chiropractic, a $2,500/month retainer.**
- They wrote twice asking to "talk about our contract and whether we continue" (9/29 and 10/2), and there is no reply from us on record.
- 5 of their requests were lost, including "always say the full name". Our own board still labels their videos "Magnolia Chiro".
- They sent 5 follow-ups, and their invoice is 21 days late.
- Greenway already left in July for the same reason: "my notes keep getting missed".

**Best channel: Referral.**
- **How profit is counted:** work value minus studio time ($40 an hour × the hours for each service) minus editor hours × that editor's rate.
- **Why not Instagram:** it has the highest profit per client only because of two retainers, Greenway (gone) and Magnolia (leaving).
- **Referral's numbers:** it closes 9 of 9 leads, earns $1,751 profit per lead (next best is $1,107), and costs nothing we can see.
- **Leads:** 17 leads never got a reply. Same-day replies won 75% of the time; replies after 4+ days won 0%.

## 2. How the system works, and what it costs

- **One engine file** runs in Node (for answers.json) and in the browser (for the app), so the two can't disagree.
- **Home screen:** one "Do this first" card ("Magnolia Chiropractic may leave. Call Kim today?"), then 4 next items, 3 tiles (money, missed edits, leads) and a client search.
- **Every card is a yes/no question.** "Yes" opens an editable draft: a call script, email, WhatsApp, board note or invoice line. The owner sends it himself. Nothing is sent automatically.
- **Each client page** shows all their names, every invoice with what the bank actually says, videos with missed requests marked, bookings and messages.
- **Add new files:** each file's type is detected from its column headers, so file names don't matter. A row with the same ID replaces the old one. "Today" moves to the latest date in the data.
- **Tested with files the app had never seen:** new payments cleared invoices, "Pauls Roofing Co" matched the right client, and a new voice note showed up as lost on the right video. A new "we'd like to pause" message created a call card.
- **Cost: $0 a month.** It is a static site on Netlify's free plan, with no server and no login. Running Jev live would add less than $0.01 a month.

## 3. What doesn't work yet

- **Uploads are saved only in the phone that added them.** There is no shared data between people yet.
- **Message sorting uses hand-written phrase rules.** They got 185 of 187 messages right (I corrected 2 by hand), but new wording could beat them. That is the Jev job below.
- **2 of the 6 vague "the one we shot last week" requests are guesses** (V134, V249). For the other 4, the client's follow-up names the video.
- **"Done" only records that the owner tapped it.** The app can't see whether the message was sent or the video was fixed.
- **Some money answers are judgment calls:** Red Oak's $1,500 ("we already paid", but the only matching payment came after the cancellation) and Ibarra's $2,250. See assumptions.md.
- **Phone testing:** I checked it at a 390px phone width and in Node, not by tapping on a real phone.

## 4. The Jev job: designed and coded, not run

- **Why this job:** sorting messages decides whether a request is ever seen, and it is the weakest part of the system. Jev returns typed answers with a confidence score, which fits "decide in code, flag what's unsure".
- **The design:** one request per message, with 4 questions.
  1. **Kind:** a Choice of 12.
  2. **Edit type:** a Choice of 13, plus none.
  3. **Video:** a Choice of only that client's titles, plus "last week" and none. This keeps the state small, as the docs recommend.
  4. **Leaving?:** a Noul.
- **How it would be used:** the rules decide first. Jev decides when the rules find nothing, and anything with low confidence is shown as "check this".
- **How it would be measured:** `scripts/jev_triage.js` sends all 187 hand-labelled messages, caches the answers, and reports accuracy per question, every disagreement, and whether low-confidence answers are the wrong ones.
- **Why it didn't run:** TypeSafe needs paid credit to create an API key, and the free Playground also says "out of funds" (screenshots in `evidence/`). The brief says "free tools only", so I stopped there. The full run would cost about $0.001.

## 5. Next 2 weeks

1. **Week 1:**
   - The owner calls Magnolia and works through the money cards.
   - Send a new broadcast that undoes the June 4 one: "please write edit notes, and name the video".
   - Add a request log that editors tick off.
2. **Week 1:** run the Jev job once there is credit, publish the accuracy, and switch the sorting to rules plus Jev.
3. **Week 2:** move to a shared free database, and pull the WhatsApp, Instagram and email inboxes in directly, with voice notes transcribed, instead of uploading files.
4. **Week 2:** track ad spend for each channel, and ask for a referral after every approved video. Referral is the best channel, and nobody asks for them today.
