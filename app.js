const header = document.getElementById("siteHeader");
const heroVideo = document.getElementById("heroVideo");
const playToggle = document.getElementById("playToggle");

const menuPanel = document.getElementById("menuPanel");
const menuOpen = document.getElementById("menuOpen");
const menuClose = document.getElementById("menuClose");
const menuBackdrop = document.getElementById("menuBackdrop");

const installBtnDesktop = document.getElementById("installBtnDesktop");
const installBtnMobile = document.getElementById("installBtnMobile");

const faqItems = document.querySelectorAll(".faq-item");
let deferredPrompt = null;
let isInstalled = false;

function updateHeader() {
  if (!header) return;
  if (window.scrollY > 24) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

function updatePlayButton() {
  if (!heroVideo || !playToggle) return;
  playToggle.textContent = heroVideo.paused ? "▶" : "❚❚";
  playToggle.setAttribute(
    "aria-label",
    heroVideo.paused ? "Riproduci il video" : "Metti in pausa il video"
  );
}

function openMenu() {
  if (!menuPanel) return;
  menuPanel.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  if (!menuPanel) return;
  menuPanel.classList.remove("open");
  document.body.style.overflow = "";
}

function setInstallButtonsVisible(visible) {
  const display = visible ? "inline-flex" : "none";
  if (installBtnDesktop) installBtnDesktop.style.display = display;
  if (installBtnMobile) installBtnMobile.style.display = display;
}

function checkStandalone() {
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  if (standalone) {
    isInstalled = true;
    setInstallButtonsVisible(false);
  }
}

async function installApp() {
  if (!deferredPrompt) return;
  await deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  if (choice.outcome === "accepted") {
    isInstalled = true;
  }
  deferredPrompt = null;
  setInstallButtonsVisible(false);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (heroVideo && playToggle) {
  playToggle.addEventListener("click", () => {
    if (heroVideo.paused) {
      heroVideo.play();
    } else {
      heroVideo.pause();
    }
  });

  heroVideo.addEventListener("play", updatePlayButton);
  heroVideo.addEventListener("pause", updatePlayButton);
  updatePlayButton();
}

if (menuOpen) menuOpen.addEventListener("click", openMenu);
if (menuClose) menuClose.addEventListener("click", closeMenu);
if (menuBackdrop) menuBackdrop.addEventListener("click", closeMenu);

document.querySelectorAll(".drawer-nav a, .drawer-cta").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-q");
  const symbol = button ? button.querySelector("span:last-child") : null;

  if (!button) return;

  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    faqItems.forEach((faq) => {
      faq.classList.remove("open");
      const faqButton = faq.querySelector(".faq-q span:last-child");
      if (faqButton) faqButton.textContent = "+";
    });

    if (!isOpen) {
      item.classList.add("open");
      if (symbol) symbol.textContent = "−";
    }
  });
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  if (!isInstalled) {
    setInstallButtonsVisible(true);
  }
});

window.addEventListener("appinstalled", () => {
  isInstalled = true;
  deferredPrompt = null;
  setInstallButtonsVisible(false);
});

if (installBtnDesktop) {
  installBtnDesktop.addEventListener("click", () => {
    void installApp();
  });
}

if (installBtnMobile) {
  installBtnMobile.addEventListener("click", () => {
    void installApp();
  });
}

checkStandalone();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}