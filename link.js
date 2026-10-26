// IL PULSANTE "DAL NOSTRO ULTIMO VIDEO" DELLA PAGINA DEI LINK (link.html)
//
// Chi guarda un reel su Instagram o TikTok non puo' toccare un link nella
// didascalia: tocca il "link in bio" e arriva a link.html. Qui in cima trova
// l'escursione del video che ha appena visto (proprietario, 26 ottobre 2026).
//
// A ogni video nuovo si cambia SOLO l'id qui sotto (l'id della scheda, quello
// di tour.html?id=…). Titolo, zona, prezzo e foto li prende dal catalogo, nella
// lingua del telefono. Con `null`, o con una scheda non pubblicata, il pulsante
// non c'e'. Dopo la modifica si alza CACHE_NAME in sw.js, come sempre.
const ULTIMO_VIDEO = "freebird-catamaran";

function disegnaUltimoVideo() {
  const box = document.getElementById("ultimoVideo");
  if (!box) return;
  const tour = ULTIMO_VIDEO && ESPLORA_CATALOG.find(x => x.id === ULTIMO_VIDEO && x.published);
  if (!tour) { box.hidden = true; return; }

  box.href = "./tour.html?id=" + encodeURIComponent(tour.id);
  box.querySelector("img").src = "./assets/piccole/" + encodeURIComponent(tour.image);
  box.querySelector("strong").textContent = tf(tour.title);
  // Il prezzo come nell'elenco ("da €30"); "su richiesta" se non c'e'.
  let prezzo = "";
  if (tour.priceFrom !== null && tour.priceFrom !== undefined) {
    const unita = tour.priceUnit ? tf(tour.priceUnit) : "";
    prezzo = t("tour.from", { p: eur(tour.priceFrom) }) + (unita ? (unita.startsWith("/") ? "" : " ") + unita : "");
  }
  box.querySelector("small").textContent = [tf(tour.zone), prezzo].filter(Boolean).join(" · ");
  box.hidden = false;
}

disegnaUltimoVideo();
// La bandiera cambia la lingua senza ricaricare: il pulsante si riscrive.
document.addEventListener("islalang", disegnaUltimoVideo);
