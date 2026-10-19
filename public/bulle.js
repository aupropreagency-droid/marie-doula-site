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
