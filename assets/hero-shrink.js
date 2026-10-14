/* Collapsing masthead for the overview page: tall on load, shrinks on scroll to a pinned strip. */
(() => {
  const body = document.body;
  const banner = document.querySelector('.research-banner');
  if (!banner || !body.classList.contains('five-part-home')) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let max = 0, min = 0, raf = 0;
  const measure = () => {
    const w = window.innerWidth;
    const vh = window.innerHeight;
    max = w <= 600 ? Math.round(Math.min(Math.max(w / 1.9, 200), 300, vh * 0.34))
                   : Math.round(Math.min(Math.max(w / 3.35, 260), 470, Math.max(vh * 0.4, 260)));
    min = w <= 600 ? 78 : 96;
    body.style.setProperty('--hero-max', max + 'px');
    body.style.setProperty('--hero-min', min + 'px');
  };
  const update = () => {
    raf = 0;
    const range = Math.max(max - min, 1);
    const p = Math.min(Math.max(window.scrollY / range, 0), 1);
    banner.style.height = Math.round(max - range * p) + 'px';
    body.style.setProperty('--hero-p', p.toFixed(3));
    banner.classList.toggle('is-compact', p > 0.85);
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
  measure(); update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { measure(); update(); });
  if (reduce.matches) banner.style.transition = 'none';
})();
