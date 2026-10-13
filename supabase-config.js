// Il collegamento a Supabase (il database delle prenotazioni).
//
// Questi due valori sono PUBBLICI per costruzione: stanno nel sito e chiunque
// li puo' leggere. Da soli non aprono niente: cosa si puo' leggere e scrivere
// lo decidono le regole in supabase/schema.sql.
//
// Qui NON va mai la chiave "service_role" o "secret" (sb_secret_...): quella
// scavalca tutte le regole.
//
// La libreria (vendor/supabase-2.117.2.js) e' copiata nel repo invece di
// essere presa da un CDN: non dipende da un altro sito e la versione non
// cambia da sola.

const SUPABASE_URL = "https://vjotkgsjtwmtctxtfeqa.supabase.co";
const SUPABASE_KEY = "sb_publishable_Qjmd8qP9J_GH1WjUmBolSw_vBdM5G3L";

// La chiave PUBBLICA delle notifiche sul telefono (richieste.js). La sua
// gemella privata sta SOLO nei Secrets di Supabase (VAPID_PRIVATE_KEY): con
// quella la funzione manda-notifiche firma gli avvisi. Se si cambia questa,
// va cambiata anche la privata, e i telefoni gia' iscritti non ricevono piu'
// niente finche' non mandano una richiesta nuova.
const VAPID_PUBLIC_KEY = "BMcOiUiurr91OS51AVAaqC4Hru2s8vwKVwqMse7-m-lulPaQzM9kgXwdh6gq5gQHuTV98YO8W_1DxMgdsi3oAe0";

// Le pagine del catalogo caricano questo file senza la libreria: a loro
// servono solo i due valori sopra, per mandare le richieste (richieste.js).
const sb = typeof supabase !== "undefined" ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
