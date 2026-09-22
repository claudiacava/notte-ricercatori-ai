# Notte delle Ricercatrici e dei Ricercatori — Gioca con l'AI

Sito HTML, CSS e JavaScript per bambini e famiglie. Riprende il template ufficiale del poster fornito dall'utente: fondo bianco, blu scuro e viola, intestazione con il marchio dell'evento, INFN Pavia e Università di Pavia, fascia con i partner in fondo.

Include due giochi completi, convertiti dalle versioni R Shiny:

- **Allena il robot-dottore:** 8 campioni con gemme, due contenitori di esempi, risposte A/B, messaggi gentili, punteggio, regola rivelabile e riavvio.
- **AI detective delle cellule:** 5 missioni, 6 esempi iniziali, confronto separato tra bambino e robot, 6 nuovi esempi da aggiungere e conclusione. Il percorso `dna-terapia/index.html` è mantenuto per rispettare i collegamenti del sito precedente; il titolo è quello aggiornato del gioco.

Il gioco delle radiografie è escluso.

## Provare il sito sul computer

Estrai **tutto** lo ZIP in una cartella. Apri `index.html` con il browser: i giochi funzionano anche senza un server locale e senza Internet, perché immagini, loghi, codice e dati sono inclusi.

Non serve R, Shiny, Node.js o l'installazione di pacchetti per giocare. Le tre pagine usano script JavaScript tradizionali, senza moduli da scaricare né richieste a servizi AI. Ogni scheda del browser ha la propria partita. Ricaricare la pagina o premere “Ricomincia” la azzera.

## Pubblicare sul sito GitHub Pages esistente

Repository: <https://github.com/claudiacava/notte-ricercatori-ai>

1. Estrai lo ZIP.
2. Apri il repository su GitHub con il tuo account.
3. Seleziona **Add file → Upload files**.
4. Trascina **i file e le cartelle contenuti nello ZIP**, non lo ZIP e non la cartella che li contiene. `index.html` deve essere nella radice del repository.
5. Conferma il caricamento con **Commit changes**. L'upload sostituisce `index.html`, `style.css`, `script.js` e `README.md` e aggiunge le cartelle `assets`, `robot-dottore`, `dna-terapia`.
6. Se GitHub Pages è già configurato sulla radice di `main`, come per il sito precedente, mantieni quella configurazione. Attendi la conclusione della pubblicazione nella scheda **Actions**, poi riapri il sito.

Indirizzo da mantenere: <https://claudiacava.github.io/notte-ricercatori-ai/>

Non caricare il PDF originale da 9 MB: gli elementi utili sono già estratti e ottimizzati. Non caricare cartelle di lavoro, script R o l'archivio delle radiografie.

Questa cartella è pronta per la pubblicazione. La creazione dei file locali non modifica automaticamente il sito online.

## Che cosa fa l'AI nei giochi

**Gemme:** è una simulazione didattica dell'apprendimento supervisionato. Il bambino scopre una regola fissata nel programma: almeno un cuore significa classe A. Il colore non decide la classe. Il punteggio considera le risposte attualmente selezionate su 8 campioni e si aggiorna anche quando vengono corrette. La regola compare soltanto dopo il pulsante “Rivela la regola”.

**Cellule:** il browser esegue davvero un piccolo classificatore k-nearest neighbors, con k = 3. Usa tre caratteristiche numeriche: grandezza, forma e numero di puntini normalizzato come `(puntini - 2) / 6`. Calcola la distanza euclidea e la maggioranza delle etichette dei tre esempi più vicini, esattamente come nella versione R. La risposta corretta della missione non entra nel modello. L'avviso di scarsa somiglianza compare quando la distanza dal primo vicino supera 0,45; non è una probabilità di correttezza.

Nella terza missione il robot sbaglia con i sei esempi iniziali. Aggiungendo esempi più vari ricalcola la previsione sulla stessa cellula e cambia gruppo. Il punteggio del bambino resta quello della prima risposta. La quinta cellula non ha un'etichetta verificata: il gioco incoraggia a chiedere aiuto e presenta il voto del robot come da controllare. Non si interpreta A/B come sana/malata e non si fanno diagnosi.

## File principali

```text
index.html                 Pagina iniziale
style.css                  Stile comune e adattamento a telefono
script.js                  Intestazione, navigazione e partner
assets/                    Loghi, illustrazioni, dati e algoritmo
robot-dottore/index.html    Gioco delle gemme
robot-dottore/game.js       Interazioni e punteggi delle gemme
dna-terapia/index.html      AI detective delle cellule
dna-terapia/game.js         Partita, risultati e nuovi esempi
CREDITS.md                 Provenienza degli elementi grafici
```

I collegamenti sono relativi: funzionano sia nella sottocartella GitHub Pages sia aprendo i file locali. Non ci sono account, pubblicità, tracciamenti aggiunti dal sito, invio di risposte al server o archiviazione delle partite.

## Aggiornare i contenuti

- Testi della pagina iniziale: `index.html`.
- Colori e dimensioni: variabili all'inizio di `style.css`.
- Intestazione e footer condivisi: `script.js`.
- Esempi e modello delle cellule: `assets/games.js`.

Prima di pubblicare modifiche agli esempi, verificare che il confronto prima/dopo della terza missione continui ad avere senso. Non sostituire la previsione calcolata con una risposta fissa.
