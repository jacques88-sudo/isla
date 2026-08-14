const excursions = [
  {
    title: "Whale & Dolphin Watching Yacht Trip",
    category: "Boat Trips",
    zone: "Puerto Colón",
    duration: "3 ore",
    price: "da €55",
    desc: "Escursione in yacht con snack, bevande e avvistamento balene e delfini.",
    image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/c032dda7a9c2819a217342e54ab69c9fea250f53.jpg"
  },
  {
    title: "Whale Watching Catamaran",
    category: "Boat Trips",
    zone: "Costa Adeje",
    duration: "3 ore",
    price: "da €47",
    desc: "Catamarano con osservazione balene e delfini nella costa sud.",
    image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/c7d762861f9bc82b75b45e502ee86f0ee2237a3c.jpg"
  },
  {
    title: "Shogun 5 Hour Tour",
    category: "Boat Trips",
    zone: "Puerto Colón",
    duration: "5 ore",
    price: "da €65",
    desc: "Crociera verso Los Gigantes e Masca con pranzo e bevande incluse.",
    image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/17d5b6c45b77ddcc7fa8ab212029bbd887af7b35.jpg"
  },
  {
    title: "Catamaran Los Gigantes Tour",
    category: "Boat Trips",
    zone: "Costa Adeje",
    duration: "4.5 ore",
    price: "da €60",
    desc: "Tour in catamarano con whale watching e vista sui giganti di Masca.",
    image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/c7d762861f9bc82b75b45e502ee86f0ee2237a3c.jpg"
  },
  {
    title: "3 Hour Shared Motor Yacht",
    category: "Boat Trips",
    zone: "Puerto Colón",
    duration: "3 ore",
    price: "da €50",
    desc: "Motor yacht piccolo gruppo con snorkeling e relax in mare.",
    image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/c032dda7a9c2819a217342e54ab69c9fea250f53.jpg"
  },
  {
    title: "4 Hour Teide Buggy Tour",
    category: "Buggies",
    zone: "Las Chafiras",
    duration: "4 ore",
    price: "da €150",
    desc: "Tour buggy con parte off-road verso il Teide e paesaggi vulcanici.",
    image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/0661c6882bb761d317402c44558055716ebeb09f.jpg"
  },
  {
    title: "2 Hour Buggy Tour Costa Adeje",
    category: "Buggies",
    zone: "Costa Adeje",
    duration: "2 ore",
    price: "da €120",
    desc: "Buggy tour con 40 minuti off-road e percorso divertente.",
    image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/0ec34f3bc271f3d7a755c26923a6489344fa0a00.jpg"
  },
  {
    title: "3 Hour Sunset Volcano Buggy Tour",
    category: "Buggies",
    zone: "Tenerife sud",
    duration: "3 ore",
    price: "da €230",
    desc: "Tour al tramonto con vista vulcanica e guida di gruppo.",
    image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/30dab6a6ffbfb145c25463ba51bd6e3229fe7ba8.jpg"
  },
  {
    title: "Teide Sunset Quad Trip",
    category: "Quads",
    zone: "Mount Teide",
    duration: "3 ore",
    price: "da €150",
    desc: "Quad tour al tramonto verso il Teide con scenari incredibili.",
    image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/30dab6a6ffbfb145c25463ba51bd6e3229fe7ba8.jpg"
  },
  {
    title: "100% Off-Road Quad Tour",
    category: "Quads",
    zone: "Tenerife sud",
    duration: "Variabile",
    price: "su richiesta",
    desc: "Percorso completamente off-road per chi cerca adrenalina pura.",
    image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/0ec34f3bc271f3d7a755c26923a6489344fa0a00.jpg"
  },
  {
    title: "Garachico & Masca Quad Trip",
    category: "Quads",
    zone: "Masca",
    duration: "4 ore",
    price: "su richiesta",
    desc: "Quad tour panoramico tra curve, montagne e viste spettacolari.",
    image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/0661c6882bb761d317402c44558055716ebeb09f.jpg"
  },
  {
    title: "Tenerife Island Coach Tour",
    category: "Island Tours",
    zone: "Tutta l'isola",
    duration: "Giornata intera",
    price: "su richiesta",
    desc: "Tour dei punti più famosi dell’isola in autobus con guida.",
    image: "https://via.placeholder.com/900x600?text=Island+Tour"
  },
  {
    title: "Teide Icod Garachico Masca",
    category: "Island Tours",
    zone: "Nord Tenerife",
    duration: "Giornata intera",
    price: "su richiesta",
    desc: "Tour classico con Teide, Icod, Garachico e Masca.",
    image: "https://via.placeholder.com/900x600?text=Teide+Icod+Masca"
  },
  {
    title: "Star Gazing on Mount Teide",
    category: "Stargazing",
    zone: "Mount Teide",
    duration: "5 ore",
    price: "da €89",
    desc: "Cena, tramonto sopra le nuvole e osservazione delle stelle con telescopi.",
    image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/ce5bfbec71a7c427e96cbe8c178edae8424601d4.jpg"
  }
];

const container = document.getElementById("excursions");
const template = document.getElementById("cardTemplate");
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const filtersEl = document.getElementById("filters");
const themeToggle = document.getElementById("themeToggle");
const playToggle = document.getElementById("playToggle");
const heroVideo = document.getElementById("heroVideo");

const categories = ["Tutti", ...new Set(excursions.map((item) => item.category))];
let activeCategory = "Tutti";

function renderFilters() {
  filtersEl.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-btn ${category === activeCategory ? "active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => {
      activeCategory = category;
      renderFilters();
      renderCards();
    });
    filtersEl.appendChild(button);
  });
}

function getFilteredExcursions() {
  const query = searchInput.value.toLowerCase().trim();

  return excursions.filter((item) => {
    const matchesCategory =
      activeCategory === "Tutti" || item.category === activeCategory;

    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.zone.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });
}

function renderCards() {
  const filtered = getFilteredExcursions();
  container.innerHTML = "";

  if (!filtered.length) {
    container.innerHTML = `<div class="empty-state">No excursions found. Try another category or keyword.</div>`;
    return;
  }

  filtered.forEach((item) => {
    const node = template.content.cloneNode(true);

    node.querySelector(".card-img").src = item.image;
    node.querySelector(".card-img").alt = item.title;
    node.querySelector(".pill").textContent = item.zone;
    node.querySelector(".price").textContent = item.price;
    node.querySelector(".card-title").textContent = item.title;
    node.querySelector(".card-desc").textContent = item.desc;
    node.querySelector(".card-meta").textContent = `${item.category} • ${item.duration}`;

    node.querySelector(".card-btn").addEventListener("click", () => {
      alert(`${item.title}
${item.category} • ${item.duration}
${item.price}`);
    });

    container.appendChild(node);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("isla-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☾" : "☼";
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Passa al tema chiaro" : "Passa al tema scuro"
  );
}

function initTheme() {
  const savedTheme = localStorage.getItem("isla-theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (systemDark ? "dark" : "light"));
}

function toggleVideoState() {
  if (!heroVideo) return;

  if (heroVideo.paused) {
    heroVideo.play();
    playToggle.textContent = "❚❚";
  } else {
    heroVideo.pause();
    playToggle.textContent = "▶";
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderCards();
});

searchInput.addEventListener("input", renderCards);

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

if (playToggle && heroVideo) {
  playToggle.addEventListener("click", toggleVideoState);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

initTheme();
renderFilters();
renderCards();