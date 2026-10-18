/* ===== EXECUTIVE FIBER — SHARED SCRIPT (nav + ticker) ===== */

/* Mobile menu (called from the hamburger's onclick) */
function toggleNav() {
  var ham = document.getElementById('hamburger');
  var mob = document.getElementById('mobile-nav');
  if (!ham || !mob) return;
  var open = mob.classList.toggle('open');
  ham.classList.toggle('open', open);
  ham.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function closeNav() {
  var ham = document.getElementById('hamburger');
  var mob = document.getElementById('mobile-nav');
  if (!ham || !mob) return;
  ham.classList.remove('open');
  mob.classList.remove('open');
  ham.setAttribute('aria-expanded', 'false');
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.mobile-nav a').forEach(function (a) {
    a.addEventListener('click', closeNav);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  /* Ticker: de-duplicate items, repeat them until one half is wider than the
     viewport, then double it so the -50% loop is seamless on any screen. */
  var tickers = [];
  document.querySelectorAll('.ticker-inner').forEach(function (inner) {
    var seen = {}, items = [];
    inner.querySelectorAll('.ticker-item').forEach(function (el) {
      var key = el.textContent.trim();
      if (!seen[key]) { seen[key] = true; items.push(el.cloneNode(true)); }
    });
    if (items.length) tickers.push({ inner: inner, items: items });
  });

  function buildTickers() {
    tickers.forEach(function (t) {
      var inner = t.inner;
      var viewport = inner.parentElement.clientWidth || window.innerWidth;
      inner.innerHTML = '';
      var guard = 0;
      do {
        t.items.forEach(function (it) { inner.appendChild(it.cloneNode(true)); });
      } while (inner.getBoundingClientRect().width < viewport && ++guard < 20);
      var half = inner.getBoundingClientRect().width;
      Array.prototype.slice.call(inner.children).forEach(function (k) {
        inner.appendChild(k.cloneNode(true));
      });
      inner.style.animationDuration = Math.max(15, Math.round(half / 70)) + 's';
    });
  }

  buildTickers();
  var timer;
  window.addEventListener('resize', function () {
    clearTimeout(timer);
    timer = setTimeout(buildTickers, 250);
  });
});
