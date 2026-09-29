// Il numero di telefono, scritto in un solo modo per tutti.
//
// Lo usano il modulo dei venditori (venditori.js) e la finestra del ticket del
// cliente (app.js): il telefono e' la chiave che li fa incontrare, quindi deve
// uscire uguale da tutte e due le parti. Se il venditore salva "+447700900123"
// e il cliente cercasse "+4407700900123", il cliente non troverebbe niente.
//
// Formato salvato: E.164, cioe' "+", prefisso del paese, numero, niente spazi
// (+393331234567). E' lo stesso controllo che fa il database.

// I paesi da cui arriva la gente a Tenerife. Il nome serve solo ai venditori
// (in italiano, come la loro pagina); il cliente vede sigla e prefisso.
const PAESI = [
  { code: "ES", name: "Spagna",        prefix: "34" },
  { code: "IT", name: "Italia",        prefix: "39" },
  { code: "GB", name: "Regno Unito",   prefix: "44" },
  { code: "DE", name: "Germania",      prefix: "49" },
  { code: "FR", name: "Francia",       prefix: "33" },
  { code: "NL", name: "Paesi Bassi",   prefix: "31" },
  { code: "BE", name: "Belgio",        prefix: "32" },
  { code: "IE", name: "Irlanda",       prefix: "353" },
  { code: "PT", name: "Portogallo",    prefix: "351" },
  { code: "CH", name: "Svizzera",      prefix: "41" },
  { code: "AT", name: "Austria",       prefix: "43" },
  { code: "PL", name: "Polonia",       prefix: "48" },
  { code: "SE", name: "Svezia",        prefix: "46" },
  { code: "NO", name: "Norvegia",      prefix: "47" },
  { code: "DK", name: "Danimarca",     prefix: "45" },
  { code: "FI", name: "Finlandia",     prefix: "358" },
  { code: "US", name: "Stati Uniti",   prefix: "1" }
];

// Il numero come va salvato o cercato, oppure null se cosi' non si puo'.
//   prefisso: quello scelto nel menu ("44"), "" se "Altro"
//   scritto:  quello che la persona ha scritto, con spazi, trattini, +…
function telefonoE164(prefisso, scritto) {
  scritto = (scritto || "").trim();
  let cifre = scritto.replace(/\D/g, "");
  if (!cifre) return null;

  // Scritto gia' internazionale: "+44…" o "0044…". Il menu del prefisso non conta.
  if (scritto.startsWith("+")) return controllaE164("+" + senzaZeroDopoPrefisso(cifre));
  if (cifre.startsWith("00")) return controllaE164("+" + senzaZeroDopoPrefisso(cifre.slice(2)));

  if (!prefisso) return null;   // "Altro" senza il + davanti: non sappiamo il paese

  // Lo 0 davanti si toglie quasi ovunque (in UK "07700…" diventa "+44 7700…"),
  // ma non in Italia: li' lo 0 fa parte del numero dei fissi.
  if (prefisso !== "39") cifre = cifre.replace(/^0+/, "");
  return controllaE164("+" + prefisso + cifre);
}

// Sui ticket si trova "+44 07595…": il cliente scrive il prefisso E lo 0 che usa
// a casa sua. Chiamando dall'estero quello 0 non va, e il numero salvato
// sarebbe un altro. Si toglie, tranne che in Italia (li' lo 0 dei fissi resta).
// Vale solo per i prefissi dell'elenco: per gli altri non sappiamo dove finisce
// il prefisso, e il numero resta com'e' scritto.
function senzaZeroDopoPrefisso(cifre) {
  const prefisso = PAESI
    .map(p => p.prefix)
    .sort((a, b) => b.length - a.length)
    .find(p => cifre.startsWith(p));
  if (!prefisso || prefisso === "39") return cifre;
  return prefisso + cifre.slice(prefisso.length).replace(/^0+/, "");
}

function controllaE164(numero) {
  return /^\+[1-9][0-9]{6,14}$/.test(numero) ? numero : null;
}
