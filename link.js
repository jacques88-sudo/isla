// IL PULSANTE "DAL NOSTRO ULTIMO VIDEO" DELLA PAGINA DEI LINK (link.html)
//
// Chi guarda un reel su Instagram o TikTok non puo' toccare un link nella
// didascalia: tocca il "link in bio" e arriva a link.html. Qui in cima trova
// l'escursione del video che ha appena visto (proprietario, 26 ottobre 2026).
//
// A ogni video nuovo si cambia SOLO la riga qui sotto:
//   - una scheda:    l'id della scheda, quello di tour.html?id=…
//                    ("freebird-catamaran")
//   - un pacchetto:  "pacchetto:" e l'id del pacchetto, quello di
//                    pacchetto.html?id=… ("pacchetto:adrenalina-in-due")
// Titolo, prezzo e foto li prende dal catalogo o da pacchetti.js, nella lingua
// del telefono. Con `null`, o con un id che non c'e', il pulsante non c'e'.
// Dopo la modifica si alza CACHE_NAME in sw.js, come sempre.
//
// Storia: Freebird (26 ottobre 2026), poi il pacchetto coppia del post
// Instagram con l'offerta da 139 (26 ottobre 2026, sera).
const ULTIMO_VIDEO = "pacchetto:adrenalina-in-due";

// Cosa mostrare: { href, foto, titolo, riga } oppure null.
function ultimoVideoDati() {
  if (!ULTIMO_VIDEO) return null;

  if (ULTIMO_VIDEO.indexOf("pacchetto:") === 0) {
    const pack = pacchettoDi(ULTIMO_VIDEO.slice("pacchetto:".length));
    if (!pack) return null;
    // Il prezzo come in vetrina: "Offerta · da €139", o "da €…" senza offerta.
    const conto = pacchettoConto(pack);
    let prezzo = "";
    if (conto) {
      prezzo = conto.minimo ? t("tour.from", { p: eur(conto.scontato) }) : "€" + eur(conto.scontato);
      prezzo += " " + t("pack.perPerson");
    }
    return {
      href: pacchettoHref(pack),
      foto: pack.image,
      titolo: tf(pack.title),
      riga: [conto && conto.offerta ? t("pack.offer") : t("pack.eyebrow"), prezzo].filter(Boolean).join(" · ")
    };
  }

  const tour = ESPLORA_CATALOG.find(x => x.id === ULTIMO_VIDEO && x.published);
  if (!tour) return null;
  // Il prezzo come nell'elenco ("da €30"); niente se non c'e'.
  let prezzo = "";
  if (tour.priceFrom !== null && tour.priceFrom !== undefined) {
    prezzo = t("tour.from", { p: eur(tour.priceFrom) }) + priceUnitSuffix(tour);
  }
  return {
    href: "./tour.html?id=" + encodeURIComponent(tour.id),
    foto: tour.image,
    titolo: tf(tour.title),
    riga: [tf(tour.zone), prezzo].filter(Boolean).join(" · ")
  };
}

function disegnaUltimoVideo() {
  const box = document.getElementById("ultimoVideo");
  if (!box) return;
  const dati = ultimoVideoDati();
  if (!dati) { box.hidden = true; return; }

  box.href = dati.href;
  box.querySelector("img").src = fotoPiccola(dati.foto);
  box.querySelector("strong").textContent = dati.titolo;
  box.querySelector("small").textContent = dati.riga;
  box.hidden = false;
}

disegnaUltimoVideo();
// La bandiera cambia la lingua senza ricaricare: il pulsante si riscrive.
document.addEventListener("islalang", disegnaUltimoVideo);
