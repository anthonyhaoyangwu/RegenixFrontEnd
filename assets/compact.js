/* Accessible tabs and opt-in technical details, with a compact default view. */
(() => {
  function selectTab(tab, focus = false) {
    const group = tab.closest('.tab-set');
    group.querySelectorAll(':scope > .compact-tabs > [role="tab"]').forEach(button => {
      const selected = button === tab;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      const wasVisible = !panel.hidden;
      panel.hidden = !selected;
      // Unload a playing embed when leaving its tab; restore it on return.
      panel.querySelectorAll('iframe').forEach(frame => {
        if (!selected && wasVisible && frame.hasAttribute('src')) {
          frame.dataset.videoSrc = frame.getAttribute('src');
          frame.removeAttribute('src');
        } else if (selected && frame.dataset.videoSrc) {
          frame.setAttribute('src', frame.dataset.videoSrc);
          delete frame.dataset.videoSrc;
        }
      });
    });
    if (focus) tab.focus();
  }
  document.querySelectorAll('.compact-tabs').forEach(list => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectTab(tab));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); selectTab(tabs[next], true); }
      });
    });
  });
  document.querySelectorAll('[data-open-dialog]').forEach(button => {
    button.addEventListener('click', () => document.getElementById(button.dataset.openDialog)?.showModal());
  });
  document.querySelectorAll('[data-close-dialog]').forEach(button => {
    button.addEventListener('click', () => button.closest('dialog').close());
  });
  function navigateHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    if (!id) return;
    const topic = [...document.querySelectorAll('[data-topic]')].find(node => node.dataset.topic === id);
    if (topic) {
      const panel = topic.closest('[role="tabpanel"]');
      selectTab(document.getElementById(panel.getAttribute('aria-labelledby')));
      return;
    }
    const target = document.getElementById(id);
    const dialog = target?.closest('dialog');
    if (dialog) {
      if (!dialog.open) dialog.showModal();
      target.scrollIntoView({ block: 'start' });
    }
  }
  window.addEventListener('hashchange', navigateHash);
  navigateHash();
})();
