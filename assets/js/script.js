/*
REGOLE
- Le risposte vanno scritte in JavaScript sotto questi commenti.
- Pattern fondamentale: stato -> render() -> eventi.
  Tutto cio' che vedi a schermo dipende dallo stato.
  Gli eventi modificano lo stato e poi chiamano render().
- Apri index.html nel browser. Apri la console (DevTools) per gli errori.
- Cerca su MDN solo i concetti dichiarati come "cerca tu":
  localStorage, Blob/URL.createObjectURL, FileReader.
  Tutto il resto e' stato visto in settimana.
- Niente AI per generare codice. Niente template scaricati.
*/

/* STATO
   In cima al file definisci poche variabili globali:
   - un array di oggetti come dato principale (es. libri, ricette, film, ...)
   - una variabile per il filtro corrente
   - una variabile per l'ordinamento corrente
   - una variabile per la stringa di ricerca corrente
*/

/* SCRIVI QUI LA TUA RISPOSTA */
let mete = [
  { id: 1, meta: "Tokyo", continente: "Asia", anno: 2019, visitato: true, categoria: "Culturale" },
  { id: 2, meta: "Parigi", continente: "Europa", anno: 2021, visitato: true, categoria: "Culturale" },
  { id: 3, meta: "Roma", continente: "Europa", anno: 2023, visitato: true, categoria: "Culturale" },
  { id: 4, meta: "New York", continente: "America", anno: 2025, visitato: false, categoria: "Relax" },
  { id: 5, meta: "Londra", continente: "Europa", anno: 2026, visitato: false, categoria: "Relax" }
];
let isDarkMode = false;
let vista = "lista";

/* RENDER()
   Una sola funzione che ridipinge la lista. A ogni chiamata:
   1) parte dall'array completo,
   2) filtra,
   3) ordina,
   4) svuota il container DOM,
   5) ricrea gli elementi DOM per gli oggetti risultanti.
   Aggiorna anche conteggi e statistiche.
   Salva lo stato in localStorage in fondo a render() (cerca tu come funziona).
*/

/* SCRIVI QUI LA TUA RISPOSTA */
function render() {
  const container = document.getElementById("lista-mete");
  const ricerca = document.getElementById("input-ricerca").value.toLowerCase();
  const filtro = document.getElementById("filtro-stato").value;
  const filtroCategoria = document.getElementById("filtro-categoria").value;
  const ordine = document.getElementById("ordine-selezionato").value;

  let visualizzati = mete.filter(m => {
    const matchRicerca = m.meta.toLowerCase().includes(ricerca) || m.continente.toLowerCase().includes(ricerca) || m.categoria.toLowerCase().includes(ricerca);
    const matchFiltro = filtro === "tutti" ? true : (filtro === "visitato" ? m.visitato : !m.visitato);
    const matchCategoria = filtroCategoria === "tutti" ? true : m.categoria === filtroCategoria;
    return matchRicerca && matchFiltro && matchCategoria;
  });

  if (ordine === "anno-crescente") visualizzati.sort((a, b) => a.anno - b.anno);
  else if (ordine === "anno-decrescente") visualizzati.sort((a, b) => b.anno - a.anno);
  else if (ordine === "meta-az") visualizzati.sort((a, b) => a.meta.localeCompare(b.meta));
  else if (ordine === "meta-za") visualizzati.sort((a, b) => b.meta.localeCompare(a.meta));

  container.className = vista;
  container.innerHTML = "";

  if (visualizzati.length === 0) {
    container.innerHTML = `<li class="meta-item" style="text-align: center; color: #6b7566;">Nessuna meta trovata</li>`;
  } else {
    if (vista === "tabella") {
        container.innerHTML = `<table><thead><tr><th>Meta</th><th>Continente</th><th>Anno</th></tr></thead><tbody id="tabella-body"></tbody></table>`;
        const body = document.getElementById("tabella-body");
        visualizzati.forEach(m => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${m.meta}</td><td>${m.continente}</td><td>${m.anno}</td>`;
            body.appendChild(tr);
        });
    } else {
        const raggruppati = visualizzati.reduce((acc, m) => {
            if (!acc[m.categoria]) acc[m.categoria] = [];
            acc[m.categoria].push(m);
            return acc;
        }, {});

        Object.keys(raggruppati).forEach(cat => {
            const h3 = document.createElement("h3");
            h3.textContent = cat;
            container.appendChild(h3);

            raggruppati[cat].forEach((m) => {
                const li = document.createElement("li");
                li.className = `meta-item ${m.visitato ? "visitato" : "da-visitare"}`;
                li.innerHTML = `
                  <span class="testo-meta">${m.meta}</span>
                  <span class="dettaglio-meta">${m.continente} — ${m.anno} — <strong>${m.categoria}</strong></span>
                  <div class="gruppo-pulsanti">
                    <button class="${m.visitato ? "btn-stato-visitato" : "btn-stato-da-visitare"}" data-id="${m.id}" data-action="toggle">
                      ${m.visitato ? "Visitato" : "Da visitare"}
                    </button>
                    <button class="btn-modifica" data-id="${m.id}" data-action="modifica">Modifica</button>
                    <button class="btn-elimina" data-id="${m.id}" data-action="elimina">Elimina</button>
                    <button data-id="${m.id}" data-action="up">↑</button>
                    <button data-id="${m.id}" data-action="down">↓</button>
                  </div>
                `;
                container.appendChild(li);
            });
        });
    }
  }

  const tot = mete.length;
  const visitati = mete.filter(m => m.visitato).length;
  document.getElementById("stat-totale").textContent = tot;
  document.getElementById("stat-visitati").textContent = visitati;
  document.getElementById("stat-da-visitare").textContent = tot - visitati;
  document.getElementById("barra-riempimento").style.width = tot > 0 ? (visitati / tot) * 100 + "%" : "0%";

  localStorage.setItem("dati", JSON.stringify(mete));
  localStorage.setItem("dark", JSON.stringify(isDarkMode));
}

/* FORM CON VALIDAZIONE
   addEventListener("submit") sul form.
   event.preventDefault().
   Leggi i valori con .value.trim().
   Se uno dei campi obbligatori e' vuoto, mostra errore e return.
   Altrimenti push allo stato, form.reset(), render().
   Id univoco con Date.now().
*/

/* SCRIVI QUI LA TUA RISPOSTA */
document.getElementById("form-viaggio").addEventListener("submit", (e) => {
  e.preventDefault();
  const meta = document.getElementById("input-meta").value.trim();
  const continente = document.getElementById("input-continente").value.trim();
  const anno = document.getElementById("input-anno").value.trim();
  const categoria = document.getElementById("input-categoria").value;
  const visitato = document.getElementById("select-stato").value === "true";

  if (!meta || !continente || !anno) {
    mostraNotifica("Errore: compila tutti i campi!");
    return;
  }

  mete.push({ id: Date.now(), meta, continente, anno, categoria, visitato });
  e.target.reset();
  render();
  mostraNotifica("Meta aggiunta");
});

/* INTERAZIONI BASE — eliminare, modificare, contare
   - Elimina: filter per id, render(). Event delegation sul container.
   - Modifica in-place: button "Modifica". Al click il testo diventa <input>,
     si conferma con Invio o blur.
   - Conteggi dinamici dentro render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */
document.getElementById("lista-mete").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = parseInt(btn.dataset.id);
  const action = btn.dataset.action;
  const idx = mete.findIndex(m => m.id === id);
  if (idx === -1) return;

  if (action === "elimina") {
    mete.splice(idx, 1);
    render();
    mostraNotifica("Meta eliminata");
  } else if (action === "modifica") {
    avviaModifica(mete[idx], btn.closest("li"));
  } else if (action === "toggle") {
    mete[idx].visitato = !mete[idx].visitato;
    render();
  } else if (action === "up" && idx > 0) {
    [mete[idx], mete[idx - 1]] = [mete[idx - 1], mete[idx]];
    document.getElementById("ordine-selezionato").value = "manuale";
    render();
  } else if (action === "down" && idx < mete.length - 1) {
    [mete[idx], mete[idx + 1]] = [mete[idx + 1], mete[idx]];
    document.getElementById("ordine-selezionato").value = "manuale";
    render();
  }
});

/* RICERCA, FILTRO, ORDINAMENTO
   - Ricerca live: <input> con event "input". Salva in stato e render().
   - Filtro: <select> con event "change". Salva in stato e render().
   - Ordinamento: due button (o select). Salva in stato e render().
   I tre si compongono dentro render() in fila.
*/

/* SCRIVI QUI LA TUA RISPOSTA */
document.getElementById("input-ricerca").oninput = render;
document.getElementById("filtro-stato").onchange = render;
document.getElementById("filtro-categoria").onchange = render;
document.getElementById("ordine-selezionato").onchange = render;

/* NOTIFICHE TEMPORANEE
   Funzione notifica(testo) che imposta il testo del <div id="notifica">,
   lo mostra (display: block), poi dopo 3000ms (setTimeout) lo nasconde.
*/

/* SCRIVI QUI LA TUA RISPOSTA */
function mostraNotifica(testo) {
    const notifica = document.getElementById("notifica");
    if(notifica) {
        notifica.textContent = testo;
        notifica.style.display = "block";
        setTimeout(() => notifica.style.display = "none", 2000);
    }
}

/* TEMA CHIARO/SCURO
   Un button che chiama document.body.classList.toggle("dark").
   In CSS scrivi le regole opposte (es. body.dark { background: #111; ... }).
*/

/* SCRIVI QUI LA TUA RISPOSTA */
document.getElementById("btn-tema").onclick = () => {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle("dark-mode", isDarkMode);
};

/* PERSISTENZA — localStorage (cerca tu su MDN)
   - In fondo a render(), salva lo stato:
       localStorage.setItem("dati", JSON.stringify(stato));
   - All'avvio, prima della prima render(), carica:
       const salvato = localStorage.getItem("dati");
       if (salvato) stato = JSON.parse(salvato);
*/

/* SCRIVI QUI LA TUA RISPOSTA */
const salvatoDati = localStorage.getItem("dati");
if (salvatoDati) mete = JSON.parse(salvatoDati);

const salvatoTema = localStorage.getItem("dark");
if (salvatoTema) {
    isDarkMode = JSON.parse(salvatoTema);
    document.body.classList.toggle("dark-mode", isDarkMode);
}

/* RIORDINO ↑ ↓
   Due button su ogni elemento. Click su ↑ scambia con il precedente nell'array,
   ↓ con il successivo. Event delegation. Poi render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */
// Integrata nell'event listener del container sopra. 

/* ESPORTAZIONE / IMPORTAZIONE JSON (cerca tu su MDN)
   - Esporta: crea un Blob con JSON.stringify(stato), genera un URL con
     URL.createObjectURL e simula il click su un <a download>.
   - Importa: <input type="file"> + FileReader per leggere il contenuto come
     testo, JSON.parse, sostituisci lo stato, render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */


/* STATISTICHE GRAFICHE
   Almeno due indicatori: contatori grandi e/o barre orizzontali
   (<div> con width: X% in base al dato). Aggiorna dentro render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */
// è stato integrato nel render() tramite stat-totale e barra-riempimento.

/* MULTI-VISTA — lista / card / tabella
   Una variabile globale "vista" che render() legge per decidere quale HTML
   produrre. Tre button cambiano "vista" e chiamano render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */


/* CATEGORIE
   Aggiungi un campo categoria nello schema. Nel form un <select> per sceglierla.
   In render(), raggruppa con reduce in { categoria: [elementi] } e disegna un
   header per categoria con sotto la lista di quella categoria.
*/

/* SCRIVI QUI LA TUA RISPOSTA */
function avviaModifica(metaObj, li) {
  const span = li.querySelector(".testo-meta");
  const container = document.createElement("span");
  container.className = "edit-container";
  
  const input = document.createElement("input");
  input.value = metaObj.meta;
  input.className = "edit-input";
  
  const btnSalva = document.createElement("button");
  btnSalva.textContent = "Salva";
  btnSalva.className = "btn-salva";
  
  const termina = () => {
    metaObj.meta = input.value;
    render();
    mostraNotifica("Meta modificata");
  };

  btnSalva.onclick = termina;
  input.onkeydown = (e) => {
    if (e.key === "Enter") termina();
    if (e.key === "Escape") render();
  };

  container.appendChild(input);
  container.appendChild(btnSalva);
  span.replaceWith(container);
  input.focus();
}

render();