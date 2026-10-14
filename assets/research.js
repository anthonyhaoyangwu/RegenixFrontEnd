/* Accessible mobile navigation shared by the four research pages. */
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#site-navigation');
  if (!toggle || !menu) return;
  const close = () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      close();
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav')) close();
  });
  menu.addEventListener('click', event => {
    if (event.target.closest('a')) close();
  });
})();
