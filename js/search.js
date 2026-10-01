/*
 * MyShishapedia - globalna pretraga.
 *
 * Ikona u headeru (i u mobilnom meniju), Ctrl+K / Cmd+K ili "/" otvaraju pretragu preko
 * cijelog ekrana. Indeks (dist/search/<jezik>.json) pravi build.mjs i učitava se tek kad
 * se pretraga prvi put otvori. Pretraga ignoriše velika/mala slova i dijakritike, radi na
 * oba jezika i podnosi manje greške u kucanju ("dubaj", "lav 66").
 * Ista logika puni i rezervnu stranicu /bs/pretraga/?q= i /en/search/?q=.
 */
(function () {
  'use strict';

  var MSP = window.MSP;
  var V = MSP.V;
  var t = MSP.t;
  var esc = V.esc;
  var FX = MSP.Effects;

  var GROUP_ORDER = ['flavor', 'brand', 'collection', 'recipe', 'term', 'guide', 'gear', 'compare', 'page'];
  var GROUP_BONUS = { flavor: 3, brand: 3, collection: 2, recipe: 2, page: 1 };
  var MAX_PER_GROUP = 6;

  /* ------------------------------------------------------------------ */
  /* Indeks                                                              */
  /* ------------------------------------------------------------------ */

  var index = null;
  var loading = null;

  /** Pojednostavljen "zvuk" riječi: dubaj = dubai, love = lov (pa "lav" prolazi uz 1 grešku). */
  function phon(w) {
    return w.replace(/[jy]/g, 'i').replace(/w/g, 'v').replace(/ph/g, 'f').replace(/(.)\1+/g, '$1').replace(/(.{3,})e$/, '$1');
  }

  function loadIndex() {
    if (index) return Promise.resolve(index);
    if (loading) return loading;
    loading = fetch('/search/' + MSP.lang + '.json', { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('index ' + r.status); return r.json(); })
      .then(function (data) {
        index = data.items.map(function (it) {
          var words = it.k.split(' ').filter(Boolean);
          var uniq = words.filter(function (w, i) { return words.indexOf(w) === i; });
          return { it: it, words: uniq, pw: uniq.map(phon), nt: V.normalize(it.t) };
        });
        return index;
      });
    loading.catch(function () { loading = null; });
    return loading;
  }

  function lev(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var prev = [];
    var i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      var cur = [i];
      var rowMin = i;
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1));
        if (cur[j] < rowMin) rowMin = cur[j];
      }
      if (rowMin > max) return max + 1;
      prev = cur;
    }
    return prev[b.length];
  }

  function tokenScore(tok, entry) {
    var best = 0;
    var pt = phon(tok);
    var numeric = /^\d+$/.test(tok);
    for (var i = 0; i < entry.words.length; i++) {
      var w = entry.words[i];
      if (w === tok) return 10;
      if (w.indexOf(tok) === 0) { best = Math.max(best, 7); continue; }
      if (numeric) continue;
      if (tok.length >= 3 && w.indexOf(tok) > 0) { best = Math.max(best, 5); continue; }
      if (entry.pw[i] === pt) { best = Math.max(best, 6); continue; }
      if (pt.length >= 3) {
        var allowed = pt.length >= 6 ? 2 : 1;
        // i početak dužih riječi ("bonb" ~ "bonbon")
        var target = entry.pw[i].length > pt.length + 1 ? entry.pw[i].slice(0, pt.length) : entry.pw[i];
        var d = lev(pt, target, allowed);
        if (d <= allowed) best = Math.max(best, 4 - d);
      }
    }
    return best;
  }

  /** Rezultati grupisani po vrsti: [{ g, items: [...] }] */
  function search(q) {
    var nq = V.normalize(q);
    if (nq.replace(/ /g, '').length < 2 || !index) return [];
    var toks = nq.split(' ').filter(Boolean);
    var hits = [];
    index.forEach(function (entry) {
      var score = 0;
      for (var i = 0; i < toks.length; i++) {
        var s = tokenScore(toks[i], entry);
        if (!s) return;
        score += s;
      }
      if (entry.nt.indexOf(nq) === 0) score += 6;
      else if (entry.nt.indexOf(nq) !== -1) score += 3;
      score += GROUP_BONUS[entry.it.g] || 0;
      hits.push({ entry: entry, score: score });
    });
    hits.sort(function (a, b) { return b.score - a.score; });
    var groups = {};
    hits.forEach(function (h) {
      var g = h.entry.it.g;
      (groups[g] = groups[g] || { g: g, best: h.score, items: [] });
      if (groups[g].items.length < MAX_PER_GROUP) groups[g].items.push(h.entry.it);
    });
    return Object.keys(groups).map(function (k) { return groups[k]; }).sort(function (a, b) {
      return b.best - a.best || GROUP_ORDER.indexOf(a.g) - GROUP_ORDER.indexOf(b.g);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Isticanje pronađenog teksta                                         */
  /* ------------------------------------------------------------------ */

  function fold(s) {
    return String(s).toLowerCase().replace(/đ/g, 'd').normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function highlight(text, q) {
    var toks = fold(q).split(/[^a-z0-9]+/).filter(function (x) { return x.length >= 2; });
    var src = String(text);
    var f = fold(src);
    // ako preklapanje dijakritika promijeni dužinu, ne ističi (rijetko)
    if (f.length !== src.length || !toks.length) return esc(src);
    var marks = new Array(src.length);
    toks.forEach(function (tok) {
      var from = 0, i;
      while ((i = f.indexOf(tok, from)) !== -1) {
        for (var k = i; k < i + tok.length; k++) marks[k] = true;
        from = i + tok.length;
      }
    });
    var out = '';
    var open = false;
    for (var j = 0; j < src.length; j++) {
      if (marks[j] && !open) { out += '<mark>'; open = true; }
      if (!marks[j] && open) { out += '</mark>'; open = false; }
      out += esc(src.charAt(j));
    }
    return out + (open ? '</mark>' : '');
  }

  var GROUP_ICON = {
    flavor: '<circle cx="12" cy="12" r="7"/><path d="M12 5c1.5-2 3.5-2.5 5-2"/>',
    brand: '<path d="M4 9 12 4l8 5v10H4z"/><path d="M9 19v-6h6v6"/>',
    collection: '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
    recipe: '<circle cx="12" cy="12" r="8"/><path d="M12 4v8l6 4"/>',
    term: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',
    guide: '<path d="M4 6h16M4 12h10M4 18h13"/>',
    gear: '<path d="M8 4h8l-2 8h-4z"/><path d="M12 12v6M8 20h8"/>',
    compare: '<path d="M8 4v16M16 4v16M4 8h8M12 16h8"/>',
    page: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>'
  };

  function itemHTML(it, q, id, asOption) {
    var ico = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + GROUP_ICON[it.g] + '</svg>';
    return (
      '<a class="gs-item" href="' + esc(it.u) + '"' + (asOption ? ' role="option" id="' + id + '" aria-selected="false" tabindex="-1"' : '') + '>' +
        '<span class="gs-item__ico"' + (it.c ? ' style="--gs-c:' + esc(it.c) + '"' : '') + '>' + ico + '</span>' +
        '<span class="gs-item__txt"><span class="gs-item__t">' + highlight(it.t, q) + '</span>' +
        (it.d ? '<span class="gs-item__d">' + esc(it.d) + '</span>' : '') + '</span>' +
      '</a>'
    );
  }

  function resultsHTML(groups, q, asOption) {
    var n = 0;
    return groups.map(function (grp) {
      var hid = 'gs-g-' + grp.g + (asOption ? '' : '-p');
      return (
        '<div class="gs-group" role="group" aria-labelledby="' + hid + '">' +
          '<p class="gs-group__h" id="' + hid + '">' + esc(t('search.groups.' + grp.g)) + '</p>' +
          grp.items.map(function (it) { return itemHTML(it, q, 'gs-opt-' + (n++), asOption); }).join('') +
        '</div>'
      );
    }).join('');
  }

  function emptyHTML(q) {
    return (
      '<div class="gs-empty">' +
        '<p class="gs-empty__t">' + esc(t('search.empty', { q: q })) + '</p>' +
        '<p class="gs-empty__d">' + esc(t('search.emptyHint')) + '</p>' +
        '<a class="btn btn--primary" href="' + V.url('suggest') + '?q=' + encodeURIComponent(q) + '">' + esc(t('search.suggestCta', { q: q })) + '</a>' +
      '</div>'
    );
  }

  function count(groups) { return groups.reduce(function (s, g) { return s + g.items.length; }, 0); }

  /* ------------------------------------------------------------------ */
  /* Prozor pretrage                                                     */
  /* ------------------------------------------------------------------ */

  var el = null;
  var input = null;
  var list = null;
  var status = null;
  var opener = null;
  var active = -1;
  var isOpen = false;

  function build() {
    if (el) return;
    el = document.createElement('div');
    el.className = 'gsearch';
    el.id = 'gsearch';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', t('search.open'));
    el.hidden = true;
    el.innerHTML =
      '<div class="gsearch__smoke" aria-hidden="true"><span></span><span></span><span></span></div>' +
      '<div class="gsearch__panel">' +
        '<div class="gsearch__bar">' +
          V.icon('search', 'gsearch__icon') +
          '<label class="sr-only" for="gsearch-input">' + esc(t('search.label')) + '</label>' +
          '<input id="gsearch-input" class="gsearch__input" type="search" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="go"' +
            ' role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="gsearch-list" placeholder="' + esc(t('search.placeholder')) + '">' +
          '<button type="button" class="gsearch__close" aria-label="' + esc(t('search.close')) + '">' + V.icon('close') + '</button>' +
        '</div>' +
        '<p class="gsearch__status" id="gsearch-status" aria-live="polite"></p>' +
        '<div class="gsearch__list" id="gsearch-list" role="listbox" aria-label="' + esc(t('search.label')) + '"></div>' +
        '<p class="gsearch__keys" aria-hidden="true">' + esc(t('search.keys')) + '</p>' +
      '</div>';
    document.body.appendChild(el);
    input = el.querySelector('#gsearch-input');
    list = el.querySelector('#gsearch-list');
    status = el.querySelector('#gsearch-status');

    input.addEventListener('input', render);
    input.addEventListener('keydown', onKey);
    el.querySelector('.gsearch__close').addEventListener('click', function () { close(true); });
    el.addEventListener('click', function (e) {
      if (e.target === el || e.target.classList.contains('gsearch__panel')) close(true);
    });
    list.addEventListener('mousemove', function (e) {
      var a = e.target.closest('.gs-item');
      if (!a) return;
      var opts = options();
      var i = opts.indexOf(a);
      if (i !== -1 && i !== active) setActive(i, false);
    });
  }

  function options() { return Array.prototype.slice.call(list.querySelectorAll('[role="option"]')); }

  function setActive(i, scroll) {
    var opts = options();
    if (!opts.length) { active = -1; input.removeAttribute('aria-activedescendant'); return; }
    active = (i + opts.length) % opts.length;
    opts.forEach(function (o, k) { o.setAttribute('aria-selected', String(k === active)); });
    input.setAttribute('aria-activedescendant', opts[active].id);
    if (scroll !== false) opts[active].scrollIntoView({ block: 'nearest' });
  }

  function render() {
    var q = input.value.trim();
    if (V.normalize(q).replace(/ /g, '').length < 2) {
      list.innerHTML = '';
      status.textContent = q ? t('search.start') : '';
      input.setAttribute('aria-expanded', 'false');
      active = -1;
      input.removeAttribute('aria-activedescendant');
      return;
    }
    if (!index) {
      status.textContent = t('search.loading');
      loadIndex().then(render, function () { status.textContent = t('forms.errSend'); });
      return;
    }
    var groups = search(q);
    var n = count(groups);
    list.innerHTML = n ? resultsHTML(groups, q, true) : emptyHTML(q);
    status.textContent = MSP.plural('search.results', n);
    input.setAttribute('aria-expanded', String(n > 0));
    if (n) setActive(0, false);
    else { active = -1; input.removeAttribute('aria-activedescendant'); }
  }

  function onKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') {
      var opts = options();
      if (active >= 0 && opts[active]) { e.preventDefault(); opts[active].click(); }
    } else if (e.key === 'Escape') { e.preventDefault(); close(true); }
    else if (e.key === 'Tab') {
      // fokus ostaje u prozoru: polje <-> dugme za zatvaranje
      e.preventDefault();
      el.querySelector('.gsearch__close').focus();
    }
  }

  function onCloseKey(e) {
    if (!isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); close(true); }
    else if (e.key === 'Tab' && document.activeElement === el.querySelector('.gsearch__close')) { e.preventDefault(); input.focus(); }
  }

  function open(from) {
    build();
    if (isOpen) { input.focus(); return; }
    isOpen = true;
    opener = from || document.activeElement;
    // mobilni meni se zatvara prije pretrage
    var menuClose = document.querySelector('.menu-overlay:not([hidden]) .menu-close');
    if (menuClose) menuClose.click();
    el.hidden = false;
    requestAnimationFrame(function () { el.classList.add('is-open'); });
    document.body.classList.add('is-locked');
    var app = document.getElementById('app');
    if (app) app.inert = true;
    input.value = '';
    render();
    setTimeout(function () { input.focus(); }, 30);
    loadIndex().catch(function () {});
    var Field = FX && FX.Field;
    if (Field && Field.ready && !FX.reducedMotion()) {
      for (var i = 0; i < 5; i++) {
        Field.puff(Math.random() * window.innerWidth, window.innerHeight * (0.2 + Math.random() * 0.6), { count: 4, alpha: 0.2, r1: [120, 240], life: [1.6, 2.6], speed: [20, 70], force: true });
      }
    }
  }

  function close(returnFocus) {
    if (!isOpen) return;
    isOpen = false;
    el.classList.remove('is-open');
    var app = document.getElementById('app');
    if (app) app.inert = false;
    if (document.documentElement.classList.contains('age-ok')) document.body.classList.remove('is-locked');
    setTimeout(function () { if (!isOpen) el.hidden = true; }, FX && FX.reducedMotion() ? 0 : 250);
    if (returnFocus && opener && opener.focus) opener.focus();
  }

  MSP.Search = { open: open, close: close, search: function (q) { return loadIndex().then(function () { return search(q); }); } };

  /* ------------------------------------------------------------------ */
  /* Okidači                                                             */
  /* ------------------------------------------------------------------ */

  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-gsearch]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    e.stopPropagation();
    open(a);
  }, true);

  document.addEventListener('keydown', function (e) {
    onCloseKey(e);
    if (isOpen) return;
    var tag = (e.target && e.target.tagName) || '';
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(tag) || (e.target && e.target.isContentEditable);
    if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key === 'k' || e.key === 'K')) {
      if (!document.documentElement.classList.contains('age-ok')) return;
      e.preventDefault();
      open(document.activeElement);
      return;
    }
    // "/" : na stranicama sa svojom pretragom (početna, svi okusi) fokusira nju, inače globalnu
    if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (document.getElementById('search-input') || document.getElementById('fl-q')) return;
      if (!document.documentElement.classList.contains('age-ok')) return;
      e.preventDefault();
      open(document.activeElement);
    }
  });

  /* ------------------------------------------------------------------ */
  /* Rezervna stranica pretrage                                          */
  /* ------------------------------------------------------------------ */

  function mountPage() {
    var out = document.getElementById('gs-page-results');
    var pin = document.getElementById('gs-page-q');
    if (!out || !pin) return;
    var q0 = new URLSearchParams(location.search).get('q') || '';
    pin.value = q0;
    function run() {
      var q = pin.value.trim();
      try { history.replaceState(null, '', location.pathname + (q ? '?q=' + encodeURIComponent(q) : '')); } catch (e) { /* ignore */ }
      if (V.normalize(q).replace(/ /g, '').length < 2) { out.innerHTML = q ? '<p class="gs-empty__d">' + esc(t('search.start')) + '</p>' : ''; return; }
      loadIndex().then(function () {
        var groups = search(q);
        out.innerHTML = count(groups) ? '<p class="gsearch__status">' + esc(MSP.plural('search.results', count(groups))) + '</p>' + resultsHTML(groups, q, false) : emptyHTML(q);
      }, function () { out.innerHTML = '<p>' + esc(t('forms.errSend')) + '</p>'; });
    }
    pin.form.addEventListener('submit', function (e) { e.preventDefault(); run(); });
    pin.addEventListener('input', run);
    run();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountPage);
  else mountPage();
})();
