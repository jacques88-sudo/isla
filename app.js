let deferredPrompt = null;
let newWorker = null;
let refreshing = false;

function createUpdateBanner() {
  if (document.getElementById('update-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'update-banner';
  banner.innerHTML = `
    <div class="update-banner-inner">
      <span>È disponibile una nuova versione di Isla.</span>
      <div class="update-banner-actions">
        <button id="update-now-btn" type="button">Aggiorna</button>
        <button id="update-later-btn" type="button">Dopo</button>
      </div>
    </div>
  `;

  const style = document.createElement('style');
  style.id = 'update-banner-style';
  style.textContent = `
    #update-banner {
      position: fixed;
      left: 16px;
      right: 16px;
      bottom: 16px;
      z-index: 9999;
      background: #18354a;
      color: #ffffff;
      border-radius: 16px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.25);
      padding: 14px 16px;
      font-family: inherit;
    }

    .update-banner-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }

    .update-banner-actions {
      display: flex;
      gap: 10px;
    }

    .update-banner-actions button {
      min-height: 42px;
      padding: 0 14px;
      border: none;
      border-radius: 999px;
      font-weight: 700;
      cursor: pointer;
    }

    #update-now-btn {
      background: #ffffff;
      color: #18354a;
    }

    #update-later-btn {
      background: rgba(255,255,255,0.16);
      color: #ffffff;
    }
  `;

  if (!document.getElementById('update-banner-style')) {
    document.head.appendChild(style);
  }

  document.body.appendChild(banner);

  document.getElementById('update-now-btn').addEventListener('click', () => {
    if (newWorker) {
      newWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  });

  document.getElementById('update-later-btn').addEventListener('click', () => {
    banner.remove();
  });
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js');
      await registration.update();

      if (registration.waiting) {
        newWorker = registration.waiting;
        createUpdateBanner();
      }

      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.addEventListener('statechange', () => {
          if (
            installingWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            newWorker = installingWorker;
            createUpdateBanner();
          }
        });
      });
    } catch (error) {
      console.log('Errore service worker:', error);
    }
  });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}

function setupInstallPrompt() {
  const installButton = document.getElementById('install-button');
  if (!installButton) return;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installButton.hidden = false;
  });

  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    console.log('Install prompt:', choice.outcome);

    deferredPrompt = null;
    installButton.hidden = true;
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installButton.hidden = true;
    console.log('PWA installata');
  });
}

function setupBookingForm() {
  const bookingForm = document.querySelector('.booking-box');
  if (!bookingForm) return;

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Qui collegheremo la ricerca reale delle escursioni.');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupInstallPrompt();
  setupBookingForm();
  registerServiceWorker();
});
