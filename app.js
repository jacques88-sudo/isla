document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const brandBlock = document.getElementById('brandBlock');
  const heroInner = document.getElementById('heroInner');
  const navLinks = Array.from(document.querySelectorAll('.main-nav a, .footer-links a'));
  const revealItems = document.querySelectorAll('.reveal');
  const sections = Array.from(document.querySelectorAll('main section[id]'));

  let ticking = false;

  function handleScrollEffects() {
    const scrollY = window.scrollY || window.pageYOffset;
    const heroLimit = Math.min(scrollY, 180);

    if (header) {
      header.style.transform = `translateY(${Math.min(scrollY * 0.06, 10)}px)`;
      header.style.opacity = '1';
    }

    if (brandBlock) {
      brandBlock.style.transform = `translateX(-50%) translateY(${Math.min(scrollY * 0.10, 18)}px)`;
      brandBlock.style.opacity = '1';
    }

    if (heroInner) {
      heroInner.style.transform = `translateY(${heroLimit * 0.08}px)`;
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(handleScrollEffects);
      ticking = true;
    }
  }, { passive: true });

  handleScrollEffects();

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();

      const headerOffset = 140;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });

      history.replaceState(null, '', href);
    });
  });

  if (sections.length && navLinks.length) {
    const setActiveLink = (id) => {
      navLinks.forEach((link) => {
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
