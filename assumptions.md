# Questions I would have asked, and what I assumed instead

Each item has the question, my assumption, and why. Where an assumption changes a number in answers.json, I say which one.

## Who is a client

1. **Who counts as a "real client"?**
   - **Assumed:** any business we did, or have booked, shoots or studio sessions for. That gives 29.
   - This includes Greenway, which left in July (they were a client during the period).
   - It excludes Tallgrass Digital, which only pays for others; it is listed under `payers_who_are_not_clients`.
   - It excludes leads that never booked.
2. **Are Crown Med Spa Frisco and Plano one client or two?**
   - **Assumed:** one. It is the same contact (Carmen Ortiz), the same email domain, and one billing relationship.
   - The board labels 2 Copperline videos "Copperline Med Spa - Frisco", but Copperline only ever booked as Plano, so I treated that label as a typo.
3. **Is Sunset Fitness the same client as Sunset Athletics?** **Yes.** On 8/1, Mateo wrote that they renamed and gave a new email.
4. **Is "Dr. Novak" (Magnolia Chiropractic) related to Isaac Novak (Novak Auto Detailing)?** **No.** They have different emails, phones and businesses. The shared surname is a trap.

## Dates

5. **What date format does each file use?**
   - **Assumed:** bookings are MM/DD and payments are DD/MM. Payments include dates like 13/04, and bookings include dates like 04/27.
   - The engine decides this per file from the values themselves, so new uploads follow the same rule.
6. **What is "today", and when is an invoice late?**
   - **Assumed:** today is 2026-10-06, as the brief says. Days late = today minus the due date.
   - An invoice due today is not late yet (INV-1129, INV-1130).
   - For new uploads, "today" becomes the latest date in the data.

## Money

7. **Is Cypress's $240 session price a mistake?** **No.** On 4/27 Axeom emailed Cypress offering 20% off from May ($300 → $240). I did not count it as under-billing.
8. **How do retainers work?**
   - **Assumed:** $2,500 a month, invoiced on the 1st, covering that month's retainer shoot. That is why the bookings show $0.
   - A month with a retainer shoot but no retainer invoice counts as never billed: Magnolia in May (B021) and Ibarra in May (B031).
   - *If their retainers really started in June, `never_billed_total` drops by $5,000.*
9. **Why is Ibarra's August retainer $2,250?**
   - No message mentions a discount, so I listed it as "billing tool is wrong" ($2,250 vs $2,500).
   - *If a discount was agreed by phone, remove it.*
10. **Which invoice does a payment with no reference pay?**
    - **Assumed:** an open invoice from the same payer with exactly that amount, oldest first. Otherwise the oldest open invoice.
    - "Rest when the next batch is done" (Luis) means INV-1090 is half paid, with $450 owed.
11. **Red Oak cancelled B140 ("we already paid"). Is $1,500 owed back?**
    - **Assumed:** yes, as a credit. INV-1126 was billed for the cancelled shoot, and a $1,500 payment arrived on 10/2.
    - I treated that money as belonging to the shoot they asked to move, which I assumed is B165 on 10/19. That shoot should not be billed again.
    - *If B147 on 10/2 was the moved shoot, Red Oak owes nothing either way, and INV-1136 is a double bill instead.*
12. **Evergreen paid $900 twice around INV-1078 (7/30 Zelle with no reference, 8/1 card with a reference).** **Assumed:** a double payment, so we owe $900, as a refund or credit.
13. **Do Tallgrass invoices without a booking memo belong to Prime Pediatrics or Glow PT?** I can't tell. Money is tracked against Tallgrass as the payer, which is what matters for collecting.
14. **Payment ID P5073 is missing from the sequence.** **Assumed:** a deleted or failed payment, not lost money. I noted it, but didn't count it.

## Requests

15. **When is a request "lost"?**
    - **Assumed:** when the board note for that video never records it.
    - The board's one notes field is the only record editors see, so this is the best signal available.
    - A video may have been fixed without a note, but the follow-ups ("did anyone see my message?") show most were not.
16. **Which video does "the one we shot last week" mean?**
    - **Assumed:** the client's most recent shoot in the past 3 weeks, then:
      - the video whose follow-up names it (4 cases),
      - otherwise the video from that shoot with no note and the most revisions (2 cases: V134 and V249).
17. **Is "we changed our mind: new song and new intro", sent after approval, a lost request?** **No.** I tracked it as rework after approval (Evergreen's Sale promo, Trinity's Open house promo), not as a lost request.
18. **Does Magnolia's "always say Magnolia Chiropractic" count?**
    - **Yes.** It is a standing instruction that was lost: the next videos still said "Magnolia Chiro".
    - It has no single video, so its `video_id` is left empty rather than guessed.

## Leads, churn and channels

19. **Which leads count as never replied?**
    - **Assumed:** every lead row with no `first_reply` (17 rows), except 4 obvious spam or test rows (L027, L067, L077, L100).
    - 3 of the 17 are existing clients who used the website form: Magnolia, Faith & Fire and Sunset. I kept them, because they still got no reply.
20. **Does Hector (Paul Zamora's cousin) count as a lead?** He is a referral given by WhatsApp and was never entered in leads.csv. The app shows him as a call card, but he isn't in `never_replied_leads`, because he has no lead ID.
21. **Who is "most likely to leave"?** **Assumed:** only clients who are still active. Greenway has already gone.
22. **How is profit counted?**
    - **Assumed:** studio time is $40 an hour for the hours in costs.csv (Content Day 6, Reels Pack 3, Retainer shoot 4, podcasts as booked).
    - Editor cost is board hours × that editor's rate, with revisions included, as the costs file says.
    - Revenue is the value of the work done: booking prices plus retainer months.
    - Owner time, rent and ad spend are unknown, so they are left out.
23. **Which channel does a client come from?** **Assumed:** the source of their first won lead. Gloria came in twice (LinkedIn, then the website form), so she counts as LinkedIn.

## The system

24. **Can the app send messages itself?** **No, by design.** "Yes" only opens a draft in the owner's own mail, WhatsApp or phone app.
25. **What happens when someone uploads files?**
    - Rows with the same ID replace the old ones.
    - Uploading 5+ kinds of file offers to replace the whole dataset.
    - Files are saved in that browser only.
26. **Jev needs paid credit (no API key and no Playground at a $0 balance). The brief says "free tools only".**
    - **Assumed:** I should not pay. I designed and coded the Jev job but did not run it. Screenshots are in `evidence/`.
    - *If paying a few dollars is fine, `node scripts/jev_triage.js` runs it as written.*
27. **The owner's name.** team.csv lists Zaid as Owner, so the drafts are signed "Zaid, Axeom".
