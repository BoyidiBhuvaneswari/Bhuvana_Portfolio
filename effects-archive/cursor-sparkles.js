const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
const sparkleCanvas = document.getElementById('sparkle-cursor');
const sparkleContext = sparkleCanvas.getContext('2d');
const sparkleParticles = [];
const SPARKLES_PER_SAMPLE = 3;
const SPARKLE_DISTANCE = 10;
const MAX_SPARKLES = 54;
const SPARKLE_COLORS = ['125,249,255', '96,165,250', '37,99,235'];
let sparkleWidth = 0;
let sparkleHeight = 0;
let sparkleRatio = 1;
let previousPointer = null;
let sparkleFrame = null;
let previousSparkleTime = 0;

function resizeSparkleCanvas() {
  sparkleRatio = Math.min(window.devicePixelRatio || 1, 2);
  sparkleWidth = window.innerWidth;
  sparkleHeight = window.innerHeight;
  sparkleCanvas.width = Math.round(sparkleWidth * sparkleRatio);
  sparkleCanvas.height = Math.round(sparkleHeight * sparkleRatio);
  sparkleContext.setTransform(sparkleRatio, 0, 0, sparkleRatio, 0, 0);
}

function createSparkle(x, y) {
  const lifetime = 700 + Math.random() * 400;
  const angle = Math.random() * Math.PI * 2;
  const speed = .012 + Math.random() * .028;
  sparkleParticles.push({
    x: x + (Math.random() - .5) * 10,
    y: y + (Math.random() - .5) * 10,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - .008,
    radius: .8 + Math.random() * 1.8,
    lifetime,
    remaining: lifetime,
    color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)]
  });
  if (sparkleParticles.length > MAX_SPARKLES) {
    sparkleParticles.splice(0, sparkleParticles.length - MAX_SPARKLES);
  }
}

function drawSparkles(time) {
  const elapsed = Math.min(time - previousSparkleTime || 16, 32);
  previousSparkleTime = time;
  sparkleContext.clearRect(0, 0, sparkleWidth, sparkleHeight);
  for (let index = sparkleParticles.length - 1; index >= 0; index--) {
    const particle = sparkleParticles[index];
    particle.remaining -= elapsed;
    if (particle.remaining <= 0) {
      sparkleParticles.splice(index, 1);
      continue;
    }
    particle.x += particle.vx * elapsed;
    particle.y += particle.vy * elapsed;
    const progress = particle.remaining / particle.lifetime;
    const opacity = progress * progress * .9;
    const radius = particle.radius * (.7 + progress * .3);
    sparkleContext.beginPath();
    sparkleContext.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
    sparkleContext.fillStyle = `rgba(${particle.color},${opacity})`;
    sparkleContext.shadowColor = `rgba(${particle.color},${opacity})`;
    sparkleContext.shadowBlur = 8 + radius * 3;
    sparkleContext.fill();
  }
  sparkleContext.shadowBlur = 0;
  sparkleFrame = sparkleParticles.length ? requestAnimationFrame(drawSparkles) : null;
}

function addSparkles(event) {
  const current = { x: event.clientX, y: event.clientY };
  if (!previousPointer) previousPointer = current;
  const distance = Math.hypot(current.x - previousPointer.x, current.y - previousPointer.y);
  if (distance < SPARKLE_DISTANCE) return;
  for (let sample = 1; sample <= SPARKLES_PER_SAMPLE; sample++) {
    const position = sample / SPARKLES_PER_SAMPLE;
    createSparkle(
      previousPointer.x + (current.x - previousPointer.x) * position,
      previousPointer.y + (current.y - previousPointer.y) * position
    );
  }
  previousPointer = current;
  if (!sparkleFrame) {
    previousSparkleTime = performance.now();
    sparkleFrame = requestAnimationFrame(drawSparkles);
  }
}

if (sparkleCanvas && finePointerQuery.matches && !reducedMotionQuery.matches) {
  resizeSparkleCanvas();
  window.addEventListener('resize', resizeSparkleCanvas, { passive: true });
  window.addEventListener('pointermove', addSparkles, { passive: true });
  window.addEventListener('blur', () => { previousPointer = null; });
}
