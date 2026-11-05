// Builds answers.json from the same engine the live app runs. Usage: node scripts/make_answers.js
const fs = require('fs');
const path = require('path');
const E = require('../app/engine.js');

const root = path.join(__dirname, '..');
const dir = path.join(root, 'data');
const files = fs.readdirSync(dir).map(n => ({ name: n, text: fs.readFileSync(path.join(dir, n), 'utf8') }));
const M = E.run(files);
const name = M.name;

let prev = {};
try { prev = JSON.parse(fs.readFileSync(path.join(root, 'answers.json'), 'utf8')); } catch (e) { /* first run */ }
const pack = (fs.readFileSync(path.join(root, 'PACK.txt'), 'utf8').match(/\d+/) || [''])[0];
const keep = k => (prev[k] && !/PUT YOUR/.test(prev[k]) ? prev[k] : '');

const S = M.stats;
const rate = k => { const x = S.byChannel.find(c => c.key === k); return x ? `${x.lost} of ${x.total}` : '0'; };
const vague = S.byVague.find(x => /vague/.test(x.key)) || { lost: 0, total: 0 };
const month = m => { const x = S.byMonth.find(y => y.key === m); return x ? `${x.lost}/${x.total} (${Math.round(100 * x.rate)}%)` : '-'; };
const vnMonth = m => { const x = S.byMonthChannel.find(y => y.key === m + ' voice note'); return x ? x.total : 0; };
// first month whose lost rate is clearly above the earlier months
const months = S.byMonth.map(x => x.key);
const worse = months.find((m, i) => i > 0 && S.byMonth[i].rate >= 0.5 && S.byMonth[i].rate > 2 * S.byMonth[i - 1].rate) || '';

const lostReason = r => {
  const why = [];
  if (r.standing) return 'Standing instruction sent as a voice note; nobody wrote it down anywhere the editors look, so the next videos still said "Magnolia Chiro".';
  if (r.channel === 'voice note') why.push('Sent as a voice note; nobody turns voice notes into board notes (0 of ' + (S.byChannel.find(c => c.key === 'voice note') || {}).total + ' voice-note requests ever reached the board)');
  if (r.channel === 'instagram') why.push('Sent as an Instagram DM; the DM inbox is not checked for edit notes (0 of ' + (S.byChannel.find(c => c.key === 'instagram') || {}).total + ' reached the board)');
  if (/[¿¡]|subt[ií]tulos|pueden/i.test(r.msg.text)) why.push('Written in Spanish; never translated onto the board');
  if (r.vague) why.push(`Client said "the one we shot last week" instead of a title (${r.msg.vagueShoot}); nobody worked out which video. ${r.video} is our best match${/follow-up/.test(r.how) ? ', confirmed by the follow-up' : ''}`);
  if (!why.length) why.push('Text message that named the video, but the note never reached the board (no pattern found; maybe missed during a busy week)');
  if (r.followedUp) why.push(`client had to chase it ${r.followedUp}x`);
  return why.join('; ') + '.';
};

const clients = M.clients.map(c => ({ name: c.name, other_names_used_in_the_data: c.otherNames, emails: c.emails, phones: c.phones }));
const magnolia = M.churn[0];
const mag = M.clients.find(c => c.key === magnolia.client);
const ch = M.profit.channels;
const leadsBy = {}; M.leads.leads.filter(l => !l.spam && !l.existingClient).forEach(l => { const a = leadsBy[l.source] = leadsBy[l.source] || { leads: 0, won: 0 }; a.leads++; if (/won/i.test(l.status)) a.won++; });
const ref = ch.find(c => c.source === 'Referral');
const ig = ch.find(c => c.source === 'Instagram');
const perLead = ch.filter(c => leadsBy[c.source]).map(c => ({ source: c.source, v: c.profit / leadsBy[c.source].leads })).sort((a, b) => b.v - a.v);
const runnerUp = perLead.find(c => c.source !== 'Referral');

const answers = {
  pack_id: pack,
  your_name: keep('your_name'),
  your_email: keep('your_email'),
  live_link: keep('live_link'),
  video_link: keep('video_link'),
  code_or_files_link: keep('code_or_files_link'),

  client_count: clients.length,
  clients,
  payers_who_are_not_clients: M.payers.map(p => ({ name: p.name, pays_for: p.paysFor })),

  overdue: M.money.overdue.map(i => ({ client: name(i.client), invoice: i.id, amount_owed: i.owed, days_late: i.daysLate })),
  overdue_total: M.totals.overdue,

  we_owe: M.weOwe.map(w => ({ client: name(w.client), amount: w.amount, why: w.why })),

  never_billed: M.money.neverBilled.map(n => ({ client: name(n.client), booking_id_or_month: n.booking || n.month, amount: n.amount })),
  never_billed_total: M.totals.neverBilled,

  billing_tool_is_wrong: M.money.toolWrong.map(t => ({ invoice: t.invoice, tool_says: t.tool_says, truth: t.truth, how_you_know: t.how })),

  lost_requests: M.requests.lost.map(r => ({ video_id: r.video, request_date: r.date, came_by: r.channel, why_it_was_lost: lostReason(r) })),
  lost_requests_root_causes: [
    `Voice notes are never written onto the production board: ${rate('voice note')} voice-note edit requests were lost, compared with ${rate('email')} by email and ${rate('whatsapp')} by WhatsApp text.`,
    `On 2026-06-04 Axeom itself told every client by WhatsApp broadcast to "just send edit notes as a voice note". Voice-note requests went from ${vnMonth('2026-05')} in May to ${vnMonth('2026-06')} in June, and the monthly lost rate went from ${month('2026-05')} to ${month('2026-06')}.`,
    `Instagram DMs are not watched as a place where edit notes arrive: ${rate('instagram')} were lost.`,
    `Vague references ("the one we shot last week") are not resolved to a video: ${vague.lost} of ${vague.total} lost. The board has no request log, just one note field per video, so nobody checks which video was meant.`,
    'There is no single inbox and no confirmation back to the client. Requests live in 5 channels, only email and WhatsApp text get copied to the board by hand, and clients only find out a note was missed when the video comes back wrong (28 "did anyone see my message / still not fixed" follow-ups).',
  ],
  lost_requests_started_getting_worse_in: worse,

  never_replied_leads: M.leads.neverReplied.map(l => l.id),

  most_likely_to_leave: {
    client: mag.name,
    evidence: magnolia.evidence.concat([
      'A standing instruction (2026-09-03, voice note: say "Magnolia Chiropractic", not "Magnolia Chiro") was missed; on 2026-09-08 Trent wrote "Not happy". Our own production board still labels their videos "Magnolia Chiro".',
      `Worth ${'$'}2,500/month retainer, one of our ${M.profit.rows.filter(r => r.months).length} retainer clients (Greenway already left in July for the same reason: "my notes keep getting missed").`,
    ]),
    what_to_do_this_week: 'Today: call Kim Novak (972-555-0148) and Trent, answer the 2 contract messages (website form 9/29, email 10/2) which have no reply on record. Own the problem: list their 5 missed requests (patient story brand colour, desk posture fix walk-ins + prices, insurance we take stumble, full name). This week: re-edit the open ones myself and send them before the 10/12 shoot (B160), put "Magnolia Chiropractic, full name" as a permanent note on every Magnolia video, and agree one channel for their notes with a written confirmation within 24h. Hold the INV-1111 ($2,500, 21 days late) conversation until after the fixes; do not chase it in the same call.',
  },

  best_marketing_channel: {
    channel: 'Referral',
    why: `Referrals close ${leadsBy.Referral ? leadsBy.Referral.won + ' of ' + leadsBy.Referral.leads : ''} leads (every other channel closes 20-38%) and cost nothing we can see, so they make the most profit per lead: ${'$'}${Math.round(ref.profit / leadsBy.Referral.leads)} vs ${'$'}${Math.round(runnerUp.v)} for ${runnerUp.source}, the next best (Instagram ${'$'}${Math.round(ig.profit / leadsBy.Instagram.leads)}). Instagram has the highest profit per client (${'$'}${Math.round(ig.profitPerClient)}) only because two of its clients are ${'$'}2,500 retainers; one (Greenway) already left and the other (Magnolia) is about to. Without them Instagram clients make about the same as referral clients. Profit here = what the work is worth (booking prices + retainer months) minus studio time (${'$'}40/hr) and editor hours times each editor's rate. Meta ads bring the most leads (${leadsBy['Meta ad'].leads}) but close only ${leadsBy['Meta ad'].won} and make the least per lead, before paying for the ads.`,
  },

  what_this_data_cannot_tell_us: [
    'What we spend on each channel (Meta ads, Google, Instagram, LinkedIn), so no true cost per client or return on ad spend.',
    'The owner\'s own time (sales calls, shoot days, reviewing) and other overheads (rent, gear, software), so "profit" is only after studio time and editor pay.',
    'Who referred each referral lead. Messages show Gloria → Ironclad and Ivy → Ridgeway, but most referral leads have no referrer.',
    'Anything said on phone calls or in person. Some requests and agreements (e.g. Ibarra\'s $2,250 August retainer, or whether Red Oak\'s cancelled shoot moved to B165 on 10/19) may have been agreed off the record.',
    'When each video was delivered and when each edit was done. The board has no dates except client approval, so turnaround time can\'t be measured.',
    'Whether lost voice notes were ever listened to, or fixed later without a board note. We only see that the note never reached the board and that clients chased.',
    'How the videos perform for clients (views, leads, sales), beyond a few happy messages.',
    'Lifetime value. The data covers April to October 2026 only, so newer clients look less profitable just because they are newer.',
  ],

  monday_top_3: [
    `Call Magnolia Chiropractic (Kim and Trent) before anything else. They asked twice to "talk about our contract and whether we continue" and got no reply. They are a ${'$'}2,500/month retainer and the same missed-notes problem already cost us Greenway in July. Saving them is worth more than everything else on the list combined.`,
    `Stop requests getting lost, starting today. Send one WhatsApp broadcast that undoes the June 4 one: "send edit notes in writing, naming the video; we'll confirm each one". Then go through the ${M.requests.lost.filter(r => r.date >= E.addDays(M.today, -30)).length} requests lost in the last 30 days (voice notes and Instagram DMs) and put each on the board. From now on every request goes into the app, which shows any request not yet on the board. This is why clients say edits come back wrong (${M.requests.lost.length} lost since April).`,
    `Collect and bill the money: send reminders on ${M.money.overdue.length} overdue invoices (${'$'}${M.totals.overdue.toLocaleString()}; oldest Luis's Roofing, Redoak Realty Group, Trinity), invoice ${M.money.neverBilled.length} pieces of work never billed (${'$'}${M.totals.neverBilled.toLocaleString()}), and tell Evergreen and Red Oak what we owe them before they find it. It's about ${'$'}${(M.totals.overdue + M.totals.neverBilled).toLocaleString()} sitting on the table, it takes an hour, and it pays for the fixes above.`,
  ],
};

fs.writeFileSync(path.join(root, 'answers.json'), JSON.stringify(answers, null, 2) + '\n');
console.log('answers.json written. today =', M.today, '| clients', answers.client_count, '| overdue', answers.overdue_total, '| never billed', answers.never_billed_total, '| lost', answers.lost_requests.length, '| worse in', answers.lost_requests_started_getting_worse_in, '| suggestions', M.suggestions.length);
console.log('\nTOP 12 SUGGESTIONS'); M.suggestions.slice(0, 12).forEach(s => console.log(' ', Math.round(s.priority), s.kind.padEnd(6), s.title));
