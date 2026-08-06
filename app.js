document.addEventListener('DOMContentLoaded', () => {
  const heroVideo = document.getElementById('heroVideo');
  const playToggle = document.getElementById('playToggle');
  const siteHeader = document.getElementById('siteHeader');
  const brandBlock = document.getElementById('brandBlock');
  const heroInner = document.getElementById('heroInner');
  const heroSection = document.getElementById('heroSection');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  const navLinks = Array.from(document.querySelectorAll('.main-nav a, .footer-links a, .book-btn, .discover-btn, .btn-dark, .btn-light'));
  const primaryNavLinks = Array.from(document.querySelectorAll('.main-nav a, .footer-links a'));
  const observedSections = Array.from(document.querySelectorAll('section[id]'));
  const revealItems = Array.from(document.querySelectorAll(
    '.trust-card, .info-card, .excursion-card, .package-card, .secret-card, .review-card, .faq-item, .cta-banner'
  ));

  let mouseX = 0;
  let mouseY = 0;
  let scrollYValue = window.scrollY;
  let currentHeaderX = 0;
  let currentHeaderY = 0;
  let currentBrandX = 0;
  let currentBrandY = 0;
  let currentHeroY = 0;
  let currentVideoY = 0;
  let currentVideoScale = 1.02;

  function updatePlayState() {
    if (!heroVideo || !playToggle) return;

    if (heroVideo.paused) {
      playToggle.classList.remove('is-playing');
      playToggle.setAttribute('aria-label', 'Play video');
    } else {
      playToggle.classList.add('is-playing');
      playToggle.setAttribute('aria-label', 'Pause video');
    }
  }

  async function toggleVideo() {
    if (!heroVideo) return;

    if (heroVideo.paused) {
      try {
        await heroVideo.play();
      } catch (error) {
        console.log(error);
      }
    } else {
      heroVideo.pause();
    }

    updatePlayState();
  }

  function setActiveNav(id) {
    primaryNavLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function setupSmoothScroll() {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      link.addEventListener('click', (event) => {
        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      });
    });
  }

  function setupScrollSpy() {
    if (!observedSections.length) return;

    const observer = new IntersectionObserver((entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visibleSections.length) return;

      setActiveNav(visibleSections[0].target.id);
    }, {
      root: null,
      rootMargin: '-20% 0px -55% 0px',
      threshold: [0.1, 0.2, 0.35, 0.5, 0.7]
    });

    observedSections.forEach((section) => observer.observe(section));
  }

  function setupReveal() {
    if (!revealItems.length) return;

    revealItems.forEach((item, index) => {
      if (reduceMotion) return;
      item.style.opacity = '0';
      item.style.transform = 'translateY(24px)';
      item.style.transition = `opacity 650ms ease, transform 650ms ease ${index * 30}ms`;
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12
    });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  function animateScene() {
    if (reduceMotion) return;

    const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
    const scrollProgress = Math.max(0, Math.min(scrollYValue / heroHeight, 1.15));

    const targetHeaderX = isTouchDevice ? 0 : mouseX * 4;
    const targetHeaderY = (isTouchDevice ? 0 : mouseY * 2) - scrollProgress * 8;

    const targetBrandX = isTouchDevice ? 0 : mouseX * 8;
    const targetBrandY = (isTouchDevice ? 0 : mouseY * 4) - scrollProgress * 14;

    const targetHeroY = scrollProgress * 24;
    const targetVideoY = scrollProgress * -18;
    const targetScale = 1.02 + (scrollProgress * 0.03);

    currentHeaderX += (targetHeaderX - currentHeaderX) * 0.10;
    currentHeaderY += (targetHeaderY - currentHeaderY) * 0.10;
    currentBrandX += (targetBrandX - currentBrandX) * 0.10;
    currentBrandY += (targetBrandY - currentBrandY) * 0.10;
    currentHeroY += (targetHeroY - currentHeroY) * 0.10;
    currentVideoY += (targetVideoY - currentVideoY) * 0.10;
    currentVideoScale += (targetScale - currentVideoScale) * 0.10;

    if (siteHeader) {
      siteHeader.style.transform = `translate3d(${currentHeaderX}px, ${currentHeaderY}px, 0)`;
      siteHeader.style.opacity = `${1 - Math.min(scrollProgress * 0.10, 0.10)}`;
    }

    if (brandBlock) {
      brandBlock.style.transform = `translate3d(${currentBrandX}px, ${currentBrandY}px, 0)`;
      brandBlock.style.opacity = `${1 - Math.min(scrollProgress * 0.16, 0.16)}`;
    }

    if (heroInner) {
      heroInner.style.transform = `translate3d(0, ${currentHeroY}px, 0)`;
    }

    if (heroVideo) {
      heroVideo.style.transform = `translate3d(0, ${currentVideoY}px, 0) scale(${currentVideoScale})`;
    }

    window.requestAnimationFrame(animateScene);
  }

  function setupPointerMotion() {
    if (reduceMotion || isTouchDevice) return;

    window.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX / window.innerWidth - 0.5);
      mouseY = (event.clientY / window.innerHeight - 0.5);
    });
  }

  function setupScrollTracking() {
    window.addEventListener('scroll', () => {
      scrollYValue = window.scrollY;
    }, { passive: true });
  }

  if (playToggle) {
    playToggle.addEventListener('click', toggleVideo);
  }

  if (heroVideo) {
    heroVideo.addEventListener('play', updatePlayState);
    heroVideo.addEventListener('pause', updatePlayState);
  }

  setupSmoothScroll();
  setupScrollSpy();
  setupReveal();
  setupPointerMotion();
  setupScrollTracking();
  updatePlayState();

  if (!reduceMotion) {
    window.requestAnimationFrame(animateScene);
  }
});
