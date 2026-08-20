// Shared across all pages: theme toggle, service worker, ticket lookup form.

(function initTheme() {
  const root = document.documentElement;
  const btn = document.querySelector("[data-theme-toggle]");
  let theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  root.setAttribute("data-theme", theme);

  function paint() {
    if (!btn) return;
    btn.textContent = theme === "dark" ? "☀" : "☾";
    btn.setAttribute("aria-label", theme === "dark" ? "Passa al tema chiaro" : "Passa al tema scuro");
  }

  paint();

  if (btn) {
    btn.addEventListener("click", () => {
      theme = theme === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", theme);
      paint();
    });
  }
})();

// Site banner shrinks to a compact bar once the page scrolls
function initStickyBanner() {
  const banner = document.querySelector(".site-banner");
  if (!banner) return;

  function paint() {
    banner.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  paint();
  window.addEventListener("scroll", paint, { passive: true });
}

document.addEventListener("DOMContentLoaded", initStickyBanner);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

// Wires any <form data-lookup-form> to navigate to booking.html?code=...
function initLookupForms() {
  document.querySelectorAll("[data-lookup-form]").forEach(form => {
    const input = form.querySelector("input");
    form.addEventListener("submit", e => {
      e.preventDefault();
      const code = input.value.trim();
      if (!code) return;
      window.location.href = "./booking.html?code=" + encodeURIComponent(code);
    });
  });
}

document.addEventListener("DOMContentLoaded", initLookupForms);

// Hero video play/pause toggle (home page only)
function initHeroVideo() {
  const video = document.getElementById("heroVideo");
  const toggle = document.getElementById("videoToggle");
  if (!video || !toggle) return;

  const iconPause = document.getElementById("iconPause");
  const iconPlay = document.getElementById("iconPlay");

  toggle.addEventListener("click", () => {
    if (video.paused) {
      video.play();
      iconPause.hidden = false;
      iconPlay.hidden = true;
      toggle.setAttribute("aria-label", "Metti in pausa il video");
    } else {
      video.pause();
      iconPause.hidden = true;
      iconPlay.hidden = false;
      toggle.setAttribute("aria-label", "Riproduci il video");
    }
  });
}

document.addEventListener("DOMContentLoaded", initHeroVideo);

// "More" off-canvas menu (home page only)
function initMoreMenu() {
  const panel = document.getElementById("moreMenu");
  const scrim = document.querySelector("[data-menu-scrim]");
  const openBtns = document.querySelectorAll("[data-menu-open]");
  const closeBtns = document.querySelectorAll("[data-menu-close]");
  const links = document.querySelectorAll("[data-menu-link]");
  if (!panel || !scrim || !openBtns.length) return;

  function open() {
    panel.hidden = false;
    scrim.hidden = false;
    requestAnimationFrame(() => {
      panel.classList.add("is-open");
      scrim.classList.add("is-visible");
    });
    document.body.classList.add("menu-open");
    openBtns.forEach(btn => btn.setAttribute("aria-expanded", "true"));
  }

  function close() {
    panel.classList.remove("is-open");
    scrim.classList.remove("is-visible");
    document.body.classList.remove("menu-open");
    openBtns.forEach(btn => btn.setAttribute("aria-expanded", "false"));
    setTimeout(() => {
      panel.hidden = true;
      scrim.hidden = true;
    }, 300);
  }

  openBtns.forEach(btn => btn.addEventListener("click", open));
  closeBtns.forEach(btn => btn.addEventListener("click", close));
  links.forEach(link => link.addEventListener("click", close));
  scrim.addEventListener("click", close);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && panel.classList.contains("is-open")) close();
  });
}

document.addEventListener("DOMContentLoaded", initMoreMenu);
