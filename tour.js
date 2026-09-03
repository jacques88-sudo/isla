// Pagina di dettaglio di una singola escursione.
//
// L'indirizzo è tour.html?id=<id della voce in esplora-catalog.js>.
// Da qui si arriva toccando una scheda nel catalogo.
//
// Riusa da escursioni.js: tourPrice(), categoryName() e la finestra
// "Richiedi disponibilità" con il messaggio WhatsApp già compilato.
// Richiede i18n.js e esplora-catalog.js caricati prima.

// Quante altre esperienze mostrare in fondo, ognuna di una categoria diversa
const DETAIL_MAX_CORRELATE = 3;

function tourFromUrl() {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return null;
  return ESPLORA_CATALOG.find(t => t.id === id && t.published) || null;
}

function detailMedia(tour) {
  return tour.image
    ? `<img src="./assets/${encodeURIComponent(tour.image)}" alt="${esc(tf(tour.title))}" data-hero-img />`
    : `<span class="tour-media-empty" aria-hidden="true">${t("tour.photoSoon")}</span>`;
}

// La mini galleria sotto la foto grande: solo dove c'e' sia `image` che
// `gallery`, altrimenti niente striscia di miniature da mostrare. Cliccando
// una miniatura cambia la foto grande, non apre un'altra pagina: e' un tocco
// solo, niente frecce avanti/indietro da gestire.
function detailGallery(tour) {
  if (!tour.image || !Array.isArray(tour.gallery) || !tour.gallery.length) return "";
  const foto = [tour.image, ...tour.gallery];
  const miniature = foto.map((nome, i) => `
    <button type="button" class="gallery-thumb${i === 0 ? " is-active" : ""}"
            data-gallery-src="${esc(nome)}" aria-label="${esc(t("detail.photo", { n: i + 1 }))}">
      <img src="./assets/${encodeURIComponent(nome)}" alt="" loading="lazy" />
    </button>`).join("");
  return `<div class="detail-gallery" data-detail-gallery>${miniature}</div>`;
}

// Le righe "In breve": si saltano i campi ancora da definire, cosi' la
// scheda non si riempie di "Da definire".
//
// `variante` e' la durata scelta coi bottoni, quando la scheda ne ha. I prezzi
// possono stare sulla scheda oppure dentro la variante, dove cambiano con la
// durata: da qui in poi non fa differenza, le righe che ne escono sono le
// stesse. Il riquadro si ridisegna a ogni bottone premuto.
function detailRows(tour, variante) {
  // daDefinire() arriva da escursioni.js, caricato prima di questo file
  const righe = [];

  // Il punto di partenza puo' cambiare con la variante: la stessa gita col
  // ritrovo nel nord parte da un altro porto.
  const zona = (variante && variante.zone) || tour.zone;
  if (!daDefinire(zona)) {
    righe.push([t("detail.departure"), tf(zona)]);
  }
  // Quando le varianti SONO le durate ("1 ora" / "2 ore"), il campo duration
  // ripete la stessa cosa in forma riassunta ("1 o 2 ore") e la pagina direbbe
  // "Durata" due volte di fila. Sulla scheda del catalogo la riassunta serve
  // ancora, qui no.
  const opzioniSonoLaDurata = !!(tour.options &&
    tf(tour.options.label) === t("detail.duration"));
  // Come la zona: la durata puo' cambiare con la variante (il giro condiviso
  // dura tre ore, il charter privato da tre a nove).
  const durata = (variante && variante.duration) || tour.duration;
  if (!daDefinire(durata) && !opzioniSonoLaDurata) {
    righe.push([t("detail.duration"), tf(durata)]);
  }

  // Orari e lingue stavano solo dentro la finestra della richiesta, dove si
  // arriva col pulsante: chi guardava la pagina non li trovava. Qui ci vanno
  // solo gli orari **veri** dell'attivita', mai le fasce segnaposto che la
  // finestra usa come ripiego.
  // I giorni si mostrano solo quando sono una limitazione vera: sette su sette
  // non e' un'informazione, e' rumore.
  const giorni = giorniDi(tour, variante);
  if (giorni.length && giorni.length < 7) {
    righe.push([t("detail.days"), giorniTesto(giorni)]);
  }
  // Come i giorni: prima gli orari della variante, se ne ha di suoi.
  const orari = (variante && variante.times) || tour.times;
  if (Array.isArray(orari) && orari.length) {
    righe.push([t("detail.times"), orari.join(" · ")]);
  }
  if (Array.isArray(tour.languages) && tour.languages.length) {
    righe.push([t("detail.languages"), tour.languages.join(" · ")]);
  }
  // I due prezzi a persona: quelli della variante scelta se ce li ha, se no
  // quelli della scheda, ma solo quando non c'e' una variante scelta. Il
  // `price` liscio della variante non entra qui: puo' essere il prezzo del
  // mezzo o del gruppo, non della persona (vedi prezziAPersona() in
  // escursioni.js). Se la variante scelta non ha `priceAdult` (una cabina
  // VIP, il jet ski a moto d'acqua) niente ripiego sul prezzo della scheda,
  // se no la cabina VIP di Siam Park mostrerebbe il prezzo del biglietto
  // normale invece di sparire.
  const adulto = variante ? (variante.priceAdult || 0) : (tour.priceAdult || 0);
  const bambino = variante ? (variante.priceChild || 0) : (tour.priceChild || 0);

  // prezzi a scaglioni: una riga per fascia al posto della riga "Prezzo"
  if (Array.isArray(tour.priceTiers) && tour.priceTiers.length) {
    tour.priceTiers.forEach(fascia => {
      righe.push([
        t("detail.people", { from: fascia.from, to: fascia.to }),
        "€" + eur(fascia.price)
      ]);
    });
  } else if (adulto > 0) {
    // "Prezzo: €55" sopra "Adulti: €55" e' la stessa cosa scritta due volte:
    // si tengono solo le righe per fascia d'eta', che sono piu' precise.
  } else if (variante && variante.price) {
    // variante col prezzo ma senza le fasce: il numero e' quello del mezzo o
    // del gruppo, e resta sulla riga generica
    righe.push([t("detail.price"), "€" + eur(variante.price) + priceUnitSuffix(tour)]);
  } else {
    righe.push([t("detail.price"), tourPrice(tour)]);
  }

  // A 0 vuol dire "non ancora deciso" e la riga resta nascosta: mostrare "€0"
  // farebbe pensare a gratis o a un errore.
  // "Adulti (12+)": la fascia d'eta' fra parentesi, quando il fornitore l'ha
  // detta. Senza, resta solo "Adulti".
  const eta = tour.ages || {};
  // tf() perche' una fascia puo' avere bisogno delle tre lingue: "0-3" si
  // scrive uguale dappertutto, "0-11 mesi" no.
  const conEta = (etichetta, fascia) => fascia ? etichetta + " (" + tf(fascia) + ")" : etichetta;
  if (adulto > 0) righe.push([conEta(t("req.adults"), eta.adult), "€" + eur(adulto)]);
  if (bambino > 0) righe.push([conEta(t("req.kids"), eta.child), "€" + eur(bambino)]);
  // Per i neonati lo zero vuol dire davvero gratis, non "da decidere": la
  // riga si mostra solo se il campo c'e', e sparisce se manca.
  // Solo insieme alle altre righe a persona: sulla variante che si paga a
  // barca, "Neonati: Gratis" non vuol dire niente — non paga nessuno a testa.
  if (tour.priceInfant !== undefined && adulto > 0) {
    righe.push([conEta(t("detail.infants"), eta.infant),
      tour.priceInfant > 0 ? "€" + eur(tour.priceInfant) : t("detail.free")]);
  }
  righe.push([t("detail.suitable"), t(tour.family ? "detail.kidsYes" : "detail.kidsNo")]);
  // "€99 adulti · €74 bambini": il posto per i neonati esiste solo qui, e'
  // il sedile sul pullman, senza transfer non si paga.
  const prezzoTransfer = tp => {
    if (!tp) return "";
    const parti = [];
    if (tp.adult) parti.push("€" + eur(tp.adult) + " " + t("wa.adults"));
    if (tp.child) parti.push("€" + eur(tp.child) + " " + t("wa.children"));
    if (tp.baby) parti.push("€" + eur(tp.baby) + " " + t("wa.babies") + " (" + t("detail.babySeat") + ")");
    return parti.join(" · ");
  };
  // `tp` in catalogo e' sempre il prezzo **completo** (biglietto+transfer),
  // quello che serve al totale. Sulla riga accorpata pero' si mostra solo il
  // supplemento del transfer: vicino ad "Adulti (12+) €78" un "€99 adulti" si
  // legge come un secondo prezzo del biglietto, non come il costo del bus.
  const supplemento = tp => {
    if (!tp) return null;
    const s = { adult: tp.adult - (tour.priceAdult || 0) };
    if (tp.child) s.child = tp.child - (tour.priceChild || 0);
    return s;
  };
  // Il prezzo completo pero' e' quello del prezzo **base** della scheda, e con
  // una variante scelta che ha un suo prezzo a persona (il VIP di Castillo San
  // Miguel, il tutto compreso di Siam Park e di Loro Parque) non e' piu' quello
  // giusto: va rifatto sul prezzo della variante, cioe' il supplemento del bus
  // sommato al prezzo di quella variante. E' lo stesso conto che fa gia'
  // prezziAPersona() per il totale: senza, la pagina scriveva "Con il transfer
  // €64,50 adulti" e due righe sotto un totale da €194.
  // Niente da rifare quando la variante il prezzo a persona non ce l'ha (le
  // cabine VIP di Siam Park, che si pagano a spazio): li' resta il prezzo della
  // scheda, come prima.
  const conVariante = tp => {
    if (!tp || !variante || !variante.priceAdult) return tp;
    const rifatto = { adult: variante.priceAdult + (tp.adult - (tour.priceAdult || 0)) };
    if (tp.child && variante.priceChild) {
      rifatto.child = variante.priceChild + (tp.child - (tour.priceChild || 0));
    }
    if (tp.baby) rifatto.baby = tp.baby;
    return rifatto;
  };
  // `transferPriceLabel` accorpa descrizione e prezzo in una riga sola: serve
  // sulle schede con due transfer diversi (Twin Ticket, Siam Park), che
  // altrimenti diventerebbero quattro righe che si confondono a vicenda. Le
  // altre schede, con un solo transfer, restano su due righe (descrizione,
  // poi prezzo completo).
  if (tour.transferPriceLabel && tour.transferPrice && !tour.transferPriceHidden) {
    const prezzo = prezzoTransfer(supplemento(tour.transferPrice));
    if (prezzo) righe.push([tf(tour.transferPriceLabel), prezzo]);
  } else {
    if (tour.transfer) righe.push([t("detail.transfer"), tf(tour.transfer)]);
    if (tour.transferPrice && !tour.transferPriceHidden) {
      const prezzo = prezzoTransfer(conVariante(tour.transferPrice));
      if (prezzo) righe.push([t("detail.withTransfer"), prezzo]);
    }
  }
  // Il secondo transfer, una seconda zona di partenza: stessa logica.
  if (tour.transferSiamPriceLabel && tour.transferSiamPrice && !tour.transferSiamPriceHidden) {
    const prezzo = prezzoTransfer(supplemento(tour.transferSiamPrice));
    if (prezzo) righe.push([tf(tour.transferSiamPriceLabel), prezzo]);
  } else {
    if (tour.transferSiam) righe.push([t("detail.transferSiam"), tf(tour.transferSiam)]);
    if (tour.transferSiamPrice && !tour.transferSiamPriceHidden) {
      const prezzo = prezzoTransfer(conVariante(tour.transferSiamPrice));
      if (prezzo) righe.push([t("detail.withTransferSiam"), prezzo]);
    }
  }
  if (tour.season) righe.push([t("detail.season"), tf(tour.season)]);

  return righe.map(([etichetta, valore]) => `
    <div class="detail-row">
      <dt>${esc(etichetta)}</dt>
      <dd>${esc(valore)}</dd>
    </div>`).join("");
}

// Icone di "Cosa e' incluso". Ognuna e' un disegno a linee su una griglia
// 24x24 che prende il colore del testo intorno. Per aggiungerne una servono
// una voce qui e una riga "inc.<parola>" in i18n.js.
const INCLUDED_ICONS = {
  snorkel:   '<rect x="3.5" y="8" width="13" height="8" rx="3.5"/><path d="M16.5 12H20"/><path d="M20 12V6"/>',
  wetsuit:   '<path d="M8 3h8l2 5-2 1v12H6V9L4 8z"/><path d="M10 3v4h4V3"/>',
  board:     '<path d="M12 2c5 4 7 10 7 14 0 3-3 6-7 6s-7-3-7-6c0-4 2-10 7-14z"/><path d="M12 6v14"/>',
  equipment: '<path d="M8 8V6a4 4 0 0 1 8 0v2"/><rect x="4" y="8" width="16" height="13" rx="3"/><path d="M9 13h6"/>',
  drinks:    '<path d="M6 5h12l-1.2 14a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8z"/><path d="M6.6 11h10.8"/>',
  snack:     '<path d="M4 11a8 5 0 0 1 16 0v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z"/><path d="M4.4 14.5h15.2"/>',
  fingerfood: '<path d="M3 15h18a9 9 0 0 1-18 0z"/><circle cx="8" cy="11" r="1.5"/><circle cx="12" cy="9.4" r="1.5"/><circle cx="16" cy="11" r="1.5"/>',
  swimstop:  '<circle cx="16.5" cy="7.5" r="1.8"/><path d="M5 13l4.5-2.5 3 2 3-1.5"/><path d="M2 18c2 0 2 1.2 4 1.2s2-1.2 4-1.2 2 1.2 4 1.2 2-1.2 4-1.2 2 1.2 4 1.2"/>',
  lunch:     '<path d="M6 3v8a2 2 0 0 0 4 0V3M8 11v10"/><path d="M17 3c-2 0-3 3-3 6s1 3 3 3v9"/>',
  tasting:   '<path d="M7 3h10l-1 6a4 4 0 0 1-8 0z"/><path d="M12 13v6M9 21h6"/>',
  guide:     '<circle cx="12" cy="7" r="3"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7"/>',
  transfer:  '<path d="M3 16V8a2 2 0 0 1 2-2h9l4 4h1a2 2 0 0 1 2 2v4"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
  ferry:     '<path d="M3 17l2-6h14l2 6"/><path d="M12 11V5h5"/><path d="M2 20c2 0 2 1 4 1s2-1 4-1 2 1 4 1 2-1 4-1 2 1 4 1"/>',
  ticket:    '<path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1 0 4 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-4 2 2 0 0 1 0-4z"/><path d="M14 6v12"/>',
  photos:    '<path d="M3 8a2 2 0 0 1 2-2h3l1.5-2h5L16 6h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="12" r="3.5"/>',
  // Il salvagente e non il giubbotto: un gilet disegnato a due tratti finisce
  // per somigliare alla muta qui sopra, l'anello no.
  lifejacket: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5"/><path d="M12 3.5v5M12 15.5v5M3.5 12h5M15.5 12h5"/>',
  // La cassa portatile: woofer grande, tweeter piccolo. Una nota musicale
  // direbbe "musica", non "te la prestiamo noi".
  speaker:   '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><circle cx="12" cy="15" r="3.4"/><circle cx="12" cy="7" r="1.1"/>',
  // La pila di asciugamani piegati. L'asciugamano appeso alla sbarra, provato
  // prima, diventava un bicchiere: la sbarra si confondeva col bordo di sopra.
  towels:    '<rect x="4.5" y="15" width="15" height="5" rx="2"/><rect x="6" y="9.5" width="12" height="5" rx="2"/><rect x="7.5" y="4" width="9" height="5" rx="2"/>',
  // La borsa frigo: coperchio largo che sporge, corpo piu' stretto sotto, e il
  // fiocco di neve dentro. Il primo disegno era una scatola con la maniglia in
  // cima e una riga in mezzo, e in fila con le altre leggeva "cassetta degli
  // attrezzi": troppo vicina a `equipment`, che e' gia' una borsa con manico e
  // riga. Il coperchio sporgente da' la sagoma giusta, il fiocco dice il freddo.
  cooler:    '<rect x="2" y="7.5" width="20" height="4.5" rx="1.5"/><path d="M4 12v6.5a1.5 1.5 0 0 0 1.5 1.5h13a1.5 1.5 0 0 0 1.5-1.5V12"/><path d="M12 14v4M10.3 15 13.7 17M13.7 15 10.3 17"/>',
  // La pompa di benzina. Senza il basamento sotto e il vetro del display
  // sembrava una caraffa col manico.
  fuel:      '<path d="M3.5 20.5V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v15.5"/><path d="M2.5 20.5h11"/><rect x="5.5" y="5.5" width="5" height="4" rx="1"/><path d="M12.5 10.5h3a2 2 0 0 1 2 2v4.75a1.75 1.75 0 0 0 3.5 0V10.5l-2.2-2.2"/>'
};

// L'itinerario: una riga per tappa, con l'orario a sinistra dove c'e'. E'
// quello che vende una gita di una giornata — il cliente vuole sapere a che
// ora parte e dove lo portano, non solo che "e' bello".
function detailItinerary(tour) {
  if (!Array.isArray(tour.itinerary) || !tour.itinerary.length) return "";

  return `
    <section class="detail-itinerary">
      <h2 class="detail-sub">${esc(t("detail.itinerary"))}</h2>
      <ol>
        ${tour.itinerary.map(tappa => `
          <li>
            ${tappa.time ? `<span class="detail-itinerary-time">${esc(tappa.time)}</span>` : ""}
            <span>${esc(tf(tappa.text))}</span>
          </li>`).join("")}
      </ol>
    </section>`;
}

// I consigli: le cose pratiche da sapere prima di partire. Testo libero e non
// parole chiave come `included`, perche' cambiano troppo da attivita' a
// attivita' per stare in un vocabolario.
function detailNotes(tour) {
  if (!Array.isArray(tour.notes) || !tour.notes.length) return "";

  return `
    <section class="detail-notes">
      <h2 class="detail-sub">${esc(t("detail.notes"))}</h2>
      <ul>
        ${tour.notes.map(nota => `<li>${esc(tf(nota))}</li>`).join("")}
      </ul>
    </section>`;
}

// Il riquadro "Cosa e' incluso": una parola chiave sconosciuta viene saltata
// invece di disegnare un buco.
// Le parole di "Cosa e' incluso" per la variante scelta: quelle della scheda,
// piu' quelle della variante. Si sommano, non si sostituiscono: sulla scheda si
// scrive quello che vale per tutte (bagno, bevande, guida) e sulla variante solo
// quello che ha in piu' (il pranzo, il transfer). Cosi' le cose comuni si
// scrivono una volta sola invece di ripeterle in ogni variante.
function paroleIncluse(tour, variante) {
  const parole = (tour.included || []).concat((variante && variante.included) || []);
  // niente doppioni se una parola sta sia sulla scheda sia sulla variante,
  // e via le parole senza icona invece di lasciare un buco nella griglia
  return parole.filter((k, i) => parole.indexOf(k) === i && INCLUDED_ICONS[k]);
}

function iconeIncluse(parole) {
  return parole.map(k => `
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${INCLUDED_ICONS[k]}</svg>
      <span>${esc(t("inc." + k))}</span>
    </li>`).join("");
}

function detailIncluded(tour) {
  // Il riquadro si disegna con la prima variante, che e' quella premuta di
  // partenza; poi lo ridisegna collegaOpzioni() a ogni cambio. Deve esistere
  // anche se la scheda non ha `included` ma una variante si', se no al primo
  // clic non ci sarebbe niente da riempire.
  const scelte = (tour.options && tour.options.choices) || [];
  const serve = (tour.included && tour.included.length) ||
    scelte.some(s => s.included && s.included.length);
  if (!serve) return "";

  const voci = paroleIncluse(tour, primaVariante(tour));
  return `
    <section class="detail-included" data-detail-included${voci.length ? "" : " hidden"}>
      <h2 class="detail-sub">${esc(t("detail.included"))}</h2>
      <ul data-detail-included-list>${iconeIncluse(voci)}</ul>
    </section>`;
}

// Le varianti come bottoni, sulla pagina stessa: il cliente sceglie qui e la
// richiesta parte gia' con la scelta dentro, senza chiedergliela di nuovo.
// La prima e' selezionata di partenza, cosi' non si puo' mandare una richiesta
// senza variante.
// Le varianti stanno **prima** di "In breve", non sopra il pulsante come
// all'inizio: la riga "Prezzo" della tabella segue la variante scelta, quindi
// prima si sceglie e poi si legge il riassunto. Al contrario il cliente leggeva
// un prezzo, scendeva, cambiava variante e quel prezzo cambiava alle sue spalle.
// Dove non ci sono varianti questa funzione non scrive niente e la pagina resta
// com'era.
function detailOptions(tour) {
  const opz = tour.options;
  if (!opz || !Array.isArray(opz.choices) || !opz.choices.length) return "";

  return `
    <div class="detail-options" data-detail-options
         role="group" aria-label="${esc(tf(opz.label))}">
      <span class="detail-options-label">${esc(tf(opz.label))}</span>
      <div class="detail-options-list">
        ${opz.choices.map((scelta, i) => {
          // `price` e' il numero da scrivere sul bottone; `priceAdult` c'e'
          // dove il prezzo della variante e' a persona e sappiamo anche
          // quello dei bambini. Sul bottone vale lo stesso.
          const prezzo = scelta.price || scelta.priceAdult;
          return `
          <button type="button" class="detail-option"
                  data-option-value="${esc(tf(scelta.label))}"
                  ${prezzo ? `data-option-price="${prezzo}"` : ""}
                  ${scelta.desc ? `data-option-desc="${esc(tf(scelta.desc))}"` : ""}
                  aria-pressed="${i === 0 ? "true" : "false"}">
            <span class="detail-option-name">${esc(tf(scelta.label))}</span>
            ${prezzo ? `<span class="detail-option-price">€${eur(prezzo)}</span>` : ""}
          </button>`; }).join("")}
      </div>
      ${opz.choices.some(s => s.desc)
        ? '<p class="detail-option-desc" data-detail-option-desc></p>' : ""}
    </div>`;
}

// La variante premuta all'apertura e' sempre la prima: la tabella e il riquadro
// devono nascere gia' d'accordo coi bottoni, se no al primo sguardo dicono i
// numeri di una variante che nessuno ha scelto.
function primaVariante(tour) {
  const scelte = (tour.options && tour.options.choices) || [];
  return scelte[0] || null;
}

// Una scheda per categoria diversa da quella aperta, cosi' si vede un
// assaggio del resto del catalogo invece che altre tre barche uguali.
function detailRelated(tour) {
  const viste = new Set();
  const altre = [];
  for (const x of ESPLORA_CATALOG) {
    if (!x.published || x.category === tour.category || viste.has(x.category)) continue;
    viste.add(x.category);
    altre.push(x);
    if (altre.length >= DETAIL_MAX_CORRELATE) break;
  }
  if (!altre.length) return "";

  return `
    <section class="detail-related">
      <h2>${esc(t("detail.related"))}</h2>
      <ul>
        ${altre.map(x => `
          <li>
            <a href="./tour.html?id=${encodeURIComponent(x.id)}">
              <span class="detail-related-media">
                ${x.image
                  ? `<img src="./assets/${encodeURIComponent(x.image)}" alt="" loading="lazy" />`
                  : `<span class="tour-media-empty" aria-hidden="true">${t("tour.photoSoon")}</span>`}
              </span>
              <span class="detail-related-body">
                <span class="detail-related-title">${esc(tf(x.title))}</span>
                <span class="detail-related-price">${esc(tourPrice(x))}</span>
              </span>
            </a>
          </li>`).join("")}
      </ul>
    </section>`;
}

// Rimando alla versione privata della stessa uscita, per chi vuole la barca
// riservata al proprio gruppo.
function detailPrivate(tour) {
  if (!tour.privateOption) return "";
  const privata = ESPLORA_CATALOG.find(x => x.id === tour.privateOption && x.published);
  if (!privata) return "";

  return `
    <a class="detail-alt" href="./tour.html?id=${encodeURIComponent(privata.id)}">
      <span class="detail-alt-title">${esc(t("detail.privateTitle"))}</span>
      <span class="detail-alt-name">${esc(tf(privata.title))} · ${esc(tourPrice(privata))}</span>
      <span class="detail-alt-go">${esc(t("detail.privateLink"))} →</span>
    </a>`;
}

function renderTour(tour) {
  const contenitore = document.querySelector("[data-tour]");
  if (!contenitore) return;

  if (!tour) {
    document.title = t("detail.notFound") + " · Isla";
    contenitore.innerHTML = `
      <div class="state">
        <h2>${esc(t("detail.notFound"))}</h2>
        <p>${esc(t("detail.notFoundText"))}</p>
        <a class="btn btn-primary" href="./escursioni.html">${esc(t("detail.seeAll"))}</a>
      </div>`;
    return;
  }

  document.title = tf(tour.title) + " · Isla";

  // Due strade dallo stesso punto: chiedere solo questa, oppure metterla da
  // parte e continuare a guardare. La prima resta il pulsante pieno, perche'
  // e' quella che fa la maggior parte dei clienti.
  const askBtn = WHATSAPP_NUMBER
    ? `<button class="btn btn-primary btn-block" type="button" data-request-open="${esc(tour.id)}"
               aria-haspopup="dialog" aria-controls="requestDialog">${esc(t("tour.ask"))}</button>
       <button class="btn btn-soft btn-block detail-add" type="button" data-request-add="${esc(tour.id)}"
               aria-haspopup="dialog" aria-controls="requestDialog">${esc(t("req.addToList"))}</button>`
    : "";

  contenitore.innerHTML = `
    <article class="detail-tour">
      <div class="detail-media">
        <div class="detail-hero">${detailMedia(tour)}</div>
        ${detailGallery(tour)}
      </div>
      <div class="detail-main">
        <span class="tour-cat">${esc(categoryName(tour.category))}</span>
        <h1 class="detail-h1">${esc(tf(tour.title))}</h1>
        <p class="detail-lead">${esc(tf(tour.desc))}</p>

        ${detailOptions(tour)}

        <h2 class="detail-sub">${esc(t("detail.summary"))}</h2>
        <dl class="detail-rows" data-detail-rows>${detailRows(tour, primaVariante(tour))}</dl>

        ${detailItinerary(tour)}
        ${detailIncluded(tour)}
        ${detailNotes(tour)}
        ${askBtn}
        <p class="hint" data-i18n-html="req.hint"></p>
        ${detailPrivate(tour)}
      </div>
    </article>
    ${detailRelated(tour)}`;

  // il paragrafo del preavviso contiene <strong>, quindi passa da applyI18n
  applyI18n(contenitore);
  collegaOpzioni(contenitore, tour);
  collegaGalleria(contenitore);
}

// Le miniature sotto la foto grande cambiano solo `src` dell'immagine
// principale: niente pagina nuova, niente libreria di lightbox.
function collegaGalleria(contenitore) {
  const galleria = contenitore.querySelector("[data-detail-gallery]");
  const heroImg = contenitore.querySelector("[data-hero-img]");
  if (!galleria || !heroImg) return;

  galleria.addEventListener("click", e => {
    const bottone = e.target.closest("[data-gallery-src]");
    if (!bottone) return;
    heroImg.src = "./assets/" + encodeURIComponent(bottone.dataset.gallerySrc);
    galleria.querySelectorAll(".gallery-thumb").forEach(b => b.classList.toggle("is-active", b === bottone));
  });
}

// Un bottone solo alla volta resta premuto, e la pagina sotto segue la variante
// scelta: senza, il cliente sceglie le 2 ore e continua a leggere i prezzi e le
// cose incluse di un'altra.
function collegaOpzioni(contenitore, tour) {
  const gruppo = contenitore.querySelector("[data-detail-options]");
  if (!gruppo) return;

  // La descrizione della variante scelta sta in un riquadro sotto i bottoni,
  // non dentro ognuno: con quattro varianti che hanno due righe di testo a
  // testa la fila di bottoni diventa un muro e non si scelgono piu'.
  const descEl = contenitore.querySelector("[data-detail-option-desc]");
  const righeEl = contenitore.querySelector("[data-detail-rows]");
  const inclusoEl = contenitore.querySelector("[data-detail-included]");
  const inclusoListaEl = contenitore.querySelector("[data-detail-included-list]");

  // Tre pezzi di pagina seguono la variante scelta, e si aggiornano insieme:
  //   - "In breve", dove i prezzi per fascia d'eta' sono quelli della variante
  //   - le due righe che spiegano la variante, sotto i bottoni
  //   - "Cosa e' incluso": sul giro di 2 ore non c'e' ne' il pranzo ne' il
  //     transfer, e mostrarli lo stesso sarebbe una promessa non mantenuta
  function aggiornaScheda(bottone) {
    const variante = varianteDi(tour, bottone.getAttribute("data-option-value"));

    if (righeEl) righeEl.innerHTML = detailRows(tour, variante);

    if (descEl) {
      const d = bottone.getAttribute("data-option-desc") || "";
      descEl.textContent = d;
      descEl.hidden = !d;
    }

    if (inclusoEl && inclusoListaEl) {
      const voci = paroleIncluse(tour, variante);
      inclusoListaEl.innerHTML = iconeIncluse(voci);
      inclusoEl.hidden = !voci.length;
    }
  }

  gruppo.addEventListener("click", e => {
    const bottone = e.target.closest(".detail-option");
    if (!bottone) return;
    gruppo.querySelectorAll(".detail-option")
      .forEach(b => b.setAttribute("aria-pressed", String(b === bottone)));
    aggiornaScheda(bottone);
  });

  const iniziale = gruppo.querySelector('.detail-option[aria-pressed="true"]');
  if (iniziale) aggiornaScheda(iniziale);
}

function initTourPage() {
  if (!document.querySelector("[data-tour]")) return;
  const tour = tourFromUrl();
  renderTour(tour);
  // Al cambio lingua la scheda va ridisegnata: e' costruita da JavaScript.
  // I bottoni delle varianti pero' rinascono col primo premuto, e chi aveva
  // scelto le 2 ore si ritrovava sul giro da 40 minuti — prezzo, orari e
  // durata compresi — senza che niente glielo dicesse. Si tiene la posizione,
  // non l'etichetta: quella e' cambiata proprio adesso. Stessa cosa che fa
  // gia' il menu delle varianti dentro la finestra della richiesta.
  document.addEventListener("islalang", () => {
    const bottoni = [...document.querySelectorAll("[data-detail-options] .detail-option")];
    const scelto = bottoni.findIndex(b => b.getAttribute("aria-pressed") === "true");
    renderTour(tourFromUrl());
    if (scelto > 0) {
      const nuovi = document.querySelectorAll("[data-detail-options] .detail-option");
      if (nuovi[scelto]) nuovi[scelto].click();
    }
  });
}

document.addEventListener("DOMContentLoaded", initTourPage);
