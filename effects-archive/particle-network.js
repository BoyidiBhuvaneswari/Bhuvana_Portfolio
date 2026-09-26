const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

/* ── Full-page interactive particle network ── */
const networkCanvas = document.getElementById('particle-network');
const networkContext = networkCanvas.getContext('2d');
const NETWORK_DENSITY = 26000;
const NETWORK_MIN_NODES = 48;
const NETWORK_MAX_NODES = 320;
const NETWORK_LINK_DISTANCE = 245;
const NETWORK_POINTER_RADIUS = 210;
const networkPointer = { x: 0, y: 0, active: false };
let networkNodes = [];
let networkWidth = 0;
let networkHeight = 0;
let networkWorldHeight = 0;
let networkRatio = 1;
let previousNetworkTime = 0;
let networkResizeTimer = null;

function createNetworkNode(x, y) {
  const angle = Math.random() * Math.PI * 2;
  const speed = .08 + Math.random() * .14;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: 1 + Math.random() * 1.25
  };
}

function distributeNetworkNodes(count) {
  const columns = Math.max(4, Math.round(Math.sqrt(count * networkWidth / networkWorldHeight)));
  const rows = Math.ceil(count / columns);
  const cellWidth = networkWidth / columns;
  const cellHeight = networkWorldHeight / rows;
  return Array.from({ length: count }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = (column + .18 + Math.random() * .64) * cellWidth;
    const y = (row + .18 + Math.random() * .64) * cellHeight;
    return createNetworkNode(x, y);
  });
}

function resizeParticleNetwork() {
  networkRatio = Math.min(window.devicePixelRatio || 1, 2);
  networkWidth = window.innerWidth;
  networkHeight = window.innerHeight;
  networkWorldHeight = Math.max(document.documentElement.scrollHeight, networkHeight);
  networkCanvas.width = Math.round(networkWidth * networkRatio);
  networkCanvas.height = Math.round(networkHeight * networkRatio);
  networkContext.setTransform(networkRatio, 0, 0, networkRatio, 0, 0);
  const targetCount = Math.min(
    NETWORK_MAX_NODES,
    Math.max(NETWORK_MIN_NODES, Math.round(networkWidth * networkWorldHeight / NETWORK_DENSITY))
  );
  networkNodes = distributeNetworkNodes(targetCount);
}

function drawNetworkLine(fromX, fromY, toX, toY, opacity, color = '156,163,175') {
  networkContext.beginPath();
  networkContext.moveTo(fromX, fromY);
  networkContext.lineTo(toX, toY);
  networkContext.strokeStyle = `rgba(${color},${opacity})`;
  networkContext.lineWidth = .9;
  networkContext.stroke();
}

function renderParticleNetwork(time, animate = true) {
  const frameScale = Math.min((time - previousNetworkTime || 16.67) / 16.67, 2);
  previousNetworkTime = time;
  networkContext.clearRect(0, 0, networkWidth, networkHeight);
  const scrollPosition = window.scrollY || document.documentElement.scrollTop;

  networkNodes.forEach(node => {
    if (animate) {
      if (networkPointer.active) {
        const pointerX = node.x - networkPointer.x;
        const pointerY = node.y - networkPointer.y;
        const pointerDistance = Math.hypot(pointerX, pointerY) || 1;
        if (pointerDistance < NETWORK_POINTER_RADIUS) {
          const force = (1 - pointerDistance / NETWORK_POINTER_RADIUS) * .018;
          node.vx += pointerX / pointerDistance * force;
          node.vy += pointerY / pointerDistance * force;
        }
      }
      const velocity = Math.hypot(node.vx, node.vy);
      if (velocity > .42) {
        node.vx = node.vx / velocity * .42;
        node.vy = node.vy / velocity * .42;
      }
      node.vx *= .998;
      node.vy *= .998;
      node.x += node.vx * frameScale;
      node.y += node.vy * frameScale;
      if (node.x < 0 || node.x > networkWidth) node.vx *= -1;
      if (node.y < 0 || node.y > networkWorldHeight) node.vy *= -1;
      node.x = Math.max(0, Math.min(networkWidth, node.x));
      node.y = Math.max(0, Math.min(networkWorldHeight, node.y));
    }
  });

  const visibleNodes = networkNodes
    .filter(node => node.y >= scrollPosition - NETWORK_LINK_DISTANCE && node.y <= scrollPosition + networkHeight + NETWORK_LINK_DISTANCE)
    .map(node => ({ node, screenY: node.y - scrollPosition }));

  const pointerConnectedNodes = networkPointer.active && finePointerQuery.matches
    ? visibleNodes
        .map(item => ({ ...item, pointerDistance: Math.hypot(item.node.x - networkPointer.x, item.node.y - networkPointer.y) }))
        .filter(item => item.pointerDistance < NETWORK_POINTER_RADIUS)
        .sort((first, second) => first.pointerDistance - second.pointerDistance)
        .slice(0, 6)
    : [];

  for (let first = 0; first < visibleNodes.length; first++) {
    const { node, screenY } = visibleNodes[first];
    for (let second = first + 1; second < visibleNodes.length; second++) {
      const { node: other, screenY: otherScreenY } = visibleNodes[second];
      const distance = Math.hypot(node.x - other.x, node.y - other.y);
      if (distance < NETWORK_LINK_DISTANCE) {
        drawNetworkLine(node.x, screenY, other.x, otherScreenY, (1 - distance / NETWORK_LINK_DISTANCE) * .4);
      }
    }

    const pointerConnection = pointerConnectedNodes.find(item => item.node === node);
    const pointerGlow = pointerConnection
      ? 1 - pointerConnection.pointerDistance / NETWORK_POINTER_RADIUS
      : 0;
    if (pointerConnection) {
      drawNetworkLine(
        node.x,
        screenY,
        networkPointer.x,
        networkPointer.y - scrollPosition,
        .18 + pointerGlow * .42,
        '250,249,246'
      );
    }

    networkContext.beginPath();
    networkContext.arc(node.x, screenY, node.radius + pointerGlow * .6, 0, Math.PI * 2);
    networkContext.fillStyle = pointerGlow
      ? `rgba(250,249,246,${.7 + pointerGlow * .25})`
      : 'rgba(226,232,240,.78)';
    networkContext.fill();
  }

  if (animate) requestAnimationFrame(renderParticleNetwork);
}

resizeParticleNetwork();
window.addEventListener('resize', resizeParticleNetwork, { passive: true });

if ('ResizeObserver' in window) {
  const networkResizeObserver = new ResizeObserver(() => {
    window.clearTimeout(networkResizeTimer);
    networkResizeTimer = window.setTimeout(() => {
      const currentHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      if (Math.abs(currentHeight - networkWorldHeight) > 40) resizeParticleNetwork();
    }, 160);
  });
  networkResizeObserver.observe(document.body);
}

if (finePointerQuery.matches && !reducedMotionQuery.matches) {
  window.addEventListener('pointermove', event => {
    networkPointer.x = event.clientX;
    networkPointer.y = event.clientY + window.scrollY;
    networkPointer.active = true;
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { networkPointer.active = false; });
}

if (reducedMotionQuery.matches) {
  renderParticleNetwork(performance.now(), false);
  window.addEventListener('scroll', () => requestAnimationFrame(time => renderParticleNetwork(time, false)), { passive: true });
}
else requestAnimationFrame(renderParticleNetwork);