/*
 * MyShishapedia - članak o stemless nargili: dugmad na presjeku POD-a (put dima, ispuhivanje, mjehurići)
 * i pokretanje animacija tek kad su na ekranu. Crtež je u HTML-u (views-articles.js), animacije u css/stemless.css.
 */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onView(el, cb, keep) {
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { cb(e.isIntersecting); if (e.isIntersecting && !keep) io.disconnect(); });
    }, { threshold: 0.25 });
    io.observe(el);
  }

  function restart(el) { el.classList.remove('is-on'); void el.offsetWidth; el.classList.add('is-on'); }

  Array.prototype.forEach.call(document.querySelectorAll('[data-pl]'), function (pl) {
    var tabs = pl.querySelectorAll('.pl-tab'), bubs = pl.querySelectorAll('.pl-bubsw button');
    var svg = pl.querySelector('svg'), visible = false;
    // čestice dima su SVG animacije: stoje dok presjek nije na ekranu (i kad su animacije isključene)
    function smil(on) { if (svg && svg.pauseAnimations) { if (on && !reduce) svg.unpauseAnimations(); else svg.pauseAnimations(); } }
    smil(false);
    Array.prototype.forEach.call(tabs, function (b) {
      b.addEventListener('click', function () {
        pl.setAttribute('data-mode', b.getAttribute('data-mode'));
        Array.prototype.forEach.call(tabs, function (x) { x.setAttribute('aria-selected', String(x === b)); });
        if (visible && !reduce) restart(pl); // koraci kreću od prvog
      });
    });
    Array.prototype.forEach.call(bubs, function (b) {
      b.addEventListener('click', function () {
        pl.setAttribute('data-bub', b.getAttribute('data-bub'));
        Array.prototype.forEach.call(bubs, function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      });
    });
    // animacije rade samo dok je presjek na ekranu (štedi bateriju)
    onView(pl, function (on) { visible = on; pl.classList.toggle('is-on', on); smil(on); }, true);
  });

  Array.prototype.forEach.call(document.querySelectorAll('[data-ps]'), function (ps) {
    if (reduce) return;
    ps.classList.add('is-ready');
    onView(ps, function (on) { if (on) ps.classList.add('is-on'); }, false);
  });
})();
