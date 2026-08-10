document.addEventListener('DOMContentLoaded', () => {
  const allNavLinks = Array.from(document.querySelectorAll('.main-nav a, .footer-links a, .mobile-more-links a, .mobile-action-btn[href^="#"]'));
  const revealItems = document.querySelectorAll('.reveal');
  const sections = Array.from(document.querySelectorAll('main section[id]'));

  const moreBtn = document.getElementById('mobileMoreBtn');
  const morePanel = document.getElementById('mobileMorePanel');
  const moreOverlay = document.getElementById('mobileMoreOverlay');
  const moreClose = document.getElementById('mobileMoreClose');

  function openMore(){
    morePanel.classList.add('is-open');
    moreOverlay.classList.add('is-open');
    moreBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMore(){
    morePanel.classList.remove('is-open');
    moreOverlay.classList.remove('is-open');
    moreBtn.setAttribute('aria-expanded', 'false');
  }

  if (moreBtn) {
    moreBtn.addEventListener('click', () => {
      const isOpen = morePanel.classList.contains('is-open');
      isOpen ? closeMore() : openMore();
    });
  }

  if (moreClose) moreClose.addEventListener('click', closeMore);
  if (moreOverlay) moreOverlay.addEventListener('click', closeMore);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMore();
  });

  allNavLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      closeMore();

      const headerOffset = 120;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });

      history.replaceState(null, '', href);
    });
  });

  if (sections.length && allNavLinks.length) {
    const setActiveLink = (id) => {
      allNavLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('is-active', isActive);
      });
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleEntry) {
        setActiveLink(visibleEntry.target.id);
      }
    }, {
      root: null,
      threshold: [0.2, 0.4, 0.6],
      rootMargin: '-25% 0px -45% 0px'
    });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  if (revealItems.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });

    revealItems.forEach((item) => revealObserver.observe(item));
  }
});
