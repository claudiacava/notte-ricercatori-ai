/* Shared, dependency-free layout. All image URLs remain relative for GitHub Pages. */
(() => {
  'use strict';
  const base = document.body.dataset.base || './';
  const current = document.body.dataset.page;
  const nav = (page, url, text) => `<a href="${base}${url}"${page === current ? ' aria-current="page"' : ''}>${text}</a>`;
  document.getElementById('site-header').innerHTML = `
    <header class="site-header">
      <div class="brand-row wrap">
        <a class="event-logo" href="${base}index.html" aria-label="Notte dei Ricercatori: pagina iniziale"><img src="${base}assets/evento.webp" alt="Logo della Notte delle Ricercatrici e dei Ricercatori, Pavia" width="114" height="113"></a>
        <div class="brand-copy"><p class="event-title">NOTTE DELLE <span>RICERCATRICI</span><br>E DEI <span>RICERCATORI</span></p>
          <div class="organizers"><img src="${base}assets/infn.webp" alt="INFN Pavia" width="91" height="55"><img src="${base}assets/universita-pavia.webp" alt="Università di Pavia" width="143" height="59"></div>
        </div>
      </div>
      <div class="nav-rule"><nav class="wrap nav-row" aria-label="Navigazione principale"><a class="nav-brand" href="${base}index.html">GIOCA CON L’AI <span class="nav-year">/ 2026</span></a><div>${nav('home', 'index.html', 'I giochi')}${nav('gemme', 'robot-dottore/index.html', 'Gemme')}${nav('cellule', 'dna-terapia/index.html', 'Cellule')}</div></nav></div>
    </header>`;
  document.getElementById('site-footer').innerHTML = `
    <footer class="site-footer wrap"><div class="footer-top"><p>Notte delle Ricercatrici e dei Ricercatori <span>· Pavia · 2026</span></p><a href="${base}index.html">Tutti i giochi ↑</a></div>
      <div class="partners" aria-label="Loghi dei partner riportati nel template dell’evento">
        <img src="${base}assets/partner-1.webp" alt="Primo gruppo di loghi dei partner del template dell’evento" width="770" height="196" loading="lazy">
        <img src="${base}assets/partner-2.webp" alt="Secondo gruppo di loghi dei partner del template dell’evento" width="908" height="196" loading="lazy">
        <img src="${base}assets/partner-3.webp" alt="Terzo gruppo di loghi dei partner del template dell’evento" width="722" height="196" loading="lazy">
        <img src="${base}assets/partner-4.webp" alt="Quarto gruppo di loghi dei partner del template dell’evento" width="1009" height="196" loading="lazy">
      </div><p class="footer-note">Un percorso per scoprire, fare domande e imparare insieme.</p></footer>`;
})();
