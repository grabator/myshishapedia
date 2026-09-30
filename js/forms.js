/*
 * MyShishapedia - forme "Predloži okus" i "Prijavi grešku".
 *
 * Ako je u site.config.js upisan FORM_ENDPOINT, forma se šalje tom servisu (npr. Formspree)
 * preko fetch (FormData, Accept: application/json). Ako nije, sastavi se uredan email i
 * otvori preko mailto, na isti zaštićeni email kao u footeru.
 * Zaštita od spama: skriveno "honeypot" polje (_gotcha) i provjera na klijentu.
 */
(function () {
  'use strict';

  var MSP = window.MSP;
  var V = MSP.V;
  var t = MSP.t;
  var FX = MSP.Effects;

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var URL_RE = /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i;

  function reverse(s) { return s.split('').reverse().join(''); }

  function authorEmail(form) {
    var parts = (form.getAttribute('data-m') || '').split('|');
    return parts.length === 2 && parts[0] ? reverse(parts[0]) + '@' + reverse(parts[1]) : '';
  }

  function setError(field, msg) {
    var wrap = field.closest('.field');
    var err = wrap && wrap.querySelector('.field__err');
    if (err) err.textContent = msg || '';
    if (wrap) wrap.classList.toggle('has-error', !!msg);
    if (field.setAttribute) {
      if (msg) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
    }
  }

  function validate(form) {
    var firstBad = null;
    var fields = form.querySelectorAll('input:not([type=hidden]):not([name=_gotcha]):not([type=radio]), textarea, select');
    Array.prototype.forEach.call(fields, function (f) {
      var v = (f.value || '').trim();
      var msg = '';
      if (f.required && !v) msg = t('forms.errRequired');
      else if (v && f.type === 'email' && !EMAIL_RE.test(v)) msg = t('forms.errEmail');
      else if (v && f.type === 'url' && !URL_RE.test(v)) msg = t('forms.errUrl');
      setError(f, msg);
      if (msg && !firstBad) firstBad = f;
    });
    // radio grupa (šta nije tačno)
    var radios = form.querySelectorAll('input[type=radio][required]');
    Array.prototype.forEach.call(radios, function (r) {
      var group = form.querySelectorAll('input[type=radio][name="' + r.name + '"]');
      var checked = Array.prototype.some.call(group, function (x) { return x.checked; });
      var fs = r.closest('fieldset');
      var err = fs && fs.querySelector('.field__err');
      if (err) err.textContent = checked ? '' : t('forms.errRequired');
      if (fs) fs.classList.toggle('has-error', !checked);
      if (!checked && !firstBad) firstBad = group[0];
    });
    var summary = form.querySelector('.mform__summary');
    summary.hidden = !firstBad;
    summary.textContent = firstBad ? t('forms.errSummary') : '';
    return firstBad;
  }

  function value(form, name) {
    var el = form.elements[name];
    if (!el) return '';
    if (el.length && el[0] && el[0].type === 'radio') {
      var c = Array.prototype.filter.call(el, function (x) { return x.checked; })[0];
      return c ? c.value : '';
    }
    return (el.value || '').trim();
  }

  function labelOf(form, name) {
    var el = form.elements[name];
    if (!el) return name;
    var first = el.length && el[0] && el[0].type === 'radio' ? el[0] : el;
    var wrap = first.closest('.field');
    var lab = wrap && wrap.querySelector('.field__label');
    if (!lab) return name;
    var clone = lab.cloneNode(true);
    var req = clone.querySelector('.field__req');
    if (req) req.remove();
    return clone.textContent.trim();
  }

  function subjectFor(form) {
    if (form.getAttribute('data-form') === 'suggest') {
      return t('forms.suggestSubject', { brand: value(form, 'brand'), name: value(form, 'flavor') });
    }
    var sel = form.elements.flavor;
    var name = sel && sel.selectedIndex > 0 ? sel.options[sel.selectedIndex].text : value(form, 'flavor');
    return t('forms.reportSubject', { flavor: name });
  }

  /** Tekst poruke za mailto (i kao rezerva ako servis ne radi). */
  function bodyFor(form) {
    var names = form.getAttribute('data-form') === 'suggest'
      ? ['brand', 'flavor', 'ingredients', 'comment', 'email']
      : ['flavor', 'what', 'correct', 'source', 'email'];
    var lines = names.map(function (n) {
      var v = value(form, n);
      if (n === 'what' && v) {
        var r = form.querySelector('input[name=what]:checked');
        v = r ? r.parentNode.textContent.trim() : v;
      }
      return v ? labelOf(form, n) + ': ' + v : '';
    }).filter(Boolean);
    lines.push('', location.href);
    return lines.join('\n');
  }

  function puff(el) {
    var Field = FX && FX.Field;
    if (!Field || !Field.ready || FX.reducedMotion() || !el) return;
    var r = el.getBoundingClientRect();
    Field.puff(r.left + r.width / 2, r.top + 60, { count: 16, alpha: 0.26, r1: [80, 200], life: [1.6, 2.8], speed: [30, 120], spread: Math.PI, force: true });
  }

  function showDone(form, title, text) {
    var done = document.getElementById(form.getAttribute('data-form') + '-done');
    done.querySelector('.mform__done-title').textContent = title;
    done.querySelector('.mform__done-text').textContent = text;
    form.hidden = true;
    done.hidden = false;
    done.classList.remove('is-in');
    void done.offsetWidth;
    done.classList.add('is-in');
    done.focus();
    puff(done);
  }

  function bind(form) {
    var send = form.querySelector('.mform__send');
    var sendLabel = send.querySelector('span');
    var endpoint = form.getAttribute('data-endpoint') || '';
    var done = document.getElementById(form.getAttribute('data-form') + '-done');

    // popunjavanje iz adrese: ?q= (predloži) i ?okus= / ?flavor= (prijavi grešku)
    var p = new URLSearchParams(location.search);
    if (form.elements.flavor) {
      var f = p.get('okus') || p.get('flavor');
      if (f && form.elements.flavor.tagName === 'SELECT' && V.flavorById(f)) form.elements.flavor.value = f;
      var q = p.get('q');
      if (q && form.elements.flavor.tagName === 'INPUT') form.elements.flavor.value = q.slice(0, 120);
    }

    // greška nestaje čim se polje ispravi
    form.addEventListener('input', function (e) {
      var fld = e.target;
      if (fld.closest('.has-error')) {
        if (fld.type === 'radio') {
          var fs = fld.closest('fieldset');
          fs.classList.remove('has-error');
          fs.querySelector('.field__err').textContent = '';
        } else setError(fld, '');
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = validate(form);
      if (bad) { bad.focus(); return; }
      // honeypot: roboti popune skriveno polje; tiho "uspjeh", bez slanja
      if (value(form, '_gotcha')) {
        showDone(form, t('forms.successTitle'), t('forms.successText'));
        return;
      }
      form.elements._subject.value = subjectFor(form);

      if (!endpoint) {
        var to = authorEmail(form);
        showDone(form, t('forms.mailtoTitle'), t('forms.mailtoText'));
        location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subjectFor(form)) + '&body=' + encodeURIComponent(bodyFor(form));
        return;
      }

      send.disabled = true;
      sendLabel.textContent = t('forms.sending');
      var data = new FormData(form);
      data.append('_page', location.href);
      fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('status ' + r.status);
          showDone(form, t('forms.successTitle'), t('forms.successText'));
          form.reset();
        })
        .catch(function () {
          var summary = form.querySelector('.mform__summary');
          summary.hidden = false;
          summary.textContent = t('forms.errSend');
          summary.focus && summary.setAttribute('tabindex', '-1');
          summary.focus();
        })
        .then(function () {
          send.disabled = false;
          sendLabel.textContent = t('forms.send');
        });
    });

    done.querySelector('.mform__again').addEventListener('click', function () {
      done.hidden = true;
      form.hidden = false;
      var first = form.querySelector('input:not([type=hidden]):not([name=_gotcha]), select, textarea');
      if (first) first.focus();
    });
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('form.mform'), bind);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
