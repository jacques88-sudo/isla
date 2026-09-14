// I PACCHETTI DI ISLA
//
// A COSA SERVE
//   Un pacchetto e' un gruppo di escursioni del catalogo vendute insieme con
//   uno sconto. Sono quelli che l'ufficio ha gia' deciso: il cliente li trova
//   pronti nella pagina "Pacchetti" del riquadro bento.
//
// COSA SI SPINGE
//   Questa lista e' costruita attorno a quattro prodotti da spingere: Luxury
//   Cruiser Experience, i giri in buggy, lo stargazing in gruppo piccolo e il
//   jet ski da un'ora. Ognuno compare in piu' pacchetti, dentro temi diversi,
//   cosi' il cliente ci arriva da strade diverse e non sembra la stessa
//   proposta ripetuta otto volte.
//
// IL PREZZO NON SI SCRIVE QUI
//   Nessun pacchetto ha un prezzo suo. Si somma quello delle escursioni
//   leggendolo da `esplora-catalog.js` e si toglie `sconto`. E' la stessa
//   regola della lista: un prezzo scritto due volte e' un prezzo che prima o
//   poi si contraddice. Se domani cambi 39 in 45 sul Teide, i pacchetti che lo
//   contengono si aggiornano da soli.
//
// COME SI COMPILA UNA VOCE
//   id          → l'id della scheda in `esplora-catalog.js`, scritto uguale.
//                 Se sbagli l'id la voce sparisce e basta, non rompe niente,
//                 ma non se ne accorge nessuno: lo controlla `controlla.js`.
//   optionIndex → facoltativo: quale variante, contando da 0 nell'ordine in
//                 cui stanno in `options.choices`. Serve quando il pacchetto
//                 vende una variante precisa e non lascia scegliere (il jet
//                 ski da un'ora, lo stargazing in gruppo piccolo). Senza,
//                 sceglie il cliente nella finestra della richiesta. E' lo
//                 stesso campo che le voci della lista gia' salvano.
//
//   Gli indici che servono qui, presi dal catalogo:
//     buggy-volcano-4h    0 Offroad 3h · 1 Tramonto sul Teide · 2 Completo 4h
//                         3 Montagna su strada
//     jet-ski-safari-1-2h 0 quaranta minuti · 1 un'ora · 2 due ore
//     stargazing-group    0 gruppo grande · 1 gruppo piccolo
//     luxury-cruiser      0 tre ore in condivisione · 1 barca privata
//
// PREZZO A PERSONA E PREZZO A MEZZO
//   Attenzione ai pacchetti con buggy o jet ski: quelle schede hanno
//   `priceUnit` e il prezzo e' del **mezzo**, non della persona. I pacchetti
//   dove succede hanno il commento PREZZO MISTO qui sotto, e il numero che
//   mostrano e' quello di **una persona da sola** — vedi "IL NUMERO IN
//   VETRINA" piu' giu'.
//
// LO SCONTO
//   `sconto` e' una percentuale sulla somma. Oggi sono tutti al 10%: resta un
//   campo per pacchetto e non una costante unica perche' il primo pacchetto
//   che va al 15% non deve costringere a riscrivere la struttura. Vale su
//   tutto, mezzi compresi: e' lo sconto nostro sul pacchetto intero, e una
//   regola sola e' una regola che l'ufficio sa ripetere al telefono.

const PACCHETTI_SCONTO_DEFAULT = 10;

const PACCHETTI = [

  // ─── I CLASSICI ───────────────────────────────────────────────────────────

  {
    id: "tenerife-classico",
    title: {
      it: "Tenerife in tre mosse",
      en: "Tenerife in three moves",
      es: "Tenerife en tres pasos"
    },
    image: "teide-national-park.jpg",
    sconto: 10,
    // 39 + 55 + 44 = 138 → 124,20 a persona
    voci: [
      { id: "teide-national-park" },
      { id: "luxury-cruiser", optionIndex: 0 },
      { id: "siam-park" }
    ],
    desc: {
      it: "La montagna, il mare e il parco: tre giorni che coprono l'isola senza ripetersi. Il Teide in pullman con la guida, una giornata in barca da Las Galletas e il Siam Park.",
      en: "The mountain, the sea and the park: three days that cover the island without repeating themselves. Teide by coach with a guide, a day on the water from Las Galletas and Siam Park.",
      es: "La montaña, el mar y el parque: tres días que recorren la isla sin repetirse. El Teide en autocar con guía, un día en barco desde Las Galletas y el Siam Park."
    }
  },

  {
    id: "tenerife-buggy",
    // PREZZO MISTO: il buggy si paga a mezzo, le altre due a persona.
    title: {
      it: "Tre mosse, versione buggy",
      en: "Three moves, buggy version",
      es: "Tres pasos, versión buggy"
    },
    image: "buggy-volcano-4h.jpg",
    sconto: 10,
    voci: [
      // Senza `optionIndex`: dei quattro percorsi sceglie il cliente. E' voluto
      // — qui il buggy e' il pezzo forte del pacchetto e non va ristretto.
      // I quattro costano uguale (180 il buggy da due posti), quindi il numero
      // in vetrina non cambia con la scelta.
      { id: "buggy-volcano-4h" },
      { id: "luxury-cruiser", optionIndex: 0 },
      { id: "siam-park" }
    ],
    desc: {
      it: "Lo stesso giro del pacchetto classico, ma alla montagna ci si arriva col buggy invece che in pullman: si sceglie il percorso, dall'offroad sulla costa alla salita al vulcano. Poi il mare e il Siam Park.",
      en: "The same trip as the classic package, but you reach the mountain in a buggy instead of a coach: you pick the route, from the coastal off-road to the climb up the volcano. Then the sea and Siam Park.",
      es: "El mismo recorrido del paquete clásico, pero a la montaña se llega en buggy en vez de en autocar: se elige el recorrido, del offroad en la costa a la subida al volcán. Después el mar y el Siam Park."
    }
  },

  {
    id: "famiglia",
    title: {
      it: "Famiglia",
      en: "Family",
      es: "Familia"
    },
    image: "luxury-cruiser.jpg",
    sconto: 10,
    // 55 + 10 + 44 = 109 → 98,10 a persona (i bambini pagano meno su tutte e tre)
    voci: [
      { id: "luxury-cruiser", optionIndex: 0 },
      { id: "monkey-park" },
      { id: "siam-park" }
    ],
    desc: {
      it: "La barca, le scimmie e il parco acquatico. Tre uscite per chi viaggia coi bambini, tutte con prezzo ridotto per i piccoli e nessuna sveglia all'alba.",
      en: "The boat, the monkeys and the water park. Three days out for families, all with a reduced price for children and no early starts.",
      es: "El barco, los monos y el parque acuático. Tres salidas para quien viaja con niños, todas con precio reducido para los pequeños y sin madrugones."
    }
  },

  // ─── IL TEIDE ─────────────────────────────────────────────────────────────

  {
    id: "teide-tre-volte",
    // PREZZO MISTO: il buggy si paga a mezzo, il pullman e la serata a persona.
    title: {
      it: "Il Teide tre volte",
      en: "Teide three times over",
      es: "El Teide tres veces"
    },
    image: "teide-by-night.jpg",
    sconto: 10,
    voci: [
      { id: "teide-national-park" },
      // optionIndex 1 = "Tramonto sul Teide, 3 ore".
      { id: "buggy-volcano-4h", optionIndex: 1 },
      // optionIndex 1 = gruppo piccolo, in minivan, con l'astrofotografia.
      { id: "stargazing-group", optionIndex: 1 }
    ],
    desc: {
      it: "Lo stesso parco a tre ore diverse: di giorno col pullman e la guida, al tramonto col buggy, e di notte col telescopio in gruppo piccolo. Chi lo fa torna a casa con tre Teide diversi, non con la stessa foto tre volte.",
      en: "The same park at three different hours: by day with the coach and a guide, at sunset in a buggy, and at night with the telescope in a small group. You go home with three different Teides, not the same photo three times.",
      es: "El mismo parque a tres horas distintas: de día en autocar con guía, al atardecer en buggy, y de noche con el telescopio en grupo pequeño. Te vuelves con tres Teides distintos, no con la misma foto tres veces."
    }
  },

  // ─── PER TEMA ─────────────────────────────────────────────────────────────

  {
    id: "adrenalina",
    // PREZZO MISTO: buggy e jet ski si pagano a mezzo, il parascending a persona.
    title: {
      it: "Adrenalina",
      en: "Adrenaline",
      es: "Adrenalina"
    },
    image: "parascending.jpg",
    sconto: 10,
    voci: [
      // optionIndex 2 = "Completo, 4 ore", il percorso lungo.
      { id: "buggy-volcano-4h", optionIndex: 2 },
      // optionIndex 1 = un'ora. I quaranta minuti sono un assaggio, le due ore
      // sono un'altra spesa: l'ora e' quella che si vende.
      { id: "jet-ski-safari-1-2h", optionIndex: 1 },
      { id: "parascending" }
    ],
    desc: {
      it: "Terra, acqua e aria in tre giorni: il buggy sul percorso lungo, un'ora di safari in moto d'acqua e il volo col paracadute trainato dalla barca.",
      en: "Land, water and air in three days: the buggy on the long route, an hour of jet ski safari and the parachute flight towed by the boat.",
      es: "Tierra, agua y aire en tres días: el buggy en el recorrido largo, una hora de safari en moto de agua y el vuelo en paracaídas remolcado por la lancha."
    }
  },

  {
    id: "mare-a-tutto-gas",
    // PREZZO MISTO: il jet ski si paga a mezzo, le altre due a persona.
    title: {
      it: "Mare a tutto gas",
      en: "Sea, full throttle",
      es: "Mar a todo gas"
    },
    image: "jet-ski-safari-1-2h.jpg",
    sconto: 10,
    voci: [
      { id: "luxury-cruiser", optionIndex: 0 },
      { id: "jet-ski-safari-1-2h", optionIndex: 1 },
      { id: "banana-boat" }
    ],
    desc: {
      it: "Il mare con calma e il mare di corsa: la giornata in barca da Las Galletas, un'ora di moto d'acqua lungo la costa e dieci minuti di banana con le risate.",
      en: "The sea slow and the sea fast: the day on the water from Las Galletas, an hour on a jet ski along the coast and ten minutes on the banana boat.",
      es: "El mar con calma y el mar a toda velocidad: el día en barco desde Las Galletas, una hora de moto de agua por la costa y diez minutos de banana entre risas."
    }
  },

  {
    id: "cielo-e-mare",
    title: {
      it: "Cielo e mare",
      en: "Sky and sea",
      es: "Cielo y mar"
    },
    image: "luxury-cruiser-2.jpg",
    sconto: 10,
    // 79 + 55 + 51 = 185 → 166,50 a persona
    voci: [
      { id: "stargazing-group", optionIndex: 1 },
      { id: "luxury-cruiser", optionIndex: 0 },
      { id: "flamenco-show" }
    ],
    desc: {
      it: "Tre serate lente, per chi viaggia in due: le stelle dal Teide in gruppo piccolo, il tramonto dalla barca e il flamenco. Niente sveglie presto, niente code.",
      en: "Three slow evenings, for couples: the stars from Teide in a small group, the sunset from the boat and a flamenco show. No early starts, no queues.",
      es: "Tres veladas tranquilas, para quien viaja en pareja: las estrellas desde el Teide en grupo pequeño, el atardecer desde el barco y el flamenco. Sin madrugones y sin colas."
    }
  },

  {
    id: "tre-sere",
    title: {
      it: "Tre sere a Tenerife",
      en: "Three nights in Tenerife",
      es: "Tres noches en Tenerife"
    },
    image: "castillo-san-miguel.jpg",
    sconto: 10,
    // 49 + 49,50 + 49 = 147,50 → 132,75 a persona
    voci: [
      { id: "mht-drag-show" },
      { id: "castillo-san-miguel" },
      { id: "history-music-show" }
    ],
    desc: {
      it: "Tre spettacoli con la cena compresa: il drag show, la notte medievale al castello e il viaggio nella storia della musica. Per chi sta in hotel a mezza pensione e la sera esce.",
      en: "Three shows with dinner included: the drag show, the medieval night at the castle and the journey through the history of music. For anyone on half board who goes out in the evening.",
      es: "Tres espectáculos con cena incluida: el drag show, la noche medieval en el castillo y el viaje por la historia de la música. Para quien está en media pensión y sale por la noche."
    }
  }

];

// ─────────────────────────────────────────────────────────────────────────
// IL CONTO
//
// DOVE STA IL PREZZO DI UNA VOCE
//   Non sempre nello stesso posto. Tre schede di questi pacchetti hanno
//   `priceAdult: 0` e il prezzo dentro la variante: stargazing (75 o 79 a
//   persona), buggy e jet ski (180 e 100, ma **a mezzo**). Sommare `priceAdult`
//   e basta le farebbe entrare nel conto come se fossero gratis. Quindi si
//   legge in quest'ordine: la variante scelta dal pacchetto, poi la scheda, e
//   dove il prezzo e' del mezzo si ripiega su `priceFrom` (il mezzo piu'
//   piccolo, cioe' il numero piu' basso che quella scheda puo' costare).
//
// IL NUMERO IN VETRINA
//   Dove sono tutti prezzi a persona il numero e' esatto: "€124,20 a persona".
//   Dove c'e' un mezzo no, perche' il buggy si divide fra chi ci sale: da solo
//   sono 180 a testa, in due 90. Il numero che mettiamo e' quello di **una
//   persona da sola**, cioe' il piu' alto: e' l'unico che al cliente puo' solo
//   scendere quando si sa quanti sono. Un "da €170" (il prezzo in due) sarebbe
//   piu' bello e sarebbe la cosa che fa arrabbiare: chi viaggia da solo se lo
//   vedrebbe **salire** al momento della richiesta.
//
// IL CONTO VERO
//   Lo fa la finestra della richiesta, una escursione alla volta, e poi la
//   lista che le somma. Qui dentro non si prenota niente: questa pagina serve
//   a far vedere che cosa c'e' dentro e quanto si risparmia.
// ─────────────────────────────────────────────────────────────────────────

// I prezzi si moltiplicano per una percentuale, e 138 * 0.9 in JavaScript fa
// 124.19999999999999. Senza questo, un pacchetto su due mostrerebbe un numero
// con dodici decimali.
function pacchettoArrotonda(n) {
  return Math.round(n * 100) / 100;
}

function pacchettoDi(id) {
  return PACCHETTI.find(p => p.id === id) || null;
}

function pacchettoSconto(pack) {
  return pack.sconto === undefined ? PACCHETTI_SCONTO_DEFAULT : pack.sconto;
}

// La scheda di catalogo di una voce, oppure null se l'id e' scritto male o la
// scheda non e' piu' pubblicata. Chi chiama deve saperlo gestire: un pacchetto
// con una voce che non c'e' non si mostra.
function pacchettoVoceTour(voce) {
  if (typeof ESPLORA_CATALOG === "undefined") return null;
  return ESPLORA_CATALOG.find(t => t.id === voce.id && t.published) || null;
}

// La variante che il pacchetto ha deciso, se l'ha decisa.
function pacchettoVoceVariante(voce, tour) {
  const scheda = tour || pacchettoVoceTour(voce);
  if (!scheda || voce.optionIndex === undefined) return null;
  const scelte = scheda.options && scheda.options.choices;
  return (Array.isArray(scelte) && scelte[voce.optionIndex]) || null;
}

// Il prezzo di una voce, con scritto **di che tipo** e':
//   { tipo: "persona", prezzo }  il prezzo di un adulto
//   { tipo: "mezzo",   prezzo }  il prezzo del mezzo piu' piccolo
//   null                         non si riesce a leggere: il pacchetto non
//                                mostra nessun numero invece di mostrarne uno
//                                inventato
function pacchettoVocePrezzo(voce) {
  const tour = pacchettoVoceTour(voce);
  if (!tour) return null;
  const variante = pacchettoVoceVariante(voce, tour);

  // Dove il prezzo e' del mezzo, `priceAdult` sulla scheda e' 0 e non vuol dire
  // gratis: vuol dire "qui non si paga a persona". Si guarda prima questo.
  if (tour.units || tour.priceUnit) {
    const prezzo = (variante && variante.price) || tour.priceFrom;
    return prezzo ? { tipo: "mezzo", prezzo: prezzo } : null;
  }

  const adulto = (variante && variante.priceAdult !== undefined)
    ? variante.priceAdult
    : tour.priceAdult;
  return adulto ? { tipo: "persona", prezzo: adulto } : null;
}

// Il conto di un pacchetto:
//   pieno     la somma senza sconto
//   scontato  la somma con lo sconto
//   risparmio la differenza, che e' il numero che il cliente guarda davvero
//   misto     c'e' dentro almeno un prezzo a mezzo: il numero vale per una
//             persona da sola e va scritto con la sua nota
// Torna null se anche una sola voce non ha un prezzo leggibile.
function pacchettoConto(pack) {
  let pieno = 0;
  let misto = false;
  let completo = true;

  pack.voci.forEach(voce => {
    const p = pacchettoVocePrezzo(voce);
    if (!p) { completo = false; return; }
    if (p.tipo === "mezzo") misto = true;
    pieno += p.prezzo;
  });
  if (!completo) return null;

  const sconto = pacchettoSconto(pack);
  const scontato = pacchettoArrotonda(pieno * (100 - sconto) / 100);
  return {
    pieno: pacchettoArrotonda(pieno),
    scontato: scontato,
    risparmio: pacchettoArrotonda(pieno - scontato),
    sconto: sconto,
    misto: misto
  };
}

// ─────────────────────────────────────────────────────────────────────────
// IL PACCHETTO DENTRO LA LISTA
//
// Le escursioni di un pacchetto si aggiungono alla lista **una alla volta**,
// dalla loro pagina di dettaglio: ognuna ha il suo giorno e le sue persone, e
// la lista non sa modificare una voce gia' dentro. Quella voce si porta pero'
// dietro il campo `pack` con l'id del pacchetto, e quando nella lista ci sono
// **tutte** le voci di un pacchetto lo sconto si applica da solo.
//
// "Tutte" vuol dire una per voce, con la stessa variante che ha deciso il
// pacchetto. Se il cliente sulla pagina di dettaglio cambia variante (prende
// lo stargazing in gruppo grande invece che piccolo) quella voce non conta
// piu': e' un altro prezzo, e lo sconto di questo pacchetto non c'entra.
// ─────────────────────────────────────────────────────────────────────────

// Voce per voce: quelle del pacchetto che sono gia' nella lista.
// Una voce della lista vale per una voce sola del pacchetto (`presi`): la
// stessa escursione aggiunta due volte non fa un pacchetto completo.
function pacchettoVociPresenti(pack, voci) {
  const inLista = voci || (typeof listaLeggi === "function" ? listaLeggi() : []);
  const presi = [];

  return pack.voci.map(voce => {
    const i = inLista.findIndex((v, idx) =>
      presi.indexOf(idx) < 0 &&
      v.pack === pack.id &&
      v.id === voce.id &&
      (voce.optionIndex === undefined || v.optionIndex === voce.optionIndex));
    if (i < 0) return false;
    presi.push(i);
    return true;
  });
}

// Quante ce ne sono: serve alla pagina per dire "2 di 3".
function pacchettoVociInLista(pack, voci) {
  return pacchettoVociPresenti(pack, voci).filter(Boolean).length;
}

function pacchettoCompleto(pack, voci) {
  return pacchettoVociInLista(pack, voci) === pack.voci.length;
}

// Lo sconto in euro che i pacchetti completi tolgono a una lista, e i loro
// nomi. Lo chiama `lista.js`: la somma della lista e' la somma dei prezzi di
// adesso, e questo e' l'unico punto in cui il pacchetto entra nel conto.
//
// Lo sconto si calcola sul prezzo **vero** delle voci (quello della richiesta,
// con le persone e i mezzi che ha scelto il cliente), non sul numero della
// vetrina: quello e' di una persona sola e qui ci sono famiglie intere.
function pacchettiScontoLista(voci, contoDiVoce) {
  let sconto = 0;
  const nomi = [];

  PACCHETTI.forEach(pack => {
    if (!pacchettoCompleto(pack, voci)) return;
    let somma = 0;
    voci.forEach(v => {
      if (v.pack !== pack.id) return;
      const conto = contoDiVoce(v);
      if (conto) somma += conto.totale;
    });
    if (!somma) return;
    sconto += pacchettoArrotonda(somma * pacchettoSconto(pack) / 100);
    nomi.push(tf(pack.title));
  });

  return { sconto: pacchettoArrotonda(sconto), nomi: nomi };
}

// ─────────────────────────────────────────────────────────────────────────
// LA PAGINA
// ─────────────────────────────────────────────────────────────────────────

// La riga di una escursione dentro la scheda del pacchetto. Non apre la
// richiesta: porta alla pagina di dettaglio, dove il cliente vede che cos'e'
// prima di metterla nella lista. L'indirizzo si porta dietro la variante
// decisa dal pacchetto (`option`) e l'id del pacchetto (`pack`), che tour.js
// rimette nella voce della lista.
//
// Il link e' **tutta la riga**, non un pulsante in fondo: su un telefono da
// 390px un bottone con scritto "Guarda e aggiungi" si prendeva meta' riga e
// spingeva "Luxury Cruiser Experience" su tre righe. Cosi' il posto dove
// toccare e' piu' grande e il titolo respira.
function pacchettoVoceHTML(pack, voce, n, giaDentro) {
  const tour = pacchettoVoceTour(voce);
  if (!tour) return "";

  const variante = pacchettoVoceVariante(voce, tour);
  const prezzo = pacchettoVocePrezzo(voce);
  const dettagli = [];
  if (variante) dettagli.push(tf(variante.label));
  if (prezzo) dettagli.push("€" + eur(prezzo.prezzo) + priceUnitSuffix(tour));
  if (giaDentro) dettagli.push(t("pack.again"));

  let href = "./tour.html?id=" + encodeURIComponent(tour.id) +
    "&pack=" + encodeURIComponent(pack.id);
  if (voce.optionIndex !== undefined) href += "&option=" + voce.optionIndex;

  return `
    <li class="pack-voce${giaDentro ? " is-in" : ""}">
      <a class="pack-voce-link" href="${href}">
        <span class="pack-voce-n" aria-hidden="true">${n}</span>
        <span class="pack-voce-testo">
          <strong>${esc(tf(tour.title))}</strong>
          <span>${esc(dettagli.join(" · "))}</span>
        </span>
        <svg class="pack-voce-freccia" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m9 6 6 6-6 6"/>
        </svg>
      </a>
    </li>`;
}

function pacchettoCardHTML(pack) {
  const conto = pacchettoConto(pack);
  const presenti = pacchettoVociPresenti(pack);
  const quante = presenti.filter(Boolean).length;
  const tutte = quante === pack.voci.length;

  const righe = pack.voci
    .map((voce, i) => pacchettoVoceHTML(pack, voce, i + 1, presenti[i]))
    .join("");

  const prezzo = conto
    ? `<span class="pack-price">
         <s class="price-before">€${esc(eur(conto.pieno))}</s>
         <strong>€${esc(eur(conto.scontato))}</strong>
         <small>${esc(t("pack.perPerson"))}</small>
       </span>
       <span class="pack-save">${esc(t("pack.save", { n: eur(conto.risparmio) }))}</span>`
    : `<span class="pack-price"><strong>${esc(t("pack.noPrice"))}</strong></span>`;

  // Lo stato della lista si scrive solo quando c'e' qualcosa da dire: a lista
  // vuota un "0 di 3" sembra un compito da finire.
  const stato = quante === 0 ? "" : `
    <p class="pack-state${tutte ? " is-full" : ""}">
      ${esc(tutte
        ? t("pack.progressFull", { n: conto ? conto.sconto : pacchettoSconto(pack) })
        : t("pack.progress", { n: quante, tot: pack.voci.length }))}
    </p>`;

  return `
    <li class="pack-card" data-pack-card="${esc(pack.id)}">
      <div class="pack-media">
        <img src="./assets/${encodeURIComponent(pack.image)}" alt="" loading="lazy" />
        <span class="pack-badge">−${esc(String(pacchettoSconto(pack)))}%</span>
      </div>
      <div class="pack-body">
        <h2 class="pack-title">${esc(tf(pack.title))}</h2>
        <p class="pack-desc">${esc(tf(pack.desc))}</p>
        <div class="pack-foot">${prezzo}</div>
        ${conto && conto.misto ? `<p class="pack-note">${esc(t("pack.unitNote"))}</p>` : ""}
        <span class="pack-inside">${esc(t("pack.inside"))}</span>
        <ol class="pack-voci">${righe}</ol>
        <p class="pack-howto">${esc(t("pack.howto", { n: pack.voci.length }))}</p>
        ${stato}
      </div>
    </li>`;
}

function initPacchetti() {
  const grid = document.querySelector("[data-pack-grid]");
  if (!grid || typeof ESPLORA_CATALOG === "undefined") return;

  function disegna() {
    // Un pacchetto con una voce che nel catalogo non c'e' piu' non si mostra:
    // meglio un pacchetto in meno che uno che promette due escursioni su tre.
    grid.innerHTML = PACCHETTI
      .filter(p => p.voci.every(v => pacchettoVoceTour(v)))
      .map(pacchettoCardHTML)
      .join("");
  }

  disegna();
  // La lista cambia da un'altra parte (il cliente ne toglie una dalla finestra
  // della lista, che sta su tutte le pagine): le schede si riscrivono da sole.
  document.addEventListener("islalista", disegna);
  document.addEventListener("islalang", disegna);
}

// `controlla.js` carica questo file da Node per controllare i pacchetti, e li'
// `document` non esiste: senza questa riga il controllo si fermerebbe qui.
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initPacchetti);
}
