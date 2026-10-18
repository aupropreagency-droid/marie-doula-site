// Points de repère sous les carrousels de services (mobile uniquement).
document.querySelectorAll('[data-carrousel]').forEach(function (piste) {
  var points = document.getElementById(piste.getAttribute('data-carrousel'));
  if (!points) return;
  var puces = points.querySelectorAll('i');
  var compteur = points.querySelector('span');
  var total = puces.length;

  function maj() {
    var carte = piste.querySelector('.carte');
    var pas = carte ? carte.offsetWidth + 14 : piste.clientWidth;
    var i = Math.min(total - 1, Math.max(0, Math.round(piste.scrollLeft / pas)));
    puces.forEach(function (p, n) { p.classList.toggle('actif', n === i); });
    if (compteur) compteur.textContent = (i + 1) + ' / ' + total;
  }

  piste.addEventListener('scroll', maj, { passive: true });
  window.addEventListener('resize', maj);
  maj();
});
