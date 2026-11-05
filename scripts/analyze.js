// Runs the same engine the app uses, on the files in ./data, and prints a report for checking by hand.
const fs = require('fs');
const path = require('path');
const E = require('../app/engine.js');

const dir = process.argv[2] || path.join(__dirname, '..', 'data');
const files = fs.readdirSync(dir).map(n => ({ name: n, text: fs.readFileSync(path.join(dir, n), 'utf8') }));
const data = E.load(files);
const id = E.resolveIdentities(data);

const section = process.argv[3] || 'clusters';
if (section === 'clusters') {
  console.log('date orders:', data.dateOrders);
  const rows = [...id.clusters.values()].filter(c => c.bookings.length || c.invoices.length || c.payments.length || c.board.length)
    .sort((a, b) => a.name.localeCompare(b.name));
  rows.forEach(c => {
    console.log(`\n## ${c.name}  [${c.key}] bookings=${c.bookings.length} inv=${c.invoices.length} pay=${c.payments.length} board=${c.board.length} msgs=${c.messages.length}${id.payerOnly.has(c.key) ? '  PAYER-ONLY' : ''}`);
    console.log('  names:', [...c.names.keys()].join(' | '));
    console.log('  persons:', [...c.persons].join(' | '), ' emails:', [...c.emails].join(' '), ' phones:', [...c.phones].join(' '));
    if (c.paidFor.size) console.log('  pays for:', [...c.paidFor].map(k => id.clusters.get(k).name).join(', '));
  });
  console.log('\nOVERRIDES', id.overrides);
  console.log('BOARD UNRESOLVED', id.boardUnresolved.map(v => v.id + ' ' + v.name));
  console.log('BOARD name-vs-booking mismatch', data.board.filter(v => v.bookingClient && v.client && v.bookingClient !== v.client).map(v => `${v.id} ${v.name} -> ${id.clusters.get(v.client).name} but booking ${v.booking} -> ${id.clusters.get(v.bookingClient).name}`));
  console.log('MSG FLAGS', id.msgFlags.map(f => f.note + ' :: ' + f.msg.raw));
  console.log('MSG UNRESOLVED', data.messages.filter(m => !m.client).map(m => m.raw));
}

if (section === 'money') {
  const today = process.argv[4] || '2026-10-06';
  const m = E.reconcile(data, id, today);
  const nm = k => k ? id.clusters.get(k).name : '??';
  console.log('OVERDUE');
  m.overdue.forEach(i => console.log(' ', i.id, nm(i.client), 'owed', i.owed, 'late', i.daysLate, 'tool:', i.status, i.payments.map(p=>p.id+':'+p.amount).join(',')));
  console.log('total', m.overdue.reduce((s, i) => s + i.owed, 0));
  console.log('\nOPEN not yet due');
  m.invoices.filter(i => i.owed > 0 && !i.daysLate).forEach(i => console.log(' ', i.id, nm(i.client), i.owed, 'due', i.due, 'tool:', i.status));
  console.log('\nCREDITS (unexplained money)');
  m.credits.forEach(c => console.log(' ', c.payment.id, c.payment.date, c.payment.name, c.amount, 'ref:', c.payment.ref, 'applied:', JSON.stringify(c.payment.applied)));
  console.log('\nNOTES', m.notes);
  console.log('\nNEVER BILLED');
  m.neverBilled.forEach(n => console.log(' ', nm(n.client), n.booking || n.month, n.amount, n.why));
  console.log('total', m.neverBilled.reduce((s, n) => s + n.amount, 0));
  console.log('\nTOOL WRONG');
  m.toolWrong.forEach(t => console.log(' ', t.invoice, nm(t.client), t.kind, '|', t.tool_says, '->', t.truth, '|', t.how));
  console.log('\nUNLINKED INVOICES (non-retainer, no booking)');
  m.invoices.filter(i => !i.bookings.length && !/retainer/i.test(i.memo)).forEach(i => console.log(' ', i.id, i.name, i.amount, i.issued, i.memo));
  console.log('\nNON-REF PAYMENT MATCHES');
  data.payments.filter(p => !/INV-/.test(p.ref)).forEach(p => console.log(' ', p.id, p.date, p.name, p.amount, '->', JSON.stringify(p.applied)));
}

if (section === 'requests') {
  const R = E.analyzeRequests(data, id);
  const nm = k => k ? id.clusters.get(k).name : '??';
  console.log('CATEGORIES', data.messages.reduce((a, m) => (a[m.cat] = (a[m.cat] || 0) + 1, a), {}));
  console.log('\nREQUESTS');
  R.requests.forEach(r => console.log(r.captured ? ' ok ' : ' LOST', r.date, r.channel.padEnd(10), (r.video || '----').padEnd(5), nm(r.client).slice(0, 18).padEnd(18), r.label.padEnd(26), r.followedUp ? 'FU' + r.followedUp : '   ', r.vague ? 'VAGUE ' + r.msg.vagueCandidates : '', '|', r.msg.text.slice(0, 60)));
  console.log('\nFOLLOWUPS');
  R.followups.forEach(f => console.log(' ', f.date, nm(f.client), f.video || '-', '->', f.chases ? f.chases.date + ' ' + f.chases.video + ' ' + f.chases.label + (f.chases.captured ? ' (was captured!)' : '') : 'NO ORIGINAL FOUND', '|', f.text));
  console.log('\nOTHER CATS');
  data.messages.filter(m => !['edit', 'followup'].includes(m.cat)).forEach(m => console.log(' ', m.cat.padEnd(9), m.date, nm(m.client).slice(0, 18).padEnd(18), '|', m.text.slice(0, 90)));
}

if (section === 'lost') {
  const R = E.analyzeRequests(data, id);
  const nm = k => k ? id.clusters.get(k).name : '??';
  R.lost.forEach(r => console.log(r.date, r.channel.padEnd(10), (r.video || '----').padEnd(5), nm(r.client).slice(0, 20).padEnd(20), r.label.slice(0, 40).padEnd(40), r.followedUp ? 'FU' : '  ', r.vague ? 'VAGUE' : ''));
  console.log('lost', R.lost.length, 'of', R.requests.filter(r => !r.afterApproval).length, ' changes after approval:', R.changes.map(r => r.video + ' ' + nm(r.client)));
  console.log('\nFOLLOWUPS'); R.followups.forEach(f => console.log(' ', f.date, nm(f.client).slice(0, 18).padEnd(18), '->', f.chases ? `${f.chases.date} ${f.chases.video} ${f.chases.label}${f.chases.captured ? ' (CAPTURED?!)' : ''}` : 'NONE', '|', f.text.slice(0, 50)));
  const S = E.lostStats(R);
  const pr = a => a.forEach(x => console.log('  ', String(x.key).padEnd(40), `${x.lost}/${x.total}`, Math.round(100 * x.rate) + '%'));
  console.log('\nBY CHANNEL'); pr(S.byChannel); console.log('BY MONTH'); pr(S.byMonth); console.log('BY VAGUE'); pr(S.byVague); console.log('BY MONTH x CHANNEL'); pr(S.byMonthChannel);
}

if (section === 'insights') {
  const today = '2026-10-06';
  const R = E.analyzeRequests(data, id);
  const M = E.reconcile(data, id, today);
  const L = E.analyzeLeads(data, id, today);
  console.log('NEVER REPLIED'); L.neverReplied.forEach(l => console.log(' ', l.id, l.created, l.name, '|', l.business, '|', l.source, '| waiting', l.waiting, 'days', l.existingClient ? 'EXISTING CLIENT ' + l.clientName : ''));
  console.log('SPAM', L.leads.filter(l => l.spam).map(l => l.id + ' ' + l.name));
  console.log('STATUS ODDITIES', L.leads.filter(l => !l.spam && ((l.firstReply && /new/i.test(l.status)) || l.existingClient)).map(l => `${l.id} ${l.name} status=${l.status} reply=${l.firstReply} existing=${l.clientName}`));
  console.log('WIN BY SPEED', L.speed);
  console.log('OFF-BOOK', L.offBook.map(o => `${o.msg.date} ${o.msg.cat} ${o.name} ${o.phone} inLeads=${o.inLeads} | ${o.msg.text.slice(0, 60)}`));
  const P = E.profitability(data, id, M);
  console.log('\nPROFIT BY CLIENT'); P.rows.forEach(r => console.log(' ', r.name.padEnd(26), r.source.padEnd(12), 'rev', r.revenue, 'studio', r.studio, 'editor', Math.round(r.editor), 'profit', Math.round(r.profit), 'videos', r.videos, 'rev/vid', r.videos ? (r.revisions / r.videos).toFixed(2) : '-'));
  console.log('\nBY CHANNEL'); P.channels.forEach(c => console.log(' ', c.source.padEnd(12), 'clients', c.clients, 'profit', Math.round(c.profit), 'per client', Math.round(c.profitPerClient), '|', c.names.join(', ')));
  const leadsBySource = {}; L.leads.filter(l => !l.spam && !l.existingClient).forEach(l => { const a = leadsBySource[l.source] = leadsBySource[l.source] || { leads: 0, won: 0 }; a.leads++; if (/won/i.test(l.status)) a.won++; });
  console.log('LEADS BY SOURCE', leadsBySource);
  const CH = E.churnRisk(data, id, R, M, today);
  console.log('\nCHURN'); CH.slice(0, 8).forEach(c => console.log(' ', c.score, c.name, c.gone ? '(ALREADY GONE)' : '', '\n    ' + c.evidence.join('\n    ')));
}

if (section === 'namemap') {
  // Every distinct (file, name, email) and the client it resolved to. Written to out/name_map.txt for checking by hand.
  const nm = k => !k ? '?? UNRESOLVED' : (/^[dep]:/.test(id.clusters.get(k).name) ? 'not a client (unknown sender)' : id.clusters.get(k).name);
  const seen = new Map();
  data.bookings.forEach(b => seen.set(`bookings  ${b.name} <${b.email}>`, nm(b.client)));
  data.invoices.forEach(i => seen.set(`invoices  ${i.name} <${i.email}>`, nm(i.payer) + (i.client !== i.payer ? `  (work for ${nm(i.client)})` : '')));
  data.payments.forEach(p => seen.set(`payments  ${p.name} <${p.email}>`, nm(p.payer)));
  data.board.forEach(v => seen.set(`board     ${v.name}`, nm(v.client)));
  data.messages.filter(m => m.direction === 'from').forEach(m => seen.set(`messages  ${m.email || m.phone || '@' + m.handle}${m.person ? ' (' + m.person + ')' : ''}`, nm(m.client)));
  const lines = [...seen].sort().map(([k, v]) => k.padEnd(64) + ' -> ' + v);
  fs.mkdirSync(path.join(__dirname, '..', 'out'), { recursive: true });
  fs.writeFileSync(path.join(__dirname, '..', 'out', 'name_map.txt'), `# ${lines.length} distinct names/senders and the client each resolves to\n` + lines.join('\n') + '\n');
  console.log(`out/name_map.txt: ${lines.length} rows, unresolved: ${lines.filter(l => /UNRESOLVED/.test(l)).length}`);
}
