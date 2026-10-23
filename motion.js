(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  const targets = new Set();
  const collect = (selector, stagger = false) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      if (targets.has(el) || el.closest('[data-motion]')) return;
      targets.add(el);
      el.dataset.motion = '';
      el.style.setProperty('--motion-delay', stagger ? `${(i % 3) * 65}ms` : '0ms');
    });
  };
  collect('.hero-copy > *, .hero-visual > *', true);
  collect('.section-top, .swatches, .calculator, .responsibilities, .strategy-feature, .closing > *');
  collect('.roadmap-stage, .plan, .case-card, .journey > div', true);
  collect('.editorial > *, .audit-layout > *', true);
  collect('.section > .prose > *, .case-conclusion', true);
  const reveal = el => { el.classList.add('motion-in'); };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
  targets.forEach(el => {
    // Content already above the viewport stays visible after anchor navigation.
    if (el.getBoundingClientRect().top < innerHeight - 24) reveal(el);
    else observer.observe(el);
  });
  const revealAll = () => {
    observer.disconnect();
    targets.forEach(reveal);
  };
  reduced.addEventListener('change', event => { if (event.matches) revealAll(); });
  window.addEventListener('beforeprint', revealAll);
  window.addEventListener('hashchange', () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const section = document.getElementById(id);
    if (!section) return;
    if (targets.has(section)) reveal(section);
    section.querySelectorAll('[data-motion]').forEach(reveal);
  });
  document.addEventListener('focusin', event => {
    const el = event.target.closest('[data-motion]');
    if (el) reveal(el);
  });
})();
