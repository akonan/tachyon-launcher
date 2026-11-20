/* Tachyon screens as DOM, drawn from the design handoff (412 x 824 units) with neutral sample data.
   Nothing here is the owner's data. window.SCREENS[name]() returns the inner HTML of a .phone. */
(function () {
  const ICON_SEARCH = '<svg class="s-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 21 21"/></svg>';
  const ICON_BACK = '<svg class="s-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
  const ICON_RET = '<svg class="s-ic s-ic-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 5v8H5"/><path d="m9 9-4 4 4 4"/></svg>';
  const RINGS = '<svg class="s-art" viewBox="0 0 412 360" preserveAspectRatio="xMidYMin slice" fill="none" stroke="#BDBDBD" stroke-width="1.5">' +
    Array.from({ length: 16 }, (_, i) => `<circle cx="330" cy="80" r="${30 + 26 * i}"/>`).join('') +
    '<circle cx="330" cy="80" r="14" fill="#000" stroke="none"/></svg>';
  const WAVES = '<svg class="s-art" viewBox="0 0 412 360" preserveAspectRatio="xMidYMin slice" fill="none" stroke="#BDBDBD" stroke-width="1.5">' +
    Array.from({ length: 12 }, (_, i) => { const y = 30 + 28 * i, a = 8 + 3 * i; return `<path d="M-10 ${y} C60 ${y - a} 130 ${y + a} 200 ${y} S340 ${y + a} 422 ${y}"/>`; }).join('') + '</svg>';

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const now = new Date();
  const DAY = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const TIME = now.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' });
  const PINS = ['Reader', 'Notes', 'Mail', 'Maps', 'Music', 'Camera', 'Browser'];

  const row = (t, tag) => `<div class="s-row"><span>${esc(t)}</span>${tag ? `<span class="s-tag">${esc(tag)}</span>` : ''}</div>`;
  const sel = (t, tag, ret) => `<div class="s-sel"><span>${esc(t)}</span><span class="s-tag">${esc(tag || 'Open')}${ret === false ? '' : ICON_RET}</span></div>`;
  const head = (k, h) => `<div class="s-head"><p class="s-mono">${esc(k)}</p><p class="s-h1">${esc(h)}</p></div>`;
  const backbar = inner => `<div class="s-bars"><div class="s-sq">${ICON_BACK}</div>${inner}</div>`;

  const S = {
    home: () => `<div class="scr s-home">
      <div><p class="s-mono s-ink">${DAY}</p><p class="s-clock">${TIME}</p><p class="s-status">Battery 82% · Wi‑Fi on</p></div>
      <div class="s-grow"></div>
      <div>${PINS.map(p => `<div class="s-pin">${p}</div>`).join('')}</div>
      <div class="s-bar s-mt">${ICON_SEARCH}<span class="s-ph">Search apps and commands</span></div>
      <p class="s-hint">Swipe up to search</p></div>`,

    search: (o = {}) => {
      const q = o.q == null ? 'no' : o.q;
      const rows = o.rows || [['Nordic Weather', 'App'], ['Notifications', 'Setting'], ['Notes: Append to inbox', 'Action'], ['Notes: New note', 'Action']];
      const best = o.best === undefined ? 'Notes' : o.best;
      return `<div class="scr s-search"><div class="s-body">
        <p class="s-mono s-pad">${o.count != null ? esc(o.count) : (rows.length + (best ? 1 : 0)) + ' results · best match last'}</p>
        <div class="s-grow"></div>
        <div>${rows.map(r => row(r[0], r[1])).join('')}${best ? sel(best) : ''}</div>
        <div class="s-bars s-mt14"><div class="s-bar s-flex">${ICON_SEARCH}${o.input || `<b class="s-q">${esc(q)}</b>`}</div><div class="s-btn">Actions</div></div>
        <p class="s-hint">Volume keys move · Enter opens</p></div>
        <div class="s-kbd"><span class="s-mono">Keyboard</span></div></div>`;
    },

    calc: () => S.search({ q: '2*(3+4)', rows: [], best: null, count: 'Calculator', input: null })
      .replace('<div></div>', `<div>${sel('14', 'Copy')}</div>`),

    actions: () => `<div class="scr">${head('Actions for', 'Notes')}<div class="s-grow"></div>
      <div>${['Uninstall', 'App info', 'Hide from search', 'Pin to home', 'Append to inbox', 'New note'].map(t => row(t)).join('')}${sel('Open', 'Default', false)}</div>
      ${backbar('<div class="s-bar s-flex"><span class="s-ph">Filter actions</span></div>').replace('s-bars', 's-bars s-mt14')}
      <p class="s-hint">Hold Enter on any result</p></div>`,

    commands: () => `<div class="scr">${head('Device', 'Commands')}<div class="s-grow"></div>
      <div>${[['Lock screen', ''], ['Timer', 'Set'], ['Bluetooth', 'Off'], ['Wi‑Fi', 'On'], ['Front light', '40%'], ['Refresh mode', 'Balanced']].map(r => row(r[0], r[1])).join('')}${sel('Full refresh', 'Clear ghosting', false)}</div>
      ${backbar('<div class="s-bar s-flex"><b class="s-q">&gt;</b></div>').replace('s-bars', 's-bars s-mt14')}
      <p class="s-hint">Type &gt; in search to jump here</p></div>`,

    modes: () => {
      const card = (name, state, kv, on) => `<div class="s-card${on ? ' s-on' : ''}"><div class="s-cardh"><b>${name}</b><span class="s-tag">${state}</span></div>${kv.map(r => `<div class="s-kv"><span>${r[0]}</span><span>${r[1]}</span></div>`).join('')}</div>`;
      return `<div class="scr">${head('Device', 'Modes')}<div class="s-grow"></div>
        ${card('Evening reading', 'Switch', [['Refresh', 'HD'], ['Front light', 'Warm 30%'], ['Wi‑Fi', 'Off'], ['Notifications', 'Silent'], ['Pinned', 'Reader, Notes']])}
        ${card('Daytime', 'Active', [['Refresh', 'Fast'], ['Front light', 'Off'], ['Wi‑Fi', 'On'], ['Notifications', 'On'], ['Pinned', 'Mail, Maps, Music']], true)}
        ${row('Switch on a schedule', 'Off')}
        ${backbar('<div class="s-btn s-flex">Edit modes</div>')}
        <p class="s-hint">Type "mode" in search to jump here</p></div>`;
    },

    dashboard: () => `<div class="scr s-nopad">
      <div class="s-panel" style="--h:300">${WAVES}<div class="s-panelin">
        <p class="s-chip s-mono s-ink">Dashboard · ${DAY}</p><div class="s-grow"></div>
        <p class="s-count">12</p><p class="s-chip s-big">days to launch</p></div></div>
      <div class="s-rest">
        ${[['Pages read', 'This week 212', '38'], ['Steps', 'This week 41,200', '6,400'], ['Focus hours', 'This week 19', '3']].map(r => `<div class="s-stat"><div><span>${r[0]}</span><span class="s-status">${r[1]}</span></div><b>${r[2]}</b></div>`).join('')}
        <div class="s-rem"><p class="s-mono">Remember</p><p>One thing at a time.</p></div>
        <div class="s-grow"></div>
        ${backbar('<div class="s-btn s-flex">Edit dashboard</div>')}
        <p class="s-hint">Updated ${TIME} · also on the lock screen</p></div></div>`,

    lock: () => `<div class="scr s-nopad">
      <div class="s-panel" style="--h:360">${RINGS}<div class="s-panelin">
        <p class="s-chip s-mono s-ink">${DAY}</p><div class="s-grow"></div>
        <p class="s-count s-xl">12</p><p class="s-chip s-big">days to launch</p></div></div>
      <div class="s-rest s-wide">
        ${[['Pages read', '38'], ['Steps', '6,400'], ['Focus hours', '3']].map(r => `<div class="s-stat s-tall"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}
        <div class="s-grow"></div>
        <div><p class="s-mono">Remember</p><p class="s-mantra">One thing at a time.</p></div>
        <div class="s-grow"></div>
        <p class="s-status">Updated ${TIME} · refreshes every 15 min</p></div></div>`,

    /* neutral stand-ins, not anyone's real UI */
    rival: () => `<div class="scr s-rival"><div class="s-rclock"></div><div class="s-grow"></div><div class="s-rgrid">${'<i></i>'.repeat(16)}</div><div class="s-rdock">${'<i></i>'.repeat(4)}</div></div>`,
    blank: () => '<div class="scr"></div>',
    app: name => `<div class="scr s-app"><div class="s-grow"></div><p class="s-h1">${esc(name)}</p><p class="s-mono">launched</p><div class="s-grow"></div></div>`,
  };

  window.SCREENS = S;
  window.mountScreens = root => (root || document).querySelectorAll('.phone[data-screen]').forEach(p => {
    const f = S[p.dataset.screen]; if (f && !p.dataset.done) { p.innerHTML = f(); p.dataset.done = 1; }
  });
})();
