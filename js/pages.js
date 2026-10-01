/*
 * MyShishapedia - ponašanje podstranica: rječnik, pojam, oprema, vodič, mikser, kviz.
 *
 * HTML ovih stranica je već gotov (views.js + build.mjs). Svaka stranica ovdje ima
 *   mount(ctx)   poveže dugmad, pretragu, dim i animacije na postojeći HTML
 * ctx dolazi iz app.js (MSP.App): els, cleanup(fn), startHookah, heroSmoke,
 * applyTheme, replaceUrl, params().
 */
(function () {
  'use strict';

  var MSP = (window.MSP = window.MSP || {});
  var Pages = (MSP.Pages = {});
  var V = MSP.V;
  var t = MSP.t;
  var L = MSP.L;
  var FX = MSP.Effects;
  var Field = FX.Field;
  var C = MSP.color;

  function smooth() { return FX.reducedMotion() ? 'auto' : 'smooth'; }

  /** fn(stanje) kad stignu ocjene (js/ratings.js se učitava poslije ovog fajla, pa se po potrebi sačeka). */
  function withRatings(ctx, fn) {
    if (MSP.Ratings) { ctx.cleanup(MSP.Ratings.on(fn)); return; }
    document.addEventListener('DOMContentLoaded', function () { if (MSP.Ratings) ctx.cleanup(MSP.Ratings.on(fn)); }, { once: true });
  }

  /* ------------------------------------------------------------------ */
  /* Rječnik                                                             */
  /* ------------------------------------------------------------------ */

  function setTermOpen(card, open) {
    card.classList.toggle('is-open', open);
    card.querySelector('.gl-card__btn').setAttribute('aria-expanded', String(open));
  }

  Pages.glossary = {
    mount: function (ctx) {
      var main = ctx.els.main;
      var input = document.getElementById('gl-search');
      var count = document.getElementById('gl-count');
      var empty = document.getElementById('gl-empty');
      var terms = V.glossary();
      // pretraga radi na oba jezika (npr. "foil" i "folija")
      terms.forEach(function (g) {
        var parts = [];
        ['bs', 'en'].forEach(function (l) {
          parts.push(L(g.term, l), L(g.short, l));
          parts = parts.concat(L(g.aka, l) || []).concat(L(g.text, l) || []);
        });
        g._search = V.normalize(parts.join(' '));
      });

      input.addEventListener('input', function () {
        var q = V.normalize(input.value);
        var shown = 0;
        terms.forEach(function (g) {
          var card = document.getElementById('pojam-' + g.id);
          if (!card) return;
          var ok = !q || q.split(' ').every(function (tok) { return g._search.indexOf(tok) !== -1; });
          card.hidden = !ok;
          if (ok) shown++;
        });
        main.querySelectorAll('.gl-group').forEach(function (sec) {
          var any = sec.querySelector('.gl-card:not([hidden])');
          sec.hidden = !any;
          var btn = main.querySelector('.gl-letter[data-letter="' + sec.getAttribute('data-letter') + '"]');
          if (btn) btn.disabled = !any;
        });
        count.textContent = MSP.plural('glossary.count', shown);
        empty.hidden = shown > 0;
      });
      document.getElementById('gl-form').addEventListener('submit', function (e) { e.preventDefault(); input.blur(); });

      main.querySelector('.gl__letters').addEventListener('click', function (e) {
        var b = e.target.closest('.gl-letter');
        if (!b || b.disabled) return;
        var sec = main.querySelector('.gl-group[data-letter="' + b.getAttribute('data-letter') + '"]');
        if (!sec) return;
        sec.scrollIntoView({ behavior: smooth(), block: 'start' });
        sec.querySelector('.gl-group__letter').focus({ preventScroll: true });
      });

      document.getElementById('gl-list').addEventListener('click', function (e) {
        var btn = e.target.closest('.gl-card__btn');
        if (!btn) return;
        var card = btn.closest('.gl-card');
        setTermOpen(card, !card.classList.contains('is-open'));
      });

      // /rjecnik/#pojam-hmd otvori taj pojam
      var m = (location.hash || '').match(/^#pojam-([a-z0-9-]+)$/);
      if (m) {
        var card = document.getElementById('pojam-' + m[1]);
        if (card) {
          setTermOpen(card, true);
          window.setTimeout(function () {
            card.scrollIntoView({ behavior: 'auto', block: 'center' });
            card.querySelector('.gl-card__btn').focus({ preventScroll: true });
          }, 60);
        }
      }

      ctx.heroSmoke();
      ctx.cleanup(FX.reveal(main));
    }
  };

  Pages.term = {
    mount: function (ctx) {
      ctx.cleanup(FX.reveal(ctx.els.main));
    }
  };

  /* ------------------------------------------------------------------ */
  /* Oprema                                                              */
  /* ------------------------------------------------------------------ */

  Pages.gear = {
    mount: function (ctx) {
      var main = ctx.els.main;
      var state = { cat: 'bowls', a: 0, b: 1 };
      function draw() {
        var parts = V.compare(state.cat, state.a, state.b);
        document.getElementById('cmp-a').innerHTML = parts.a;
        document.getElementById('cmp-b').innerHTML = parts.b;
        document.getElementById('cmp-cols').innerHTML = parts.cols;
      }
      main.querySelector('.cmp').addEventListener('click', function (e) {
        var b = e.target.closest('.seg-btn');
        if (!b) return;
        if (b.hasAttribute('data-cat')) {
          state.cat = b.getAttribute('data-cat');
          state.a = 0;
          state.b = 1;
          main.querySelectorAll('#cmp-cat .seg-btn').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        } else {
          state[b.getAttribute('data-which')] = +b.getAttribute('data-i');
        }
        draw();
      });

      ctx.heroSmoke();
      main.querySelectorAll('.gcards').forEach(function (g) {
        ctx.cleanup(FX.hoverWisps(g, '.gcard', '.gcard__visual', null));
      });
      ctx.cleanup(FX.reveal(main));
    }
  };

  /* ------------------------------------------------------------------ */
  /* Vodič                                                               */
  /* ------------------------------------------------------------------ */

  var guide = { step: 1, liveStarted: false };

  function stepParam() { return MSP.lang === 'bs' ? 'korak' : 'step'; }

  function setGuideStep(ctx, n, opts) {
    opts = opts || {};
    var steps = V.guideSteps();
    n = Math.max(1, Math.min(steps.length, n | 0 || 1));
    var main = ctx.els.main;
    var scene = main.querySelector('.gs');
    var live = main.querySelector('.guide__live');
    if (!scene) return;
    var prev = guide.step;
    guide.step = n;

    // stanje scene: šta je već urađeno do ovog koraka
    scene.setAttribute('data-step', String(n));
    scene.classList.toggle('has-water', n >= 1 && n < 9);
    scene.classList.toggle('has-parts', n >= 2);
    scene.classList.toggle('has-tobacco', n >= 4 && n < 9);
    scene.classList.toggle('has-foil', n >= 5 && n < 9);
    scene.classList.toggle('has-coals', n >= 7 && n < 9);
    scene.classList.toggle('show-burner', n === 6 || n === 7);
    var s = steps[n - 1];
    main.querySelector('.guide__scene').setAttribute('aria-label', t('guide.sceneLabel', { title: L(s.title) }));

    // korak "uživaj": prava nargila sa "Povuci dim"
    var isLive = s.id === 'enjoy';
    live.hidden = !isLive;
    main.querySelector('.guide__stage').classList.toggle('is-live', isLive);
    if (isLive && !guide.liveStarted) {
      guide.liveStarted = true;
      ctx.startHookah(live, V.themeFor(null), { introDelay: 0.6 });
    }

    main.querySelectorAll('.gstep').forEach(function (a) {
      var cur = +a.getAttribute('data-step') === n;
      a.classList.toggle('is-current', cur);
      a.classList.remove('is-in');
      if (cur) { void a.offsetWidth; a.classList.add('is-in'); }
    });

    main.querySelectorAll('.gdot').forEach(function (d, i) {
      if (i + 1 === n) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
      d.classList.toggle('is-done', i + 1 < n);
    });
    main.querySelector('.guide').style.setProperty('--progress', ((n - 1) / (steps.length - 1)).toFixed(3));
    var prevBtn = main.querySelector('[data-guide="prev"]');
    var nextBtn = main.querySelector('[data-guide="next"]');
    prevBtn.disabled = n === 1;
    nextBtn.querySelector('span').textContent = n === steps.length ? t('guide.finish') : t('guide.next');

    if (!opts.initial) {
      ctx.replaceUrl(n > 1 ? '?' + stepParam() + '=' + n : '');
      if (Field.ready && prev !== n) {
        var r = scene.getBoundingClientRect();
        Field.puff(r.left + r.width / 2, r.top + r.height * 0.3, { count: 8, alpha: 0.18, r1: [60, 130], life: [1.4, 2.4], speed: [20, 60] });
      }
      if (opts.focus) {
        var h = document.getElementById('gstep-title-' + n);
        if (h) h.focus({ preventScroll: true });
      }
    }
  }

  Pages.guide = {
    mount: function (ctx) {
      var main = ctx.els.main;
      var p = ctx.params();
      var n = parseInt(p.get(stepParam()) || p.get('korak') || p.get('step'), 10) || 1;
      guide = { step: n, liveStarted: false };

      function go(d) {
        var total = V.guideSteps().length;
        var target = guide.step + d;
        if (target > total) target = 1;
        if (target < 1) return;
        setGuideStep(ctx, target, { focus: false });
      }
      main.querySelector('.guide').addEventListener('click', function (e) {
        var dot = e.target.closest('.gdot');
        if (dot) {
          e.preventDefault();
          setGuideStep(ctx, +dot.getAttribute('data-step'), { focus: true });
          return;
        }
        var nav = e.target.closest('[data-guide]');
        if (nav) go(nav.getAttribute('data-guide') === 'next' ? 1 : -1);
      });
      function onKey(e) {
        if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
        var tag = (e.target && e.target.tagName) || '';
        if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return;
        if (e.target && e.target.closest && e.target.closest('.hookah, .pull')) return;
        if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      }
      document.addEventListener('keydown', onKey);
      ctx.cleanup(function () { document.removeEventListener('keydown', onKey); });
      ctx.cleanup(FX.swipe(main.querySelector('.guide__grid'), function () { go(1); }, function () { go(-1); }));

      var hint = main.querySelector('.guide__hint');
      if (hint) hint.textContent = FX.finePointer() ? t('guide.keysHint') : t('guide.swipeHint');

      setGuideStep(ctx, n, { initial: true });
      ctx.heroSmoke();
      ctx.cleanup(FX.reveal(main));
      if (n > 1) {
        window.setTimeout(function () {
          var g = main.querySelector('.guide');
          if (g) g.scrollIntoView({ behavior: 'auto', block: 'start' });
        }, 30);
      }
    }
  };

  /* ------------------------------------------------------------------ */
  /* Mikser                                                              */
  /* ------------------------------------------------------------------ */

  var mix = null;

  function streamColors(f) {
    // svjetlije nijanse boja okusa, da se mlaz vidi i na stopljenoj pozadini
    return [C.lighten(f.palette.primary, 0.45), C.lighten(f.palette.primary, 0.2), C.lighten(f.palette.secondary, 0.4)];
  }

  function parseMix(params) {
    var F = V.flavors();
    var d = V.defaultMix();
    var out = { a: d.a, b: d.b, ratio: d.ratio };
    var a = V.flavorById(params.get('a') || '');
    var b = V.flavorById(params.get('b') || '');
    if (a) out.a = a;
    if (b) out.b = b;
    var r = parseInt(params.get('r'), 10);
    if (r >= 20 && r <= 80) out.ratio = Math.round(r / 5) * 5;
    else if (V.coolerRatio(out.a, out.b)) out.ratio = V.coolerRatio(out.a, out.b);
    if (out.a === out.b) out.b = F.filter(function (f) { return f !== out.a; })[0] || out.a;
    return out;
  }

  function updateMix(ctx, opts) {
    opts = opts || {};
    var main = ctx.els.main;
    var a = mix.a, b = mix.b, r = mix.ratio / 100;
    // stopljena paleta cijele stranice (kontrast osigurava computeTheme)
    var th = V.computeTheme(V.blendPalette(a, b, r), false);
    ctx.applyTheme(th);
    var wrap = main.querySelector('.hookah-wrap');
    if (wrap) wrap.setAttribute('style', V.hookahVars(th));

    var ings = V.mergedIngredients(a, b, r);
    var prof = V.blendedProfile(a, b, r);
    main.querySelector('.mix__name').textContent = a.name + ' × ' + b.name;
    main.querySelector('.mix__desc').textContent = V.mixDescription(a, b, r, ings, prof);
    var slider = document.getElementById('mix-ratio');
    slider.value = String(mix.ratio);
    slider.setAttribute('aria-valuetext', t('mixer.ratioText', { a: mix.ratio, nameA: a.name, b: 100 - mix.ratio, nameB: b.name }));
    main.querySelector('.mix__pct--a').innerHTML = '<b>' + mix.ratio + '%</b> ' + V.esc(a.name);
    main.querySelector('.mix__pct--b').innerHTML = '<b>' + (100 - mix.ratio) + '%</b> ' + V.esc(b.name);
    main.querySelector('.mixer').style.setProperty('--ratio', r.toFixed(2));
    main.querySelector('.mix__ings').innerHTML = V.mixIngredients(ings);
    main.querySelector('.mix__prof').innerHTML = V.mixProfile(prof);

    // dim: jačina mlazova prati omjer
    if (mix.emA) { var ea = Field.getEmitter(mix.emA); if (ea) ea.rateMul = 0.4 + r * 1.6; }
    if (mix.emB) { var eb = Field.getEmitter(mix.emB); if (eb) eb.rateMul = 0.4 + (1 - r) * 1.6; }

    main.querySelector('.mixer__stage').setAttribute('aria-label', t('mixer.stageLabel', { a: a.name, b: b.name }));
    if (!opts.keepUrl) ctx.replaceUrl('?a=' + encodeURIComponent(a.id) + '&b=' + encodeURIComponent(b.id) + '&r=' + mix.ratio);
    document.title = t('meta.mixTitle', { a: a.name, b: b.name });
  }

  function setupStreams(ctx) {
    var stage = ctx.els.main.querySelector('.mixer__top');
    if (mix.emA) Field.removeEmitter(mix.emA);
    if (mix.emB) Field.removeEmitter(mix.emB);
    mix.emA = mix.emB = 0;
    if (!Field.ready || FX.reducedMotion() || !stage) return;
    var w = stage.getBoundingClientRect().width || 400;
    // brzina tako da mlazovi stignu do sredine (drag 0.55 => put ≈ v / 0.6)
    var v = Math.max(80, w * 0.32);
    var common = { anchor: stage, rate: 11, r0: 10, r1: [50, 110], life: [2.4, 3.6], speed: [v * 0.85, v * 1.1], alpha: 0.42, turb: 40, buoy: 12, spread: 0.2, drag: 0.55 };
    mix.emA = Field.addEmitter(Object.assign({}, common, { point: [0.01, 0.42], angle: -0.1, colors: streamColors(mix.a) }));
    mix.emB = Field.addEmitter(Object.assign({}, common, { point: [0.99, 0.42], angle: Math.PI + 0.1, colors: streamColors(mix.b) }));
  }

  Pages.mixer = {
    mount: function (ctx) {
      var main = ctx.els.main;
      var fromUrl = ctx.params().has('a');
      mix = parseMix(ctx.params());
      mix.emA = mix.emB = 0;

      function drawSlots() {
        document.getElementById('slot-a').innerHTML = V.mixSlot('a', mix.a);
        document.getElementById('slot-b').innerHTML = V.mixSlot('b', mix.b);
        document.getElementById('mix-ideas').innerHTML = V.mixIdeas(mix.a, mix.b);
      }
      function setPair(a, b, ratio) {
        mix.a = a; mix.b = b;
        // Supernova i slični "hladnjaci" idu u malom omjeru (20%)
        ratio = V.coolerRatio(a, b) || ratio;
        if (ratio) mix.ratio = ratio;
        drawSlots();
        setupStreams(ctx);
        updateMix(ctx);
      }

      var slider = document.getElementById('mix-ratio');
      slider.addEventListener('input', function () {
        mix.ratio = +slider.value;
        updateMix(ctx);
      });

      // izbor okusa
      var picker = document.getElementById('picker');
      var pickSearch = document.getElementById('picker-search');
      function openPicker(which, btn) {
        mix.slot = which;
        mix.slotBtn = btn;
        picker.hidden = false;
        picker.classList.add('is-open');
        picker.setAttribute('data-slot', which);
        btn.setAttribute('aria-expanded', 'true');
        var other = which === 'a' ? mix.b : mix.a;
        var cur = which === 'a' ? mix.a : mix.b;
        picker.querySelectorAll('.pick-item').forEach(function (p) {
          var id = p.getAttribute('data-id');
          p.setAttribute('aria-pressed', String(id === cur.id));
          p.disabled = id === other.id;
        });
        pickSearch.value = '';
        pickSearch.dispatchEvent(new Event('input'));
        picker.scrollIntoView({ behavior: smooth(), block: 'nearest' });
        pickSearch.focus({ preventScroll: true });
      }
      function closePicker(returnFocus) {
        if (picker.hidden) return;
        picker.hidden = true;
        picker.classList.remove('is-open');
        if (mix.slotBtn) {
          mix.slotBtn.setAttribute('aria-expanded', 'false');
          if (returnFocus) {
            var again = main.querySelector('.slot[data-slot="' + mix.slot + '"]');
            if (again) again.focus();
          }
        }
      }
      main.querySelector('.mixer__top').addEventListener('click', function (e) {
        var s = e.target.closest('.slot');
        if (!s) return;
        if (!picker.hidden && mix.slot === s.getAttribute('data-slot')) closePicker(false);
        else openPicker(s.getAttribute('data-slot'), s);
      });
      picker.addEventListener('click', function (e) {
        if (e.target.closest('.picker__close')) { closePicker(true); return; }
        var it = e.target.closest('.pick-item');
        if (!it || it.disabled) return;
        var f = V.flavorById(it.getAttribute('data-id'));
        if (mix.slot === 'a') setPair(f, mix.b); else setPair(mix.a, f);
        closePicker(true);
      });
      pickSearch.addEventListener('input', function () {
        picker.querySelectorAll('.pick-item').forEach(function (p) {
          p.parentNode.hidden = !V.matchesQuery(V.flavorById(p.getAttribute('data-id')), pickSearch.value);
        });
      });
      function onKey(e) {
        if (e.key === 'Escape' && !picker.hidden) { e.preventDefault(); closePicker(true); }
      }
      document.addEventListener('keydown', onKey);
      ctx.cleanup(function () { document.removeEventListener('keydown', onKey); });

      document.getElementById('mix-surprise').addEventListener('click', function () {
        var F = V.flavors();
        if (F.length < 2) return;
        var i = Math.floor(Math.random() * F.length);
        var j = Math.floor(Math.random() * (F.length - 1));
        if (j >= i) j++;
        var ratios = [30, 40, 50, 60, 70];
        setPair(F[i], F[j], ratios[Math.floor(Math.random() * ratios.length)]);
        slider.focus({ preventScroll: true });
      });
      document.getElementById('mix-share').addEventListener('click', function () {
        // link uvijek sa parametrima (i za početni miks)
        var url = location.origin + location.pathname + '?a=' + encodeURIComponent(mix.a.id) + '&b=' + encodeURIComponent(mix.b.id) + '&r=' + mix.ratio;
        var out = document.getElementById('mix-copied');
        function ok() { out.textContent = t('mixer.copied'); }
        function fail() { out.textContent = t('mixer.copyFailed'); }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok, fail);
        else fail();
        window.setTimeout(function () { out.textContent = ''; }, 3500);
      });
      document.getElementById('mix-ideas').addEventListener('click', function (e) {
        var a = e.target.closest('.idea__try');
        if (!a) return;
        e.preventDefault();
        setPair(V.flavorById(a.getAttribute('data-a')), V.flavorById(a.getAttribute('data-b')), 50);
        main.querySelector('.mixer__top').scrollIntoView({ behavior: smooth(), block: 'center' });
      });

      if (fromUrl) drawSlots();
      updateMix(ctx, { keepUrl: !fromUrl });
      var th = V.computeTheme(V.blendPalette(mix.a, mix.b, mix.ratio / 100), false);
      ctx.startHookah(main.querySelector('.mixer__stage'), th, { introDelay: 1.2, bowlSmoke: { rate: 4, alpha: 0.16 } });
      // mlazovi dima krenu kad se nargila iscrta
      ctx.cleanup(ctx.whenAgeOk(function () {
        var timer = window.setTimeout(function () { setupStreams(ctx); updateMix(ctx, { keepUrl: true }); }, 900);
        return function () {
          clearTimeout(timer);
          if (mix && mix.emA) Field.removeEmitter(mix.emA);
          if (mix && mix.emB) Field.removeEmitter(mix.emB);
        };
      }));
      ctx.cleanup(FX.reveal(main));
    }
  };

  /* ------------------------------------------------------------------ */
  /* Kviz                                                                */
  /* ------------------------------------------------------------------ */

  var quiz = null;

  function quizShow(ctx, stage, opts) {
    opts = opts || {};
    var main = ctx.els.main;
    var box = main.querySelector('.quiz__box');
    var Q = window.QUIZ || [];
    quiz.stage = stage;
    var html;
    if (stage === 'intro') {
      html = V.quizIntro();
    } else if (stage === 'result') {
      var res = V.quizResult(quiz.answers);
      quiz.top = res.top;
      html = res.html;
    } else {
      html = V.quizQuestion(stage, quiz.answers[stage] && quiz.answers[stage].id);
    }
    box.classList.remove('is-in');
    box.innerHTML = html;
    void box.offsetWidth;
    box.classList.add('is-in');
    box.setAttribute('data-stage', String(stage));

    var done = stage === 'result' ? Q.length : stage === 'intro' ? 0 : stage;
    main.querySelector('.quiz').style.setProperty('--progress', (done / Q.length).toFixed(3));
    main.querySelector('.quiz__count').textContent = stage === 'intro' || stage === 'result' ? '' : t('quiz.questionOf', { n: stage + 1, total: Q.length });

    if (Field.ready && opts.puff !== false) {
      var r = box.getBoundingClientRect();
      var colors = stage === 'result' ? V.themeFor(quiz.top).smoke : null;
      Field.puff(r.left + r.width / 2, r.top + Math.min(r.height, 400) / 2, {
        count: stage === 'result' ? 22 : 9, colors: colors, alpha: stage === 'result' ? 0.3 : 0.16,
        r1: [80, stage === 'result' ? 220 : 140], life: [1.4, 2.6], speed: [40, stage === 'result' ? 180 : 90], spread: Math.PI, force: true
      });
    }
    if (opts.focus !== false) {
      var h = document.getElementById('q-title') || box.querySelector('button');
      if (h) h.focus({ preventScroll: true });
    }
  }

  Pages.quiz = {
    mount: function (ctx) {
      quiz = { answers: [], stage: 'intro', top: null, pointer: false };
      var box = ctx.els.main.querySelector('.quiz__box');
      var Q = window.QUIZ || [];

      box.addEventListener('pointerdown', function (e) {
        quiz.pointer = !!(e.target.closest && e.target.closest('.qopt'));
      });
      box.addEventListener('change', function (e) {
        var input = e.target;
        if (!input.classList.contains('qopt__input')) return;
        var qi = quiz.stage;
        quiz.answers[qi] = Q[qi].answers.filter(function (x) { return x.id === input.value; })[0];
        var next = document.getElementById('q-next');
        if (next) next.disabled = false;
        // mišem/prstom: automatski dalje; strelicama na tastaturi: ne
        if (quiz.pointer) {
          quiz.pointer = false;
          var at = qi;
          window.setTimeout(function () {
            if (quiz.stage === at) quizShow(ctx, at + 1 < Q.length ? at + 1 : 'result');
          }, FX.reducedMotion() ? 0 : 380);
        }
      });
      box.addEventListener('submit', function (e) {
        e.preventDefault();
        var qi = quiz.stage;
        if (typeof qi !== 'number' || !quiz.answers[qi]) return;
        quizShow(ctx, qi + 1 < Q.length ? qi + 1 : 'result');
      });
      box.addEventListener('click', function (e) {
        if (e.target.closest('#q-start')) { quizShow(ctx, 0); return; }
        if (e.target.closest('#q-back') && typeof quiz.stage === 'number' && quiz.stage > 0) { quizShow(ctx, quiz.stage - 1); return; }
        if (e.target.closest('#q-restart')) { quiz.answers = []; quizShow(ctx, 0); }
      });

      ctx.heroSmoke();
    }
  };


  /* ------------------------------------------------------------------ */
  /* Kolekcije                                                           */
  /* ------------------------------------------------------------------ */

  Pages.collections = {
    mount: function (ctx) {
      ctx.heroSmoke();
      ctx.cleanup(FX.reveal(ctx.els.main));
    }
  };

  Pages.collection = {
    mount: function (ctx) {
      var main = ctx.els.main;
      var grid = document.getElementById('collection-grid');
      if (grid) {
        ctx.cleanup(FX.tilt(grid));
        ctx.cleanup(FX.cardWisps(grid));
      }
      // mekan dim koji se diže sa dna zaglavlja, u bojama kolekcije
      var hero = main.querySelector('.chero');
      if (hero && Field.ready && !FX.reducedMotion()) {
        var cold = hero.classList.contains('chero--ice');
        var id = Field.addEmitter({
          anchor: hero, point: [0.5, 0.98], rate: cold ? 7 : 5, r1: [120, 260], life: [3, 5],
          speed: [18, 40], spread: 1.4, alpha: cold ? 0.16 : 0.14, turb: cold ? 30 : 60, buoy: 14
        });
        ctx.cleanup(function () { Field.removeEmitter(id); });
      }
      ctx.cleanup(FX.reveal(main));
    }
  };

  /* ------------------------------------------------------------------ */
  /* Poređenje                                                           */
  /* ------------------------------------------------------------------ */

  function mountCompare(ctx) {
    var main = ctx.els.main;
    var root = main.querySelector('.cmpx');
    var pairSlug = root.getAttribute('data-pair');
    var p = ctx.params();
    var start = pairSlug ? V.pairBySlug(pairSlug) : V.defaultPair();
    var state = {
      a: V.flavorById(p.get('a') || '') || start.a,
      b: V.flavorById(p.get('b') || '') || start.b,
      slot: null,
      emA: 0,
      emB: 0
    };
    if (state.a === state.b) state.b = V.flavors().filter(function (f) { return f !== state.a; })[0] || state.b;
    var fromUrl = !pairSlug && p.has('a');

    var stage = document.getElementById('cmp-stage');
    var picker = document.getElementById('cpicker');
    var pickSearch = document.getElementById('cpicker-search');

    function streams() {
      if (state.emA) Field.removeEmitter(state.emA);
      if (state.emB) Field.removeEmitter(state.emB);
      state.emA = state.emB = 0;
      if (!Field.ready || FX.reducedMotion()) return;
      var wide = window.innerWidth >= 768;
      var sa = stage.querySelector('.cside--a');
      var sb = stage.querySelector('.cside--b');
      var common = { rate: 6, r0: 12, r1: [50, 120], life: [2.4, 3.6], alpha: 0.3, turb: 40, buoy: 10, spread: 0.3, drag: 0.6 };
      var w = stage.getBoundingClientRect().width || 400;
      var v = Math.max(60, (wide ? w / 2 : 200) * 0.45);
      state.emA = Field.addEmitter(Object.assign({}, common, {
        anchor: sa, point: wide ? [0.72, 0.5] : [0.5, 0.8], angle: wide ? 0 : Math.PI / 2, speed: [v * 0.8, v], colors: V.themeFor(state.a).smoke
      }));
      state.emB = Field.addEmitter(Object.assign({}, common, {
        anchor: sb, point: wide ? [0.28, 0.5] : [0.5, 0.2], angle: wide ? Math.PI : -Math.PI / 2, speed: [v * 0.8, v], colors: V.themeFor(state.b).smoke
      }));
    }

    function render(pushUrl) {
      var parts = V.compareParts(state.a, state.b);
      stage.innerHTML = parts.stage;
      stage.setAttribute('style', parts.seam);
      stage.setAttribute('aria-label', parts.label);
      document.getElementById('cmp-verdict').textContent = parts.verdict;
      document.getElementById('cmp-bars').innerHTML = parts.bars;
      document.getElementById('cmp-ings').innerHTML = parts.ings;
      document.getElementById('cmp-mixer').setAttribute('href', parts.mixer);
      // nove trake se odmah pune (sekcija je već bila vidljiva)
      var bars = main.querySelector('#cmp-bars .dbars');
      if (bars) window.requestAnimationFrame(function () { bars.classList.add('is-in'); });
      var ings = main.querySelector('#cmp-ings .cings');
      if (ings) ings.classList.add('is-in');
      document.title = t('meta.comparePickTitle', { a: state.a.name, b: state.b.name });
      if (pushUrl) ctx.replaceUrl('?a=' + encodeURIComponent(state.a.id) + '&b=' + encodeURIComponent(state.b.id));
      streams();
    }

    /** Na SEO stranici para promjena vodi na interaktivno poređenje (ili drugu stranicu para). */
    function change() {
      if (pairSlug) {
        location.href = V.compareUrl(state.a, state.b);
        return;
      }
      render(true);
    }

    function openPicker(which, btn) {
      state.slot = which;
      picker.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      var cur = which === 'a' ? state.a : state.b;
      var other = which === 'a' ? state.b : state.a;
      picker.querySelectorAll('.pick-item').forEach(function (it) {
        var id = it.getAttribute('data-id');
        it.setAttribute('aria-pressed', String(id === cur.id));
        it.disabled = id === other.id;
      });
      pickSearch.value = '';
      pickSearch.dispatchEvent(new Event('input'));
      picker.scrollIntoView({ behavior: smooth(), block: 'nearest' });
      pickSearch.focus({ preventScroll: true });
    }
    function closePicker(returnFocus) {
      if (picker.hidden) return;
      picker.hidden = true;
      var btn = stage.querySelector('.cside__pick[data-slot="' + state.slot + '"]');
      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
        if (returnFocus) btn.focus();
      }
    }

    stage.addEventListener('click', function (e) {
      var b = e.target.closest('.cside__pick');
      if (!b) return;
      if (!picker.hidden && state.slot === b.getAttribute('data-slot')) closePicker(false);
      else openPicker(b.getAttribute('data-slot'), b);
    });
    picker.addEventListener('click', function (e) {
      if (e.target.closest('.picker__close')) { closePicker(true); return; }
      var it = e.target.closest('.pick-item');
      if (!it || it.disabled) return;
      var f = V.flavorById(it.getAttribute('data-id'));
      var slot = state.slot;
      closePicker(false);
      state[slot] = f;
      change();
      var again = stage.querySelector('.cside__pick[data-slot="' + slot + '"]');
      if (again) again.focus({ preventScroll: true });
    });
    pickSearch.addEventListener('input', function () {
      picker.querySelectorAll('.pick-item').forEach(function (it) {
        it.parentNode.hidden = !V.matchesQuery(V.flavorById(it.getAttribute('data-id')), pickSearch.value);
      });
    });
    function onKey(e) {
      if (e.key === 'Escape' && !picker.hidden) { e.preventDefault(); closePicker(true); }
    }
    document.addEventListener('keydown', onKey);
    ctx.cleanup(function () { document.removeEventListener('keydown', onKey); });

    document.getElementById('cmp-swap').addEventListener('click', function () {
      var x = state.a; state.a = state.b; state.b = x;
      if (Field.ready) {
        var r = stage.getBoundingClientRect();
        Field.puff(r.left + r.width / 2, r.top + r.height / 2, { count: 12, alpha: 0.25, r1: [80, 180], life: [1.4, 2.4], speed: [40, 120], spread: Math.PI, force: true });
      }
      change();
    });
    document.getElementById('cmp-share').addEventListener('click', function () {
      var url = location.origin + V.urlFor(MSP.lang, 'compare') + '?a=' + encodeURIComponent(state.a.id) + '&b=' + encodeURIComponent(state.b.id);
      if (pairSlug) url = location.origin + location.pathname;
      var out = document.getElementById('cmp-copied');
      function ok() { out.textContent = t('compare.copied'); }
      function fail() { out.textContent = t('compare.copyFailed'); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok, fail);
      else fail();
      window.setTimeout(function () { out.textContent = ''; }, 3500);
    });

    if (fromUrl) render(false);
    else streams();
    var resizeT = 0;
    function onResize() { clearTimeout(resizeT); resizeT = setTimeout(streams, 250); }
    window.addEventListener('resize', onResize);
    ctx.cleanup(function () {
      window.removeEventListener('resize', onResize);
      if (state.emA) Field.removeEmitter(state.emA);
      if (state.emB) Field.removeEmitter(state.emB);
    });
    ctx.cleanup(FX.reveal(main));
  }

  Pages.compare = { mount: mountCompare };
  Pages.comparePair = { mount: mountCompare };

  /* ------------------------------------------------------------------ */
  /* Recepti                                                             */
  /* ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------ */
  /* Svi okusi: pretraga + tagovi + kolekcije + sortiranje, stanje u adresi */
  /* ------------------------------------------------------------------ */

  Pages.flavors = {
    mount: function (ctx) {
      var main = ctx.els.main;
      var grid = document.getElementById('fl-grid');
      var input = document.getElementById('fl-q');
      var sortEl = document.getElementById('fl-sort');
      var tagsEl = document.getElementById('fl-tags');
      var colsEl = document.getElementById('fl-cols');
      var brandEl = document.getElementById('fl-brand');
      var leafEl = document.getElementById('fl-leaf');
      var countEl = document.getElementById('fl-count');
      var empty = document.getElementById('fl-empty');
      var suggest = document.getElementById('fl-suggest');
      var items = {};
      grid.querySelectorAll('.grid__item').forEach(function (li) { items[li.getAttribute('data-id')] = li; });
      var suggestBase = suggest.getAttribute('href');

      var p = ctx.params();
      var state = {
        q: p.get('q') || '',
        tag: p.get('tag') || '',
        col: p.get('col') || '',
        brand: V.brandBySlug(p.get('brand')) ? p.get('brand') : '',
        leaf: /^(light|dark)$/.test(p.get('leaf') || '') ? p.get('leaf') : '',
        sort: V.SORTS.indexOf(p.get('sort')) !== -1 ? p.get('sort') : 'az'
      };

      function syncControls() {
        input.value = state.q;
        sortEl.value = state.sort;
        brandEl.value = state.brand;
        leafEl.querySelectorAll('.chip').forEach(function (b) {
          var on = (b.getAttribute('data-leaf') || '') === state.leaf;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', String(on));
        });
        tagsEl.querySelectorAll('.chip').forEach(function (b) {
          var on = (b.getAttribute('data-tag') || '') === state.tag;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', String(on));
        });
        colsEl.querySelectorAll('.chip').forEach(function (b) {
          var on = b.getAttribute('data-col') === state.col;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', String(on));
        });
      }

      function apply(animate) {
        var list = V.flavors().filter(function (f) {
          if (state.tag && (f.tags || []).indexOf(state.tag) === -1) return false;
          if (state.brand && f.brandId !== state.brand) return false;
          if (state.leaf && V.leafOf(f) !== state.leaf) return false;
          if (state.col && (items[f.id].getAttribute('data-cols') || '').split(' ').indexOf(state.col) === -1) return false;
          return V.matchesQuery(f, state.q);
        });
        list = V.sortFlavors(list, state.sort);
        var shown = {};
        list.forEach(function (f, i) {
          var li = items[f.id];
          shown[f.id] = 1;
          li.hidden = false;
          li.style.setProperty('--i', String(i % 3));
          grid.appendChild(li);
          li.classList.add('is-in');
          if (animate) {
            li.classList.remove('is-shuffling');
            void li.offsetWidth;
            li.classList.add('is-shuffling');
          }
        });
        Object.keys(items).forEach(function (id) { if (!shown[id]) items[id].hidden = true; });
        countEl.textContent = MSP.plural('home.count', list.length);
        empty.hidden = list.length > 0;
        suggest.setAttribute('href', suggestBase + (state.q ? '?q=' + encodeURIComponent(state.q) : ''));
        var qs = [];
        if (state.q) qs.push('q=' + encodeURIComponent(state.q));
        if (state.tag) qs.push('tag=' + encodeURIComponent(state.tag));
        if (state.col) qs.push('col=' + encodeURIComponent(state.col));
        if (state.brand) qs.push('brand=' + encodeURIComponent(state.brand));
        if (state.leaf) qs.push('leaf=' + state.leaf);
        if (state.sort !== 'az') qs.push('sort=' + state.sort);
        ctx.replaceUrl(qs.length ? '?' + qs.join('&') : '');
      }

      input.addEventListener('input', function () { state.q = input.value; apply(false); });
      document.getElementById('fl-form').addEventListener('submit', function (e) { e.preventDefault(); input.blur(); });
      sortEl.addEventListener('change', function () { state.sort = sortEl.value; apply(true); });
      brandEl.addEventListener('change', function () { state.brand = brandEl.value; apply(true); });
      leafEl.addEventListener('click', function (e) {
        var b = e.target.closest('.chip');
        if (!b) return;
        var v = b.getAttribute('data-leaf') || '';
        state.leaf = state.leaf === v ? '' : v;
        syncControls();
        apply(true);
      });
      tagsEl.addEventListener('click', function (e) {
        var b = e.target.closest('.chip');
        if (!b) return;
        var v = b.getAttribute('data-tag') || '';
        state.tag = state.tag === v ? '' : v;
        syncControls();
        apply(true);
      });
      colsEl.addEventListener('click', function (e) {
        var b = e.target.closest('.chip');
        if (!b) return;
        var v = b.getAttribute('data-col');
        state.col = state.col === v ? '' : v;
        syncControls();
        apply(true);
      });
      document.getElementById('fl-reset').addEventListener('click', function () {
        state = { q: '', tag: '', col: '', brand: '', leaf: '', sort: state.sort };
        syncControls();
        apply(true);
        input.focus();
      });
      function onKey(e) {
        if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
        var tag = (e.target && e.target.tagName) || '';
        if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return;
        e.preventDefault();
        input.focus();
        input.select();
      }
      document.addEventListener('keydown', onKey);
      ctx.cleanup(function () { document.removeEventListener('keydown', onKey); });

      // Sortiranje po ocjeni čeka ocjene sa servera; bez njih ta opcija nije dostupna.
      withRatings(ctx, function (st) {
        var opt = sortEl.querySelector('option[value="rating"]');
        if (st === 'off') {
          if (opt) opt.disabled = true;
          if (state.sort === 'rating') { state.sort = 'az'; syncControls(); apply(false); }
        } else if (state.sort === 'rating') apply(false);
      });

      syncControls();
      apply(false);
      ctx.cleanup(FX.tilt(grid));
      ctx.cleanup(FX.cardWisps(grid));
      ctx.heroSmoke();
      ctx.cleanup(FX.reveal(main));
    }
  };


  /* ------------------------------------------------------------------ */
  /* Najbolje ocijenjeno: rang liste iz MSP.Ratings, filter po brendu i kolekciji */
  /* ------------------------------------------------------------------ */

  var TOP_LIMIT = 10;

  Pages.top = {
    mount: function (ctx) {
      var main = ctx.els.main;
      var wrap = document.getElementById('top');
      var brandEl = document.getElementById('top-brand');
      var colEl = document.getElementById('top-col');
      var status = document.getElementById('top-status');
      var has = function (sel, v) { return !!sel.querySelector('option[value="' + v + '"]'); };
      var p = ctx.params();
      var state = {
        brand: p.get('brand') && has(brandEl, p.get('brand')) ? p.get('brand') : '',
        col: p.get('col') && has(colEl, p.get('col')) ? p.get('col') : ''
      };
      brandEl.value = state.brand;
      colEl.value = state.col;
      var first = true;

      function apply() {
        var R = MSP.Ratings;
        if (!R || R.state !== 'ready') return;
        ['flavor', 'recipe'].forEach(function (kind) {
          var list = wrap.querySelector('[data-top-list="' + kind + '"]');
          Array.prototype.forEach.call(list.querySelectorAll('.top__ghost'), function (g) { g.remove(); });
          var items = Array.prototype.slice.call(list.querySelectorAll('.top__item'));
          var get = function (li) { return R.get(kind, li.getAttribute('data-id')); };
          var shown = items.filter(function (li) {
            var r = get(li);
            if (!r || r.count < V.TOP_MIN) return false;
            if (state.brand && li.getAttribute('data-brands').split(' ').indexOf(state.brand) === -1) return false;
            if (state.col && li.getAttribute('data-cols').split(' ').indexOf(state.col) === -1) return false;
            return true;
          });
          shown.sort(function (a, b) { return V.compareRated(a, b, get); });
          shown = shown.slice(0, TOP_LIMIT);
          items.forEach(function (li) { li.hidden = shown.indexOf(li) === -1; });
          shown.forEach(function (li, i) {
            li.querySelector('.top__rank').textContent = String(i + 1);
            li.style.setProperty('--i', String(i));
            li.classList.toggle('is-first', i === 0);
            list.appendChild(li);
            if (!first) {
              li.classList.remove('is-shuffling');
              void li.offsetWidth;
              li.classList.add('is-shuffling');
            }
          });
          wrap.querySelector('[data-top-empty="' + kind + '"]').hidden = shown.length > 0;
        });
        wrap.classList.add('is-ready');
        status.textContent = t('ratings.ready');
        status.classList.add('sr-only');
        first = false;
        var qs = [];
        if (state.brand) qs.push('brand=' + encodeURIComponent(state.brand));
        if (state.col) qs.push('col=' + encodeURIComponent(state.col));
        ctx.replaceUrl(qs.length ? '?' + qs.join('&') : '');
      }

      brandEl.addEventListener('change', function () { state.brand = brandEl.value; apply(); });
      colEl.addEventListener('change', function () { state.col = colEl.value; apply(); });

      withRatings(ctx, function (st) {
        if (st === 'ready') apply();
        else {
          Array.prototype.forEach.call(wrap.querySelectorAll('.top__ghost'), function (g) { g.remove(); });
          wrap.classList.add('is-off');
          status.textContent = t('ratings.unavailable');
        }
      });
      ctx.heroSmoke();
      ctx.cleanup(FX.reveal(main));
    }
  };

  /* ------------------------------------------------------------------ */
  /* Brendovi: filter po vrsti lista; stranica brenda                     */
  /* ------------------------------------------------------------------ */

  Pages.brands = {
    mount: function (ctx) {
      var main = ctx.els.main;
      var group = document.getElementById('br-leaf');
      var grid = document.getElementById('br-grid');
      var items = grid.querySelectorAll('.bcards__item');
      var p = ctx.params();
      var leaf = /^(light|dark)$/.test(p.get('leaf') || '') ? p.get('leaf') : '';
      function apply() {
        var shown = 0;
        items.forEach(function (li) {
          var l = li.querySelector('.bcard').getAttribute('data-leaf');
          var ok = !leaf || l === leaf || l === 'both';
          li.hidden = !ok;
          if (ok) { shown++; li.querySelector('.bcard').classList.add('is-in'); }
        });
        group.querySelectorAll('.chip').forEach(function (b) {
          var on = (b.getAttribute('data-leaf') || '') === leaf;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', String(on));
        });
        document.getElementById('br-count').textContent = MSP.plural('brands.count', shown);
        document.getElementById('br-empty').hidden = shown > 0;
        ctx.replaceUrl(leaf ? '?leaf=' + leaf : '');
      }
      group.addEventListener('click', function (e) {
        var b = e.target.closest('.chip');
        if (!b) return;
        var v = b.getAttribute('data-leaf') || '';
        leaf = leaf === v ? '' : v;
        apply();
      });
      apply();
      ctx.heroSmoke();
      ctx.cleanup(FX.reveal(main));
    }
  };

  Pages.brand = {
    mount: function (ctx) {
      var main = ctx.els.main;
      var grid = document.getElementById('brand-grid');
      if (grid) {
        ctx.cleanup(FX.tilt(grid));
        ctx.cleanup(FX.cardWisps(grid));
      }
      ctx.cleanup(FX.reveal(main));
    }
  };

  Pages.privacy = { mount: function (ctx) { ctx.heroSmoke(); } };
  Pages.terms = { mount: function (ctx) { ctx.heroSmoke(); } };
  Pages.suggest = { mount: function (ctx) { ctx.heroSmoke(); } };
  Pages.report = { mount: function (ctx) { ctx.heroSmoke(); } };
  Pages.search = { mount: function (ctx) { ctx.heroSmoke(); } };

  Pages.mixes = {
    mount: function (ctx) {
      var main = ctx.els.main;
      var state = { tag: '', strength: '' };
      var tagsEl = document.getElementById('mix-tags');
      var strEl = document.getElementById('mix-strength');
      var items = main.querySelectorAll('#mix-grid .rcards__item');
      function setActive(group, attr, val) {
        group.querySelectorAll('.chip').forEach(function (b) {
          var on = (b.getAttribute(attr) || '') === val;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', String(on));
        });
      }
      function apply() {
        var shown = 0;
        items.forEach(function (li) {
          var card = li.querySelector('.rcard');
          var tags = (card.getAttribute('data-tags') || '').split(' ');
          var ok = (!state.tag || tags.indexOf(state.tag) !== -1) && (!state.strength || card.getAttribute('data-strength') === state.strength);
          li.hidden = !ok;
          if (ok) { shown++; li.classList.add('is-in'); }
        });
        document.getElementById('mix-count').textContent = MSP.plural('mixes.count', shown);
        document.getElementById('mix-empty').hidden = shown > 0;
      }
      tagsEl.addEventListener('click', function (e) {
        var b = e.target.closest('.chip');
        if (!b) return;
        var v = b.getAttribute('data-tag') || '';
        state.tag = state.tag === v ? '' : v;
        setActive(tagsEl, 'data-tag', state.tag);
        apply();
      });
      strEl.addEventListener('click', function (e) {
        var b = e.target.closest('.chip');
        if (!b) return;
        var v = b.getAttribute('data-strength') || '';
        state.strength = state.strength === v ? '' : v;
        setActive(strEl, 'data-strength', state.strength);
        apply();
      });
      document.getElementById('mix-reset').addEventListener('click', function () {
        state.tag = state.strength = '';
        setActive(tagsEl, 'data-tag', '');
        setActive(strEl, 'data-strength', '');
        apply();
      });
      ctx.heroSmoke();
      ctx.cleanup(FX.reveal(main));
    }
  };

  Pages.recipe = {
    mount: function (ctx) {
      var main = ctx.els.main;
      var art = main.querySelector('.recipe');
      var bowl = main.querySelector('[data-bowl]');
      if (art && bowl && Field.ready && !FX.reducedMotion()) {
        // dim iz posude naizmjenično u bojama jednog pa drugog okusa
        var sets = (art.getAttribute('data-smoke') || '').split('|').map(function (s) { return s.split(','); });
        var k = 0;
        var id = Field.addEmitter({
          anchor: bowl, point: [0.5, 0.45], rate: 7, colors: sets[0],
          r1: [70, 170], life: [2.6, 4.2], speed: [26, 56], alpha: 0.22, turb: 50, buoy: 20
        });
        var iv = window.setInterval(function () {
          k = (k + 1) % sets.length;
          var em = Field.getEmitter(id);
          if (em) em.o.colors = sets[k];
        }, 2200);
        ctx.cleanup(function () { clearInterval(iv); Field.removeEmitter(id); });
      }
      ctx.cleanup(FX.reveal(main));
    }
  };

  /** Za testove i README: bodovanje (npr. MSP.Pages.quiz.score(['pocetnik','puno','slatko','voce','srednji','ljeto'])). */
  Pages.quiz.score = function (answerIds) {
    var Q = window.QUIZ || [];
    var answers = answerIds.map(function (id, i) { return Q[i].answers.filter(function (a) { return a.id === id; })[0]; });
    return V.scoreFlavors(answers).map(function (r) { return r.flavor.id + ' ' + r.pct + '%'; });
  };
})();
