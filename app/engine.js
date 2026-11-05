/* Axeom engine: one file, runs in the browser (window.AxeomEngine) and in Node (require).
 * Input: raw file texts. Output: a model with clients, money, lost requests, leads and suggested actions.
 * Nothing in here sends anything anywhere. It only reads and suggests.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AxeomEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------------------------------------------------------------- parsing */

  function parseCSV(text) {
    text = String(text || '').replace(/^﻿/, '');
    const rows = [];
    let row = [], field = '', q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
        else field += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(field); field = '';
        if (row.some(v => v.trim() !== '')) rows.push(row);
        row = [];
      } else field += c;
    }
    row.push(field);
    if (row.some(v => v.trim() !== '')) rows.push(row);
    if (!rows.length) return [];
    const head = rows[0].map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
    return rows.slice(1).map(r => {
      const o = {};
      head.forEach((h, i) => { o[h] = (r[i] == null ? '' : r[i]).trim(); });
      return o;
    });
  }

  // Which kind of file is this? Decided by columns, not by filename, so renamed uploads still work.
  function detectType(name, text) {
    const first = String(text || '').replace(/^﻿/, '').split(/\r?\n/).find(l => l.trim()) || '';
    if (/^\s*\[\d{4}-\d{2}-\d{2}/.test(first)) return 'messages';
    const h = first.toLowerCase();
    if (h.includes('lead_id')) return 'leads';
    if (h.includes('booking_id')) return 'bookings';
    if (h.includes('invoice_no')) return 'invoices';
    if (h.includes('payment_id')) return 'payments';
    if (h.includes('video_id')) return 'board';
    if (h.includes('role') && h.includes('pay')) return 'team';
    if (h.includes('item') && h.includes('cost')) return 'costs';
    if (/messages/i.test(name || '')) return 'messages';
    return null;
  }

  function money(v) {
    if (v == null) return 0;
    const n = parseFloat(String(v).replace(/[$,\s]/g, ''));
    return isFinite(n) ? n : 0;
  }

  // Slash dates are ambiguous (bookings use MM/DD, payments use DD/MM in this pack).
  // We decide per column: if any first part > 12 it is DD/MM; if any second part > 12 it is MM/DD;
  // otherwise fall back to the given default.
  function slashOrder(values, fallback) {
    let dm = false, md = false;
    values.forEach(v => {
      const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(v || '');
      if (!m) return;
      if (+m[1] > 12) dm = true;
      if (+m[2] > 12) md = true;
    });
    if (dm && !md) return 'DM';
    if (md && !dm) return 'MD';
    return fallback;
  }
  function toISO(v, order) {
    v = String(v || '').trim();
    let m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(v);
    if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
    m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(v);
    if (m) {
      const [a, b] = order === 'DM' ? [m[2], m[1]] : [m[1], m[2]];
      return `${m[3]}-${a.padStart(2, '0')}-${b.padStart(2, '0')}`;
    }
    return '';
  }
  function days(a, b) { // b - a in days
    return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86400000);
  }
  function addDays(iso, n) {
    return new Date(Date.parse(iso + 'T00:00:00Z') + n * 86400000).toISOString().slice(0, 10);
  }

  function parseMessages(text) {
    const out = [];
    String(text || '').split(/\r?\n/).forEach((line, i) => {
      const m = /^\[(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})\]\s+(.*)$/.exec(line.trim());
      if (!m) return;
      const msg = { raw: line.trim(), date: m[1], time: m[2], line: i + 1 };
      let rest = m[3];
      const ch = /^(WHATSAPP|EMAIL|VOICE NOTE|INSTAGRAM DM|WEBSITE FORM|SMS|TEXT|CALL)\b\s*(.*)$/i.exec(rest);
      msg.channel = ch ? ch[1].toLowerCase() : 'other';
      if (msg.channel === 'instagram dm') msg.channel = 'instagram';
      if (msg.channel === 'website form') msg.channel = 'website form';
      rest = ch ? ch[2] : rest;
      const dir = /^(from|to)\s+(.*)$/i.exec(rest);
      msg.direction = dir ? dir[1].toLowerCase() : 'from';
      rest = dir ? dir[2] : rest;
      // sender: "+1 817-555-0184 (Angela): text" | "a@b.com: text" | "@handle: text" | "a@b.com (Name, Biz): text"
      const s = /^(.+?)(?:\s*\(([^)]*)\))?(?:,\s*(\d+:\d{2}))?\s*[.:]\s+(.*)$/.exec(rest);
      let who = rest, label = '', body = '';
      if (s) { who = s[1].trim(); label = (s[2] || '').trim(); body = s[4]; }
      const tr = /Transcript:\s*"?(.*?)"?\s*$/.exec(body);
      if (tr) body = tr[1];
      msg.who = who; msg.label = label; msg.text = body.trim();
      const email = /[\w.+-]+@[\w-]+(\.[\w-]+)+/.exec(who);
      const phone = /\+?[\d][\d\s().-]{8,}\d/.exec(who);
      const handle = /^@([\w.]+)/.exec(who);
      msg.email = email ? email[0].toLowerCase() : '';
      msg.phone = !email && phone ? normPhone(phone[0]) : '';
      msg.handle = handle ? handle[1].toLowerCase() : '';
      msg.broadcast = /all clients|broadcast/i.test(who + ' ' + label);
      const parts = label.split(',').map(x => x.trim()).filter(Boolean);
      msg.person = parts[0] || '';
      msg.business = parts[1] || '';
      out.push(msg);
    });
    return out;
  }

  /* ---------------------------------------------------------------- normalising */

  const FREE_MAIL = /@(gmail|yahoo|hotmail|outlook|icloud|aol|proton|protonmail|live|msn|me|mail)\./i;
  function normPhone(p) {
    const d = String(p || '').replace(/\D/g, '');
    return d.length >= 10 ? d.slice(-10) : '';
  }
  // A business is identified by its email domain label (sullivandental.com and the typo
  // sullivandental.con are the same business). Free-mail addresses identify a person.
  function emailKey(e) {
    e = String(e || '').trim().toLowerCase();
    if (!e || !e.includes('@')) return '';
    if (FREE_MAIL.test(e)) return 'e:' + e;
    const dom = e.split('@')[1].split('.');
    const label = dom.length >= 2 ? dom[dom.length - 2] : dom[0];
    return 'd:' + label;
  }
  const STOP = new Set(['llc', 'pllc', 'inc', 'co', 'the', 'dr', 'dds', 'md', 'and', 'of', 'tx', 'dallas', 'corp', 'ltd', 'company']);
  function normName(s) {
    return String(s || '').toLowerCase().replace(/&/g, ' and ').replace(/['’`]/g, '')
      .replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(t => t && !STOP.has(t)).join(' ');
  }
  const compact = s => normName(s).replace(/ /g, '');
  function firstName(s) { return String(s || '').trim().split(/\s+/)[0].toLowerCase(); }

  /* ---------------------------------------------------------------- union find */

  function UF() {
    const p = new Map();
    const find = x => { if (!p.has(x)) p.set(x, x); let r = x; while (p.get(r) !== r) r = p.get(r); while (p.get(x) !== r) { const n = p.get(x); p.set(x, r); x = n; } return r; };
    return { find, union: (a, b) => { if (a && b) p.set(find(a), find(b)); }, has: x => p.has(x), keys: () => [...p.keys()] };
  }

  /* ---------------------------------------------------------------- loading */

  function load(files) {
    // files: [{name, text}] in upload order; later rows with the same id replace earlier ones.
    const raw = { leads: [], bookings: [], invoices: [], payments: [], board: [], messages: [], team: [], costs: [] };
    const seen = [];
    files.forEach(f => {
      const type = detectType(f.name, f.text);
      seen.push({ name: f.name, type });
      if (!type) return;
      if (type === 'messages') raw.messages.push(...parseMessages(f.text));
      else raw[type].push(...parseCSV(f.text));
    });
    const dedupe = (arr, key) => { const m = new Map(); arr.forEach(r => { const k = key(r); if (k) m.set(k, r); }); return [...m.values()]; };
    raw.leads = dedupe(raw.leads, r => r.lead_id);
    raw.bookings = dedupe(raw.bookings, r => r.booking_id);
    raw.invoices = dedupe(raw.invoices, r => r.invoice_no);
    raw.payments = dedupe(raw.payments, r => r.payment_id);
    raw.board = dedupe(raw.board, r => r.video_id);
    raw.messages = dedupe(raw.messages, r => r.raw);
    raw.team = dedupe(raw.team, r => r.name);
    raw.costs = dedupe(raw.costs, r => r.item);

    const bOrder = slashOrder(raw.bookings.map(r => r.date), 'MD');
    const pOrder = slashOrder(raw.payments.map(r => r.date), 'DM');
    const data = {
      files: seen,
      dateOrders: { bookings: bOrder, payments: pOrder },
      leads: raw.leads.map(r => ({
        id: r.lead_id, created: toISO(r.created, 'MD'), createdAt: r.created, name: r.name, business: r.business,
        email: (r.email || '').toLowerCase(), phone: normPhone(r.phone), source: r.source, firstReply: toISO(r.first_reply, 'MD'), status: r.status,
      })),
      bookings: raw.bookings.map(r => ({
        id: r.booking_id, date: toISO(r.date, bOrder), name: r.client_name, email: (r.email || '').toLowerCase(),
        service: r.service, status: (r.status || '').toLowerCase(), price: money(r.price),
      })).sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id)),
      invoices: raw.invoices.map(r => ({
        id: r.invoice_no, name: r.bill_to, email: (r.email || '').toLowerCase(), issued: toISO(r.issued, 'MD'), due: toISO(r.due, 'MD'),
        amount: money(r.amount), status: (r.status || '').toLowerCase(), memo: r.memo || '',
      })).sort((a, b) => a.issued.localeCompare(b.issued) || a.id.localeCompare(b.id)),
      payments: raw.payments.map(r => ({
        id: r.payment_id, date: toISO(r.date, pOrder), name: r.payer, email: (r.payer_email || '').toLowerCase(),
        amount: money(r.amount), method: r.method, ref: r.reference || '',
      })).sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id)),
      board: raw.board.map(r => ({
        id: r.video_id, name: r.client, title: r.title, editor: r.editor, stage: r.stage, notes: r.notes_on_board || '',
        revisions: +r.revisions || 0, hours: parseFloat(r.editor_hours) || 0, approved: toISO(r.client_approved_on, 'MD'), booking: r.shoot_booking || '',
      })).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })),
      messages: raw.messages.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
      team: raw.team.map(r => ({ name: r.name, role: r.role, joined: toISO(r.joined, 'MD'), rate: money(r.pay) })),
      costs: raw.costs,
    };
    return data;
  }

  /* ---------------------------------------------------------------- identity */

  function isSpamLead(l) {
    if (/^(test|asdf|qwer|xxx)/i.test(l.name) || /test@|a@a\./i.test(l.email)) return true;
    if (!l.phone && !l.business) return true; // no phone, no business: the junk rows in this pack
    return false;
  }

  function resolveIdentities(data) {
    const uf = UF();
    const node = r => emailKey(r.email);
    data.leads.forEach(l => { l.spam = isSpamLead(l); });
    // 1. Self-reported links: a lead row ties its email to its phone.
    data.leads.filter(l => !l.spam).forEach(l => {
      const e = node(l), p = l.phone ? 'p:' + l.phone : '';
      if (e) uf.find(e); if (p) uf.find(p);
      if (e && p) uf.union(e, p);
    });
    // 2. Every email seen anywhere is at least its own identity.
    [...data.bookings, ...data.invoices, ...data.payments].forEach(r => { const e = node(r); if (e) uf.find(e); });
    data.messages.forEach(m => {
      if (m.direction !== 'from') return;
      if (m.email) uf.find(emailKey(m.email));
    });
    // 3. "Our new email is x" messages link old and new addresses.
    data.messages.forEach(m => {
      const nm = /new (?:email|e-mail|address) is\s+([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/i.exec(m.text);
      if (nm && m.email) uf.union(emailKey(m.email), emailKey(nm[1]));
    });

    // Build clusters
    const clusters = new Map();
    const get = key => {
      const r = uf.find(key);
      if (!clusters.has(r)) clusters.set(r, { key: r, emails: new Set(), phones: new Set(), names: new Map(), persons: new Set(), leads: [], bookings: [], invoices: [], payments: [], board: [], messages: [], paidFor: new Set(), paidBy: new Set() });
      return clusters.get(r);
    };
    const addName = (c, n, w = 1) => { if (!n) return; c.names.set(n, (c.names.get(n) || 0) + w); };

    data.leads.filter(l => !l.spam).forEach(l => {
      const c = get(emailKey(l.email) || 'p:' + l.phone);
      c.leads.push(l); c.emails.add(l.email); if (l.phone) c.phones.add(l.phone);
      if (l.name) c.persons.add(l.name);
    });

    // Name index (from leads first; bookings/invoices add to it as they are placed)
    const index = new Map();   // normName -> Set(clusterKey)
    const cindex = new Map();  // compact -> Set(clusterKey)
    const compound = new Set(); // "Tallgrass - Glow" style labels: exact match only, never token scoring
    const addAlias = (name, ck) => {
      const n = normName(name); if (!n) return;
      if (/\s[-–]\s/.test(name)) compound.add(n);
      if (!index.has(n)) index.set(n, new Set()); index.get(n).add(ck);
      const k = n.replace(/ /g, ''); if (!cindex.has(k)) cindex.set(k, new Set()); cindex.get(k).add(ck);
    };
    data.leads.filter(l => !l.spam).forEach(l => {
      const ck = uf.find(emailKey(l.email) || 'p:' + l.phone);
      addAlias(l.business, ck); addAlias(l.name, ck);
    });

    // Name resolver. Returns { key, exact, scores } or null.
    //  1. exact normalized alias  2. same letters without spaces ("Medspa" = "Med Spa")
    //  3. "A - B" labels (agency - client, client - location): resolve the parts
    //  4. scored token overlap: prefixes ("Ins" = Insurance) and initials ("PT" = Physical Therapy)
    function tokenScores(n, ok) {
      const toks = n.split(' ');
      const hitBy = toks.map(() => new Set());
      index.forEach((cks, alias) => {
        if (compound.has(alias)) return;
        const at = alias.split(' ');
        const live = [...cks].filter(ok); if (!live.length) return;
        toks.forEach((t, i) => {
          if (at.some(a => a === t || (t.length >= 3 && a.startsWith(t)) || (a.length >= 4 && t.startsWith(a)))) live.forEach(k => hitBy[i].add(k));
        });
        at.forEach(a => { // initials
          if (a.length < 2 || a.length > 4) return;
          for (let i = 0; i + a.length <= toks.length; i++) {
            if (toks.slice(i, i + a.length).map(t => t[0]).join('') === a) for (let j = i; j < i + a.length; j++) live.forEach(k => hitBy[j].add(k));
          }
        });
      });
      const scores = new Map();
      hitBy.forEach(s => s.forEach(k => scores.set(k, (scores.get(k) || 0) + 1 / s.size)));
      return { scores, ntok: toks.length };
    }
    function resolveName(name, universe, avoid, prefer) {
      const ok = k => (!universe || universe.has(k)) && !(avoid && avoid.has(k));
      const n = normName(name); if (!n) return null;
      const pick = set => [...(set || [])].filter(ok);
      let a = pick(index.get(n));
      if (a.length === 1) return { key: a[0], exact: true };
      if (a.length > 1) return prefer && a.includes(prefer) ? { key: prefer, exact: true } : null;
      a = pick(cindex.get(n.replace(/ /g, '')));
      if (a.length === 1) return { key: a[0], exact: true };
      if (/\s[-–]\s/.test(name)) {
        const parts = name.split(/\s[-–]\s/).map(p => resolveName(p, universe, avoid, prefer)).filter(Boolean);
        let keys = [...new Set(parts.map(p => p.key))].filter(k => !payerOnly.has(k));
        if (keys.length === 1) return { key: keys[0], exact: parts.find(p => p.key === keys[0]).exact };
        if (prefer && keys.includes(prefer)) return { key: prefer, exact: true };
        const ex = parts.filter(p => p.exact && keys.includes(p.key));
        if (ex.length === 1) return ex[0];
      }
      const { scores, ntok } = tokenScores(n, ok);
      const ranked = [...scores.entries()].sort((x, y) => y[1] - x[1]);
      if (!ranked.length) return null;
      if (prefer && scores.has(prefer)) return { key: prefer, exact: false, scores };
      const [top, second] = ranked;
      if (top[1] >= 0.5 && (!second || top[1] >= 1.5 * second[1])) return { key: top[0], exact: false, scores };
      return null;
    }
    const payerOnly = new Set();

    // Bookings: email says who booked; the name says who the work is for. If the name clearly
    // points at a different business (an agency booking for its client), the name wins.
    const overrides = [];
    data.bookings.forEach(b => {
      const ek = b.email ? uf.find(emailKey(b.email)) : null;
      let ck = ek;
      const r = resolveName(b.name, null, null, ek);
      const byName = r && r.key;
      // Only override the email when the name has nothing in common with the email's business.
      const emailAlsoFits = r && r.scores && r.scores.has(ek);
      if (byName && ek && byName !== ek && !emailAlsoFits) {
        overrides.push({ booking: b.id, name: b.name, emailCluster: ek, nameCluster: byName });
        ck = byName;
        get(ek).paidFor.add(byName);
      }
      if (!ck) ck = byName;
      if (!ck) return;
      b.client = ck;
      const c = get(ck); c.bookings.push(b); addName(c, b.name);
      if (ck === ek && b.email) c.emails.add(b.email);
      addAlias(b.name, ck);
    });

    // Invoices are billed to whoever pays. A memo "B041" ties the invoice to a booking (and its client).
    const bookingById = new Map(data.bookings.map(b => [b.id, b]));
    data.invoices.forEach(inv => {
      const ek = inv.email ? uf.find(emailKey(inv.email)) : ((resolveName(inv.name) || {}).key || null);
      inv.payer = ek;
      const m = /\b(B\d{3,})\b/.exec(inv.memo);
      inv.bookingRef = m ? m[1] : '';
      const bk = inv.bookingRef && bookingById.get(inv.bookingRef);
      inv.client = bk && bk.client ? bk.client : ek;
      if (inv.client !== inv.payer && inv.payer) { get(inv.payer).paidFor.add(inv.client); }
      const c = get(inv.payer || inv.client); c.invoices.push(inv); addName(c, inv.name, 0.5);
      if (inv.email) c.emails.add(inv.email);
      if (inv.payer === inv.client) addAlias(inv.name, inv.payer);
    });

    // A payer-only cluster: it is billed / pays, but no work is ever done for it.
    clusters.forEach((c, k) => { if (!c.bookings.length && (c.invoices.length || c.payments.length) && c.paidFor.size) payerOnly.add(k); });

    data.payments.forEach(p => {
      let ck = p.email ? uf.find(emailKey(p.email)) : null;
      if (!ck) ck = (resolveName(p.name, clientKeys()) || {}).key || null;
      p.payer = ck;
      if (!ck) return;
      const c = get(ck); c.payments.push(p);
      if (p.email) c.emails.add(p.email);
      if (p.name && !p.email) c.persons.add(p.name);
    });
    function clientKeys() { return new Set([...clusters.entries()].filter(([, c]) => c.bookings.length).map(([k]) => k)); }

    // Board: only a client name. Resolve against clients (businesses with bookings).
    const clientSet = clientKeys();
    const boardUnresolved = [];
    const bkClient = new Map(data.bookings.map(b => [b.id, b.client]));
    data.board.forEach(v => {
      const viaBooking = v.booking && bkClient.get(v.booking);
      let ck = (resolveName(v.name, clientSet, payerOnly, viaBooking) || {}).key || null;
      if (!ck && viaBooking) ck = viaBooking;
      v.client = ck;
      v.bookingClient = viaBooking || null;
      if (!ck) { boardUnresolved.push(v); return; }
      const c = get(ck); c.board.push(v); addName(c, v.name, 0.25);
    });

    // Phone index from leads, for WhatsApp/voice notes
    const phoneIdx = new Map();
    clusters.forEach((c, k) => c.phones.forEach(p => phoneIdx.set(p, k)));
    const compactAliases = [];
    clusters.forEach((c, k) => { if (clientSet.has(k)) c.names.forEach((_, n) => compactAliases.push([compact(n), k])); });
    clusters.forEach((c, k) => { if (clientSet.has(k)) c.leads.forEach(l => compactAliases.push([compact(l.business), k])); });

    function resolveHandle(h) {
      h = h.replace(/[^a-z0-9]/g, '');
      let best = null, bestLen = 0, tie = false;
      compactAliases.forEach(([a, k]) => {
        if (!a) return;
        let i = 0; while (i < a.length && i < h.length && a[i] === h[i]) i++;
        const need = Math.max(6, Math.floor(0.75 * Math.min(a.length, h.length)));
        if (i >= need) { if (i > bestLen) { best = k; bestLen = i; tie = false; } else if (i === bestLen && k !== best) tie = true; }
      });
      return tie ? null : best;
    }

    const msgFlags = [];
    data.messages.forEach(m => {
      if (m.direction !== 'from' || m.broadcast) {
        if (m.email) m.client = uf.has(emailKey(m.email)) ? uf.find(emailKey(m.email)) : null;
        else if (m.handle) m.client = resolveHandle(m.handle);
        if (m.client) get(m.client).messages.push(m);
        return;
      }
      let ck = null, how = '';
      if (m.email) { ck = uf.find(emailKey(m.email)); how = 'email'; }
      else if (m.phone) { ck = phoneIdx.get(m.phone) || null; how = 'phone'; }
      else if (m.handle) { ck = resolveHandle(m.handle); how = 'instagram handle'; }
      // Sanity check: phone matched, but the first name the message shows is not anyone at that
      // business, or the business is not a client. Fall back to the first name among clients.
      if (how === 'phone' && m.person) {
        const c = ck && clusters.get(ck);
        const known = c ? [...c.persons].map(firstName) : [];
        if (!c || !clientSet.has(ck) || (known.length && !known.includes(firstName(m.person)))) {
          const cands = [...clientSet].filter(k => [...clusters.get(k).persons].some(p => firstName(p) === firstName(m.person)));
          if (cands.length === 1 && cands[0] !== ck) {
            msgFlags.push({ msg: m, phoneCluster: ck, nameCluster: cands[0], note: `Phone ${m.phone} belongs to ${c ? displayName(c) : 'nobody we know'}, but the sender signs as ${m.person}. Matched by name instead.` });
            ck = cands[0]; how = 'first name (phone did not match)';
          } else if (cands.length > 1 && (!c || !clientSet.has(ck))) {
            m.candidates = cands; ck = null; how = 'ambiguous first name';
          }
        }
      }
      m.client = ck; m.how = how;
      if (ck) get(ck).messages.push(m);
    });

    function displayName(c) {
      // Prefer a business name (not a person's name) used most often across files.
      const persons = new Set([...c.persons].map(normName));
      const leadBiz = c.leads.map(l => l.business).filter(Boolean);
      const cands = [...c.names.entries()].filter(([n]) => !persons.has(normName(n)) && !/^dr\.?\s/i.test(n) && !/\bdds\b/i.test(n));
      leadBiz.forEach(b => { if (!persons.has(normName(b))) cands.push([b, 0.75]); });
      if (!cands.length) return leadBiz[0] || [...c.names.keys()][0] || [...c.persons][0] || [...c.emails][0] || c.key;
      // The business's own name from its lead form, in its fullest spelling seen anywhere.
      const own = leadBiz.filter(b => !persons.has(normName(b)) && !/^dr\.?\s/i.test(b)).map(b => compact(b.split(/\s[-–]\s/)[0]));
      if (own.length) {
        const longer = cands.map(([n]) => n.split(/\s[-–]\s/)[0].trim()).filter(n => own.some(o => compact(n).startsWith(o)));
        if (longer.length) return longer.sort((a, b) => b.length - a.length)[0];
      }
      // merge counts by normalized name, keep the longest spelling as label
      const agg = new Map();
      cands.forEach(([n, w]) => {
        const base = n.split(/\s[-–]\s/)[0].trim();
        const k = normName(base);
        const a = agg.get(k) || { w: 0, label: base }; a.w += w;
        if (base.length > a.label.length) a.label = base;
        agg.set(k, a);
      });
      const best = [...agg.values()].sort((a, b) => b.w - a.w || b.label.length - a.label.length)[0];
      return best.label;
    }

    clusters.forEach(c => { c.name = displayName(c); });
    return { clusters, uf, resolveName, overrides, boardUnresolved, msgFlags, payerOnly, clientSet, emailKey };
  }

  /* ---------------------------------------------------------------- money */

  const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  function monthFromText(t, year) {
    const m = new RegExp('\\b(' + MONTHS.map(x => x.slice(0, 3)).join('|') + ')[a-z]*\\b', 'i').exec(t || '');
    if (!m) return '';
    const i = MONTHS.findIndex(x => x.startsWith(m[1].toLowerCase()));
    return `${year}-${String(i + 1).padStart(2, '0')}`;
  }
  const isRetainerInv = inv => /retainer/i.test(inv.memo);
  const isRetainerBooking = b => /retainer/i.test(b.service);

  function reconcile(data, id, today) {
    const C = id.clusters;
    const inv = data.invoices.filter(i => i.status !== 'void');
    const voided = data.invoices.filter(i => i.status === 'void');
    const byId = new Map(inv.map(i => [i.id, i]));
    inv.forEach(i => { i.paid = 0; i.payments = []; });
    const credits = []; // money we hold that no invoice explains
    const notes = [];
    data.payments.forEach(p => { p.left = p.amount; p.applied = []; });
    const apply = (p, i, amt, how) => {
      amt = Math.min(amt, p.left, i.amount - i.paid); if (amt <= 0) return 0;
      i.paid += amt; p.left -= amt; i.payments.push({ id: p.id, amount: amt, date: p.date, how }); p.applied.push({ inv: i.id, amount: amt, how });
      return amt;
    };
    const openOf = (payer, before) => inv.filter(i => i.payer === payer && i.amount - i.paid > 0.001 && (!before || i.issued <= before));

    // pass 1: explicit invoice number in the reference
    data.payments.forEach(p => {
      const refs = (p.ref.match(/INV-\d+/gi) || []).map(r => r.toUpperCase());
      refs.forEach(r => {
        const i = byId.get(r);
        if (!i) { notes.push({ type: 'unknown_ref', payment: p.id, ref: r }); return; }
        if (i.amount - i.paid <= 0.001) { notes.push({ type: 'double_paid', payment: p.id, invoice: r }); return; }
        apply(p, i, p.left, 'reference');
      });
    });
    // pass 2: "Jul invoices" / "august sessions": the payer's open invoices issued that month
    data.payments.forEach(p => {
      if (p.left <= 0.001 || /INV-\d+/i.test(p.ref)) return;
      const mon = monthFromText(p.ref, p.date.slice(0, 4));
      if (!mon) return;
      openOf(p.payer).filter(i => i.issued.slice(0, 7) === mon).forEach(i => apply(p, i, p.left, `memo "${p.ref}"`));
    });
    // pass 3: no reference. Same payer: an open invoice with exactly this amount (oldest first,
    // issued up to 7 days after the payment for prepaid shoots), else the oldest open invoice.
    data.payments.forEach(p => {
      if (p.left <= 0.001) return;
      if (/INV-\d+/i.test(p.ref) && p.applied.length) return;
      const open = openOf(p.payer, addDays(p.date, 7));
      const exact = open.find(i => Math.abs((i.amount - i.paid) - p.left) < 0.01);
      if (exact) { apply(p, exact, p.left, 'amount match'); return; }
      open.forEach(i => { if (p.left > 0.001) apply(p, i, p.left, 'oldest open invoice'); });
    });
    data.payments.forEach(p => { if (p.left > 0.001) credits.push({ payment: p, amount: p.left }); });

    inv.forEach(i => {
      i.owed = Math.round((i.amount - i.paid) * 100) / 100;
      i.truth = i.owed <= 0.001 ? 'paid' : (i.paid > 0 ? 'partial' : 'unpaid');
      i.daysLate = i.owed > 0 && i.due && i.due < today ? days(i.due, today) : 0;
    });

    /* ---- invoices <-> bookings */
    const bookings = data.bookings;
    bookings.forEach(b => { b.invoices = []; });
    inv.forEach(i => { i.bookings = []; });
    const link = (i, b, how) => { i.bookings.push(b.id); b.invoices.push({ id: i.id, how }); i.linkHow = how; };
    const bById = new Map(bookings.map(b => [b.id, b]));
    // a) memo "B041"
    inv.forEach(i => { if (i.bookingRef && bById.has(i.bookingRef)) link(i, bById.get(i.bookingRef), 'memo booking id'); });
    // b) memo "Reels Pack 7/16": same client, that date
    inv.forEach(i => {
      if (i.bookings.length || isRetainerInv(i)) return;
      const m = /(\d{1,2})\/(\d{1,2})\s*$/.exec(i.memo);
      if (!m) return;
      const d = `${i.issued.slice(0, 4)}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`;
      const forWho = new Set([i.payer, i.client, ...((C.get(i.payer) || {}).paidFor || [])]);
      const b = bookings.find(b => b.date === d && forWho.has(b.client) && !b.invoices.length && !isRetainerBooking(b));
      if (b) link(i, b, 'memo date');
    });
    // c) same client + same price, booking within 7 days before .. 14 days after? -> closest
    inv.forEach(i => {
      if (i.bookings.length || isRetainerInv(i)) return;
      const forWho = new Set([i.payer, i.client, ...((C.get(i.payer) || {}).paidFor || [])]);
      const cands = bookings.filter(b => forWho.has(b.client) && !b.invoices.length && !isRetainerBooking(b) && Math.abs(b.price - i.amount) < 0.01)
        .map(b => ({ b, gap: days(b.date, i.issued) })).filter(x => x.gap >= -7 && x.gap <= 21)
        .sort((x, y) => Math.abs(x.gap) - Math.abs(y.gap) || (y.gap - x.gap));
      if (cands.length) link(i, cands[0].b, 'same client, price and date');
    });

    // retainers: one invoice per client per month
    const retainerInv = new Map(); // client|YYYY-MM -> [inv]
    inv.filter(isRetainerInv).forEach(i => {
      const mon = monthFromText(i.memo, i.issued.slice(0, 4)) || i.issued.slice(0, 7);
      i.retainerMonth = mon;
      const k = i.client + '|' + mon; if (!retainerInv.has(k)) retainerInv.set(k, []); retainerInv.get(k).push(i);
    });
    const retainerRate = new Map();
    inv.filter(isRetainerInv).forEach(i => { const a = retainerRate.get(i.client) || []; a.push(i.amount); retainerRate.set(i.client, a); });
    const mode = a => { const m = new Map(); a.forEach(x => m.set(x, (m.get(x) || 0) + 1)); return [...m].sort((x, y) => y[1] - x[1])[0][0]; };

    /* ---- findings */
    const neverBilled = [];
    bookings.forEach(b => {
      if (b.status !== 'completed') return;
      if (isRetainerBooking(b)) {
        const mon = b.date.slice(0, 7);
        if (!retainerInv.has(b.client + '|' + mon)) {
          const rate = retainerRate.has(b.client) ? mode(retainerRate.get(b.client)) : 0;
          if (!neverBilled.some(n => n.client === b.client && n.month === mon))
            neverBilled.push({ client: b.client, month: mon, bookings: [b.id], amount: rate, why: `Retainer shoot ${b.id} on ${b.date}, but no "Monthly retainer" invoice for ${mon}.` });
          else neverBilled.find(n => n.client === b.client && n.month === mon).bookings.push(b.id);
        }
        return;
      }
      if (b.price > 0 && !b.invoices.length) neverBilled.push({ client: b.client, booking: b.id, date: b.date, amount: b.price, why: `${b.service} on ${b.date} was completed, but no invoice matches it.` });
    });

    const toolWrong = [];
    inv.forEach(i => {
      const tool = i.status;
      if (tool !== i.truth) {
        const pays = i.payments.map(p => `${p.id} ($${p.amount}, ${p.date}, ${p.how})`).join('; ');
        toolWrong.push({ invoice: i.id, client: i.client, kind: 'status', tool_says: tool, truth: i.truth + (i.owed > 0 ? ` ($${i.owed} still owed)` : ''),
          how: i.truth === 'paid' ? `Bank shows ${pays}.` : (i.paid > 0 ? `Bank shows only ${pays}.` : 'No payment in the bank matches this invoice (by reference, month memo, or amount).') });
      }
      i.bookings.forEach(bid => {
        const b = bById.get(bid);
        if (b.status === 'cancelled') toolWrong.push({ invoice: i.id, client: i.client, kind: 'cancelled', tool_says: `billed $${i.amount} for ${b.id}`, truth: `${b.id} was cancelled`, how: `bookings.csv marks ${b.id} (${b.date}) cancelled.` });
        else if (b.price > 0 && Math.abs(b.price - i.amount) > 0.01) toolWrong.push({ invoice: i.id, client: i.client, kind: 'amount', tool_says: `$${i.amount}`, truth: `$${b.price}`, how: `Booking ${b.id} price is $${b.price}.` });
      });
      if (isRetainerInv(i) && retainerRate.has(i.client)) {
        const rate = mode(retainerRate.get(i.client));
        if (Math.abs(rate - i.amount) > 0.01) toolWrong.push({ invoice: i.id, client: i.client, kind: 'amount', tool_says: `$${i.amount}`, truth: `$${rate}`, how: `Every other retainer invoice for this client is $${rate}.` });
      }
    });
    // same booking billed twice
    bookings.forEach(b => { if (b.invoices.length > 1) toolWrong.push({ invoice: b.invoices.map(x => x.id).join(' + '), client: b.client, kind: 'duplicate', tool_says: `${b.invoices.length} invoices`, truth: `one booking (${b.id})`, how: 'Both invoices point at the same booking.' }); });

    const overdue = inv.filter(i => i.daysLate > 0).sort((a, b) => b.daysLate - a.daysLate);
    return { invoices: inv, voided, credits, notes, neverBilled, toolWrong, overdue, retainerInv };
  }

  /* ---------------------------------------------------------------- messages */

  // Edit requests: what clients ask, and the short note an editor would write on the board for it.
  const EDIT_TYPES = [
    { key: 'stumble', label: 'Cut stumble', re: /stumble/i, note: /stumble/i },
    { key: 'spelling', label: 'Fix name spelling', re: /spell/i, note: /spell/i },
    { key: 'phone', label: 'Phone number end card', re: /phone number at the end|number at the end|end card/i, note: /phone|end card/i },
    { key: 'prices', label: 'Remove prices part', re: /talk about prices|remove.*price|take out.*price/i, note: /price/i },
    { key: 'calmer', label: 'Calmer music', re: /calmer (song|music)|too hype/i, note: /calmer/i },
    { key: 'music', label: 'Music lower', re: /music.*too loud|too loud|lower the music/i, note: /music lower|lower music|music down/i },
    { key: 'captions', label: 'Captions bigger', re: /captions bigger|bigger captions|subt[ií]tulos m[aá]s grandes|captions.*hard to read/i, note: /caption/i },
    { key: 'first3', label: 'Cut first 3 sec', re: /first 3 seconds|first three seconds|starts slow/i, note: /first 3|first three/i },
    { key: 'brand', label: 'Brand color', re: /brand colou?r/i, note: /brand colou?r/i, param: /brand colou?r ([a-z ]+?)(?:,| not|\.|$)/i },
    { key: 'walkins', label: 'Add walk-ins welcome', re: /walk-?ins welcome/i, note: /walk-?ins/i },
    { key: 'outside', label: 'Use outside shot', re: /other shot|one outside|outside shot/i, note: /outside/i },
    { key: 'blur', label: 'Blur client face', re: /blur/i, note: /blur/i },
    { key: 'redo', label: 'New song and new intro', re: /changed (our|my) mind|different song|new intro/i, note: /intro|song/i },
  ];
  const FOLLOWUP = /did anyone see|not fixed|still has the same problem|already told you|second time i ask|still wrong|again\. i asked/i;
  const CATS = [
    ['spam', /followers|crypto|rank #?1|free audit|domain expires|final notice|partnership offer|10x guaranteed|run your ads for free/i],
    ['churn', /\bpaus(e|ing)\b|whether we continue|talk about (our|the) contract|cancel (our|the|my) (contract|retainer|account|plan|videos)|(stop|end) (our|the) (videos|contract|retainer|work)|not (going to )?renew|another (agency|studio)|last month with you|not happy|nothing personal/i],
    ['payment', /cash is tight|pay (the|once|later)|sent half|rest when|accounting will handle|invoice|we already paid/i],
    ['referral', /my friend|my cousin|gave her your number|she'?ll reach out|he needs videos|call him/i],
    ['upsell', /every month\?|what would that cost|short clips|how much for|package where/i],
    ['schedule', /cancel today|move it|move to|running \d+ ?min|see you tomorrow|parking|bring anything|reschedul/i],
    ['info', /new (office )?number|new email|is now [A-Z]|full name|please use this one/i],
    ['praise', /best content team|great session|thank you|turned out great|love it|sales went up|use this as a review|new cases came|new patients mention|loved our reels/i],
    ['approval', /approved|looks great/i],
  ];
  function classify(m) {
    if (m.direction === 'to' || m.broadcast) return { cat: 'outbound' };
    const t = m.text;
    if (FOLLOWUP.test(t)) return { cat: 'followup' };
    for (const [cat, re] of CATS.slice(0, 2)) if (re.test(t)) return { cat };
    const et = EDIT_TYPES.find(e => e.re.test(t));
    if (et) {
      const p = et.param && et.param.exec(t);
      return { cat: 'edit', edit: et.key, editLabel: et.label + (p ? ' ' + p[1].trim().toLowerCase() : ''), param: p ? p[1].trim().toLowerCase() : '' };
    }
    for (const [cat, re] of CATS.slice(2)) if (re.test(t)) return { cat };
    return { cat: 'other' };
  }

  function analyzeRequests(data, id) {
    const C = id.clusters;
    const bById = new Map(data.bookings.map(b => [b.id, b]));
    // date for each board row: its shoot date, or the nearest earlier row of the same client that has one
    const rowsBy = new Map();
    data.board.forEach(v => { if (!v.client) return; if (!rowsBy.has(v.client)) rowsBy.set(v.client, []); rowsBy.get(v.client).push(v); });
    rowsBy.forEach(rows => {
      let last = '';
      rows.forEach(v => { const b = bById.get(v.booking); if (b) last = b.date; v.shootDate = b ? b.date : last; v.dateGuessed = !b; });
      // rows before the first linked row: take the next linked date
      let next = ''; for (let i = rows.length - 1; i >= 0; i--) { if (!rows[i].dateGuessed) next = rows[i].shootDate; else if (!rows[i].shootDate) rows[i].shootDate = next; }
    });
    data.board.forEach(v => { v.requests = []; });

    const requests = [];
    data.messages.forEach(m => {
      Object.assign(m, classify(m));
      if (m.cat !== 'edit' && m.cat !== 'followup') return;
      const rows = rowsBy.get(m.client) || [];
      // quoted text is the line to add ('walk-ins welcome'), not the video's title
      const text = m.text.toLowerCase().replace(/'[^']*'|"[^"]*"/g, ' ');
      // which video? 1) a board title quoted in the message
      let titleRows = [];
      let bestLen = 0;
      rows.forEach(v => {
        const t = v.title.toLowerCase();
        if (t.length > 3 && text.includes(t)) { if (t.length > bestLen) { bestLen = t.length; titleRows = [v]; } else if (t.length === bestLen) titleRows.push(v); }
      });
      let target = null, how = '', vague = false;
      const before = titleRows.filter(v => v.shootDate && v.shootDate < m.date);
      if (titleRows.length) {
        target = (before.length ? before[before.length - 1] : titleRows[0]); how = 'title in message';
      } else if (/one we shot last week|last week'?s|the last (shoot|batch)/i.test(text)) {
        vague = true;
        const shoots = (C.get(m.client) ? C.get(m.client).bookings : []).filter(b => b.status === 'completed' && b.date < m.date && days(b.date, m.date) <= 21 && rows.some(v => v.booking === b.id));
        const shoot = shoots[shoots.length - 1];
        if (shoot) {
          const vids = rows.filter(v => v.booking === shoot.id);
          m.vagueShoot = shoot.id; m.vagueCandidates = vids.map(v => v.id);
          // the board holds one note per video: a video that already has a different note was
          // tracked for something else, so prefer empty-note videos, then the most-revised one
          target = vids.find(v => noteMatches(v, m)) || vids.slice().sort((a, b) => (!!a.notes - !!b.notes) || b.revisions - a.revisions || a.id.localeCompare(b.id))[0];
          how = `"the one we shot last week" = ${shoot.id} (${shoot.date}); ${vids.length} videos from that shoot`;
        }
      }
      // if another row of the same title carries the right note, it was captured there
      if (m.cat === 'edit' && target && !noteMatches(target, m)) {
        const alt = titleRows.find(v => noteMatches(v, m));
        if (alt) target = alt;
      }
      m.video = target ? target.id : '';
      m.videoHow = how; m.vague = vague;
      m.titleKey = titleRows.length ? titleRows[0].title.toLowerCase() : '';
      if (m.cat === 'edit') {
        const captured = !!(target && noteMatches(target, m));
        const r = { msg: m, video: m.video, client: m.client, date: m.date, channel: m.channel, edit: m.edit, label: m.editLabel, captured, vague, how,
          afterApproval: m.edit === 'redo', title: target ? target.title : '' };
        requests.push(r);
      }
    });
    const vById = new Map(data.board.map(v => [v.id, v]));

    // standing instructions ("always say the full name") are requests about every future video
    data.messages.filter(m => m.cat === 'info' && /full name|always (say|use|write)/i.test(m.text)).forEach(m => {
      requests.push({ msg: m, video: '', client: m.client, date: m.date, channel: m.channel, edit: 'standing', label: 'Standing instruction: ' + (m.text.split(/(?<=[.!?])\s+/).find(x => /full name|always/i.test(x)) || m.text).replace(/[.!]$/, ''), captured: false, standing: true, how: 'applies to all future videos', title: '' });
    });
    requests.sort((a, b) => (a.date + a.msg.time).localeCompare(b.date + b.msg.time));

    // follow-ups: tie each to the request it chases (same video title, or the vague request whose
    // shoot contains a video with that title, which also tells us which video the vague one meant)
    const followups = data.messages.filter(m => m.cat === 'followup');
    followups.forEach(f => {
      const mine = requests.filter(r => r.client === f.client && r.date <= f.date && !r.afterApproval);
      let prev = null;
      if (f.titleKey) {
        prev = mine.filter(r => r.title.toLowerCase() === f.titleKey).pop();
        const vagueHit = mine.filter(r => r.vague && r.msg.vagueCandidates && r.msg.vagueCandidates.some(id => vById.get(id).title.toLowerCase() === f.titleKey)).pop();
        if (vagueHit && (!prev || vagueHit.date > prev.date)) {
          const v = vagueHit.msg.vagueCandidates.map(id => vById.get(id)).find(v => v.title.toLowerCase() === f.titleKey);
          vagueHit.video = v.id; vagueHit.title = v.title; vagueHit.how += `; follow-up on ${f.date} names "${v.title}"`;
          vagueHit.captured = noteMatches(v, vagueHit.msg);
          prev = vagueHit;
        }
        if (!prev) prev = mine.filter(r => r.title.toLowerCase() === f.titleKey && r.afterApproval === undefined).pop() || null;
      } else {
        prev = mine.filter(r => r.standing).pop() || null;
      }
      f.chases = prev;
      if (prev) { prev.followedUp = (prev.followedUp || 0) + 1; prev.followups = (prev.followups || []).concat(f); }
    });
    requests.forEach(r => { const v = r.video && vById.get(r.video); if (v) v.requests.push(r); });

    const lost = requests.filter(r => !r.captured && !r.afterApproval);
    const changes = requests.filter(r => r.afterApproval);
    return { requests, lost, changes, followups };
  }

  function lostStats(R) {
    const real = R.requests.filter(r => !r.afterApproval && !r.standing);
    const by = key => {
      const m = new Map();
      real.forEach(r => { const k = key(r); const a = m.get(k) || { total: 0, lost: 0 }; a.total++; if (!r.captured) a.lost++; m.set(k, a); });
      return [...m.entries()].map(([k, a]) => ({ key: k, total: a.total, lost: a.lost, rate: a.total ? a.lost / a.total : 0 })).sort((a, b) => String(a.key).localeCompare(String(b.key)));
    };
    return {
      byChannel: by(r => r.channel),
      byMonth: by(r => r.date.slice(0, 7)),
      byVague: by(r => r.vague ? 'vague ("the one we shot last week")' : 'names the video'),
      byMonthChannel: by(r => r.date.slice(0, 7) + ' ' + r.channel),
    };
  }

  /* ---------------------------------------------------------------- leads, churn, channels */

  function analyzeLeads(data, id, today) {
    const C = id.clusters;
    const firstBooking = k => { const c = C.get(k); return c && c.bookings.length ? c.bookings[0].date : ''; };
    const out = data.leads.map(l => {
      const k = id.uf.has(emailKey(l.email)) ? id.uf.find(emailKey(l.email)) : (l.phone && id.uf.has('p:' + l.phone) ? id.uf.find('p:' + l.phone) : null);
      const fb = k ? firstBooking(k) : '';
      const existing = !!(fb && fb < l.created);
      const replyDays = l.firstReply ? days(l.created, l.firstReply) : null;
      return { ...l, cluster: k, existingClient: existing, clientName: existing ? C.get(k).name : '', replyDays, waiting: !l.firstReply && !l.spam ? days(l.created, today) : 0 };
    });
    const neverReplied = out.filter(l => !l.spam && !l.firstReply);
    // win rate by reply speed (real prospects only)
    const prospects = out.filter(l => !l.spam && !l.existingClient && /won|lost/i.test(l.status));
    const bucket = d => d == null ? 'no reply' : d === 0 ? 'same day' : d === 1 ? 'next day' : d <= 3 ? '2-3 days' : '4+ days';
    const speed = new Map();
    prospects.forEach(l => { const b = bucket(l.replyDays); const a = speed.get(b) || { won: 0, total: 0 }; a.total++; if (/won/i.test(l.status)) a.won++; speed.set(b, a); });
    // referrals that never became a lead row
    const offBook = data.messages.filter(m => m.cat === 'referral' || m.cat === 'upsell').map(m => {
      const phone = /(\d{3})[-. ]?(\d{3})[-. ]?(\d{4})/.exec(m.text);
      const name = /(?:cousin|friend)\s+(?:Dr\.\s+)?([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/.exec(m.text);
      const ph = phone ? normPhone(phone[0]) : '';
      const inLeads = ph ? data.leads.some(l => l.phone === ph) : false;
      return { msg: m, phone: ph, name: name ? name[1] : '', inLeads };
    });
    return { leads: out, neverReplied, speed: [...speed.entries()].map(([k, v]) => ({ bucket: k, ...v, rate: v.won / v.total })), offBook };
  }

  function studioHours(b) {
    const m = /(\d+)\s*hr/i.exec(b.service);
    if (m) return +m[1];
    if (/content day/i.test(b.service)) return 6;
    if (/reels/i.test(b.service)) return 3;
    if (/retainer/i.test(b.service)) return 4;
    return 0;
  }

  function profitability(data, id, money) {
    const C = id.clusters;
    const studioRate = (() => { const s = data.costs.find(c => /studio/i.test(c.item)); return s ? (money_(s.cost) || 40) : 40; })();
    function money_(v) { return parseFloat(String(v).replace(/[^0-9.]/g, '')) || 0; }
    const rate = new Map(data.team.map(t => [t.name.toLowerCase(), t.rate]));
    const rows = [];
    id.clientSet.forEach(k => {
      const c = C.get(k);
      const done = c.bookings.filter(b => b.status === 'completed');
      const workRevenue = done.filter(b => !/retainer/i.test(b.service)).reduce((s, b) => s + b.price, 0);
      const months = new Set(done.filter(b => /retainer/i.test(b.service)).map(b => b.date.slice(0, 7)));
      const retInv = money.invoices.filter(i => i.client === k && /retainer/i.test(i.memo));
      const retRate = retInv.length ? retInv.map(i => i.amount).sort((a, b) => b - a)[0] : 0;
      const retainerRevenue = months.size * retRate;
      const revenue = workRevenue + retainerRevenue;
      const studio = done.reduce((s, b) => s + studioHours(b), 0) * studioRate;
      const editHours = c.board.reduce((s, v) => s + v.hours, 0);
      const editor = c.board.reduce((s, v) => s + v.hours * (rate.get(String(v.editor).toLowerCase()) || 0), 0);
      const lead = c.leads.filter(l => /won/i.test(l.status)).sort((a, b) => a.created.localeCompare(b.created))[0] || c.leads[0];
      const revisions = c.board.reduce((s, v) => s + v.revisions, 0);
      rows.push({ client: k, name: c.name, source: lead ? lead.source : 'unknown', firstLead: lead ? lead.id : '', revenue, studio, editor, editHours, profit: revenue - studio - editor, videos: c.board.length, revisions, bookings: done.length, months: months.size });
    });
    const by = new Map();
    rows.forEach(r => { const a = by.get(r.source) || { source: r.source, clients: 0, revenue: 0, profit: 0, names: [] }; a.clients++; a.revenue += r.revenue; a.profit += r.profit; a.names.push(r.name); by.set(r.source, a); });
    const channels = [...by.values()].map(a => ({ ...a, profitPerClient: a.profit / a.clients })).sort((a, b) => b.profit - a.profit);
    return { rows: rows.sort((a, b) => b.profit - a.profit), channels, studioRate };
  }

  function churnRisk(data, id, R, money, today) {
    const C = id.clusters;
    const out = [];
    id.clientSet.forEach(k => {
      const c = C.get(k);
      const msgs = c.messages.filter(m => m.direction === 'from');
      const lost = R.lost.filter(r => r.client === k);
      const fups = R.followups.filter(f => f.client === k);
      const churnMsgs = msgs.filter(m => m.cat === 'churn');
      const angry = msgs.filter(m => /frustrated|not happy|second time|already told/i.test(m.text));
      const overdue = money.overdue.filter(i => i.client === k || i.payer === k);
      const last = c.bookings.filter(b => b.status === 'completed').map(b => b.date).sort().pop() || '';
      const upcoming = c.bookings.filter(b => b.status === 'upcoming').length;
      const recent = d => d >= addDays(today, -45);
      let score = 0; const evidence = [];
      churnMsgs.forEach(m => { score += recent(m.date) ? 10 : 4; evidence.push(`${m.date} ${m.channel}: "${m.text}"`); });
      const openLost = lost.filter(r => recent(r.date));
      if (lost.length) { score += lost.length + openLost.length; evidence.push(`${lost.length} edit requests never reached the board (${openLost.length} in the last 45 days)`); }
      if (fups.length) { score += fups.length; evidence.push(`${fups.length} "did anyone see my message / still not fixed" follow-ups`); }
      angry.filter(m => recent(m.date)).forEach(m => { score += 2; });
      if (overdue.length) { score += 2; evidence.push(`Unpaid: ${overdue.map(i => `${i.id} $${i.owed} (${i.daysLate} days late)`).join(', ')}`); }
      if (!upcoming && last && days(last, today) > 35) { score += 3; evidence.push(`No shoot since ${last} and nothing booked`); }
      const unanswered = msgs.filter(m => m.cat === 'churn' && !c.messages.some(o => o.direction === 'to' && o.date >= m.date));
      if (unanswered.length) evidence.push(`No reply from us on record to: ${unanswered.map(m => m.date).join(', ')}`);
      const gone = churnMsgs.some(m => /pause|cancel/i.test(m.text)) && !upcoming && days(last || today, today) > 30;
      const risk = !gone && (score >= 15 || churnMsgs.some(m => m.date >= addDays(today, -30)));
      out.push({ client: k, name: c.name, score, evidence, lost: lost.length, followups: fups.length, last, upcoming, gone, risk });
    });
    return out.sort((a, b) => b.score - a.score);
  }

  // Did the board note on this video record this request?
  function noteMatches(v, m) {
    const et = EDIT_TYPES.find(e => e.key === m.edit);
    if (!et || !v.notes) return false;
    if (!et.note.test(v.notes)) return false;
    if (m.param && !v.notes.toLowerCase().includes(m.param)) return false;
    return true;
  }

  /* ---------------------------------------------------------------- everything + suggestions */

  const fmtPhone = p => p && p.length === 10 ? `${p.slice(0, 3)}-${p.slice(3, 6)}-${p.slice(6)}` : p;
  const usd = n => '$' + Math.round(n).toLocaleString('en-US');

  // "today" = the latest real activity in the files (not upcoming bookings), so new uploads move it forward.
  function dataToday(data) {
    const ds = [];
    data.messages.forEach(m => ds.push(m.date));
    data.payments.forEach(p => ds.push(p.date));
    data.invoices.forEach(i => ds.push(i.issued));
    data.leads.forEach(l => ds.push(l.created));
    data.bookings.filter(b => b.status !== 'upcoming').forEach(b => ds.push(b.date));
    return ds.filter(Boolean).sort().pop() || new Date().toISOString().slice(0, 10);
  }

  function run(files, opts) {
    opts = opts || {};
    const data = load(files);
    const today = opts.today || dataToday(data);
    const id = resolveIdentities(data);
    const C = id.clusters;
    const money = reconcile(data, id, today);
    const R = analyzeRequests(data, id);
    const stats = lostStats(R);
    const leads = analyzeLeads(data, id, today);
    const profit = profitability(data, id, money);
    const churn = churnRisk(data, id, R, money, today);
    const name = k => (k && C.get(k) ? C.get(k).name : 'Unknown');

    // clients: businesses we did (or will do) work for
    const clients = [...id.clientSet].map(k => {
      const c = C.get(k);
      const names = new Map();
      const add = n => {
        n = String(n || '').trim(); if (!n) return;
        if (n === n.toUpperCase() && /[A-Z]{3}/.test(n)) n = n.toLowerCase().replace(/\b[a-z]/g, ch => ch.toUpperCase()); // bank exports shout
        const key = n.toLowerCase(); if (!names.has(key)) names.set(key, n);
      };
      c.names.forEach((_, n) => add(n)); c.leads.forEach(l => add(l.business)); c.payments.forEach(p => add(p.name)); c.persons.forEach(add);
      names.delete(c.name.toLowerCase());
      const inv = money.invoices.filter(i => i.client === k || i.payer === k);
      return {
        key: k, name: c.name, otherNames: [...names.values()], emails: [...new Set([...c.emails].filter(Boolean))], phones: [...c.phones].map(fmtPhone),
        persons: [...c.persons].filter(p => p === p.replace(/^[A-Z ]+$/, '') || p !== p.toUpperCase()),
        bookings: c.bookings, invoices: inv, payments: c.payments, videos: c.board, messages: c.messages, leads: c.leads,
        paidBy: [...C.entries()].filter(([, o]) => o.paidFor.has(k) && id.payerOnly.has(o.key)).map(([pk]) => name(pk)),
        owed: inv.reduce((s, i) => s + Math.max(0, i.owed), 0), overdue: inv.filter(i => i.daysLate > 0).reduce((s, i) => s + i.owed, 0),
        lost: R.lost.filter(r => r.client === k), churn: churn.find(x => x.client === k),
        profit: profit.rows.find(r => r.client === k),
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
    const payers = [...id.payerOnly].map(k => ({ key: k, name: name(k), paysFor: [...C.get(k).paidFor].map(name), emails: [...C.get(k).emails], invoices: money.invoices.filter(i => i.payer === k) }));

    // money we owe back: payments no invoice explains, and money taken for cancelled work
    const weOwe = [];
    money.credits.forEach(cr => {
      const p = cr.payment;
      const dup = money.invoices.find(i => i.payer === p.payer && i.payments.length && Math.abs(i.amount - cr.amount) < 0.01 && Math.abs(days(i.issued, p.date)) <= 14);
      weOwe.push({ client: p.payer, amount: cr.amount, why: dup ? `Paid ${dup.id} twice: ${p.id} (${p.method}, ${p.date}, no reference) and ${dup.payments.map(x => x.id + ' (' + x.date + ')').join(', ')}. Refund or keep as credit.` : `Payment ${p.id} (${p.date}, ${usd(cr.amount)}) matches no invoice. Refund or keep as credit.` });
    });
    money.toolWrong.filter(t => t.kind === 'cancelled').forEach(t => {
      const i = money.invoices.find(x => x.id === t.invoice);
      if (i && i.paid > 0) {
        const b = data.bookings.find(x => x.id === i.bookings[0]);
        const next = data.bookings.find(x => x.client === i.client && x.status === 'upcoming' && x.service === b.service);
        weOwe.push({ client: i.client, amount: i.paid, why: `${i.id} (${usd(i.paid)}) was paid for ${b.id} on ${b.date}, but that shoot was cancelled.${next ? ` Carry it over to the rescheduled ${b.service} ${next.id} on ${next.date} (don't bill that one again), or refund.` : ' Refund or credit it.'}` });
      }
    });

    /* suggestions: one question each, owner says yes or no */
    const S = [];
    const add = s => S.push(s);
    const recent = (d, n) => d >= addDays(today, -n);

    // 1. clients about to leave
    churn.filter(x => x.risk).forEach(x => {
      const c = C.get(x.client);
      // call whoever wrote the latest "we may leave" message
      const warn = c.messages.filter(m => m.direction === 'from' && m.cat === 'churn').pop();
      const byLead = warn && c.leads.find(l => (warn.email && l.email === warn.email) || (warn.phone && l.phone === warn.phone));
      const who = (warn && (warn.person || (byLead && byLead.name))) || [...c.persons][0] || c.name;
      const contact = byLead || c.leads.find(l => l.name === who) || c.leads[0] || {};
      const openLost = R.lost.filter(r => r.client === x.client);
      add({ id: 'churn-' + x.client, kind: 'client', priority: 1000 + x.score, client: x.client, clientName: c.name,
        title: `${c.name} may leave. Call ${who.split(' ')[0]} today?`,
        why: x.evidence.slice(0, 3).join(' · '),
        yes: 'Call now', draft: { channel: 'phone', to: fmtPhone(contact.phone || [...c.phones][0]), text: `Hi ${who.split(' ')[0]}, it's Zaid from Axeom. I saw your note about the contract. You're right that we've missed things: ${openLost.slice(-3).map(r => r.standing ? 'your instruction "' + r.label.replace(/^Standing instruction:\s*/, '') + '"' : r.title + ' (' + r.label.toLowerCase() + ')').join(', ')}. I'm fixing them myself this week and I want to walk you through how we'll stop it happening. When can we talk?` } });
    });

    // 2. edit requests that never reached the board (recent, still open)
    R.lost.filter(r => recent(r.date, 30)).forEach(r => {
      const v = r.video && data.board.find(x => x.id === r.video);
      add({ id: 'edit-' + r.msg.date + '-' + r.msg.time + '-' + r.client + '-' + r.edit, kind: 'edit', priority: 400 + (r.followedUp ? 150 : 0) + (30 - days(r.date, today)), client: r.client, clientName: name(r.client),
        title: `${name(r.client)} asked${r.followedUp ? ' ' + (r.followedUp + 1) + ' times' : ''}: ${r.label.charAt(0).toLowerCase() + r.label.slice(1)}${v ? ' on ' + v.title + ' (' + v.id + ')' : ''}. Put it on the board?`,
        why: `Sent by ${r.channel} on ${r.date}, never written on the board${r.vague ? '. They said "the one we shot last week", so check the video' : ''}. "${r.msg.text.slice(0, 120)}"`,
        yes: 'Add to board', draft: { channel: 'board', to: v ? `${v.id} (${v.editor})` : '', text: `${v ? v.id + ' ' + v.title + ': ' : ''}${r.label}` } });
    });

    // 3. money: overdue invoices. For a client who may leave, chasing money first makes the call harder: hold it.
    const atRisk = new Set(churn.filter(x => x.risk).map(x => x.client));
    const hold = k => atRisk.has(k) ? 'Hold this until after you have talked to them: they may leave. ' : '';
    money.overdue.forEach(i => {
      const c = C.get(i.payer);
      const lead = c && c.leads[0];
      const blocked = data.messages.filter(m => m.client === i.client && m.cat === 'payment' && m.date >= i.issued).pop();
      add({ id: 'overdue-' + i.id, kind: 'money', priority: 200 + i.owed / 25 + i.daysLate - (atRisk.has(i.client) ? 200 : 0), client: i.client, clientName: name(i.payer), amount: i.owed,
        title: `${name(i.payer)} owes ${usd(i.owed)} (${i.id}), ${i.daysLate} days late. Send a reminder?`,
        why: hold(i.client) + (i.status !== i.truth ? `Billing tool says "${i.status}", bank says ${i.truth}. ` : '') + (blocked ? `They wrote on ${blocked.date}: "${blocked.text}"` : `Due ${i.due}.`),
        yes: 'Send reminder', draft: { channel: 'email', to: [...(c ? c.emails : [])][0] || '', text: `Hi${lead ? ' ' + lead.name.split(' ')[0] : ''}, a friendly reminder that invoice ${i.id} for ${usd(i.owed)} was due on ${i.due}. Can you let me know when it will be paid? Thank you! Zaid, Axeom` } });
    });
    // 4. work never billed
    money.neverBilled.forEach(n => {
      add({ id: 'unbilled-' + (n.booking || n.client + n.month), kind: 'money', priority: 180 + n.amount / 25 - (atRisk.has(n.client) ? 200 : 0), client: n.client, clientName: name(n.client), amount: n.amount,
        title: `${name(n.client)}: ${n.booking ? n.booking + ' (' + n.date + ')' : 'retainer for ' + n.month} was never billed. Create a ${usd(n.amount)} invoice?`,
        why: hold(n.client) + n.why, yes: 'Create invoice', draft: { channel: 'billing', to: name(n.client), text: `Invoice ${name(n.client)} ${usd(n.amount)}: ${n.booking ? n.booking : 'Monthly retainer ' + n.month}` } });
    });
    // 5. money we owe back
    weOwe.forEach((w, i) => add({ id: 'owe-' + i + '-' + w.client, kind: 'money', priority: 260, client: w.client, clientName: name(w.client), amount: w.amount,
      title: `We owe ${name(w.client)} ${usd(w.amount)}. Tell them and refund or credit?`, why: w.why, yes: 'Draft note',
      draft: { channel: 'email', to: [...C.get(w.client).emails][0] || '', text: `Hi, while checking our books I found we owe you ${usd(w.amount)}: ${w.why} Would you like a refund, or should we take it off your next invoice? Zaid, Axeom` } }));
    // 6. billing tool says paid but no money arrived (others are fixed in the tool quietly)
    money.toolWrong.filter(t => t.kind === 'status' || t.kind === 'amount').forEach(t => add({ id: 'tool-' + t.invoice, kind: 'money', priority: t.tool_says === 'paid' ? 150 : 60, client: t.client, clientName: name(t.client),
      title: `Fix ${t.invoice} in the billing tool? It says ${t.tool_says}, truth is ${t.truth}.`, why: t.how, yes: 'Mark fixed', draft: { channel: 'billing', to: t.invoice, text: `${t.invoice}: change ${t.tool_says} to ${t.truth}` } }));

    // 7. leads and referrals nobody answered
    leads.offBook.filter(o => o.msg.cat === 'referral' && o.phone && !o.inLeads).forEach(o => add({ id: 'ref-' + o.phone, kind: 'lead', priority: 300, client: o.msg.client, clientName: name(o.msg.client),
      title: `Referral from ${name(o.msg.client)}: call ${o.name || 'them'} at ${fmtPhone(o.phone)}?`, why: `${o.msg.date}: "${o.msg.text}". Not in leads.csv.`, yes: 'Call', draft: { channel: 'phone', to: fmtPhone(o.phone), text: `Hi ${o.name}, ${[...C.get(o.msg.client).persons][0] || 'a client'} told us you might want videos for your business.` } }));
    leads.neverReplied.filter(l => !l.existingClient).forEach(l => add({ id: 'lead-' + l.id, kind: 'lead', priority: l.waiting <= 14 ? 280 : (l.waiting <= 60 ? 90 : 20), clientName: l.business || l.name,
      title: `${l.name}${l.business ? ' (' + l.business + ')' : ''} asked ${l.waiting} days ago and never got a reply. Reply now?`,
      why: `${l.source} lead ${l.id}, ${l.created}. Leads answered the same day won 75% of the time; after 4+ days, 0%.`, yes: 'Send reply',
      draft: { channel: 'email', to: l.email, text: `Hi ${l.name.split(' ')[0]}, sorry for the slow reply to your message about videos${l.business ? ' for ' + l.business : ''}. Are you still interested? I'd love to show you what we've done for businesses like yours. Zaid, Axeom` } }));
    leads.neverReplied.filter(l => l.existingClient && !churn.some(x => x.client === l.cluster && x.risk)).forEach(l => add({ id: 'lead-' + l.id, kind: 'lead', priority: 240, client: l.cluster, clientName: l.clientName,
      title: `${l.clientName} (existing client) wrote in on ${l.created} and got no reply. Answer?`, why: `${l.source} form ${l.id} by ${l.name}. ${(data.messages.find(m => m.date === l.created && m.client === l.cluster) || {}).text || ''}`, yes: 'Reply', draft: { channel: 'email', to: l.email, text: `Hi ${l.name.split(' ')[0]}, thanks for your message, sorry for the delay!` } }));
    data.messages.filter(m => m.cat === 'upsell' && m.client && id.clientSet.has(m.client) && recent(m.date, 90)).forEach(m => {
      if (S.some(s => s.id === 'upsell-' + m.client)) return;
      add({ id: 'upsell-' + m.client, kind: 'lead', priority: 120, client: m.client, clientName: name(m.client), title: `${name(m.client)} asked about buying more. Send a price?`, why: `${m.date}: "${m.text}"`, yes: 'Draft offer', draft: { channel: 'email', to: [...C.get(m.client).emails][0] || '', text: `Hi! Yes, we can do that. Here's what it would cost: ...` } });
    });

    S.sort((a, b) => b.priority - a.priority);
    return {
      today, data, id, money, requests: R, stats, leads, profit, churn, clients, payers, weOwe, suggestions: S,
      totals: { overdue: money.overdue.reduce((s, i) => s + i.owed, 0), neverBilled: money.neverBilled.reduce((s, n) => s + n.amount, 0), weOwe: weOwe.reduce((s, w) => s + w.amount, 0), open: money.invoices.reduce((s, i) => s + Math.max(0, i.owed), 0) },
      name, fmtPhone,
    };
  }

  return { run, dataToday, fmtPhone, lostStats, noteMatches, analyzeLeads, profitability, churnRisk, studioHours, parseCSV, parseMessages, detectType, load, resolveIdentities, reconcile, analyzeRequests, classify, EDIT_TYPES, normName, normPhone, emailKey, toISO, days, addDays, money };
});
