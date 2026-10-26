/*
 * MyShishapedia - Dnevnik sesija.
 *
 * Svaka upisana sesija: miks (okusi, omjer, grami), ugalj, posuda, naslov, ocjena 1-5,
 * bilješka, datum i mala sličica slike sesije. Sve se čuva samo u ovom browseru
 * (localStorage "msp-journal") i nikad se ne šalje. Kopija se može izvesti i uvesti (JSON).
 *
 *   - MSP.Journal: list, add, update, remove, importData (koristi i js/session.js)
 *   - stranica "Dnevnik sesija" (#jr): brojke, najbolji miks, pretraga, sortiranje,
 *     kartice sesija sa ocjenom i bilješkom, uređivanje, brisanje, kopija
 * Ovisi o: views.js (V), strings.js (t).
 */
(function () {
  'use strict';

  var MSP = window.MSP;
  var V = MSP.V;
  var t = MSP.t;
  var esc = V.esc;
  var icon = V.icon;
  var bs = MSP.lang === 'bs';

  var KEY = 'msp-journal';
  var MAX_ENTRIES = 500;
  var mem = null;

  /* ------------------------------------------------------------------ */
  /* Čuvanje                                                             */
  /* ------------------------------------------------------------------ */

  function clean(e) {
    if (!e || typeof e !== 'object' || !Array.isArray(e.items)) return null;
    var items = e.items.filter(function (x) { return x && typeof x.name === 'string' && x.name; }).slice(0, 4).map(function (x) {
      return { id: typeof x.id === 'string' ? x.id : '', brand: String(x.brand || '').slice(0, 24), name: String(x.name).slice(0, 32), pct: Math.max(0, Math.min(100, +x.pct || 0)), color: /^#[0-9a-f]{6}$/i.test(x.color) ? x.color : '#f2a33c' };
    });
    if (!items.length) return null;
    var at = new Date(e.at);
    return {
      id: String(e.id || ('j' + Date.now().toString(36))).slice(0, 24),
      at: isNaN(at) ? new Date().toISOString() : at.toISOString(),
      items: items,
      total: Math.max(1, Math.min(60, +e.total || 20)),
      coals: Math.max(0, Math.min(9, parseInt(e.coals, 10) || 0)),
      bowl: String(e.bowl || '').slice(0, 28),
      heading: String(e.heading || '').slice(0, 40),
      rating: Math.max(0, Math.min(5, parseInt(e.rating, 10) || 0)),
      note: String(e.note || '').slice(0, 400),
      thumb: typeof e.thumb === 'string' && e.thumb.indexOf('data:image/') === 0 ? e.thumb : ''
    };
  }

  function read() {
    var raw = mem;
    try { raw = window.localStorage.getItem(KEY); } catch (e) { /* koristi memoriju */ }
    var list;
    try { list = JSON.parse(raw || '[]'); } catch (e) { list = []; }
    if (!Array.isArray(list)) return [];
    return list.map(clean).filter(Boolean);
  }

  /** Sačuva listu; ako nema mjesta, izbacuje sličice od najstarijih sesija. */
  function write(list) {
    list = list.slice().sort(function (a, b) { return a.at < b.at ? 1 : -1; }).slice(0, MAX_ENTRIES);
    for (var k = list.length; k >= 0; k--) {
      var v = JSON.stringify(list);
      try { window.localStorage.setItem(KEY, v); return true; } catch (e) {
        if (k === 0) { mem = v; return false; }
        // sličica najstarije sesije koja je još ima
        for (var i = list.length - 1; i >= 0; i--) { if (list[i].thumb) { list[i] = Object.assign({}, list[i], { thumb: '' }); break; } }
      }
    }
    return false;
  }

  var listeners = [];
  function changed() { listeners.forEach(function (fn) { fn(); }); }

  var Journal = {
    list: read,
    get: function (id) { return read().filter(function (e) { return e.id === id; })[0] || null; },
    add: function (entry) {
      var e = clean(Object.assign({}, entry, { id: 'j' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5) }));
      if (!e) return null;
      var list = read(); list.unshift(e);
      write(list); changed();
      return e;
    },
    update: function (id, patch) {
      var list = read().map(function (e) { return e.id === id ? clean(Object.assign({}, e, patch, { id: id })) || e : e; });
      write(list); changed();
    },
    remove: function (id) { write(read().filter(function (e) { return e.id !== id; })); changed(); },
    /** Uvoz iz kopije: dodaje samo sesije kojih još nema (po id-u). Vraća broj dodanih. */
    importData: function (data) {
      var arr = Array.isArray(data) ? data : (data && Array.isArray(data.entries) ? data.entries : null);
      if (!arr) return -1;
      var list = read(), have = {}, n = 0;
      list.forEach(function (e) { have[e.id] = 1; });
      arr.map(clean).filter(Boolean).forEach(function (e) { if (!have[e.id]) { list.push(e); have[e.id] = 1; n++; } });
      write(list); changed();
      return n;
    },
    on: function (fn) { listeners.push(fn); },
    /** Link koji otvara isti miks na stranici Slika sesije. */
    sessionUrl: function (e) {
      var m = e.items.map(function (it) {
        return (it.id && V.flavorById(it.id) ? it.id : '~' + encodeURIComponent(it.brand || '') + '~' + encodeURIComponent(it.name)) + ':' + Math.round(it.pct);
      }).join(',');
      return V.url('session') + '?m=' + encodeURIComponent(m).replace(/%2C/g, ',').replace(/%3A/g, ':').replace(/%7E/gi, '~') + '&g=' + e.total;
    }
  };
  MSP.Journal = Journal;

  /* ------------------------------------------------------------------ */
  /* Zajedničko za prikaz                                                */
  /* ------------------------------------------------------------------ */

  function fmtNum(v) { return V.formatNum(v); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmtDate(iso, withTime) {
    var d = new Date(iso);
    var time = pad(d.getHours()) + ':' + pad(d.getMinutes());
    if (bs) return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear() + '.' + (withTime ? ' · ' + time : '');
    var day = d.getDate() + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()] + ' ' + d.getFullYear();
    return day + (withTime ? ', ' + time : '');
  }
  function stars(n) {
    var s = '';
    for (var i = 1; i <= 5; i++) s += '<span class="jr-star' + (i <= n ? ' is-on' : '') + '">' + icon('star') + '</span>';
    return s;
  }
  function donut(items) {
    var a = 0;
    var stops = items.map(function (it) { var from = a; a += it.pct; return it.color + ' ' + from + '% ' + a + '%'; }).join(', ');
    return 'conic-gradient(' + stops + ')';
  }
  /** "3 sesije", "5 sesija", "1 session" ... */
  function plural(n, one, few, many) {
    if (!bs) return n === 1 ? one : many;
    var d = n % 10, h = n % 100;
    if (d === 1 && h !== 11) return one;
    if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return few;
    return many;
  }
  function coalsText(n) {
    if (!n) return '';
    if (bs) {
      if (n === 1) return t('session.coalsOne');
      var d = n % 10, h = n % 100;
      return t(d >= 2 && d <= 4 && (h < 12 || h > 14) ? 'session.coalsLine' : 'session.coalsMany', { n: n });
    }
    return n === 1 ? t('session.coalsOne') : t('session.coalsLine', { n: n });
  }
  function rateButtons(cur) {
    var s = '';
    for (var i = 1; i <= 5; i++) {
      s += '<button type="button" role="radio" class="jr-rate__b' + (i <= cur ? ' is-on' : '') + '" data-rate="' + i + '" aria-checked="' + (i === cur) + '" aria-label="' + esc(t('journal.ratingAria', { n: i })) + '" tabindex="' + (i === (cur || 1) ? 0 : -1) + '">' + icon('star') + '</button>';
    }
    return s;
  }
  Journal.rateButtons = rateButtons;
  Journal.stars = stars;
  Journal.fmtDate = fmtDate;

  /* ------------------------------------------------------------------ */
  /* Stranica "Dnevnik sesija"                                           */
  /* ------------------------------------------------------------------ */

  var root = document.getElementById('jr');
  if (!root) return;

  var $ = function (id) { return document.getElementById(id); };
  var els = { stats: $('jr-stats'), best: $('jr-best'), tools: $('jr-tools'), q: $('jr-q'), sort: $('jr-sort'), list: $('jr-list'), empty: $('jr-empty'), none: $('jr-none'), count: $('jr-count'), status: $('jr-status') };
  var editing = null, confirmDel = null;

  function itemKey(it) { return it.id || (it.brand + '|' + it.name).toLowerCase(); }

  function stats(list) {
    var rated = list.filter(function (e) { return e.rating; });
    var avg = rated.length ? rated.reduce(function (s, e) { return s + e.rating; }, 0) / rated.length : 0;
    var grams = list.reduce(function (s, e) { return s + e.total; }, 0);
    var count = {}, top = null;
    list.forEach(function (e) {
      e.items.forEach(function (it) {
        var k = itemKey(it);
        count[k] = count[k] || { n: 0, it: it };
        count[k].n++;
        if (!top || count[k].n > top.n) top = count[k];
      });
    });
    return { n: list.length, avg: avg, rated: rated.length, grams: grams, top: top };
  }

  function bestOf(list) {
    var best = null;
    list.forEach(function (e) { if (e.rating && (!best || e.rating > best.rating)) best = e; });
    return best && best.rating >= 4 ? best : null;
  }

  function mixLine(e) {
    return e.items.map(function (it) { return it.name + ' ' + Math.round(it.pct) + '%'; }).join(' · ');
  }

  function renderStats(list) {
    var s = stats(list);
    var tiles = [
      [String(s.n), plural(s.n, t('journal.sessionOne'), t('journal.sessionFew'), t('journal.sessionMany'))],
      [s.rated ? fmtNum(s.avg) + ' / 5' : '-', t('journal.avg')],
      [s.top ? s.top.it.name : '-', s.top ? t('journal.topFlavor', { n: s.top.n }) : t('journal.topFlavor0'), s.top ? s.top.it.color : ''],
      [fmtNum(s.grams) + ' g', t('journal.grams')]
    ];
    els.stats.innerHTML = tiles.map(function (x) {
      return '<li class="jr-stat"' + (x[2] ? ' style="--fc:' + x[2] + '"' : '') + '><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></li>';
    }).join('');
    var b = bestOf(list);
    els.best.hidden = !b;
    if (b) {
      els.best.innerHTML =
        '<span class="jr-best__donut" style="background:' + donut(b.items) + '" aria-hidden="true"></span>' +
        '<span class="jr-best__txt"><small>' + esc(t('journal.best')) + '</small><b>' + esc(mixLine(b)) + '</b>' +
        '<span class="jr-stars" role="img" aria-label="' + esc(t('journal.ratingAria', { n: b.rating })) + '">' + stars(b.rating) + '</span></span>' +
        '<a class="btn btn--primary" href="' + esc(Journal.sessionUrl(b)) + '">' + icon('refresh') + '<span>' + esc(t('journal.again')) + '</span></a>';
    }
  }

  function card(e) {
    var meta = [coalsText(e.coals), e.bowl, fmtNum(e.total) + ' g'].filter(Boolean).join(' · ');
    var pic = e.thumb
      ? '<img class="jr-card__pic" src="' + esc(e.thumb) + '" alt="" loading="lazy" decoding="async">'
      : '<span class="jr-card__pic jr-card__pic--gen" aria-hidden="true"><span style="background:' + donut(e.items) + '"></span></span>';
    var chips = e.items.map(function (it) {
      var name = esc(it.name);
      var inner = '<i style="background:' + it.color + '"></i>' + (it.brand ? '<small>' + esc(it.brand) + '</small>' : '') + '<b>' + name + '</b><em>' + Math.round(it.pct) + '% · ' + fmtNum(e.total * it.pct / 100) + ' g</em>';
      var f = it.id && V.flavorById(it.id);
      return '<li>' + (f ? '<a href="' + esc(V.flavorUrl(f)) + '">' + inner + '</a>' : '<span>' + inner + '</span>') + '</li>';
    }).join('');
    var body;
    if (editing === e.id) {
      body =
        '<div class="jr-edit">' +
          '<div class="jr-rate" role="radiogroup" aria-label="' + esc(t('journal.rating')) + '">' + rateButtons(e.rating) + '</div>' +
          '<label class="sr-only" for="jr-note-' + e.id + '">' + esc(t('journal.note')) + '</label>' +
          '<textarea class="jr-note-in" id="jr-note-' + e.id + '" maxlength="400" rows="3" placeholder="' + esc(t('journal.notePh')) + '">' + esc(e.note) + '</textarea>' +
          '<div class="jr-card__acts"><button type="button" class="btn btn--primary" data-act="save">' + icon('check') + '<span>' + esc(t('journal.saveEdit')) + '</span></button>' +
          '<button type="button" class="btn btn--ghost" data-act="cancel">' + esc(t('journal.cancel')) + '</button></div>' +
        '</div>';
    } else {
      body =
        (e.rating ? '<p class="jr-stars" role="img" aria-label="' + esc(t('journal.ratingAria', { n: e.rating })) + '">' + stars(e.rating) + '</p>' : '<p class="jr-card__unrated">' + esc(t('journal.unrated')) + '</p>') +
        (e.note ? '<p class="jr-card__note">' + esc(e.note) + '</p>' : '') +
        '<div class="jr-card__acts">' +
          '<a class="btn btn--ghost" href="' + esc(Journal.sessionUrl(e)) + '">' + icon('refresh') + '<span>' + esc(t('journal.again')) + '</span></a>' +
          '<button type="button" class="jr-icon" data-act="edit" aria-label="' + esc(t('journal.edit')) + '" title="' + esc(t('journal.edit')) + '">' + icon('pencil') + '</button>' +
          (confirmDel === e.id
            ? '<button type="button" class="jr-del is-sure" data-act="del">' + icon('trash') + '<span>' + esc(t('journal.sure')) + '</span></button>'
            : '<button type="button" class="jr-icon" data-act="del" aria-label="' + esc(t('journal.del')) + '" title="' + esc(t('journal.del')) + '">' + icon('trash') + '</button>') +
        '</div>';
    }
    return (
      '<li class="jr-card" data-id="' + esc(e.id) + '">' +
        pic +
        '<div class="jr-card__main">' +
          '<p class="jr-card__date"><time datetime="' + esc(e.at) + '">' + esc(fmtDate(e.at, true)) + '</time></p>' +
          '<h3 class="jr-card__h">' + esc(e.heading || t('session.defaultHeading')) + '</h3>' +
          '<ul class="jr-chips" role="list">' + chips + '</ul>' +
          (meta ? '<p class="jr-card__meta">' + esc(meta) + '</p>' : '') +
          body +
        '</div>' +
      '</li>'
    );
  }


  function filtered(list) {
    var q = V.normalize(els.q.value);
    var out = list.filter(function (e) {
      if (!q) return true;
      return V.normalize([e.heading, e.note, e.bowl].concat(e.items.map(function (it) { return it.brand + ' ' + it.name; })).join(' ')).indexOf(q) !== -1;
    });
    var by = els.sort.value;
    out.sort(function (a, b) {
      if (by === 'best') return (b.rating - a.rating) || (a.at < b.at ? 1 : -1);
      if (by === 'old') return a.at < b.at ? -1 : 1;
      return a.at < b.at ? 1 : -1;
    });
    return out;
  }

  function render() {
    var list = read();
    root.classList.toggle('is-empty', !list.length);
    els.empty.hidden = !!list.length;
    els.tools.hidden = !list.length;
    els.stats.hidden = !list.length;
    if (!list.length) { els.best.hidden = true; els.list.innerHTML = ''; els.none.hidden = true; els.count.textContent = ''; return; }
    renderStats(list);
    var shown = filtered(list);
    els.none.hidden = !!shown.length;
    els.count.textContent = shown.length === list.length ? '' : t('journal.shown', { n: shown.length, total: list.length });
    els.list.innerHTML = shown.map(card).join('');
  }

  function status(s) {
    els.status.textContent = s;
    if (s) setTimeout(function () { if (els.status.textContent === s) els.status.textContent = ''; }, 4000);
  }

  els.q.addEventListener('input', render);
  els.sort.addEventListener('change', render);

  els.list.addEventListener('click', function (ev) {
    var li = ev.target.closest('.jr-card');
    if (!li) return;
    var id = li.getAttribute('data-id');
    var r = ev.target.closest('[data-rate]');
    if (r) {
      var n = +r.getAttribute('data-rate');
      var box = r.parentNode;
      Array.prototype.forEach.call(box.children, function (b, k) { b.classList.toggle('is-on', k < n); b.setAttribute('aria-checked', String(k + 1 === n)); b.tabIndex = k + 1 === n ? 0 : -1; });
      box.setAttribute('data-val', n);
      return;
    }
    var act = ev.target.closest('[data-act]');
    if (!act) return;
    var a = act.getAttribute('data-act');
    if (a === 'edit') { editing = id; confirmDel = null; render(); var ta = $('jr-note-' + id); if (ta) ta.focus(); }
    else if (a === 'cancel') { editing = null; render(); }
    else if (a === 'save') {
      var box2 = li.querySelector('.jr-rate'), e0 = Journal.get(id);
      var val = box2.hasAttribute('data-val') ? +box2.getAttribute('data-val') : (e0 ? e0.rating : 0);
      editing = null;
      Journal.update(id, { rating: val, note: $('jr-note-' + id).value.trim() });
      status(t('journal.updated'));
    } else if (a === 'del') {
      if (confirmDel === id) { confirmDel = null; Journal.remove(id); status(t('journal.deleted')); }
      else { confirmDel = id; render(); var b = els.list.querySelector('[data-id="' + id + '"] .jr-del'); if (b) b.focus(); }
    }
  });
  // strelice po zvjezdicama
  els.list.addEventListener('keydown', function (ev) {
    var r = ev.target.closest('[data-rate]');
    if (!r) return;
    var d = ev.key === 'ArrowRight' || ev.key === 'ArrowUp' ? 1 : ev.key === 'ArrowLeft' || ev.key === 'ArrowDown' ? -1 : 0;
    if (!d) return;
    ev.preventDefault();
    var n = Math.max(1, Math.min(5, +r.getAttribute('data-rate') + d));
    var b = r.parentNode.children[n - 1]; b.click(); b.focus();
  });

  // kopija
  $('jr-export').addEventListener('click', function () {
    var blob = new Blob([JSON.stringify({ app: 'myshishapedia', kind: 'journal', v: 1, entries: read() }, null, 1)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'myshishapedia-dnevnik-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 3000);
  });
  $('jr-import').addEventListener('change', function () {
    var f = this.files[0]; var input = this;
    if (!f) return;
    var rd = new FileReader();
    rd.onload = function () {
      var n = -1;
      try { n = Journal.importData(JSON.parse(rd.result)); } catch (e) { n = -1; }
      status(n < 0 ? t('journal.importBad') : t('journal.imported', { n: n }));
      input.value = '';
    };
    rd.readAsText(f);
  });

  Journal.on(render);
  window.addEventListener('storage', function (e) { if (e.key === KEY) render(); });
  render();
})();
