const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

/* â”€â”€ Floating formulas background â”€â”€ */
const mathBg = document.getElementById('math-bg');
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

/* â”€â”€ Scroll progress â”€â”€ */
const progressBar = document.getElementById('progress');
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

/* â”€â”€ Mobile navigation â”€â”€ */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('primary-navigation');
const mobileOverlay = document.getElementById('mobile-overlay');

function setMenu(open) {
  navToggle.classList.toggle('active', open);
  navLinks.classList.toggle('active', open);
  mobileOverlay.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('active')));
  mobileOverlay.addEventListener('click', () => setMenu(false));
  navLinks.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
    if (event.matches) setMenu(false);
  });
}

/* â”€â”€ Reveal on scroll â”€â”€ */
const revealTargets = document.querySelectorAll('.rv, .rv-l, .tl-item');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  revealTargets.forEach(target => revealObserver.observe(target));
} else {
  revealTargets.forEach(target => target.classList.add('visible'));
}

/* â”€â”€ Stat counters â”€â”€ */
const statNumbers = document.querySelectorAll('.stat-num[data-target]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    counterObserver.unobserve(element);
    if (reducedMotionQuery.matches) {
      element.textContent = element.dataset.target;
      return;
    }
    const startValue = Number(element.dataset.start) || 0;
    const targetValue = Number(element.dataset.target) || 0;
    const duration = 1400;
    const startTime = performance.now();
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(startValue + (targetValue - startValue) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}, { threshold: .4 });
statNumbers.forEach(element => counterObserver.observe(element));

/* â”€â”€ Timeline line animation â”€â”€ */
const timeline = document.getElementById('timeline');
if (timeline) {
  const timelineObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timeline.classList.add('animated');
        timelineObserver.disconnect();
      }
    });
  }, { threshold: .2 });
  timelineObserver.observe(timeline);
}

/* â”€â”€ Stat panel modal â”€â”€ */
const statOverlay = document.getElementById('stat-overlay');
const statPanel = document.getElementById('stat-panel');
const statPanelContent = document.getElementById('sp-content');
const statPanelCount = document.getElementById('sp-count');
const statPanelTitle = document.getElementById('sp-title');
const statPanelClose = statPanel.querySelector('.sp-close');
let lastFocusedElement = null;

const panelData = {
  internships: {
    label: 'Internships',
    items: [
      { name: 'AI-ML Intern', issuer: 'Blackbuck Engineers Pvt Ltd.', date: 'Jan â€“ Apr 2025', skills: ['OpenCV', 'Image Processing', 'Edge Detection', 'Python', 'Computer Vision'], highlight: ['OpenCV', 'Python'], certUrl: 'certificates/aiml-blackbuck.pdf' },
      { name: 'Python Developer Intern', issuer: 'Codexintern', date: 'Oct â€“ Nov 2024', skills: ['Flask', 'REST API', 'CRUD Operations', 'Python', 'Backend Development'], highlight: ['Flask', 'Python'], certUrl: 'certificates/python-codexintern.pdf' },
      { name: 'Machine Learning Intern', issuer: 'Codegnan Solutions', date: 'May â€“ Jun 2023', skills: ['Pandas', 'NumPy', 'Data Preprocessing', 'Scikit-learn', 'Python'], highlight: ['Pandas', 'NumPy'], certUrl: 'certificates/ml-codegnan.pdf' }
    ]
  },
  certifications: {
    label: 'Certifications',
    items: [
      { name: 'Claude Code in Action', issuer: 'Anthropic', date: 'Apr 2026', skills: ['Claude Skills', 'Anthropic Claude'], highlight: ['Claude Skills', 'Anthropic Claude'], certUrl: 'certificates/claude-code-in-action.png' },
      { name: 'AI Fluency: Framework & Foundations', issuer: 'Anthropic', date: 'Apr 2026', skills: ['AI Fluency', 'Artificial Intelligence (AI)'], highlight: ['AI Fluency'], certUrl: 'certificates/ai-fluency.png' },
      { name: 'Python', issuer: 'HackerRank', date: 'Apr 2026', skills: ['Python (Programming Language)'], highlight: ['Python (Programming Language)'], certUrl: 'https://www.hackerrank.com/certificates/8661505875b8' },
      { name: 'Software Engineer', issuer: 'HackerRank', date: 'Apr 2026', skills: ['Software Development', 'Problem Solving'], highlight: ['Software Development'], certUrl: 'https://www.hackerrank.com/certificates/a9d712dbdfda' },
      { name: 'Workshop Certification â€“ AI Design Workshop', issuer: 'Learn Worlds', date: 'May 2025', skills: ['Artificial Intelligence (AI)', 'Generative AI Tools'], highlight: ['Generative AI Tools'], certUrl: 'certificates/ai-design.pdf' },
      { name: 'Logical Reasoning', issuer: 'Lara Technologies Pvt Ltd', date: 'Mar 2025', skills: ['Logical Approach', 'Reasoning Skills', 'Analytical Thinking'], highlight: ['Logical Approach'], certUrl: 'certificates/Logical-reasoning.pdf' },
      { name: 'Foundations of Prompt Engineering', issuer: 'Amazon Web Services (AWS)', date: 'Feb 2025', skills: ['Prompt Engineering', 'Generative AI', 'AWS'], highlight: ['Prompt Engineering'], certUrl: 'certificates/prompt-engineering-aws.pdf' },
      { name: 'Deep Learning Course: Deep Dive into Deep Learning', issuer: 'Scaler', date: 'Nov 2024', skills: ['Deep Neural Networks (DNN)', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Neural Networks'], highlight: ['Deep Learning', 'Deep Neural Networks (DNN)'], certUrl: 'certificates/deep-learning-scaler.pdf' },
      { name: 'Google Play Academy â€“ Store Listing Certificate', issuer: 'United Latino Students Association', date: 'Nov 2024', skills: ['Google Play', 'App Development'], highlight: ['Google Play'], certUrl: 'https://www.credential.net/ae9feef1-3c59-48bf-a01a-82bb91658d66#acc.NGerauUX' },
      { name: 'Machine Learning with Go', issuer: 'Infosys Springboard', date: 'Oct 2024', skills: ['Machine Learning Algorithms', 'Go (Programming Language)', 'ML Pipelines'], highlight: ['Machine Learning Algorithms', 'Go (Programming Language)'], certUrl: 'certificates/ml-with-go.pdf' },
      { name: 'Freedom With AI Masterclass', issuer: 'Freedom With AI', date: 'Sep 2024', skills: ['Artificial Intelligence (AI)', 'Prompt Engineering'], highlight: ['Prompt Engineering'], certUrl: 'certificates/freedom-ai-masterclass.pdf' },
      { name: 'AI for Students: Build Your Own Generative AI Model', issuer: 'NxtWave', date: 'Aug 2024', skills: ['Generative AI for Web Developers', 'LLMs', 'Python'], highlight: ['Generative AI for Web Developers'], certUrl: 'certificates/ai-for-students-nxtwave.jpg' },
      { name: 'Analyzing and Visualizing Data with Power BI', issuer: 'edX (Verified)', date: 'Jul 2024', skills: ['Power BI', 'Data Visualization', 'Business Intelligence'], highlight: ['Power BI', 'Data Visualization'], certUrl: 'certificates/power-bi-edx.pdf' },
      { name: 'Attention Mechanism', issuer: 'Google', date: 'Jul 2024', skills: ['Attention Mechanisms', 'Deep Learning', 'NLP'], highlight: ['Attention Mechanisms'], certUrl: 'https://www.skills.google/public_profiles/7f55aee3-1b8f-4122-a6ee-1937e7dd23f3/badges/9780390' },
      { name: 'Transformer Model and BART Model', issuer: 'Google', date: 'Jul 2024', skills: ['Transformers', 'BART', 'NLP', 'Sequence Modeling'], highlight: ['Transformers', 'BART'], certUrl: 'https://www.skills.google/public_profiles/7f55aee3-1b8f-4122-a6ee-1937e7dd23f3/badges/9780055' },
      { name: 'Introduction to Large Language Models', issuer: 'Google', date: 'Jul 2024', skills: ['Large Language Models', 'Generative AI', 'Prompt Engineering'], highlight: ['Large Language Models'], certUrl: 'https://www.skills.google/public_profiles/7f55aee3-1b8f-4122-a6ee-1937e7dd23f3/badges/9776829' },
      { name: 'Introduction to Responsible AI', issuer: 'Google', date: 'Jul 2024', skills: ['Responsible AI', 'AI Ethics', 'Bias Mitigation'], highlight: ['Responsible AI', 'AI Ethics'], certUrl: 'https://www.skills.google/public_profiles/7f55aee3-1b8f-4122-a6ee-1937e7dd23f3/badges/9775957' },
      { name: 'Introduction to Image Generation', issuer: 'Google', date: 'Jul 2024', skills: ['Image Generation', 'Diffusion Models', 'Generative AI'], highlight: ['Image Generation', 'Diffusion Models'], certUrl: 'https://www.skills.google/public_profiles/7f55aee3-1b8f-4122-a6ee-1937e7dd23f3/badges/9775642' },
      { name: 'Introduction to Generative AI', issuer: 'Google', date: 'Jul 2024', skills: ['Generative AI', 'AI Fundamentals', 'LLMs'], highlight: ['Generative AI'], certUrl: 'https://www.skills.google/public_profiles/7f55aee3-1b8f-4122-a6ee-1937e7dd23f3/badges/9775056' },
      { name: 'MongoDB Node.js Developer Path', issuer: 'MongoDB', date: 'May 2024', skills: ['MongoDB', 'Node.js', 'NoSQL', 'Database Design'], highlight: ['MongoDB', 'Node.js'], certUrl: 'certificates/mongodb-nodejs.pdf' },
      { name: 'Introduction to Prompt Engineering', issuer: 'edX (Verified)', date: 'Apr 2024', skills: ['Prompt Engineering', 'Generative AI Tools', 'ChatGPT'], highlight: ['Prompt Engineering'], certUrl: 'certificates/prompt-engineering-edx.pdf' },
      { name: 'Introduction to Generative AI', issuer: 'edX (Verified)', date: 'Apr 2024', skills: ['Generative AI Tools', 'Artificial Intelligence (AI)', 'LLMs'], highlight: ['Generative AI Tools'], certUrl: 'certificates/generative-ai-edx.pdf' },
      { name: 'Introduction to Artificial Intelligence', issuer: 'LinkedIn Learning', date: 'Nov 2023', skills: ['Artificial Intelligence (AI)', 'AI for Business'], highlight: ['Artificial Intelligence (AI)'], certUrl: 'certificates/intro-ai-linkedin.pdf' },
      { name: 'Game Development using PyGame', issuer: 'GUVI', date: 'Oct 2023', skills: ['Game Development', 'Python', 'PyGame'], highlight: ['Game Development', 'Python'], certUrl: 'certificates/pygame-guvi.jpg' },
      { name: 'ChatGPT for Everyone', issuer: 'GUVI', date: 'Oct 2023', skills: ['ChatGPT for Web Developers', 'ChatGPT', 'Prompt Engineering'], highlight: ['ChatGPT'], certUrl: 'certificates/chatgpt-guvi.jpg' },
      { name: 'Tomcat Server Administration', issuer: 'Infosys Springboard', date: 'Oct 2023', skills: ['Tomcat Server Administration', 'Server Management', 'Java'], highlight: ['Tomcat Server Administration'], certUrl: 'certificates/tomcat-infosys.pdf' },
      { name: 'Data Science 101', issuer: 'IBM', date: 'Sep 2023', skills: ['Data Science', 'Python', 'Data Analysis'], highlight: ['Data Science'], certUrl: 'certificates/data-science-ibm.jpg' },
      { name: 'TCS iON Career Edge â€“ Young Professional', issuer: 'TCS iON', date: 'Sep 2023', skills: ['Communication', 'Presentations', 'Business Acumen', 'Teamwork'], highlight: ['Communication', 'Presentations'], certUrl: 'certificates/tcs-ion-career.pdf' },
      { name: 'SQL', issuer: 'HackerRank', date: 'Aug 2023', skills: ['SQL', 'MySQL', 'Query Optimization'], highlight: ['SQL', 'MySQL'], certUrl: 'https://www.hackerrank.com/certificates/8b7770eb0b70' },
      { name: 'CSS', issuer: 'HackerRank', date: 'Aug 2023', skills: ['Cascading Style Sheets (CSS)', 'Web Design', 'Responsive Layout'], highlight: ['Cascading Style Sheets (CSS)'], certUrl: 'https://www.hackerrank.com/certificates/d4df6bdc1b21' }
    ]
  },
  projects: {
    label: 'Major Projects',
    items: [
      { name: 'Video & Text Summarizer', issuer: 'NLP & AI', date: '2024', skills: ['HuggingFace', 'BERT', 'NLTK', 'TextRank', 'Python', 'Flask'], highlight: ['BERT', 'HuggingFace'], certUrl: 'https://github.com/BoyidiBhuvaneswari/video-text-summarizer' },
      { name: 'SQL Injection Detection System', issuer: 'Cybersecurity', date: '2024', skills: ['BERT', 'SVM', 'PyMySQL', 'Scikit-learn', 'Python', 'Flask'], highlight: ['BERT', 'SVM'], certUrl: 'https://github.com/BoyidiBhuvaneswari/Real-time-SQL-injection-attack-alarming-system', githubUrl: 'https://github.com/BoyidiBhuvaneswari/Real-time-SQL-injection-attack-alarming-system' },
      { name: 'Hybrid Movie Recommender', issuer: 'Recommendation Systems', date: '2024', skills: ['TensorFlow', 'Surprise', 'NLTK', 'Pandas', 'Python', 'Flask'], highlight: ['TensorFlow', 'Pandas'], certUrl: 'https://github.com/BoyidiBhuvaneswari/hybrid-movie-recommender' }
    ]
  }
};

/* â”€â”€ Render a single item card (same as Meee portfolio) â”€â”€ */
function renderItem(item, isProject) {
  const article = document.createElement('article');
  article.className = 'sp-item';
  const skillsHtml = (item.skills || []).map(s => {
    const isHL = item.highlight && item.highlight.includes(s);
    return `<span class="sp-skill${isHL ? ' hl' : ''}">${s}</span>`;
  }).join('');

  const btnLabel = isProject ? 'âŽ‡ View on GitHub â†’' : 'ðŸŽ“ View Certificate â†’';
  const linkUrl = isProject && item.githubUrl ? item.githubUrl : item.certUrl;
  const btnHtml = linkUrl
    ? `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="sp-view-btn" style="cursor:pointer;">
         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
         ${btnLabel}
       </a>`
    : '';

  article.innerHTML = `
    <div class="sp-item-top">
      <div class="sp-item-left">
        <div class="sp-item-name" title="${item.name}">${item.name}</div>
        <div class="sp-item-issuer"><span class="sp-issuer-dot"></span>${item.issuer}</div>
      </div>
      <div class="sp-item-right">
        <div class="sp-item-date">${item.date}</div>
        <div class="sp-item-badge">âœ“ Earned</div>
      </div>
    </div>
    <div class="sp-skills">${skillsHtml}</div>
    ${btnHtml}`;
  return article;
}

function openStatPanel(key) {
  const data = panelData[key];
  if (!data) return;
  const isProject = (key === 'projects');
  statPanelCount.textContent = `${data.items.length} total`;
  statPanelTitle.textContent = data.label;
  statPanelContent.innerHTML = '';
  data.items.forEach(item => statPanelContent.appendChild(renderItem(item, isProject)));
  lastFocusedElement = document.activeElement;
  statOverlay.hidden = false;
  statPanel.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    statPanel.style.transform = 'translateY(0)';
  }));
  document.body.style.overflow = 'hidden';
  statPanelClose.focus();
}

function closeStatPanel() {
  statPanel.style.transform = 'translateY(100%)';
  window.setTimeout(() => {
    statOverlay.hidden = true;
    statPanel.hidden = true;
    statPanel.style.transform = '';
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
  }, 420);
}

document.querySelectorAll('[data-stat-panel]').forEach(button => {
  button.addEventListener('click', () => openStatPanel(button.dataset.statPanel));
});
statPanelClose.addEventListener('click', closeStatPanel);
statOverlay.addEventListener('click', closeStatPanel);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !statPanel.hidden) closeStatPanel();
});

/* â”€â”€ Project drawers â”€â”€ */
function setCardState(card, button, drawer, open) {
  button.setAttribute('aria-expanded', String(open));
  drawer.setAttribute('aria-hidden', String(!open));
  drawer.classList.toggle('open', open);
  card.classList.toggle('drawer-open', open);
  if (open) card.style.transform = '';
}
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('click', event => {
    if (event.target.closest('a')) return;
    const button = card.querySelector('.proj-toggle');
    if (!button) return;
    const drawer = document.getElementById(button.getAttribute('aria-controls'));
    const open = button.getAttribute('aria-expanded') === 'true';
    // close all other cards first
    document.querySelectorAll('.proj-card.drawer-open').forEach(other => {
      if (other === card) return;
      const otherBtn = other.querySelector('.proj-toggle');
      setCardState(other, otherBtn, document.getElementById(otherBtn.getAttribute('aria-controls')), false);
    });
    setCardState(card, button, drawer, !open);
  });
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      const target = event.target;
      if (target.closest('a') || target.classList.contains('proj-toggle')) return;
      event.preventDefault();
      card.querySelector('.proj-toggle').click();
    }
  });
});

/* â”€â”€ GitHub contribution year label â”€â”€ */
const ghYear = document.getElementById('gh-year');
if (ghYear) {
  const now = new Date();
  ghYear.textContent = `Last 12 months (${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear() - 1} â†’ ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()})`;
}

/* â”€â”€ Project card tilt â”€â”€ */
const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
if (finePointerQuery.matches && !reducedMotionQuery.matches) {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (card.classList.contains('drawer-open')) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── Beyond the Code centered modal (separate component) ── */
const beyondData = {
  reading: {
    title: 'Reading',
    books: [
      { name: 'Atomic Habits', author: 'James Clear', why: 'small habits, big results' },
      { name: 'The Psychology of Money', author: 'Morgan Housel', why: 'money is behavioral' },
      { name: 'Ikigai', author: 'García & Miralles', why: 'finding your "why"' }
    ]
  },
  writing: {
    title: 'Writing',
    links: [
      { name: 'Quotes & Reflections', sub: 'Short words on growth, discipline, and everyday life.', label: 'Read on Instagram →', url: 'https://www.instagram.com/quotessence.official?igsh=MzhxZHhscWpsNGo0' },
      { name: 'My Story', sub: 'A story I wrote.', label: 'Read my story →', url: 'https://drive.google.com/file/d/1aJTrrAQ5mXr0zya-IFcmAaN_W5LoN837/view?usp=sharing' }
    ]
  }
};

const beyondOverlay = document.getElementById('beyond-overlay');
const beyondModal = document.getElementById('beyond-modal');
const beyondContent = document.getElementById('beyond-content');
const beyondTitle = document.getElementById('beyond-title');
const beyondClose = beyondModal.querySelector('.bm-close');
let beyondLastFocus = null;

function openBeyondModal(key) {
  const data = beyondData[key];
  if (!data) return;
  beyondTitle.textContent = data.title;
  beyondContent.innerHTML = '';
  if (data.books) {
    data.books.forEach(book => {
      const div = document.createElement('div');
      div.className = 'bm-book';
      const name = document.createElement('div');
      name.className = 'bm-book-name';
      name.textContent = book.name;
      const author = document.createElement('span');
      author.className = 'bm-book-author';
      author.textContent = ' ' + book.author;
      name.appendChild(author);
      const why = document.createElement('div');
      why.className = 'bm-book-why';
      why.textContent = book.why;
      div.appendChild(name);
      div.appendChild(why);
      beyondContent.appendChild(div);
    });
  }
  if (data.links) {
    const wrap = document.createElement('div');
    wrap.className = 'bm-link-row';
    data.links.forEach(link => {
      const item = document.createElement('div');
      item.className = 'bm-link-item';
      const name = document.createElement('div');
      name.className = 'bm-link-name';
      name.textContent = link.name;
      const sub = document.createElement('div');
      sub.className = 'bm-link-sub';
      sub.textContent = link.sub;
      const btn = document.createElement('a');
      btn.className = 'bm-link-btn';
      btn.href = link.url;
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
      btn.textContent = link.label;
      item.appendChild(name);
      item.appendChild(sub);
      item.appendChild(btn);
      wrap.appendChild(item);
    });
    beyondContent.appendChild(wrap);
  }
  beyondLastFocus = document.activeElement;
  beyondOverlay.hidden = false;
  beyondModal.hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => beyondModal.classList.add('bm-open'));
  beyondClose.focus();
}

function closeBeyondModal() {
  beyondModal.classList.remove('bm-open');
  window.setTimeout(() => {
    beyondOverlay.hidden = true;
    beyondModal.hidden = true;
    document.body.style.overflow = '';
    if (beyondLastFocus) beyondLastFocus.focus();
  }, 250);
}

document.querySelectorAll('[data-beyond-modal]').forEach(button => {
  button.addEventListener('click', () => openBeyondModal(button.dataset.beyondModal));
});
beyondClose.addEventListener('click', closeBeyondModal);
beyondOverlay.addEventListener('click', closeBeyondModal);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !beyondModal.hidden) closeBeyondModal();
});
