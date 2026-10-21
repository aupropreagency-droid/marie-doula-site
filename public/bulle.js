// Bulle WhatsApp : visible une fois le haut de page passé, masquée au niveau du pied de page.
(function () {
  var bulle = document.querySelector('.flottant');
  if (!bulle || !('IntersectionObserver' in window)) { if (bulle) bulle.classList.add('visible'); return; }
  var haut = document.querySelector('.heros:not(.heros-service)');
  var pied = document.querySelector('.pied');
  var hautVisible = !!haut, piedVisible = false;
  function maj() { bulle.classList.toggle('visible', !hautVisible && !piedVisible); }
  var obs = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (e) {
      if (e.target === haut) hautVisible = e.isIntersecting;
      if (e.target === pied) piedVisible = e.isIntersecting;
    });
    maj();
  });
  if (haut) obs.observe(haut);
  if (pied) obs.observe(pied);
  maj();
})();

// Menu mobile : se referme quand on choisit une section ou qu'on touche ailleurs.
(function () {
  var menu = document.querySelector('.menu-mobile');
  if (!menu) return;
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { menu.removeAttribute('open'); });
  });
  document.addEventListener('click', function (e) {
    if (menu.hasAttribute('open') && !menu.contains(e.target)) menu.removeAttribute('open');
  });
})();

// Retour depuis une page de service : revenir sur la section d'où l'on vient (accompagnements ou soins).
(function () {
  document.querySelectorAll('.bloc-num').forEach(function (lien) {
    lien.addEventListener('click', function () {
      var section = lien.closest('section[id]');
      if (section && history.replaceState) history.replaceState(null, '', '#' + section.id);
    });
  });
  function allerSection() {
    var h = location.hash;
    if (h !== '#accompagnements' && h !== '#soins') return;
    var el = document.querySelector(h);
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  window.addEventListener('pageshow', function () { setTimeout(allerSection, 0); });
})();
