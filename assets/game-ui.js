(() => {
  'use strict';
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function gem([shape,color]) {
    const colors = {rosso:'#de3e54',verde:'#35976b',viola:'#8350b1',arancione:'#ef943b',rosa:'#dd70a1'};
    const shapes = {
      cuore:'<path d="M32 53C22 45 7 35 7 22C7 8 24 5 32 18C40 5 57 8 57 22C57 35 42 45 32 53Z"/>',
      quadrato:'<rect x="12" y="12" width="40" height="40" rx="6" transform="rotate(7 32 32)"/>',
      bastoncino:'<rect x="23" y="5" width="20" height="53" rx="8" transform="rotate(-13 32 32)"/>',
      ottagono:'<path d="M22 7H42L57 22V42L42 57H22L7 42V22Z"/>'
    };
    const label = escape(`Gemma ${shape} ${color}`);
    return `<svg class="gem-svg" viewBox="0 0 64 64" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg"><title>${label}</title><g fill="${colors[color]}" stroke="#342541" stroke-opacity=".15" stroke-width="2">${shapes[shape]}</g></svg>`;
  }
  const cup = (gems,compact=false) => `<div class="cup${compact?' compact':''}">${gems.map(gem).join('')}</div>`;
  function cellSvg(cell) {
    const size=31+cell.size*19, ratio=1+cell.shape*.6;
    const rx=size*Math.sqrt(ratio), ry=size/Math.sqrt(ratio);
    const spots=[[-.32,-.26],[.30,.25],[.26,-.30],[-.28,.29],[0,0],[-.57,.02],[.58,-.02],[.02,.53]];
    const label=escape(GameLogic.cellWords(cell).join(', '));
    return `<svg class="cell-svg" viewBox="0 0 200 136" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg"><title>${label}</title><rect x="1" y="1" width="198" height="134" rx="18" fill="#f6f2fb"/><ellipse cx="100" cy="68" rx="${rx.toFixed(2)}" ry="${ry.toFixed(2)}" fill="#e7d9f5" stroke="#7952a1" stroke-width="3"/>${spots.slice(0,cell.dots).map(([x,y])=>`<circle cx="${(100+x*rx).toFixed(2)}" cy="${(68+y*ry).toFixed(2)}" r="4" fill="#604083"/>`).join('')}</svg>`;
  }
  const badge = label => `<span class="badge${label==='B'?' b':''}">Gruppo ${escape(label)}</span>`;
  const cellCard = (cell, showBadge=false) => `<article class="cell-card"><div class="cell-card-top">${showBadge?badge(cell.label):'<span>Esempio</span>'}<span>${escape(cell.id)}</span></div>${cellSvg(cell)}<p>${GameLogic.cellWords(cell).map(word=>`<span>${escape(word)}</span>`).join('')}</p></article>`;
  function focusHeading(container) {
    const heading=container.querySelector('h2');
    if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});container.scrollIntoView({block:'start'});}
  }
  window.GameUI={escape,gem,cup,cellSvg,badge,cellCard,focusHeading};
})();
