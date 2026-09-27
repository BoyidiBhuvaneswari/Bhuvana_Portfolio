// Paste this in DevTools console — reports symbols + computed opacity
(function () {
  const bg = document.getElementById('math-bg');
  const kids = bg ? bg.childElementCount : 'no #math-bg element';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  console.log('reduced-motion matches:', reduced);
  console.log('math-bg childElementCount:', kids);
  const symbols = bg ? [...bg.querySelectorAll('.math-symbol')] : [];
  if (symbols.length) {
    const s = symbols[0];
    const cs = getComputedStyle(s);
    const bgcs = getComputedStyle(bg);
    console.log('symbol #1 inline opacity attr:', s.style.opacity || '(none)');
    console.log('symbol #1 computed opacity:', cs.opacity);
    console.log('symbol #1 computed animation:', cs.animationName, '| duration:', cs.animationDuration);
    console.log('symbol #1 font-size:', cs.fontSize);
    console.log('#math-bg computed opacity:', bgcs.opacity);
    const symOp = parseFloat(cs.opacity);
    const bgOp = parseFloat(bgcs.opacity);
    console.log('EFFECTIVE opacity (symbol x container):', (symOp * bgOp).toFixed(3));
    console.log('color:', cs.color);
  } else {
    console.log('no .math-symbol children found');
  }
})();