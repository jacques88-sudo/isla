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
    title: "Teide Sunset Quad Trip",
    category: "Quads",
    zone: "Mount Teide",
    duration: "3 ore",
    price: "da €150",
    desc: "Quad tour al tramonto verso il Teide con scenari incredibili.",
    image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/30dab6a6ffbfb145c25463ba51bd6e3229fe7ba8.jpg"
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
    title: "Star Gazing on Mount Teide",
    category: "Stargazing",
    zone: "Mount Teide",
    duration: "5 ore",
    price: "da €89",
    desc: "Cena, tramonto sopra le nuvole e osservazione delle stelle con telescopi.",
    image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/ce5bfbec71a7c427e96cbe8c178edae8424601d4.jpg"
  },
  {
    title: "Tenerife Island Coach Tour",
    category: "Island Tours",
    zone: "Tutta l'isola",
    duration: "Giornata intera",
    price: "su richiesta",
    desc: "Tour dei punti più famosi dell’isola in autobus con guida.",
    image: "https://via.placeholder.com/900x600?text=Island+Tour"
  }
];

const filtersEl = document.getElementById("filters");
const excursionsEl = document.getElementById("excursions");
const template = document.getElementById("cardTemplate");
const heroVideo = document.getElementById("heroVideo");
const playToggle = document.getElementById("playToggle");
const menuToggle = document.getElementById("menuToggle");

const categories = ["All", ...new Set(excursions.map((item) => item.category))];
let activeCategory = "All";

function renderFilters() {
  filtersEl.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip ${category === activeCategory ? "active" : ""}`;
    button.textContent = category;

    button.addEventListener("click", () => {
      activeCategory = category;
      renderFilters();
      renderCards();
    });

    filtersEl.appendChild(button);
  });
}

function getFilteredItems() {
  if (activeCategory === "All") return excursions;
  return excursions.filter((item) => item.category === activeCategory);
}

function renderCards() {
  const items = getFilteredItems();
  excursionsEl.innerHTML = "";

  items.forEach((item) => {
    const node = template.content.cloneNode(true);

    node.querySelector(".tour-image").src = item.image;
    node.querySelector(".tour-image").alt = item.title;
    node.querySelector(".tour-zone").textContent = item.zone;
    node.querySelector(".tour-price").textContent = item.price;
    node.querySelector(".tour-title").textContent = item.title;
    node.querySelector(".tour-meta").textContent = `${item.category} • ${item.duration}`;
    node.querySelector(".tour-desc").textContent = item.desc;

    node.querySelector(".detail-btn").addEventListener("click", () => {
      alert(`${item.title}
${item.category} • ${item.duration}
${item.price}`);
    });

    excursionsEl.appendChild(node);
  });
}

function updatePlayButton() {
  if (!heroVideo || !playToggle) return;
  playToggle.textContent = heroVideo.paused ? "▶" : "❚❚";
}

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

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    alert("Qui dopo possiamo aggiungere menu, FAQ, contatti e sezioni interne.");
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

renderFilters();
renderCards();