/*
 * MyShishapedia - pogledi za: sve okuse (pretraga, filteri, sortiranje), politiku privatnosti,
 * uslove korištenja, forme (predloži okus, prijavi grešku) i stranicu pretrage.
 *
 * Nastavak js/views.js i js/views-more.js (isti MSP.V objekat).
 */
(function (root) {
  'use strict';

  var MSP = root.MSP;
  var V = MSP.V;
  var esc = V.esc;
  var icon = V.icon;

  function t(k, v) { return MSP.t(k, v); }
  function L(v, lang) { return MSP.L(v, lang); }

  /** Datum iz "GGGG-MM-DD" na jeziku stranice. */
  V.formatDate = function (iso) {
    var p = String(iso || '').split('-').map(Number);
    if (p.length !== 3) return iso || '';
    var d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
    try {
      return d.toLocaleDateString(MSP.lang === 'bs' ? 'bs-BA' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
    } catch (e) {
      return MSP.lang === 'bs' ? p[2] + '. ' + p[1] + '. ' + p[0] + '.' : iso;
    }
  };

  /** Zaštićen email link (JavaScript ga složi; bez njega "ime [at] domen [dot] com"). */
  V.mailLink = function (cfg, label) {
    var email = (cfg && cfg.AUTHOR_EMAIL) || '';
    if (!email) return '';
    return '<a class="mail-link" href="' + V.url('about') + '#kontakt" data-m="' + V.mailParts(email) + '">' + esc(label || t('about.contactCta')) + '</a>' +
      '<noscript> (' + esc(V.mailPlain(email)) + ')</noscript>';
  };

  /* ================================================================== */
  /* Politika privatnosti i uslovi                                       */
  /* ================================================================== */

  function renderBody(lines, cfg) {
    var out = '';
    var list = '';
    lines.forEach(function (line) {
      if (line.indexOf('- ') === 0) { list += '<li>' + esc(line.slice(2)) + '</li>'; return; }
      if (list) { out += '<ul>' + list + '</ul>'; list = ''; }
      var html = esc(line).replace('{email}', V.mailLink(cfg));
      out += '<p>' + html + '</p>';
    });
    if (list) out += '<ul>' + list + '</ul>';
    return out;
  }

  function pageLegal(kind, crumbs, cfg) {
    var doc = (root.LEGAL || {})[kind] || { lead: '', sections: [] };
    var title = t(kind === 'privacy' ? 'legal.privacyTitle' : 'legal.termsTitle');
    var toc = doc.sections.map(function (s, i) {
      return '<li><a href="#' + kind + '-' + (i + 1) + '">' + esc(L(s.title)) + '</a></li>';
    }).join('');
    return (
      V.pageHero({ id: 'legal-title', eyebrow: t('legal.eyebrow'), title: title, lead: L(doc.lead), crumbs: crumbs }) +
      '<section class="fsec fsec--flush"><div class="container legal">' +
        '<p class="legal__updated">' + esc(t('legal.updated', { date: V.formatDate(cfg && cfg.LEGAL_UPDATED) })) + '</p>' +
        '<nav class="legal__toc" aria-label="' + esc(title) + '"><ol>' + toc + '</ol></nav>' +
        '<div class="legal__body prose">' +
          doc.sections.map(function (s, i) {
            return '<section id="' + kind + '-' + (i + 1) + '" aria-labelledby="' + kind + '-h-' + (i + 1) + '">' +
              '<h2 id="' + kind + '-h-' + (i + 1) + '">' + esc(L(s.title)) + '</h2>' + renderBody(L(s.body) || [], cfg) + '</section>';
          }).join('') +
          '<p class="legal__note">' + esc(t('legal.notLegal')) + '</p>' +
          '<p class="legal__other"><a class="btn btn--ghost" href="' + V.url(kind === 'privacy' ? 'terms' : 'privacy') + '">' +
            esc(t(kind === 'privacy' ? 'legal.termsTitle' : 'legal.privacyTitle')) + icon('arrowRight') + '</a></p>' +
        '</div>' +
      '</div></section>'
    );
  }

  /* ================================================================== */
  /* Forme                                                               */
  /* ================================================================== */

  function field(o) {
    var id = o.id;
    var req = !!o.required;
    var labelExtra = '<span class="field__req">' + esc(t(req ? 'forms.required' : 'forms.optional')) + '</span>';
    var control;
    var common = ' id="' + id + '" name="' + o.name + '"' + (req ? ' required aria-required="true"' : '') +
      ' aria-describedby="' + id + '-err"' + (o.placeholder ? ' placeholder="' + esc(o.placeholder) + '"' : '');
    if (o.type === 'textarea') {
      control = '<textarea' + common + ' rows="' + (o.rows || 4) + '" maxlength="' + (o.max || 2000) + '"></textarea>';
    } else if (o.type === 'select') {
      control = '<select' + common + '>' + o.options + '</select>';
    } else {
      control = '<input' + common + ' type="' + (o.type || 'text') + '" maxlength="' + (o.max || 200) + '"' +
        (o.autocomplete ? ' autocomplete="' + o.autocomplete + '"' : ' autocomplete="off"') + (o.inputmode ? ' inputmode="' + o.inputmode + '"' : '') + '>';
    }
    return (
      '<div class="field' + (o.wide ? ' field--wide' : '') + '">' +
        '<label class="field__label" for="' + id + '">' + esc(o.label) + labelExtra + '</label>' +
        control +
        '<p class="field__err" id="' + id + '-err" aria-live="polite"></p>' +
      '</div>'
    );
  }

  function formShell(kind, inner, cfg) {
    var endpoint = (cfg && cfg.FORM_ENDPOINT) || '';
    var email = (cfg && cfg.AUTHOR_EMAIL) || '';
    return (
      '<form class="mform" id="' + kind + '-form" data-form="' + kind + '" data-m="' + (email ? V.mailParts(email) : '') + '"' +
        (endpoint ? ' action="' + esc(endpoint) + '" method="post" data-endpoint="' + esc(endpoint) + '"' : '') + ' novalidate>' +
        '<div class="mform__hp" aria-hidden="true"><label for="' + kind + '-hp">' + esc(t('forms.honeypot')) + '</label>' +
          '<input id="' + kind + '-hp" name="_gotcha" type="text" tabindex="-1" autocomplete="off"></div>' +
        '<input type="hidden" name="_subject" value="">' +
        '<input type="hidden" name="_language" value="' + MSP.lang + '">' +
        '<p class="mform__summary" role="alert" hidden></p>' +
        '<div class="mform__grid">' + inner + '</div>' +
        '<p class="mform__note">' + esc(t('forms.privacyNote')) + ' <a href="' + V.url('privacy') + '">' + esc(t('forms.privacyLink')) + '</a>.</p>' +
        '<div class="mform__actions">' +
          '<button type="submit" class="btn btn--primary mform__send">' + icon('arrowRight') + '<span>' + esc(t('forms.send')) + '</span></button>' +
        '</div>' +
        (endpoint ? '' : '<noscript><p class="mform__nojs">' + esc(t('forms.noJs')) + ' ' + esc(V.mailPlain(email)) + '</p></noscript>') +
      '</form>' +
      '<div class="mform__done" id="' + kind + '-done" tabindex="-1" hidden>' +
        '<span class="mform__coal" aria-hidden="true">' + MSP.coal() + '</span>' +
        '<h2 class="mform__done-title"></h2>' +
        '<p class="mform__done-text"></p>' +
        '<button type="button" class="btn btn--ghost mform__again">' + esc(t('forms.again')) + '</button>' +
      '</div>'
    );
  }

  function pageSuggest(crumbs, cfg) {
    var inner =
      field({ id: 'sf-brand', name: 'brand', label: t('forms.brand'), placeholder: t('forms.brandHint'), required: true, max: 80 }) +
      field({ id: 'sf-name', name: 'flavor', label: t('forms.name'), placeholder: t('forms.nameHint'), required: true, max: 120 }) +
      field({ id: 'sf-ings', name: 'ingredients', label: t('forms.ingredients'), placeholder: t('forms.ingredientsHint'), wide: true, max: 300 }) +
      field({ id: 'sf-comment', name: 'comment', label: t('forms.comment'), placeholder: t('forms.commentHint'), type: 'textarea', wide: true }) +
      field({ id: 'sf-email', name: 'email', label: t('forms.email'), placeholder: t('forms.emailHint'), type: 'email', autocomplete: 'email', inputmode: 'email', wide: true, max: 160 });
    return (
      V.pageHero({ id: 'suggest-title', eyebrow: t('forms.suggestEyebrow'), title: t('forms.suggestTitle'), lead: t('forms.suggestLead'), crumbs: crumbs }) +
      '<section class="fsec fsec--flush"><div class="container mform-wrap">' + formShell('suggest', inner, cfg) + '</div></section>'
    );
  }

  function pageReport(crumbs, cfg) {
    var options = '<option value="">' + esc(t('forms.flavorPick')) + '</option>' +
      V.flavors().map(function (f) { return '<option value="' + f.id + '">' + esc(f.brand + ' ' + f.name) + '</option>'; }).join('');
    var whats = ['composition', 'description', 'profile', 'other'];
    var radios =
      '<fieldset class="field field--wide field--radios" aria-describedby="rf-what-err">' +
        '<legend class="field__label">' + esc(t('forms.what')) + '<span class="field__req">' + esc(t('forms.required')) + '</span></legend>' +
        '<div class="radios">' + whats.map(function (w, i) {
          var key = 'forms.what' + w.charAt(0).toUpperCase() + w.slice(1);
          return '<label class="radio"><input type="radio" name="what" value="' + w + '"' + (i === 0 ? ' required' : '') + '><span>' + esc(t(key)) + '</span></label>';
        }).join('') + '</div>' +
        '<p class="field__err" id="rf-what-err" aria-live="polite"></p>' +
      '</fieldset>';
    var inner =
      field({ id: 'rf-flavor', name: 'flavor', label: t('forms.flavor'), type: 'select', options: options, required: true, wide: true }) +
      radios +
      field({ id: 'rf-correct', name: 'correct', label: t('forms.correct'), placeholder: t('forms.correctHint'), type: 'textarea', required: true, wide: true }) +
      field({ id: 'rf-source', name: 'source', label: t('forms.source'), placeholder: t('forms.sourceHint'), type: 'url', inputmode: 'url', wide: true, max: 400 }) +
      field({ id: 'rf-email', name: 'email', label: t('forms.email'), placeholder: t('forms.emailHint'), type: 'email', autocomplete: 'email', inputmode: 'email', wide: true, max: 160 });
    return (
      V.pageHero({ id: 'report-title', eyebrow: t('forms.reportEyebrow'), title: t('forms.reportTitle'), lead: t('forms.reportLead'), crumbs: crumbs }) +
      '<section class="fsec fsec--flush"><div class="container mform-wrap">' + formShell('report', inner, cfg) + '</div></section>'
    );
  }

  /* ================================================================== */
  /* Svi okusi                                                           */
  /* ================================================================== */

  V.SORTS = ['az', 'cooling', 'sweetness', 'fruitiness'];

  V.sortFlavors = function (list, sort) {
    var out = list.slice();
    if (sort === 'az') out.sort(function (a, b) { return a.name.localeCompare(b.name, MSP.lang); });
    else if (V.SORTS.indexOf(sort) > 0) out.sort(function (a, b) { return (b.profile[sort] || 0) - (a.profile[sort] || 0) || a.name.localeCompare(b.name, MSP.lang); });
    return out;
  };

  function pageFlavors(crumbs) {
    var list = V.sortFlavors(V.flavors(), 'az');
    var chip = function (attr, val, label, on) {
      return '<button type="button" class="chip' + (on ? ' is-active' : '') + '" ' + attr + '="' + esc(val) + '" aria-pressed="' + on + '">' + esc(label) + '</button>';
    };
    var tags = {};
    V.flavors().forEach(function (f) { (f.tags || []).forEach(function (x) { tags[x] = (tags[x] || 0) + 1; }); });
    var tagKeys = Object.keys(tags).sort(function (a, b) { return tags[b] - tags[a] || MSP.tagLabel(a).localeCompare(MSP.tagLabel(b), MSP.lang); });
    return (
      V.pageHero({ id: 'flavors-title', eyebrow: t('flavorsPage.eyebrow'), title: t('flavorsPage.title'), lead: t('flavorsPage.lead'), crumbs: crumbs }) +
      '<section class="fsec fsec--flush"><div class="container">' +
        '<div class="fl-tools">' +
          '<form class="search search--small fl-search" role="search" id="fl-form" action="' + V.url('flavors') + '">' +
            '<label class="sr-only" for="fl-q">' + esc(t('flavorsPage.searchLabel')) + '</label>' +
            '<span class="search__icon" aria-hidden="true">' + icon('search') + '</span>' +
            '<input class="search__input" id="fl-q" name="q" type="search" autocomplete="off" spellcheck="false" placeholder="' + esc(t('home.searchPlaceholder')) + '">' +
          '</form>' +
          '<div class="fl-sort"><label class="fl-sort__label" for="fl-sort">' + esc(t('flavorsPage.sortLabel')) + '</label>' +
            '<select id="fl-sort" name="sort">' + V.SORTS.map(function (s) { return '<option value="' + s + '">' + esc(t('flavorsPage.sort.' + s)) + '</option>'; }).join('') + '</select></div>' +
        '</div>' +
        '<div class="filters" role="group" aria-label="' + esc(t('flavorsPage.collectionsLabel')) + '" id="fl-cols">' +
          V.collections().map(function (c) {
            return '<button type="button" class="chip chip--col" data-col="' + c.id + '" aria-pressed="false">' + V.moodIcon(c.mood) + '<span>' + esc(L(c.title)) + '</span></button>';
          }).join('') +
        '</div>' +
        '<div class="filters" role="group" aria-label="' + esc(t('flavorsPage.tagsLabel')) + '" id="fl-tags">' +
          chip('data-tag', '', t('home.filterAll'), true) + tagKeys.map(function (x) { return chip('data-tag', x, MSP.tagLabel(x), false); }).join('') +
        '</div>' +
        '<p class="catalog__count" id="fl-count" aria-live="polite">' + esc(MSP.plural('home.count', list.length)) + '</p>' +
        '<ul class="grid" id="fl-grid" role="list">' + list.map(function (f, i) {
          return '<li class="grid__item" data-id="' + f.id + '" data-cols="' + V.collectionsOf(f).map(function (c) { return c.id; }).join(' ') + '" style="--i:' + (i % 3) + '">' + V.card(f, 'h2') + '</li>';
        }).join('') + '</ul>' +
        '<div class="empty fl-empty" id="fl-empty" hidden>' +
          '<span class="fl-empty__coal" aria-hidden="true">' + MSP.coal() + '</span>' +
          '<p class="empty__title">' + esc(t('flavorsPage.emptyTitle')) + '</p>' +
          '<p class="empty__text">' + esc(t('flavorsPage.emptyText')) + '</p>' +
          '<p class="fl-empty__actions"><a class="btn btn--primary" id="fl-suggest" href="' + V.url('suggest') + '">' + esc(t('flavorsPage.suggestCta')) + '</a>' +
          '<button type="button" class="btn btn--ghost" id="fl-reset">' + esc(t('flavorsPage.reset')) + '</button></p>' +
        '</div>' +
        '<p class="fl-suggest-line">' + esc(t('flavorsPage.suggestLine')) + ' <a href="' + V.url('suggest') + '">' + esc(t('nav.suggest')) + '</a></p>' +
      '</div></section>'
    );
  }

  /* ================================================================== */
  /* Stranica pretrage (rezerva za globalnu pretragu)                    */
  /* ================================================================== */

  function pageSearch(crumbs) {
    var links = ['flavors', 'collections', 'mixes', 'glossary', 'guide'].map(function (p) {
      return '<li><a href="' + V.url(p) + '">' + esc(t('nav.' + (p === 'flavors' ? 'allFlavors' : p))) + '</a></li>';
    }).join('');
    return (
      V.pageHero({ id: 'search-title', eyebrow: t('nav.search'), title: t('search.pageTitle'), lead: t('search.pageLead'), crumbs: crumbs }) +
      '<section class="fsec fsec--flush"><div class="container gsearch-page">' +
        '<form class="search gsearch-page__form" role="search" action="' + V.url('search') + '">' +
          '<label class="sr-only" for="gs-page-q">' + esc(t('search.label')) + '</label>' +
          '<span class="search__icon" aria-hidden="true">' + icon('search') + '</span>' +
          '<input class="search__input" id="gs-page-q" name="q" type="search" autocomplete="off" spellcheck="false" placeholder="' + esc(t('search.placeholder')) + '">' +
        '</form>' +
        '<div class="gsearch-page__results" id="gs-page-results" aria-live="polite"></div>' +
        '<noscript><p>' + esc(t('search.noJs')) + '</p><ul class="gsearch-page__links">' + links + '</ul></noscript>' +
      '</div></section>'
    );
  }

  /* ================================================================== */
  /* Dugmad na postojećim stranicama                                     */
  /* ================================================================== */

  V.shareButton = function (kind, id, extraCls) {
    return '<button type="button" class="btn share-btn' + (extraCls ? ' ' + extraCls : '') + '" data-share="' + kind + '"' + (id ? ' data-id="' + esc(id) + '"' : '') + '>' +
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>' +
      '<span>' + esc(t('share.button')) + '</span></button>';
  };

  V.reportUrl = function (f, lang) {
    lang = lang || MSP.lang;
    return V.urlFor(lang, 'report') + '?' + (lang === 'bs' ? 'okus' : 'flavor') + '=' + encodeURIComponent(f.id);
  };

  /* ================================================================== */
  /* Stranice (poziva ih V.page iz views.js)                             */
  /* ================================================================== */

  V.EXTRA_PAGES = ['privacy', 'terms', 'suggest', 'report', 'flavors', 'search'];
  V.NOINDEX_PAGES = ['report', 'search'];

  V.pageExtra = function (desc, crumbs, cfg) {
    switch (desc.page) {
      case 'privacy': return { main: pageLegal('privacy', crumbs, cfg), title: t('meta.privacyTitle'), description: t('meta.privacyDescription') };
      case 'terms': return { main: pageLegal('terms', crumbs, cfg), title: t('meta.termsTitle'), description: t('meta.termsDescription') };
      case 'suggest': return { main: pageSuggest(crumbs, cfg), title: t('meta.suggestTitle'), description: t('meta.suggestDescription') };
      case 'report': return { main: pageReport(crumbs, cfg), title: t('meta.reportTitle'), description: t('meta.reportDescription') };
      case 'flavors': return { main: pageFlavors(crumbs), title: t('meta.flavorsTitle'), description: t('meta.flavorsDescription') };
      case 'search': return { main: pageSearch(crumbs), title: t('meta.searchTitle'), description: t('meta.searchDescription') };
    }
    return { main: '', title: '', description: '' };
  };
})(typeof window !== 'undefined' ? window : globalThis);
