# Isla — prenotazioni: ticket di carta + "Le mie escursioni"

Versione 2 (26 settembre 2026): la prima bozza del proprietario, corretta con le
risposte date in chat. Il database che la realizza è `schema.sql`, in questa cartella.

## 1. Contesto

Isla mostra il catalogo di **Admiral Excursions**, che è un rivenditore. **CanaryVIP è un
concorrente** da cui prendiamo solo spunto, per esempio il flusso delle prenotazioni
online. Non copiamo i suoi testi, le sue condizioni o i suoi prezzi barrati.

Le escursioni si vendono soprattutto in strada. Il venditore compila un **ticket cartaceo**
("Admiral Excursions Point S.C.") e gli fa una foto. **Il ticket di carta resta il
documento ufficiale**: Isla lo rende visibile anche nell'app, e questo diventa un motivo
per installarla.

## 2. Decisioni

1. **Backend: Supabase** (database, foto, login, funzioni sul server). Si parte col piano
   gratuito, con tre precauzioni: foto compresse nel telefono, cancellazione automatica
   delle foto vecchie ed esportazione settimanale della tabella (il piano gratis non ha
   backup). Se serve, si passa al Pro (25 $ al mese).
2. **Il cliente entra con telefono + numero di un suo ticket.** Niente OTP: il ticket ce
   l'ha in mano. Se la coppia è giusta vede **tutte** le sue prenotazioni confermate; se
   è sbagliata vede zero righe, e non scopre se quel telefono esiste.
3. **I numeri dei ticket non si ripetono mai**, nemmeno fra venditori diversi. Per questo
   sono la chiave contro i doppioni.
4. **Due venditori**, con due account creati a mano. Non c'è una pagina di registrazione.
   Il campo `seller` si compila da solo con chi ha fatto il login.
5. **TIME** vuol dire **ora del ritiro** dove il ritiro c'è, e **ora di partenza** dove non
   c'è. L'etichetta viene dal catalogo (`hotel.js`): le schede in `PICKUP_NESSUNO` sono
   "partenza", tutte le altre "ritiro". Il venditore la vede nel modulo e la può
   cambiare. Si salva in `time_kind`.
6. **Numero sconosciuto o sbagliato**: nessun profilo, si vede il catalogo con l'invito ad
   acquistare.

## 3. Dal ticket ai campi

| sul ticket | campo | note |
|---|---|---|
| TICKET NUMBER | `ticket_number` | unico |
| EXCURSION | `excursion_id` + `option_label` | id della scheda + etichetta italiana della variante, se c'è |
| DATE OF EXCURSIONS | `date` | |
| TIME | `time` + `time_kind` | ritiro o partenza, vedi decisione 5 |
| MEETING POINT | `meeting_point` | |
| HOTEL | `hotel` | solo venditore |
| NATIONALITY | `nationality` | solo venditore; serve anche a proporre il prefisso del telefono |
| PHONE NUMBER | `phone` | E.164 (`+393331234567`), il database rifiuta gli altri formati |
| FIRMA CLIENTE | — | resta solo nella foto |
| REFERENCE / OBSERVATIONS | `notes` | |
| SELLER | `seller` | |
| ADULTS / KIDS / BABIES | `adults`, `kids`, `babies` | |
| TOTAL / DEPOSIT / REST TO PAY | `total`, `deposit`, `rest_to_pay` | il modulo avvisa se total ≠ deposit + rest |

Altri campi: `source` (`strada`, `online`, `whatsapp`), `status` (`pending`, `confirmed`,
`cancelled`), `photo_path` (percorso nello spazio **privato**, non un link pubblico),
`seller_id`, `created_at` e `confirmed_at`.

## 4. Flusso venditore

1. **Nuovo ticket**: `<input type="file" accept="image/*" multiple>`, cioè fotocamera o
   galleria, anche più foto insieme a fine turno.
2. La foto si **rimpicciolisce nel telefono** prima dell'invio (circa 150–300 KB). Se manca
   la rete, resta in coda e parte dopo.
3. Si salva come `pending`. L'AI legge la foto e precompila i campi (dal passo 3 in poi,
   vedi sotto). Un campo illeggibile resta vuoto, mai inventato, e ogni campo ha il suo
   livello di sicurezza.
4. **Modulo di conferma**, uno per ticket: foto accanto, telefono evidenziato da
   confermare, escursione scelta dal menu del catalogo, avviso sui soldi che non tornano.
5. Alla conferma: `status = confirmed`. Se il numero del ticket esiste già, il database
   rifiuta il doppione.
6. Una prenotazione **non si cancella mai**: si mette `cancelled`. Correzioni come cambio
   di data o saldo pagato si fanno dallo stesso modulo.

## 5. Flusso cliente — "Le mie escursioni"

- Telefono (prefisso scelto da un menu) + numero del ticket.
- Si vedono: escursione, variante, data, "ritiro/partenza alle", meeting point, persone,
  resto da pagare. Prima le escursioni future, poi quelle passate.
- **Non si vedono mai**: hotel, nazionalità, venditore, foto, note.
- Il telefono ricorda i dati (localStorage), così al secondo accesso non si riscrive
  niente.
- In seguito: un **QR sul ticket** che apre `…?ticket=12345` già compilato.

## 6. Ordine di lavoro

1. **Supabase**: tabelle, regole di accesso e foto (`schema.sql`), poi i 2 account.
2. **Modulo del venditore scritto a mano**, senza AI. Resta anche dopo come ripiego.
3. **"Le mie escursioni"** lato cliente, nelle tre lingue.
4. **Lettura della foto con l'AI**, che precompila il modulo del passo 2. La chiave
   resta solo sul server (edge function).
5. QR sul ticket.
6. Prenotazioni online (`source = online`): rimandate.

## 7. Ancora aperto

- **Per quanti mesi tenere le foto** (GDPR e spazio). Dipende da quanti ticket si fanno al
  giorno.
- **Informativa GDPR**: in app e/o stampata sul ticket.
- **Rate limiting** sulla ricerca del cliente. Con telefono + ticket è meno urgente, ma
  si farà insieme all'edge function del passo 4.
- Come convivono "Le mie escursioni", la lista delle richieste (`lista.js`) e il
  "Prenota ora" con i dati finti.
