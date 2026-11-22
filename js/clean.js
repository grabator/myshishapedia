/*
 * MyShishapedia - članak o čišćenju nargile: crtež "šta smije u vodu" (izbor dijela, klasična ili
 * modularna nargila) i postepeno pojavljivanje koraka. HTML je napravio build (views-articles.js).
 */
(function () {
  'use strict';
  var doc = document;
  Array.prototype.forEach.call(doc.querySelectorAll('[data-cl]'), function (root) {
    var data;
    try { data = JSON.parse(root.querySelector('.cl-data').textContent); } catch (e) { return; }
    var mode = 'classic', sel = null;
    var parts = {};
    data.parts.forEach(function (p) { parts[p.id] = p; });
    var card = root.querySelector('.cl-card'), pill = card.querySelector('.cl-card__pill'), nameEl = card.querySelector('.cl-card__name'), textEl = card.querySelector('.cl-card__text');
    function paint() {
      root.setAttribute('data-mode', mode);
      Array.prototype.forEach.call(root.querySelectorAll('[data-part]'), function (el) {
        var p = parts[el.getAttribute('data-part')];
        if (p) el.setAttribute('data-s', p[mode].s);
        el.classList.toggle('is-sel', el.getAttribute('data-part') === sel);
      });
      root.classList.toggle('has-sel', !!sel);
      var p = parts[sel || 'base'];
      var info = p[mode];
      pill.setAttribute('data-s', info.s);
      pill.textContent = data.legend[info.s];
      nameEl.textContent = p.name;
      textEl.textContent = info.t;
      card.classList.remove('is-swap'); void card.offsetWidth; card.classList.add('is-swap');
    }
    function pick(id) { sel = sel === id ? null : id; root.classList.add('is-touched'); paint(); }
    root.addEventListener('click', function (e) {
      var tab = e.target.closest('.cl-tab');
      if (tab) {
        mode = tab.getAttribute('data-mode');
        Array.prototype.forEach.call(root.querySelectorAll('.cl-tab'), function (t) { var on = t === tab; t.classList.toggle('is-on', on); t.setAttribute('aria-selected', on ? 'true' : 'false'); });
        paint();
        return;
      }
      var part = e.target.closest('[data-part]');
      if (part) pick(part.getAttribute('data-part'));
    });
    root.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('cl-part')) { e.preventDefault(); pick(e.target.getAttribute('data-part')); }
    });
    sel = 'mouth';
    paint();
    sel = null;
    root.classList.remove('has-sel');
    Array.prototype.forEach.call(root.querySelectorAll('.is-sel'), function (el) { el.classList.remove('is-sel'); });
  });
  // koraci se pojave kad dođu na ekran
  var steps = doc.querySelectorAll('.cls');
  if (!('IntersectionObserver' in window)) { Array.prototype.forEach.call(steps, function (s) { s.classList.add('is-in'); }); return; }
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
  }, { threshold: 0.15 });
  Array.prototype.forEach.call(steps, function (s) { io.observe(s); });
})();
