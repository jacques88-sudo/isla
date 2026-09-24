// La pagina dei noleggi: auto, moto e scooter.
//
// Non sono schede del catalogo: il catalogo ragiona a persone (adulto,
// bambino), un noleggio ragiona a giorni. Stanno qui, in un elenco loro.
//
// I prezzi vengono dai listini dei due noleggiatori (settembre 2026) e sono
// **quelli del listino**, senza ricarico, per scelta del proprietario. I nomi
// dei noleggiatori non si mostrano: sul sito ci sono solo i modelli.
//
// COME E' FATTO UN MEZZO
//   name     il modello, uguale in tutte e tre le lingue (e' un nome proprio)
//   kind     che cos'e' ("Maxi scooter 300 cc"), tradotto; si puo' omettere
//   seats    posti, solo dove il listino li scrive
//   license  la patente che serve, chiave di i18n.js ("rent.lic.A2")
//   perDay   [1-2 giorni, 3-6 giorni, 7 o piu'] — prezzo AL GIORNO, e scende
//            coi giorni. Si legge "€50 al giorno se lo tieni 1 o 2 giorni".
//   totals   al posto di perDay, per l'unico listino scritto a totali (lo
//            scooter 125): [prezzo di 1 giorno, di 2, ... di 7], poi `extraDay`
//            e' quanto costa ogni giorno dall'ottavo in poi.
//
// Il messaggio WhatsApp porta il nome del mezzo: l'ufficio sa da chi andare.

const RENT_GROUPS = [
  {
    id: "auto",
    title: "rent.cars",
    // Il listino delle auto lo scrive sotto: luglio, agosto, dicembre e
    // gennaio costano 5 euro in piu' al giorno. Vale per tutte le auto.
    note: "rent.carsNote",
    items: [
      { name: "Fiat Panda", perDay: [50, 45, 40] },
      { name: "Fiat 500", perDay: [55, 50, 45] },
      { name: "Seat Ibiza / Citroën C3", perDay: [62, 57, 52] },
      { name: "Volkswagen Polo", perDay: [62, 57, 52] },
      { name: "Volkswagen Polo", kind: "rent.kind.auto", perDay: [70, 65, 60] },
      { name: "Volkswagen Golf / Seat León", perDay: [75, 70, 65] },
      // Sul listino "automatico" sta accanto alla Cactus: della Captur non
      // lo dice, quindi non lo scriviamo.
      { name: "Citroën C4 Cactus", kind: "rent.kind.auto", perDay: [75, 70, 65] },
      { name: "Renault Captur", perDay: [75, 70, 65] },
      { name: "Fiat 500 Cabrio", perDay: [80, 75, 70] },
      { name: "Citroën Grand Picasso", seats: 7, perDay: [110, 105, 100] },
      { name: "Volkswagen Beetle", perDay: [115, 110, 105] },
      { name: "Renault Trafic", kind: "rent.kind.van", perDay: [120, 115, 110] }
    ]
  },
  {
    id: "moto",
    title: "rent.motos",
    // Scritto in fondo al listino delle moto: vale per tutti i mezzi qui sotto.
    note: "rent.motosNote",
    items: [
      { name: "Honda PCX", kind: "rent.kind.scooter125", license: "rent.lic.B3",
        totals: [50, 90, 120, 150, 170, 190, 210], extraDay: 30 },
      { name: "Honda Forza 300", kind: "rent.kind.scooter300", license: "rent.lic.A2", perDay: [65, 60, 55] },
      { name: "Suzuki Burgman 400", kind: "rent.kind.scooter400", license: "rent.lic.A2", perDay: [75, 70, 60] },
      { name: "Honda CB125F", kind: "rent.kind.gear125", license: "rent.lic.B3", perDay: [50, 45, 40] },
      { name: "Honda / Kawasaki", kind: "rent.kind.moto500", license: "rent.lic.A2", perDay: [90, 85, 80] },
      { name: "Honda / Kawasaki / Yamaha", kind: "rent.kind.moto750", license: "rent.lic.A", perDay: [95, 90, 85] },
      { name: "BMW / Yamaha / Honda", kind: "rent.kind.moto800", license: "rent.lic.A", perDay: [105, 95, 90] },
      { name: "Honda Africa Twin", license: "rent.lic.A", perDay: [155, 150, 145] },
      { name: "BMW R 1300 GS", license: "rent.lic.A", perDay: [170, 165, 160] }
    ]
  }
];

// Il nome del mezzo come lo legge l'ufficio nel messaggio: modello e tipo,
// cosi' le due Polo (manuale e automatica) non si confondono.
function rentLabel(item) {
  return item.kind ? item.name + " · " + t(item.kind) : item.name;
}

function rentWaLink(text) {
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
}

// Una riga della tabella prezzi: a sinistra quanti giorni, a destra il prezzo.
function rentRow(label, price) {
  const row = document.createElement("div");
  row.className = "rent-row";
  const dt = document.createElement("dt");
  dt.textContent = label;
  const dd = document.createElement("dd");
  dd.textContent = price;
  row.append(dt, dd);
  return row;
}

function rentCard(item) {
  const li = document.createElement("li");
  li.className = "rent-card";

  const head = document.createElement("div");
  head.className = "rent-card-head";
  const name = document.createElement("h3");
  name.textContent = item.name;
  head.appendChild(name);
  const sub = [];
  if (item.kind) sub.push(t(item.kind));
  if (item.seats) sub.push(t("rent.seats", { n: item.seats }));
  if (sub.length) {
    const kind = document.createElement("p");
    kind.className = "rent-kind";
    kind.textContent = sub.join(" · ");
    head.appendChild(kind);
  }
  li.appendChild(head);

  const dl = document.createElement("dl");
  dl.className = "rent-prices";
  if (item.perDay) {
    const labels = ["rent.d12", "rent.d36", "rent.d7"];
    item.perDay.forEach((p, i) => dl.appendChild(rentRow(t(labels[i]), "€" + eur(p))));
  } else {
    item.totals.forEach((p, i) =>
      dl.appendChild(rentRow(t(i === 0 ? "rent.day1" : "rent.dayN", { n: i + 1 }), "€" + eur(p))));
    dl.appendChild(rentRow(t("rent.dayExtra", { n: item.totals.length + 1 }), "€" + eur(item.extraDay)));
  }
  li.appendChild(dl);
  // "al giorno" o "in tutto": senza, €50 accanto a "3-6 giorni" si legge
  // come il prezzo di tutti i giorni insieme.
  const unit = document.createElement("p");
  unit.className = "rent-unit";
  unit.textContent = t(item.perDay ? "rent.unitDay" : "rent.unitTotal");
  li.appendChild(unit);

  if (item.license) {
    const lic = document.createElement("p");
    lic.className = "rent-license";
    lic.textContent = t(item.license);
    li.appendChild(lic);
  }

  const btn = document.createElement("a");
  btn.className = "btn btn-soft btn-block rent-cta";
  btn.href = rentWaLink(t("wa.rentItem", { mezzo: rentLabel(item) }));
  btn.target = "_blank";
  btn.rel = "noopener noreferrer";
  btn.textContent = t("rent.request");
  li.appendChild(btn);

  return li;
}

function renderRent() {
  const root = document.querySelector("[data-rent-groups]");
  if (!root) return;
  root.textContent = "";

  RENT_GROUPS.forEach(group => {
    const section = document.createElement("section");
    section.className = "rent-group";
    section.id = group.id;

    const h2 = document.createElement("h2");
    h2.textContent = t(group.title);
    section.appendChild(h2);

    if (group.note) {
      const note = document.createElement("p");
      note.className = "rent-note";
      note.textContent = t(group.note);
      section.appendChild(note);
    }

    const ul = document.createElement("ul");
    ul.className = "rent-grid";
    group.items.forEach(item => ul.appendChild(rentCard(item)));
    section.appendChild(ul);

    root.appendChild(section);
  });

  const other = document.querySelector("[data-rent-other]");
  if (other) {
    other.href = rentWaLink(t("wa.rental"));
  }
}

document.addEventListener("DOMContentLoaded", renderRent);
document.addEventListener("islalang", renderRent);
