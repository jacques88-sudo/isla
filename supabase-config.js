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

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
