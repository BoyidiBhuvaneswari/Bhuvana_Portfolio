const mathBg = document.getElementById('math-bg');
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const symbols = ['f(x)','∑','∫','∂','∇','θ','π','μ','σ','λ','∞','√','≈','≠','∈','∀','∃','log','exp','sin','cos','tan','Δ','α','β','γ','ε','ω','∏','⊕','∩'];

function createSymbol(startMidScreen) {
  const symbol = document.createElement('div');
  symbol.className = 'math-symbol';
  symbol.innerText = symbols[Math.floor(Math.random() * symbols.length)];
  symbol.style.left = `${Math.random() * 100}vw`;
  symbol.style.fontSize = `${Math.random() * .6 + .7}rem`;
  symbol.style.opacity = '0';
  const duration = Math.random() * 4 + 3;
  symbol.style.animationDuration = `${duration}s`;
  if (startMidScreen) {
    const progress = Math.random() * 80 + 10;
    symbol.style.animationDelay = `${-(duration * progress / 100)}s`;
  }
  mathBg.appendChild(symbol);
  window.setTimeout(() => symbol.remove(), (duration + 1) * 1000);
}

if (mathBg && !reducedMotionQuery.matches) {
  const initialCount = window.innerWidth < 600 ? 8 : 14;
  for (let index = 0; index < initialCount; index++) createSymbol(true);
  window.setInterval(() => {
    if (!document.hidden && mathBg.childElementCount < 18) createSymbol(false);
  }, 900);
}
