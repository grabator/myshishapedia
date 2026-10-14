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
    if (MSP.lang === 'bs') {
      // genitiv ("1. oktobra 2026."), što Intl na bosanskom ne daje
      var months = ['januara', 'februara', 'marta', 'aprila', 'maja', 'juna', 'jula', 'augusta', 'septembra', 'oktobra', 'novembra', 'decembra'];
      return p[2] + '. ' + months[p[1] - 1] + ' ' + p[0] + '.';
    }
    var d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
    try {
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
    } catch (e) {
      return iso;
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

  V.SORTS = ['az', 'rating', 'cooling', 'sweetness', 'fruitiness'];

  V.sortFlavors = function (list, sort) {
    var out = list.slice();
    var byName = function (a, b) { return a.name.localeCompare(b.name, MSP.lang); };
    if (sort === 'az') out.sort(byName);
    else if (sort === 'rating') {
      var R = MSP.Ratings;
      var get = function (f) { return R && R.get('flavor', f.id); };
      out.sort(function (a, b) { return V.compareRated(a, b, get) || byName(a, b); });
    } else if (V.SORTS.indexOf(sort) > 1) out.sort(function (a, b) { return (b.profile[sort] || 0) - (a.profile[sort] || 0) || byName(a, b); });
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
      V.recentStrip('recent--flush') +
      '<section class="fsec fsec--flush"><div class="container">' +
        '<div class="fl-tools">' +
          '<form class="search search--small fl-search" role="search" id="fl-form" action="' + V.url('flavors') + '">' +
            '<label class="sr-only" for="fl-q">' + esc(t('flavorsPage.searchLabel')) + '</label>' +
            '<span class="search__icon" aria-hidden="true">' + icon('search') + '</span>' +
            '<input class="search__input" id="fl-q" name="q" type="search" autocomplete="off" spellcheck="false" placeholder="' + esc(t('home.searchPlaceholder')) + '">' +
          '</form>' +
          '<div class="fl-sort"><label class="fl-sort__label" for="fl-brand">' + esc(t('flavorsPage.brandsLabel')) + '</label>' +
            '<select id="fl-brand" name="brand"><option value="">' + esc(t('flavorsPage.brandAll')) + '</option>' +
              V.brands().filter(function (b) { return V.brandFlavors(b).length; }).map(function (b) {
                return '<option value="' + esc(b.slug) + '">' + esc(b.name) + '</option>';
              }).join('') +
            '</select></div>' +
          '<div class="fl-sort"><label class="fl-sort__label" for="fl-sort">' + esc(t('flavorsPage.sortLabel')) + '</label>' +
            '<select id="fl-sort" name="sort">' + V.SORTS.map(function (s) { return '<option value="' + s + '">' + esc(t('flavorsPage.sort.' + s)) + '</option>'; }).join('') + '</select></div>' +
        '</div>' +
        '<div class="filters" role="group" aria-label="' + esc(t('flavorsPage.collectionsLabel')) + '" id="fl-cols">' +
          V.collections().map(function (c) {
            return '<button type="button" class="chip chip--col" data-col="' + c.id + '" aria-pressed="false">' + V.moodIcon(c.mood) + '<span>' + esc(L(c.title)) + '</span></button>';
          }).join('') +
        '</div>' +
        '<div class="filters filters--leaf" role="group" aria-label="' + esc(t('flavorsPage.leafLabel')) + '" id="fl-leaf">' +
          chip('data-leaf', '', t('flavorsPage.leafAll'), true) +
          ['light', 'dark'].map(function (x) { return chip('data-leaf', x, t('leaf.' + x), false); }).join('') +
        '</div>' +
        '<div class="filters" role="group" aria-label="' + esc(t('flavorsPage.tagsLabel')) + '" id="fl-tags">' +
          chip('data-tag', '', t('home.filterAll'), true) + tagKeys.map(function (x) { return chip('data-tag', x, MSP.tagLabel(x), false); }).join('') +
        '</div>' +
        '<p class="catalog__count" id="fl-count" aria-live="polite">' + esc(MSP.plural('home.count', list.length)) + '</p>' +
        '<ul class="grid" id="fl-grid" role="list">' + list.map(function (f, i) {
          return '<li class="grid__item" data-id="' + f.id + '" data-cols="' + V.collectionsOf(f).map(function (c) { return c.id; }).join(' ') + '" style="--i:' + (i % 3) + '">' + V.card(f, 'h2') + '</li>';
        }).join('') + '</ul>' +
        '<nav class="pager" id="fl-pager" aria-label="' + esc(t('pager.label')) + '" hidden></nav>' +
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
  /* Brendovi                                                            */
  /* ================================================================== */

  /**
   * Tema stranice brenda: pozadina i tekst iz palete brenda (data/brands.js),
   * a glavne boje iz njegovih okusa, pa stranica "liči" na okuse koje nudi.
   */
  var brandThemes = {};
  V.brandTheme = function (b) {
    if (!brandThemes[b.slug]) {
      var fl = V.brandFlavors(b);
      var p = {};
      Object.keys(b.palette).forEach(function (k) { p[k] = b.palette[k]; });
      if (fl[0]) {
        p.primary = fl[0].palette.primary;
        p.secondary = fl[1] ? fl[1].palette.primary : fl[0].palette.secondary;
        p.smoke = [MSP.color.lighten(p.primary, 0.5), MSP.color.lighten(p.secondary, 0.5), MSP.color.lighten(b.palette.accent, 0.4)];
      }
      brandThemes[b.slug] = V.computeTheme(p, false);
    }
    return brandThemes[b.slug];
  };

  V.brandLeafLabel = function (b) { return t('leaf.' + (b.leaf === 'both' ? 'both' : b.leaf === 'dark' ? 'dark' : 'light')); };

  function leafChipFor(b) {
    return '<span class="leaf-chip leaf-chip--' + esc(b.leaf) + '"><span class="leaf-chip__dot" aria-hidden="true"></span>' + esc(V.brandLeafLabel(b)) + '</span>';
  }

  /** Kartica brenda: ime kao tipografija, zemlja, list, broj okusa i boje njegovih okusa. */
  V.brandCard = function (b, headingTag, i) {
    var h = headingTag || 'h3';
    var th = V.brandTheme(b);
    var fl = V.brandFlavors(b);
    var MAX_SW = 6;
    var swatches = fl.slice(0, MAX_SW).map(function (f, k) {
      var ft = V.themeFor(f);
      var ing = V.byIntensity(f)[0];
      return '<span class="bcard__sw" style="--k:' + k + ';--sw:' + ft.bg + ';--sw2:' + f.palette.primary + '">' +
        (ing ? MSP.illustrate(ing.illustration, { color: ing.color }) : '') + '</span>';
    }).join('') + (fl.length > MAX_SW ? '<span class="bcard__sw bcard__sw--more" style="--k:' + MAX_SW + '">+' + (fl.length - MAX_SW) + '</span>' : '');
    return (
      '<a class="bcard" href="' + V.brandUrl(b) + '" data-veil="' + th.veil + '" data-leaf="' + esc(b.leaf) + '" data-reveal style="--i:' + ((i || 0) % 3) + ';' +
        '--bc-bg:' + th.bg + ';--bc-text:' + th.text + ';--bc-muted:' + th.muted + ';--bc-accent:' + th.accentInk + ';--bc-glow:' + th.surface2 + ';--bc-primary:' + th.primary + ';--bc-secondary:' + th.secondary + '">' +
        '<span class="bcard__glow" aria-hidden="true"></span>' +
        '<span class="bcard__top">' +
          '<span class="bcard__country">' + icon('globe') + esc(L(b.country)) + '</span>' +
          leafChipFor(b) +
        '</span>' +
        '<' + h + ' class="bcard__name" style="--len:' + b.name.length + '">' + esc(b.name) + '</' + h + '>' +
        '<span class="bcard__short">' + esc(L(b.short)) + '</span>' +
        '<span class="bcard__foot">' +
          '<span class="bcard__sws" aria-hidden="true">' + swatches + '</span>' +
          '<span class="bcard__count">' + esc(MSP.plural('brands.flavorsCount', fl.length)) + '</span>' +
        '</span>' +
        '<span class="card__arrow" aria-hidden="true">' + icon('arrowUpRight') + '</span>' +
      '</a>'
    );
  };

  function brandsWithFlavors() { return V.brands().filter(function (b) { return V.brandFlavors(b).length; }); }

  function pageBrands(crumbs) {
    var list = brandsWithFlavors();
    var chip = function (val, label, on) {
      return '<button type="button" class="chip' + (on ? ' is-active' : '') + '" data-leaf="' + esc(val) + '" aria-pressed="' + on + '">' + esc(label) + '</button>';
    };
    return (
      V.pageHero({ id: 'brands-title', eyebrow: t('brands.eyebrow'), title: t('brands.title'), lead: t('brands.lead'), crumbs: crumbs }) +
      '<section class="fsec fsec--flush"><div class="container">' +
        '<div class="fl-tools br-tools">' +
          '<form class="search search--small fl-search" role="search" id="br-form" action="' + V.url('brands') + '">' +
            '<label class="sr-only" for="br-q">' + esc(t('brands.searchLabel')) + '</label>' +
            '<span class="search__icon" aria-hidden="true">' + icon('search') + '</span>' +
            '<input class="search__input" id="br-q" name="q" type="search" autocomplete="off" spellcheck="false" placeholder="' + esc(t('brands.searchPlaceholder')) + '">' +
          '</form>' +
          '<div class="fl-sort"><label class="fl-sort__label" for="br-jump">' + esc(t('brands.jumpLabel')) + '</label>' +
            '<select id="br-jump"><option value="">' + esc(t('brands.jumpPick')) + '</option>' +
              list.slice().sort(function (a, c) { return a.name.localeCompare(c.name); }).map(function (b) {
                return '<option value="' + esc(V.brandUrl(b)) + '">' + esc(b.name) + ' (' + V.brandFlavors(b).length + ')</option>';
              }).join('') +
            '</select></div>' +
        '</div>' +
        '<div class="filters" role="group" aria-label="' + esc(t('brands.filterLabel')) + '" id="br-leaf">' +
          chip('', t('brands.all'), true) + chip('light', t('leaf.light'), false) + chip('dark', t('leaf.dark'), false) +
        '</div>' +
        '<p class="catalog__count" id="br-count" aria-live="polite">' + esc(MSP.plural('brands.count', list.length)) + '</p>' +
        '<ul class="bcards" id="br-grid" role="list">' + list.map(function (b, i) {
          return '<li class="bcards__item" data-name="' + esc(V.normalize(b.name + ' ' + MSP.L(b.country, 'bs') + ' ' + MSP.L(b.country, 'en'))) + '">' + V.brandCard(b, 'h2', i) + '</li>';
        }).join('') + '</ul>' +
        '<p class="empty" id="br-empty" hidden>' + esc(t('brands.empty')) + '</p>' +
        '<p class="fl-suggest-line">' + esc(t('flavorsPage.suggestLine')) + ' <a href="' + V.url('suggest') + '">' + esc(t('nav.suggest')) + '</a></p>' +
      '</div></section>'
    );
  }

  /** Traka u zaglavlju brenda: koliko okusa je brend sam provjerio i kad (samo ako ima takvih). */
  function brandVerified(b, fl) {
    var done = fl.filter(function (f) { return f.verified; });
    if (!done.length) return '';
    var last = done.map(function (f) { return f.verified; }).sort().pop();
    return '<p class="bverified anim-in" style="--i:6">' + icon('check') + '<span>' +
      esc(MSP.plural('verified.brandBanner', done.length, { name: b.name, total: fl.length })) +
      ' <span class="bverified__when">' + esc(t('verified.lastCheck', { date: V.verifiedDate(last) })) + '</span></span></p>';
  }

  // Brend sa više okusa: na stranici brenda 12 kartica, ostalo na stranici svih okusa (?brand=),
  // a "Sastav na prvi pogled" postaje kompaktna lista na otvaranje (sama se otvori na #sastav).
  var BRAND_GRID = 12;

  /** Sastav svih okusa brenda na jednom mjestu (jedan link koji brend može pregledati). */
  function brandGlance(b, fl) {
    if (fl.length > BRAND_GRID) return brandGlanceList(b, fl);
    var th = V.brandTheme(b);
    var c = MSP.color;
    var rows = fl.map(function (f) {
      var ings = V.byIntensity(f).map(function (ing) {
        var v = Math.max(0, Math.min(10, ing.intensity));
        // tamna boja (npr. kola) na tamnoj pozadini se ne vidi: tad traka ide prema boji teksta
        var ink = c.contrast(ing.color, th.surface) >= 2.4 ? ing.color : c.mix(th.text, ing.color, 0.3);
        return '<li class="gi" style="--ing:' + ink + ';--v:' + v + '">' +
          '<span class="gi__name">' + esc(L(ing.name)) + '</span>' +
          '<span class="gi__val"><b>' + v + '</b>/10</span>' +
          '<span class="gi__bar" aria-hidden="true"><span></span></span>' +
        '</li>';
      }).join('');
      return '<li class="glance__row">' +
        '<p class="glance__head"><a class="glance__name" href="' + V.flavorUrl(f) + '">' + esc(f.name) + '</a>' + V.verifiedBadge(f, 'card') + '</p>' +
        '<p class="glance__short">' + esc(L(f.shortDescription)) + '</p>' +
        '<ul class="glance__ings" role="list">' + ings + '</ul>' +
      '</li>';
    }).join('');
    return '<section class="fsec fsec--tight" aria-labelledby="brand-glance" id="sastav"><div class="container">' +
      '<h2 class="mix__h" id="brand-glance">' + esc(t('brands.glanceTitle')) + '</h2>' +
      '<p class="glance__lead">' + esc(t('brands.glanceLead')) + '</p>' +
      '<ul class="glance" role="list">' + rows + '</ul>' +
    '</div></section>';
  }

  /** Alati iznad okusa brenda sa puno okusa: pretraga unutar brenda, sortiranje i tagovi (oživi ih Pages.brand). */
  function brandTools(b, fl) {
    var tags = {};
    fl.forEach(function (f) { (f.tags || []).forEach(function (x) { tags[x] = (tags[x] || 0) + 1; }); });
    var keys = Object.keys(tags).sort(function (a, c) { return tags[c] - tags[a]; });
    var chip = function (val, label, on) {
      return '<button type="button" class="chip' + (on ? ' is-active' : '') + '" data-tag="' + esc(val) + '" aria-pressed="' + on + '">' + esc(label) + '</button>';
    };
    return '<div class="bfilter" id="brand-tools">' +
      '<div class="fl-tools">' +
        '<form class="search search--small fl-search" role="search" id="bf-form" action="' + V.url('flavors') + '">' +
          '<input type="hidden" name="brand" value="' + esc(b.slug) + '">' +
          '<label class="sr-only" for="bf-q">' + esc(t('brands.searchIn', { name: b.name })) + '</label>' +
          '<span class="search__icon" aria-hidden="true">' + icon('search') + '</span>' +
          '<input class="search__input" id="bf-q" name="q" type="search" autocomplete="off" spellcheck="false" placeholder="' + esc(t('brands.searchIn', { name: b.name })) + '">' +
        '</form>' +
        '<div class="fl-sort"><label class="fl-sort__label" for="bf-sort">' + esc(t('flavorsPage.sortLabel')) + '</label>' +
          '<select id="bf-sort">' + V.SORTS.map(function (x) { return '<option value="' + x + '">' + esc(t('flavorsPage.sort.' + x)) + '</option>'; }).join('') + '</select></div>' +
      '</div>' +
      '<div class="filters" role="group" aria-label="' + esc(t('flavorsPage.tagsLabel')) + '" id="bf-tags">' +
        chip('', t('home.filterAll'), true) + keys.map(function (x) { return chip(x, MSP.tagLabel(x), false); }).join('') +
      '</div>' +
      '<p class="catalog__count" id="bf-count" aria-live="polite">' + esc(MSP.plural('home.count', fl.length)) + '</p>' +
    '</div>';
  }

  /** Kompaktna verzija za brendove sa puno okusa: jedan red po okusu, sastojci kao oznake. */
  function brandGlanceList(b, fl) {
    var rows = fl.map(function (f) {
      var ings = V.byIntensity(f).map(function (ing) {
        return '<li class="gchip" style="--ing:' + ing.color + '"><span class="gchip__dot" aria-hidden="true"></span>' + esc(L(ing.name)) +
          ' <b>' + Math.max(0, Math.min(10, ing.intensity)) + '</b><span class="sr-only">/10</span></li>';
      }).join('');
      return '<li class="gline">' +
        '<p class="gline__head"><a class="gline__name" href="' + V.flavorUrl(f) + '">' + esc(f.name) + '</a>' + V.verifiedBadge(f, 'card') + '</p>' +
        '<ul class="gline__ings" role="list">' + ings + '</ul>' +
      '</li>';
    }).join('');
    return '<section class="fsec fsec--tight" aria-labelledby="brand-glance" id="sastav"><div class="container">' +
      '<details class="glance-fold" id="glance-fold">' +
        '<summary class="glance-fold__sum"><h2 class="mix__h" id="brand-glance">' + esc(t('brands.glanceTitle')) + '</h2>' +
          '<span class="glance-fold__count">' + esc(MSP.plural('brands.flavorsCount', fl.length)) + '</span>' + icon('chevronDown') + '</summary>' +
        '<p class="glance__lead">' + esc(t('brands.glanceLead')) + '</p>' +
        '<ul class="glines" role="list">' + rows + '</ul>' +
      '</details>' +
    '</div></section>';
  }

  function pageBrand(b, crumbs) {
    var fl = V.brandFlavors(b);
    var about = L(b.about) || [];
    var others = brandsWithFlavors().filter(function (x) { return x !== b; });
    var wisps = '';
    for (var i = 0; i < 5; i++) wisps += '<span class="bsmoke__w" style="--k:' + i + '"></span>';
    return (
      '<section class="bhero" aria-labelledby="brand-title">' +
        '<div class="bsmoke" aria-hidden="true">' + wisps + '</div>' +
        crumbs +
        '<div class="container bhero__inner">' +
          '<p class="eyebrow anim-in" style="--i:0"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('brands.eyebrow')) + '</p>' +
          '<h1 class="bhero__name anim-in" style="--i:1;--len:' + b.name.length + '" id="brand-title" tabindex="-1">' + esc(b.name) + '</h1>' +
          '<ul class="bhero__meta anim-in" style="--i:2" role="list">' +
            '<li><span class="bhero__k">' + esc(t('brands.country')) + '</span><span class="bhero__v">' + icon('globe') + esc(L(b.country)) + '</span></li>' +
            '<li><span class="bhero__k">' + esc(t('brands.leafLabel')) + '</span><span class="bhero__v">' + leafChipFor(b) + '</span></li>' +
            '<li><span class="bhero__k">' + esc(t('brands.flavorsTitle')) + '</span><span class="bhero__v">' + esc(MSP.plural('brands.flavorsCount', fl.length)) + '</span></li>' +
          '</ul>' +
          '<div class="bhero__about">' + about.map(function (p, k) { return '<p class="anim-in" style="--i:' + (k + 3) + '">' + esc(p) + '</p>'; }).join('') + '</div>' +
          brandVerified(b, fl) +
        '</div>' +
      '</section>' +
      '<section class="fsec fsec--tight" aria-labelledby="brand-flavors"><div class="container">' +
        '<h2 class="mix__h" id="brand-flavors">' + esc(t('brands.flavorsTitle')) + '</h2>' +
        (fl.length > BRAND_GRID ? brandTools(b, fl) : '') +
        '<ul class="grid' + (fl.length < 3 ? ' grid--big' : '') + '" id="brand-grid" data-brand="' + esc(b.slug) + '" role="list">' + fl.slice(0, BRAND_GRID).map(function (f, k) {
          return '<li class="grid__item" data-reveal style="--i:' + (k % 3) + '">' + V.card(f, 'h3') + '</li>';
        }).join('') + '</ul>' +
        (fl.length > BRAND_GRID ? '<nav class="pager" id="brand-pager" aria-label="' + esc(t('pager.label')) + '" hidden></nav>' +
          '<p class="empty" id="brand-empty" hidden>' + esc(t('flavorsPage.emptyTitle')) + '</p>' : '') +
        (fl.length > BRAND_GRID
          ? '<p class="bmore"><a class="btn btn--primary" href="' + V.url('flavors') + '?brand=' + encodeURIComponent(b.slug) + '"><span>' +
            esc(t('brands.showAll', { n: fl.length })) + '</span>' + icon('arrowUpRight') + '</a></p>'
          : '') +
        '<p class="mix__note bnote" role="note">' + icon('alert') + '<span>' + esc(t('brands.disclaimer', { name: b.name })) + '</span></p>' +
      '</div></section>' +
      brandGlance(b, fl) +
      '<section class="fsec fsec--alt" aria-labelledby="brand-others"><div class="container">' +
        '<h2 class="mix__h" id="brand-others">' + esc(t('brands.otherTitle')) + '</h2>' +
        '<ul class="bcards bcards--small" role="list">' + others.map(function (x, k) { return '<li class="bcards__item">' + V.brandCard(x, 'h3', k) + '</li>'; }).join('') + '</ul>' +
        '<p><a class="btn btn--ghost" href="' + V.url('brands') + '">' + icon('arrowLeft') + '<span>' + esc(t('brands.allBrands')) + '</span></a></p>' +
      '</div></section>'
    );
  }

  /* ================================================================== */
  /* Najbolje ocijenjeni (brojke i redoslijed dolaze iz js/ratings.js)   */
  /* ================================================================== */

  function topRow(kind, o) {
    return (
      '<li class="top__item" data-kind="' + kind + '" data-id="' + esc(o.id) + '" data-brands="' + esc(o.brands.join(' ')) + '" data-cols="' + esc(o.cols.join(' ')) + '" hidden>' +
        '<a class="top__link" href="' + o.url + '" data-veil="' + o.veil + '" style="--tp-bg:' + o.bg + ';--tp-text:' + o.text + ';--tp-muted:' + o.muted + ';--tp-accent:' + o.accent + '">' +
          '<span class="top__rank" aria-hidden="true"></span>' +
          '<span class="top__art" aria-hidden="true">' + o.art + '</span>' +
          '<span class="top__txt"><span class="top__kicker">' + esc(o.kicker) + '</span><span class="top__name">' + esc(o.name) + '</span></span>' +
          V.rateSlot(kind, o.id, 'rpill--top') +
        '</a>' +
      '</li>'
    );
  }

  function topList(kind, rows, headingId) {
    var skeleton = '';
    for (var i = 0; i < 5; i++) skeleton += '<li class="top__ghost" style="--i:' + i + '" aria-hidden="true"><span></span></li>';
    return (
      '<section class="top__col" aria-labelledby="' + headingId + '">' +
        '<h2 class="top__h" id="' + headingId + '">' + icon(kind === 'recipe' ? 'mix' : 'star') + '<span>' + esc(t(kind === 'recipe' ? 'ratings.topMixes' : 'ratings.topFlavors')) + '</span></h2>' +
        '<ol class="top__list" role="list" data-top-list="' + kind + '">' + skeleton + rows + '</ol>' +
        '<p class="top__empty" data-top-empty="' + kind + '" hidden>' + esc(t('ratings.topEmpty', { n: V.TOP_MIN })) + '</p>' +
      '</section>'
    );
  }

  function pageTop(crumbs) {
    var flavorRows = V.flavors().map(function (f) {
      var th = V.themeFor(f);
      var ing = V.byIntensity(f)[0];
      return topRow('flavor', {
        id: f.id, url: V.flavorUrl(f), veil: th.veil, bg: th.bg, text: th.text, muted: th.muted, accent: th.accentInk,
        art: ing ? MSP.illustrate(ing.illustration, { color: ing.color }) : '',
        kicker: f.brand, name: f.name,
        brands: [f.brandId], cols: V.collectionsOf(f).map(function (c) { return c.id; })
      });
    }).join('');
    var mixRows = V.mixes().map(function (m) {
      var th = V.recipeTheme(m);
      var fl = V.recipeFlavors(m);
      var brands = [], cols = [];
      fl.forEach(function (f) {
        if (brands.indexOf(f.brandId) === -1) brands.push(f.brandId);
        V.collectionsOf(f).forEach(function (c) { if (cols.indexOf(c.id) === -1) cols.push(c.id); });
      });
      return topRow('recipe', {
        id: m.id, url: V.recipeUrl(m), veil: th.veil, bg: th.bg, text: th.text, muted: th.muted, accent: th.accentInk,
        art: V.bowlTop(m, { cls: 'bowl-top--mini' }),
        kicker: V.recipePartsText(m), name: L(m.name),
        brands: brands, cols: cols
      });
    }).join('');
    var brandOpts = V.brands().filter(function (b) { return V.brandFlavors(b).length; }).map(function (b) {
      return '<option value="' + esc(b.slug) + '">' + esc(b.name) + '</option>';
    }).join('');
    var colOpts = V.collections().map(function (c) { return '<option value="' + c.id + '">' + esc(L(c.title)) + '</option>'; }).join('');
    return (
      V.pageHero({ id: 'top-title', eyebrow: t('ratings.eyebrow'), title: t('ratings.topTitle'), lead: t('ratings.topLead', { n: V.TOP_MIN }), crumbs: crumbs }) +
      '<section class="fsec fsec--flush"><div class="container top" id="top" data-top-min="' + V.TOP_MIN + '">' +
        '<div class="fl-tools top__tools">' +
          '<div class="fl-sort"><label class="fl-sort__label" for="top-brand">' + esc(t('flavorsPage.brandsLabel')) + '</label>' +
            '<select id="top-brand" name="brand"><option value="">' + esc(t('flavorsPage.brandAll')) + '</option>' + brandOpts + '</select></div>' +
          '<div class="fl-sort"><label class="fl-sort__label" for="top-col">' + esc(t('flavorsPage.collectionsLabel')) + '</label>' +
            '<select id="top-col" name="col"><option value="">' + esc(t('ratings.colAll')) + '</option>' + colOpts + '</select></div>' +
        '</div>' +
        '<p class="top__status" id="top-status" role="status" aria-live="polite">' + esc(t('ratings.loading')) + '</p>' +
        '<div class="top__cols">' + topList('flavor', flavorRows, 'top-flavors') + topList('recipe', mixRows, 'top-mixes') + '</div>' +
        '<noscript><p class="top__noscript">' + esc(t('ratings.noJs')) + '</p></noscript>' +
        '<p class="mix__note" role="note">' + icon('alert') + '<span>' + esc(t('ratings.topNote', { n: V.TOP_MIN })) + '</span></p>' +
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

  V.EXTRA_PAGES = ['privacy', 'terms', 'suggest', 'report', 'flavors', 'search', 'brands', 'top', 'shelf', 'tips'];
  V.NOINDEX_PAGES = ['report', 'search', 'shelf'];

  V.pageExtra = function (desc, crumbs, cfg) {
    switch (desc.page) {
      case 'privacy': return { main: pageLegal('privacy', crumbs, cfg), title: t('meta.privacyTitle'), description: t('meta.privacyDescription') };
      case 'terms': return { main: pageLegal('terms', crumbs, cfg), title: t('meta.termsTitle'), description: t('meta.termsDescription') };
      case 'suggest': return { main: pageSuggest(crumbs, cfg), title: t('meta.suggestTitle'), description: t('meta.suggestDescription') };
      case 'report': return { main: pageReport(crumbs, cfg), title: t('meta.reportTitle'), description: t('meta.reportDescription') };
      case 'flavors': return { main: pageFlavors(crumbs), title: t('meta.flavorsTitle'), description: t('meta.flavorsDescription') };
      case 'search': return { main: pageSearch(crumbs), title: t('meta.searchTitle'), description: t('meta.searchDescription') };
      case 'brands': return { main: pageBrands(crumbs), title: t('meta.brandsTitle'), description: t('meta.brandsDescription') };
      case 'top': return { main: pageTop(crumbs), title: t('meta.topTitle'), description: t('meta.topDescription') };
      case 'shelf': return { main: V.pageShelf(crumbs), title: t('meta.shelfTitle'), description: t('meta.shelfDescription') };
      case 'tips': return { main: V.pageTips(crumbs), title: t('meta.tipsTitle'), description: t('meta.tipsDescription') };
      case 'brand':
        var b = desc.brand;
        return {
          main: pageBrand(b, crumbs),
          title: t('meta.brandTitle', { name: b.name, country: L(b.country) }),
          description: V.clip(L(b.short) + ' ' + t('brands.metaIn', { list: V.brandFlavors(b).map(function (f) { return f.name; }).join(', ') })),
          theme: V.brandTheme(b)
        };
    }
    return { main: '', title: '', description: '' };
  };
})(typeof window !== 'undefined' ? window : globalThis);
