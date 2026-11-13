/*
 * MyShishapedia - stranica miksa kreatora: video sa Instagrama se učita tek na klik
 * (stranica ostaje brza, a pregled ide kreatoru jer se pušta sa njegovog profila).
 */
(function () {
  'use strict';
  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-reel]'), function (box) {
      var b = box.querySelector('[data-play]');
      if (!b) return;
      b.addEventListener('click', function () {
        var f = document.createElement('iframe');
        f.src = 'https://www.instagram.com/reel/' + encodeURIComponent(box.getAttribute('data-reel')) + '/embed/';
        f.title = 'Instagram video';
        f.allow = 'autoplay; encrypted-media; picture-in-picture';
        f.setAttribute('allowfullscreen', '');
        f.className = 'crt-video__frame';
        box.innerHTML = '';
        box.appendChild(f);
        box.classList.add('is-on');
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
