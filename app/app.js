/* Axeom Today: the phone screen. Reads files, runs the engine, shows what to do first.
 * It never sends anything. "Yes" opens a ready-made draft in the owner's own mail / WhatsApp / phone app.
 */
(function () {
  'use strict';
  const E = window.AxeomEngine;
  const $app = document.getElementById('app');
  const $file = document.getElementById('file');
  const LS = { uploads: 'axeom.uploads.v1', base: 'axeom.useBase.v1', answers: 'axeom.answers.v1' };

  /* ---------- storage (per browser; the page still works if storage is blocked) */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  };
  let uploads = store.get(LS.uploads, []);       // [{name, text, added}]
  let useBase = store.get(LS.base, true);        // false after "Replace all data"
  let answers = store.get(LS.answers, {});       // suggestionId -> {a: 'yes'|'no', at}
  let M = null;

  /* ---------- helpers */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const usd = n => '$' + Math.round(n || 0).toLocaleString('en-US');
  const fmtDate = iso => { if (!iso) return ''; const d = new Date(iso + 'T12:00:00Z'); return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }); };
  const KIND = { client: 'Client at risk', edit: 'Lost edit request', money: 'Money', lead: 'Lead' };
  const open = s => !answers[s.id];
  function toast(msg) {
    const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 3800);
  }

  function compute() {
    const files = (useBase ? (window.AXEOM_BASE_FILES || []) : []).concat(uploads);
    M = E.run(files);
  }

  /* ---------- router: #/ | #/list/money | #/client/<key> | #/do/<id> */
  window.addEventListener('hashchange', render);
  function go(h) { location.hash = h; }

  function render() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    const [view, ...rest] = h.split('/');
    const arg = rest.join('/');
    window.scrollTo(0, 0);
    if (view === 'list') return renderList(arg);
    if (view === 'client') return renderClient(arg);
    if (view === 'do') return renderDraft(arg);
    if (view === 'clients') return renderClients();
    if (view === 'data') return renderData();
    renderHome();
  }

  /* ---------- home: the 10-second screen */
  function renderHome() {
    const todo = M.suggestions.filter(open);
    const first = todo[0];
    // "Then": the best item of each kind first, so money and leads don't hide behind edits
    const next = [];
    const rest = todo.slice(1);
    const kinds = [...new Set(rest.map(s => s.kind))];
    kinds.forEach(k => { const s = rest.find(x => x.kind === k); if (s) next.push(s); });
    rest.forEach(s => { if (!next.includes(s)) next.push(s); });
    next.splice(4); next.sort((a, b) => b.priority - a.priority);
    const edits = todo.filter(s => s.kind === 'edit').length;
    const leads = todo.filter(s => s.kind === 'lead').length;
    const owedOpen = M.money.overdue.filter(i => !answers['overdue-' + i.id]).reduce((s, i) => s + i.owed, 0);
    $app.innerHTML = `<main>
      <h1><span>Axeom · ${esc(fmtDate(M.today))}</span><a class="ghost" href="#/clients">Clients</a></h1>
      ${first ? `<div class="card first">
          <span class="tag ${first.kind}">Do this first · ${esc(KIND[first.kind])}</span>
          <p class="q">${esc(first.title)}</p>
          <p class="why">${esc(first.why)}</p>
          <div class="row">
            <button class="yes" data-yes="${esc(first.id)}">Yes, ${esc(first.yes.toLowerCase())}</button>
            <button class="no" data-no="${esc(first.id)}">Not now</button>
          </div>
        </div>` : `<div class="card empty"><p class="q">You're all caught up.</p><p class="why">Nothing needs a decision right now.</p></div>`}
      ${next.length ? `<h2>Then</h2>${next.slice(0, 4).map(cardHTML).join('')}` : ''}
      <h2>Everything else</h2>
      <div class="tiles">
        <button class="tile" data-go="#/list/money"><b>${usd(owedOpen)}</b><span>overdue · ${usd(M.totals.neverBilled)} never billed</span></button>
        <button class="tile" data-go="#/list/edit"><b>${edits}</b><span>missed edits, last 30 days (${M.requests.lost.length} in all)</span></button>
        <button class="tile" data-go="#/list/lead"><b>${leads}</b><span>leads & clients waiting</span></button>
      </div>
      <h2>Find a client</h2>
      <input type="search" id="q" placeholder="Name, email or phone" autocomplete="off" aria-label="Find a client">
      <div class="list" id="hits"></div>
    </main>
    ${uploadBar()}`;
    bind();
    const q = document.getElementById('q');
    q.addEventListener('input', () => {
      const v = q.value.trim().toLowerCase();
      const hits = !v ? [] : M.clients.filter(c => [c.name, ...c.otherNames, ...c.emails, ...c.phones].join(' ').toLowerCase().includes(v)).slice(0, 8);
      document.getElementById('hits').innerHTML = hits.map(c => `<a href="#/client/${encodeURIComponent(c.key)}">${esc(c.name)}<small>${esc(c.otherNames.slice(0, 3).join(' · '))}</small></a>`).join('') || (v ? '<p class="note">No client matches.</p>' : '');
    });
  }

  function cardHTML(s) {
    const a = answers[s.id];
    return `<div class="card compact ${a ? 'done' : ''}">
      <span class="tag ${s.kind}">${esc(KIND[s.kind])}</span>
      <p class="q">${esc(s.title)}</p>
      <details><summary>Why</summary><p class="why">${esc(s.why)}</p></details>
      <div class="row">${a
        ? `<span class="note">${a.a === 'yes' ? 'Done' : 'Skipped'} · </span><button class="ghost" data-undo="${esc(s.id)}">Undo</button>`
        : `<button class="yes" data-yes="${esc(s.id)}">${esc(s.yes)}</button><button class="no" data-no="${esc(s.id)}">Not now</button>`}</div>
    </div>`;
  }

  function uploadBar() {
    const n = uploads.length;
    return `<div class="bar"><div class="in">
      <button class="yes" data-upload>Add new files</button>
      <a class="ghost" href="#/data">${n ? n + ' added' : 'Data'}</a>
    </div></div>`;
  }

  function bind() {
    $app.querySelectorAll('[data-yes]').forEach(b => b.onclick = () => go('#/do/' + encodeURIComponent(b.dataset.yes)));
    $app.querySelectorAll('[data-no]').forEach(b => b.onclick = () => { answer(b.dataset.no, 'no'); toast('Skipped. You can undo it from the list.'); render(); });
    $app.querySelectorAll('[data-undo]').forEach(b => b.onclick = () => { delete answers[b.dataset.undo]; store.set(LS.answers, answers); render(); });
    $app.querySelectorAll('[data-go]').forEach(b => b.onclick = () => go(b.dataset.go));
    $app.querySelectorAll('[data-upload]').forEach(b => b.onclick = () => $file.click());
    $app.querySelectorAll('[data-back]').forEach(b => b.onclick = () => (history.length > 1 ? history.back() : go('#/')));
  }
  function answer(id, a) { answers[id] = { a, at: new Date().toISOString() }; store.set(LS.answers, answers); }

  /* ---------- "Yes": show the draft. The owner sends it from their own app. */
  function renderDraft(id) {
    const s = M.suggestions.find(x => x.id === id);
    if (!s) return go('#/');
    const d = s.draft || {};
    const digits = String(d.to || '').replace(/\D/g, '');
    const links = [];
    if (d.channel === 'email' && d.to) links.push(`<a class="btn yes" data-send href="mailto:${esc(d.to)}?subject=${encodeURIComponent('Axeom')}&body=__BODY__">Open in Mail</a>`);
    if (d.channel === 'phone' && digits) {
      links.push(`<a class="btn yes" data-send href="tel:+1${digits}">Call ${esc(d.to)}</a>`);
      links.push(`<a class="btn no" data-send href="https://wa.me/1${digits}?text=__BODY__">WhatsApp instead</a>`);
    }
    $app.innerHTML = `<div class="sheet"><main>
      <button class="back" data-back>‹ Back</button>
      <span class="tag ${s.kind}">${esc(KIND[s.kind])}</span>
      <p class="q">${esc(s.title)}</p>
      <p class="why">${esc(s.why)}</p>
      ${d.to ? `<p class="note">${d.channel === 'board' ? 'Board item' : d.channel === 'billing' ? 'Billing tool' : 'To'}: <b>${esc(d.to)}</b></p>` : ''}
      <label class="note" for="draft">${d.channel === 'phone' ? 'What to say (you can edit it)' : d.channel === 'board' || d.channel === 'billing' ? 'Note to copy' : 'Draft (you can edit it)'}</label>
      <textarea id="draft">${esc(d.text || '')}</textarea>
      <div class="row" style="margin-top:10px">${links.join('')}<button class="no" data-copy>Copy text</button></div>
      <p class="note">Nothing is sent by this app. You send it yourself, then tap below.</p>
      <div class="row"><button class="yes" data-done>Done</button><button class="no" data-skip>Not now</button></div>
      ${s.client ? `<p><a class="ghost" href="#/client/${encodeURIComponent(s.client)}">See everything about ${esc(s.clientName)} ›</a></p>` : ''}
    </main></div>`;
    bind();
    const ta = document.getElementById('draft');
    $app.querySelectorAll('[data-send]').forEach(a => a.addEventListener('click', () => { a.href = a.href.replace('__BODY__', encodeURIComponent(ta.value)); }));
    $app.querySelector('[data-copy]').onclick = async () => { try { await navigator.clipboard.writeText(ta.value); toast('Copied.'); } catch (e) { ta.select(); toast('Select and copy the text.'); } };
    $app.querySelector('[data-done]').onclick = () => { answer(id, 'yes'); toast('Marked done.'); go('#/'); };
    $app.querySelector('[data-skip]').onclick = () => { answer(id, 'no'); go('#/'); };
  }

  /* ---------- lists behind the tiles */
  function renderList(kind) {
    const all = M.suggestions.filter(s => s.kind === kind || (kind === 'lead' && s.kind === 'client'));
    const titles = { money: 'Money', edit: 'Edit requests not on the board', lead: 'Leads and clients waiting' };
    let extra = '';
    if (kind === 'money') {
      extra = `<div class="card"><table>
        <tr><th>Overdue</th><td>${usd(M.totals.overdue)}</td></tr>
        <tr><th>Never billed</th><td>${usd(M.totals.neverBilled)}</td></tr>
        <tr><th>We owe clients</th><td>${usd(M.totals.weOwe)}</td></tr>
        <tr><th>All open invoices</th><td>${usd(M.totals.open)}</td></tr>
        <tr><th>Billing tool wrong</th><td>${M.money.toolWrong.length} invoices</td></tr></table></div>`;
    }
    if (kind === 'edit') {
      const rows = M.stats.byChannel.map(c => `<tr><td>${esc(c.key)}</td><td class="${c.rate > .5 ? 'bad' : ''}">${c.lost} of ${c.total} lost</td></tr>`).join('');
      const older = M.requests.lost.filter(r => !M.suggestions.some(s => s.kind === 'edit' && s.id.includes(r.msg.date + '-' + r.msg.time))).slice().reverse();
      extra = `<div class="card"><p class="q">Why requests get lost</p><table>${rows}</table>
        <p class="note">Voice notes and Instagram DMs never reach the board. Ask clients to write edit notes, naming the video, and confirm each one.</p></div>`;
      if (older.length) extra += `<details class="card"><summary>${older.length} older lost requests (over 30 days)</summary><table>${older.map(r => `<tr><td>${esc(r.date)}<br><span class="muted">${esc(r.channel)}</span></td><td>${esc(M.name(r.client))}: ${esc(r.label)}${r.video ? ' · ' + esc(r.video) : ''}</td></tr>`).join('')}</table></details>`;
    }
    const todo = all.filter(open), done = all.filter(s => !open(s));
    $app.innerHTML = `<div class="sheet"><main>
      <button class="back" data-back>‹ Back</button>
      <h1><span>${esc(titles[kind] || kind)}</span></h1>
      ${extra}
      ${todo.map(cardHTML).join('') || '<p class="note">Nothing open.</p>'}
      ${done.length ? `<h2>Done or skipped</h2>${done.map(cardHTML).join('')}` : ''}
    </main></div>`;
    bind();
  }

  /* ---------- clients */
  function renderClients() {
    $app.innerHTML = `<div class="sheet"><main>
      <button class="back" data-back>‹ Back</button>
      <h1><span>${M.clients.length} clients</span></h1>
      <input type="search" id="q" placeholder="Name, email or phone" aria-label="Find a client">
      <div class="list" id="hits"></div>
      ${M.payers.length ? `<h2>Pays for others (not a client)</h2><div class="list">${M.payers.map(p => `<a>${esc(p.name)}<small>Pays for ${esc(p.paysFor.join(', '))}</small></a>`).join('')}</div>` : ''}
    </main></div>`;
    bind();
    const q = document.getElementById('q'), hits = document.getElementById('hits');
    const draw = () => {
      const v = q.value.trim().toLowerCase();
      hits.innerHTML = M.clients.filter(c => !v || [c.name, ...c.otherNames, ...c.emails, ...c.phones].join(' ').toLowerCase().includes(v))
        .map(c => `<a href="#/client/${encodeURIComponent(c.key)}">${esc(c.name)}${c.overdue ? ` <span class="bad">· ${usd(c.overdue)} late</span>` : ''}${c.lost.length ? ` <span class="muted">· ${c.lost.length} lost edits</span>` : ''}<small>${esc(c.otherNames.slice(0, 4).join(' · '))}</small></a>`).join('');
    };
    q.addEventListener('input', draw); draw();
  }

  function renderClient(key) {
    const c = M.clients.find(x => x.key === key);
    if (!c) return go('#/clients');
    const sug = M.suggestions.filter(s => s.client === key && open(s));
    const inv = c.invoices.slice().sort((a, b) => b.issued.localeCompare(a.issued));
    const upcoming = c.bookings.filter(b => b.status === 'upcoming');
    const msgs = c.messages.slice(-12).reverse();
    const lead = c.leads[0];
    $app.innerHTML = `<div class="sheet"><main>
      <button class="back" data-back>‹ Back</button>
      <p class="q" style="font-size:22px">${esc(c.name)}</p>
      <p class="why">Also called: ${esc(c.otherNames.join(' · ') || '-')}</p>
      <p class="note">${c.emails.map(e => `<a href="mailto:${esc(e)}">${esc(e)}</a>`).join(' · ')}${c.phones.length ? ' · ' + c.phones.map(p => `<a href="tel:+1${p.replace(/\D/g, '')}">${esc(p)}</a>`).join(' · ') : ''}</p>
      ${c.paidBy.length ? `<p class="note">Billed to and paid by <b>${esc(c.paidBy.join(', '))}</b></p>` : ''}
      ${lead ? `<p class="note">Came from: ${esc(lead.source)} (${esc(lead.id)}, ${esc(lead.created)})</p>` : ''}
      ${c.churn && c.churn.risk ? `<div class="card" style="border-color:var(--red)"><span class="tag client">At risk</span><p class="why" style="margin-top:8px">${c.churn.evidence.map(esc).join('<br>')}</p></div>` : ''}
      ${sug.length ? `<h2>Waiting on you</h2>${sug.map(cardHTML).join('')}` : ''}
      <h2>Money</h2>
      <div class="card"><table><tr><th>Invoice</th><th>Amount</th><th>Bank says</th></tr>
        ${inv.map(i => `<tr><td>${esc(i.id)}<br><span class="muted">${esc(i.issued)}</span></td><td>${usd(i.amount)}</td><td class="${i.daysLate ? 'bad' : i.truth === 'paid' ? 'ok' : ''}">${esc(i.truth)}${i.owed > 0 ? ' ' + usd(i.owed) : ''}${i.daysLate ? `, ${i.daysLate}d late` : ''}${i.status !== i.truth ? `<br><span class="muted">tool says ${esc(i.status)}</span>` : ''}</td></tr>`).join('') || '<tr><td colspan="3" class="muted">No invoices</td></tr>'}
      </table></div>
      <h2>Videos (${c.videos.length})</h2>
      <div class="card"><table>
        ${c.videos.slice().reverse().slice(0, 12).map(v => { const lost = c.lost.filter(r => r.video === v.id); return `<tr><td>${esc(v.id)}</td><td>${esc(v.title)}<br><span class="muted">${esc(v.stage)} · ${esc(v.editor)}${v.notes ? ' · note: ' + esc(v.notes) : ''}</span>${lost.map(r => `<br><span class="bad">Missed: ${esc(r.label)} (${esc(r.channel)}, ${esc(r.date)})</span>`).join('')}</td></tr>`; }).join('') || '<tr><td class="muted">No videos</td></tr>'}
      </table>${c.videos.length > 12 ? `<p class="note">Showing the latest 12.</p>` : ''}</div>
      ${upcoming.length ? `<h2>Booked</h2><div class="card"><table>${upcoming.map(b => `<tr><td>${esc(b.date)}</td><td>${esc(b.service)} · ${usd(b.price)}</td></tr>`).join('')}</table></div>` : ''}
      <h2>Latest messages</h2>
      <div class="card"><table>${msgs.map(m => `<tr><td>${esc(m.date)}<br><span class="muted">${esc(m.channel)}</span></td><td>${m.direction === 'to' ? '<span class="muted">Us: </span>' : ''}${esc(m.text)}</td></tr>`).join('') || '<tr><td class="muted">No messages</td></tr>'}</table></div>
    </main></div>`;
    bind();
  }

  /* ---------- data: what's loaded, reset */
  function renderData() {
    const counts = M.data;
    const rows = [['Leads', counts.leads.length], ['Bookings', counts.bookings.length], ['Invoices', counts.invoices.length], ['Payments', counts.payments.length], ['Videos', counts.board.length], ['Messages', counts.messages.length], ['Team', counts.team.length]];
    $app.innerHTML = `<div class="sheet"><main>
      <button class="back" data-back>‹ Back</button>
      <h1><span>Data</span></h1>
      <div class="card"><table>${rows.map(r => `<tr><th>${r[0]}</th><td>${r[1]}</td></tr>`).join('')}</table>
        <p class="note">"Today" is the latest date in the files: ${esc(M.today)}.</p></div>
      <h2>Files added on this phone</h2>
      <div class="card">${uploads.length ? `<table>${uploads.map(u => `<tr><td>${esc(u.name)}</td><td class="muted">${esc(E.detectType(u.name, u.text) || 'not recognised')}</td><td class="muted">${esc((u.added || '').slice(0, 10))}</td></tr>`).join('')}</table>` : '<p class="note">None yet. The original pack is loaded.</p>'}
        <p class="note">${useBase ? 'Your files are added on top of the original pack. Rows with the same ID replace the old ones.' : 'Only your files are loaded (the original pack was replaced).'}</p></div>
      <div class="row"><button class="yes" data-upload>Add new files</button>${uploads.length || !useBase ? '<button class="no" data-reset>Go back to the original pack</button>' : ''}</div>
    </main></div>`;
    bind();
    const r = $app.querySelector('[data-reset]');
    if (r) r.onclick = () => { if (!confirm('Remove the files you added and go back to the original pack?')) return; uploads = []; useBase = true; store.set(LS.uploads, uploads); store.set(LS.base, useBase); compute(); toast('Back to the original pack.'); render(); };
  }

  /* ---------- Add new files */
  $file.addEventListener('change', async () => {
    const list = [...$file.files];
    $file.value = '';
    if (!list.length) return;
    const read = await Promise.all(list.map(f => f.text().then(text => ({ name: f.name, text, added: new Date().toISOString() }))));
    const known = read.filter(f => E.detectType(f.name, f.text));
    const unknown = read.filter(f => !E.detectType(f.name, f.text));
    if (!known.length) { toast(`Couldn't read ${unknown.map(f => f.name).join(', ')}. Use the same CSV/TXT formats as the pack.`); return; }
    const types = new Set(known.map(f => E.detectType(f.name, f.text)));
    // A full new pack (5+ kinds of file) replaces everything; a few files are added on top.
    const replace = types.size >= 5 && confirm(`You added ${types.size} kinds of file. Replace all data with these files?\n\nOK = replace everything\nCancel = add them to the current data`);
    const before = { s: new Set(M.suggestions.map(s => s.id)), d: M.data };
    const prev = { uploads, useBase };
    if (replace) { uploads = known; useBase = false; } else { uploads = uploads.concat(known); }
    try { compute(); }
    catch (e) { uploads = prev.uploads; useBase = prev.useBase; compute(); toast('Those files could not be processed: ' + e.message); return; }
    if (!store.set(LS.uploads, uploads)) toast('Loaded, but this browser will not remember the files after you close it.');
    store.set(LS.base, useBase);
    const fresh = M.suggestions.filter(s => !before.s.has(s.id)).length;
    const delta = k => M.data[k].length - before.d[k].length;
    const parts = [['leads', 'leads'], ['bookings', 'bookings'], ['invoices', 'invoices'], ['payments', 'payments'], ['board', 'videos'], ['messages', 'messages']].map(([k, n]) => delta(k) ? `${delta(k) > 0 ? '+' : ''}${delta(k)} ${n}` : '').filter(Boolean);
    toast(`Updated from ${known.length} file${known.length > 1 ? 's' : ''}${parts.length ? ' (' + parts.join(', ') + ')' : ''}. ${fresh} new suggestion${fresh === 1 ? '' : 's'}.${unknown.length ? ' Skipped: ' + unknown.map(f => f.name).join(', ') : ''}`);
    go('#/'); render();
  });

  /* ---------- start */
  try { compute(); }
  catch (e) { uploads = []; useBase = true; store.set(LS.uploads, uploads); store.set(LS.base, true); compute(); setTimeout(() => toast('Saved files could not be read, so the original pack was loaded.'), 300); }
  render();
})();
