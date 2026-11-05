// Jev job: message triage. For every inbound message, one Jev request with 4 typed questions:
//   kind (Choice), edit type (Choice), which video (Choice over that client's own titles), leaving (Noul).
// Compares Jev with hand-checked labels and writes out/jev_report.md + app/jev-labels.js.
//
// Usage: put TYPESAFE_API_KEY=... in .env (gitignored), then: node scripts/jev_triage.js
//        node scripts/jev_triage.js --report   (re-score from the cache, no API calls)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const E = require('../app/engine.js');

const root = path.join(__dirname, '..');
try { fs.readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/).forEach(l => { const m = /^\s*([A-Z_]+)\s*=\s*(.*)\s*$/.exec(l); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }); } catch (e) { /* no .env */ }
const MODEL = process.env.JEV_MODEL || 'jev-latest';
const CACHE = path.join(root, 'out', 'jev_raw.json');
const REPORT_ONLY = process.argv.includes('--report');

/* ---------- the labels Jev chooses from */
const KINDS = {
  edit: 'Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).',
  followup: 'Says an earlier request was missed or is still not fixed ("did anyone see my message", "still wrong", "second time I ask").',
  churn: 'Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.',
  payment: 'About paying, invoices or billing: when they will pay, partial payment, who to bill.',
  referral: 'Recommends someone else to us, or says someone else will contact us.',
  upsell: 'Asks about buying more or a new service, or asks for a price.',
  schedule: 'Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.',
  info: 'Updates their business details (name, email, phone) or gives a standing rule for all future videos.',
  praise: 'Thanks us or says the videos worked well, with no request.',
  approval: 'Approves a video for posting.',
  spam: 'Unsolicited marketing, scams or offers from someone who is not a client.',
  other: 'None of the above.',
};
const EDITS = Object.fromEntries(E.EDIT_TYPES.map(t => [t.key, {
  stumble: 'Remove a part where the speaker stumbles over words',
  spelling: 'A name is spelled wrong in captions or text',
  phone: 'Add a phone number at the end',
  prices: 'Remove the part where prices are mentioned',
  calmer: 'Use a calmer song or music',
  music: 'The music is too loud; turn it down',
  captions: 'Make captions or subtitles bigger',
  first3: 'Cut the first seconds because the start is slow',
  brand: 'Use a different brand color',
  walkins: "Add the line 'walk-ins welcome' at the end",
  outside: 'Use a different shot (the outside one)',
  blur: "Blur someone's face",
  redo: 'They changed their mind: new song and new intro',
}[t.key] || t.label]));
EDITS.none = 'The message does not ask for a change to a video';

/* ---------- data + hand-checked labels */
const files = fs.readdirSync(path.join(root, 'data')).map(n => ({ name: n, text: fs.readFileSync(path.join(root, 'data', n), 'utf8') }));
const M = E.run(files);
const inbound = M.data.messages.filter(m => m.direction === 'from' && !m.broadcast);
// The rule labels were read one by one (scripts/analyze.js data requests). These are the ones I disagreed with:
const OVERRIDE = {
  'Please bill us (Tallgrass)': { kind: 'payment' },        // rules said "other"
  "We have to cancel today's shoot": { kind: 'schedule' },  // rules said "payment" because of "we already paid"
};
const keyOf = m => crypto.createHash('sha1').update(m.raw).digest('hex').slice(0, 12);
const gold = inbound.map(m => {
  const o = Object.entries(OVERRIDE).find(([k]) => m.text.includes(k));
  const kind = (o && o[1].kind) || m.cat;
  return {
    key: keyOf(m), date: m.date, channel: m.channel, client: m.client ? M.name(m.client) : '', text: m.text,
    kind, edit: kind === 'edit' ? m.edit : 'none',
    video: (kind === 'edit' || kind === 'followup') ? (m.titleKey || (m.vague ? 'last_shoot' : 'none')) : 'none',
    leaving: kind === 'churn',
    titles: m.client ? [...new Set((M.clients.find(c => c.key === m.client) || { videos: [] }).videos.map(v => v.title.toLowerCase()))] : [],
  };
});

/* ---------- ask Jev */
async function ask() {
  const { TypeSafeClient, choice, noul } = require('@typesafe-ai/sdk');
  if (!process.env.TYPESAFE_API_KEY) { console.error('Set TYPESAFE_API_KEY in .env first (see console.typesafe.ai/keys).'); process.exit(1); }
  const client = new TypeSafeClient({ defaultModel: MODEL });
  const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
  const lim = process.argv.find(a => a.startsWith('--limit='));
  const todo = gold.filter(g => !cache[g.key]).slice(0, lim ? +lim.split('=')[1] : Infinity);
  console.log(`${gold.length} messages, ${todo.length} to send to ${MODEL}`);
  let done = 0;
  async function one(g) {
    const videoOpts = {};
    g.titles.forEach((t, i) => { videoOpts['t' + i] = `The video titled "${t}"`; });
    videoOpts.last_shoot = 'Does not name the video; says "the one we shot last week" or similar';
    videoOpts.none = 'Not about one specific video';
    const res = await client.systemOne({
      state: { message: g.text, channel: g.channel, sender_business: g.client || 'unknown' },
      questions: {
        kind: choice('What is the main purpose of this message from a client (or stranger) to a video studio?', KINDS),
        edit: choice('If the message asks for a change to a video, which change? Otherwise "none".', EDITS),
        video: choice('Which of this client\'s videos is the message about?', videoOpts),
        leaving: noul('The sender says or hints that they may stop, pause or cancel working with the studio.'),
      },
    });
    const a = res.answers;
    const vid = a.video.choice;
    cache[g.key] = {
      kind: a.kind.choice, kindConf: a.kind.confidence, kindP: a.kind.probabilities,
      edit: a.edit.choice, editConf: a.edit.confidence,
      video: /^t\d+$/.test(vid) ? g.titles[+vid.slice(1)] : vid, videoConf: a.video.confidence,
      leaving: a.leaving.noul, model: res.model, usage: res.usage,
    };
    if (++done % 20 === 0) { console.log(`  ${done}/${todo.length}`); fs.writeFileSync(CACHE, JSON.stringify(cache, null, 1)); }
  }
  for (let i = 0; i < todo.length; i += 8) {
    await Promise.all(todo.slice(i, i + 8).map(g => one(g).catch(e => console.error('  failed', g.key, e.status || '', e.message))));
  }
  fs.mkdirSync(path.dirname(CACHE), { recursive: true });
  fs.writeFileSync(CACHE, JSON.stringify(cache, null, 1));
  return cache;
}

/* ---------- score Jev against the hand-checked labels */
function report(cache) {
  const rows = gold.filter(g => cache[g.key]).map(g => ({ g, j: cache[g.key] }));
  const pct = (a, b) => b ? `${a}/${b} (${Math.round(100 * a / b)}%)` : '-';
  const kindOk = rows.filter(r => r.j.kind === r.g.kind);
  const edits = rows.filter(r => r.g.kind === 'edit');
  const editOk = edits.filter(r => r.j.edit === r.g.edit);
  const vids = rows.filter(r => r.g.video !== 'none');
  const vidOk = vids.filter(r => r.j.video === r.g.video);
  const leaveOk = rows.filter(r => (r.j.leaving >= 0.5) === r.g.leaving);
  // rules vs Jev on the 2 cases the rules got wrong
  const hi = rows.filter(r => r.j.kindConf >= 0.8), lo = rows.filter(r => r.j.kindConf < 0.8);
  const tokens = Object.values(cache).reduce((s, c) => s + ((c.usage && (c.usage.input_tokens || c.usage.inputTokens)) || 0), 0);
  const wrong = rows.filter(r => r.j.kind !== r.g.kind).map(r => `| ${r.g.date} | ${r.g.channel} | ${r.g.text.slice(0, 70).replace(/\|/g, '/')} | ${r.g.kind} | ${r.j.kind} (${(r.j.kindConf ?? 0).toFixed(2)}) |`);
  const wrongEdit = edits.filter(r => r.j.edit !== r.g.edit).map(r => `| ${r.g.text.slice(0, 70).replace(/\|/g, '/')} | ${r.g.edit} | ${r.j.edit} |`);
  const wrongVid = vids.filter(r => r.j.video !== r.g.video).map(r => `| ${r.g.text.slice(0, 70).replace(/\|/g, '/')} | ${r.g.video} | ${r.j.video} |`);
  const md = `# Jev triage report

Model: ${(rows[0] && rows[0].j.model) || MODEL} · messages scored: ${rows.length} · input tokens: ${tokens.toLocaleString()} (~$${(tokens * 0.042 / 1e6).toFixed(4)})

| Question | Jev correct |
|---|---|
| Kind of message (12 options) | ${pct(kindOk.length, rows.length)} |
| Which edit (13 options + none), edit requests only | ${pct(editOk.length, edits.length)} |
| Which video (client's own titles + "last week" + none) | ${pct(vidOk.length, vids.length)} |
| Is the client hinting they will leave (yes/no) | ${pct(leaveOk.length, rows.length)} |

Confidence check (kind): confidence ≥ 0.8 → ${pct(hi.filter(r => r.j.kind === r.g.kind).length, hi.length)} correct; below 0.8 → ${pct(lo.filter(r => r.j.kind === r.g.kind).length, lo.length)} correct.

Hand labels: the engine's rule labels, read one by one; ${Object.keys(OVERRIDE).length} corrected by hand (${Object.keys(OVERRIDE).join('; ')}).

## Kind: where Jev disagreed
| Date | Channel | Message | Hand label | Jev (confidence) |
|---|---|---|---|---|
${wrong.join('\n') || '| - | - | none | - | - |'}

## Edit type: where Jev disagreed
| Message | Hand label | Jev |
|---|---|---|
${wrongEdit.join('\n') || '| none | - | - |'}

## Video: where Jev disagreed
| Message | Hand label | Jev |
|---|---|---|
${wrongVid.join('\n') || '| none | - | - |'}
`;
  fs.writeFileSync(path.join(root, 'out', 'jev_report.md'), md);
  // labels the app can use (keyed by a hash of the raw message line)
  const labels = Object.fromEntries(rows.map(r => [r.g.key, { kind: r.j.kind, kindConf: r.j.kindConf, edit: r.j.edit, video: r.j.video, leaving: r.j.leaving }]));
  fs.writeFileSync(path.join(root, 'app', 'jev-labels.js'), '/* generated by scripts/jev_triage.js: Jev answers for the pack messages */\nwindow.AXEOM_JEV_LABELS = ' + JSON.stringify(labels) + ';\n');
  console.log(md.split('\n## ')[0]);
}

// Same request, as JSON to paste into the free Playground (console.typesafe.ai/playground) when the API has no credit.
function requestFor(g) {
  const videoOpts = {};
  g.titles.forEach((t, i) => { videoOpts['t' + i] = `The video titled "${t}"`; });
  videoOpts.last_shoot = 'Does not name the video; says "the one we shot last week" or similar';
  videoOpts.none = 'Not about one specific video';
  return {
    state: { message: g.text, channel: g.channel, sender_business: g.client || 'unknown' },
    questions: {
      kind: { type: 'choice', instructions: 'What is the main purpose of this message from a client (or stranger) to a video studio?', criteria: KINDS },
      edit: { type: 'choice', instructions: 'If the message asks for a change to a video, which change? Otherwise "none".', criteria: EDITS },
      video: { type: 'choice', instructions: "Which of this client's videos is the message about?", criteria: videoOpts },
      leaving: { type: 'noul', instructions: 'The sender says or hints that they may stop, pause or cancel working with the studio.' },
    },
  };
}
if (process.argv.includes('--playground')) {
  // A sample that covers every kind of message and the hard cases, not just easy edits.
  const pick = [];
  const take = (f, n) => gold.filter(g => f(g) && !pick.includes(g)).slice(0, n).forEach(g => pick.push(g));
  take(g => /[¿¡]/.test(g.text), 1);                       // Spanish
  take(g => g.video === 'last_shoot', 2);                  // vague video reference
  take(g => /Tallgrass|cancel today|full name|pause/i.test(g.text), 4); // rules got these wrong / tricky
  ['churn', 'payment', 'referral', 'upsell', 'schedule', 'info', 'praise', 'approval', 'spam'].forEach(k => take(g => g.kind === k, 1));
  take(g => g.kind === 'followup', 3);
  take(g => g.kind === 'edit' && g.channel === 'voice note', 3);
  take(g => g.kind === 'edit' && g.channel === 'instagram', 1);
  take(g => g.kind === 'edit' && g.channel === 'email', 2);
  take(g => g.kind === 'edit' && g.channel === 'whatsapp', 1);
  const out = pick.map((g, i) => `## P${String(i + 1).padStart(2, '0')} · ${g.date} · ${g.channel} · key ${g.key}\n\nHand label: kind=${g.kind}, edit=${g.edit}, video=${g.video}, leaving=${g.leaving}\n\n**State**\n\`\`\`json\n${JSON.stringify(requestFor(g).state, null, 2)}\n\`\`\`\n\n**Questions**\n\`\`\`json\n${JSON.stringify(requestFor(g).questions, null, 2)}\n\`\`\`\n`);
  fs.mkdirSync(path.join(root, 'out'), { recursive: true });
  fs.writeFileSync(path.join(root, 'out', 'jev_playground.md'), `# Jev Playground pack (${pick.length} messages)\n\nFor each block: paste **State** into the state box and **Questions** into the questions box, run, and copy the answer JSON into out/jev_playground_answers.json under its key.\n\n` + out.join('\n'));
  const tmpl = Object.fromEntries(pick.map(g => [g.key, null]));
  const ans = path.join(root, 'out', 'jev_playground_answers.json');
  if (!fs.existsSync(ans)) fs.writeFileSync(ans, JSON.stringify(tmpl, null, 2));
  console.log(`wrote out/jev_playground.md with ${pick.length} messages:`, pick.map(g => g.kind).join(', '));
  process.exit(0);
}

if (process.argv.includes('--labels')) {
  const c = {}; gold.forEach(x => { c[x.kind] = (c[x.kind] || 0) + 1; });
  console.log('messages', gold.length, c, '| with a video label', gold.filter(x => x.video !== 'none').length, '| "last week"', gold.filter(x => x.video === 'last_shoot').length, '| leaving', gold.filter(x => x.leaving).length);
  gold.filter(x => Object.keys(OVERRIDE).some(k => x.text.includes(k))).forEach(x => console.log('  override:', x.kind, '|', x.text.slice(0, 60)));
  process.exit(0);
}

// Score answers copied from the Playground (raw response JSON, or just its "answers" object, per key).
if (process.argv.includes('--score-playground')) {
  const ans = JSON.parse(fs.readFileSync(path.join(root, 'out', 'jev_playground_answers.json'), 'utf8'));
  const cache = {};
  Object.entries(ans).forEach(([k, r]) => {
    if (!r) return;
    const a = r.answers || r;
    const g = gold.find(x => x.key === k); if (!g || !a.kind) return;
    const vid = a.video && a.video.choice;
    cache[k] = { kind: a.kind.choice, kindConf: a.kind.confidence, edit: a.edit && a.edit.choice, editConf: a.edit && a.edit.confidence,
      video: /^t\d+$/.test(vid || '') ? g.titles[+vid.slice(1)] : vid, videoConf: a.video && a.video.confidence,
      leaving: a.leaving && a.leaving.noul, model: r.model || 'playground', usage: r.usage };
  });
  console.log(`${Object.keys(cache).length} Playground answers found`);
  report(cache);
  process.exit(0);
}

(async () => {
  let cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
  if (!REPORT_ONLY) cache = await ask();
  report(cache);
})();
