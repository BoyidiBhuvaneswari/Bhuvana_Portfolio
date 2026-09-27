# PORTFOLIO — WORKING GUIDE FOR AI ASSISTANTS (START HERE)

Read this file FIRST before doing anything. It explains the project, the rules,
and how deployment works. Last updated: 26 Sep 2026.

---

## ⚠️ THE MOST IMPORTANT RULES — READ BEFORE ANYTHING

1. **NEVER commit, push, or touch git history. Git operations are 100% manual.**
   The owner does all `git add / commit / push` themselves. You only edit files
   and run `npm test`. After finishing changes, tell the owner what to commit.

2. **Ask permission before any file edit.** Explain what you will change and
   wait for approval. The owner wants control over every modification.

3. **Revert on request, immediately.** If the owner says "revoke/revert that",
   undo your change exactly. Do not argue, do not re-apply.

4. **Never modify anything outside the requested scope.** If the owner says
   "only change X", touch ONLY X — not neighboring rules, not "improvements".

5. **The `Meee\portfolio` folder is REFERENCE-ONLY.**
   `C:\Users\babyb\OneDrive\Desktop\Meee\portfolio` — never edit files there.
   It is the owner's original/standard portfolio used for comparison.

6. **Never re-introduce emoji into the Internships/Certifications panels.**
   Rulings (already applied, keep them):
   - Cert link label: plain `View Certificate →` (no 🎓)
   - GitHub link label: plain `View on GitHub →` (no ⎇)
   - Badge: plain `Earned` (no ✓)
   - The `→` arrow IS allowed and must stay (it is not an emoji).

7. **Encoding discipline.** This project has suffered UTF-8 mojibake multiple
   times (symbols like ∑ stored as âˆ‘). When you save script.js or
   index.html, ALWAYS save explicitly as UTF-8. Never write non-ASCII chars
   through shell pipelines that can re-encode them. Prefer Python
   `io.open(..., encoding='utf-8')` for text surgery.

---

## PROJECT BASICS

- **Working folder (the live project):**
  `C:\Users\babyb\OneDrive\Desktop\My_projects\portfolio_working`
- **It IS a git repo** (has .git). Remote: GitHub, connected to Cloudflare.
- **Site type:** pure static HTML/CSS/JS. No backend, no build step needed.
- **Owner:** Bhuvaneswari Boyidi — AI/ML engineer + Python developer portfolio.
- **Contact in site:** bhuvana2024.in@gmail.com, GitHub/LinkedIn/HF links inline.

### Files
| File | Purpose |
|---|---|
| `index.html` | All sections + modal containers |
| `style.css` | All styling (gold/cream theme: `--cyan: #D4AF37`, `--text: #E1D5C2`) |
| `script.js` | Background effect + ALL interactivity |
| `photo.jpeg`, `favicon.svg`, `og.png` | Assets |
| `hf-logo.svg`, `leetcode-logo.png`, `hackerrank-logo.png` | Local brand logos (do NOT hotlink these from CDNs — that broke in production once) |
| `certificates/` | 22 cert PDFs/images shown in the stat panel |
| `effects-archive/` | Archived background effects (particle-network, cursor-sparkles, floating-formulas copies) — reference only |
| `tests/verify.mjs` | Test suite — run with `npm test` |
| `scripts/build.mjs` | LEGACY build script (copies files to dist/). NOT used by current deployment. References a missing worker/index.js and would crash if run. Ignore it. |

### Theme (current, migrated)
- Gold `#D4AF37` (var(--cyan)), cream/beige `#E1D5C2` (var(--violet), var(--text))
- Dark navy cards `#111827`, near-black bg `#000`/`#1A1A1A`
- NO leftover cyan `rgba(125,249,255,…)` or purple `rgba(167,139,250,…)` —
  fully migrated. If you ever see them again, that's a regression: report it.
- CodeChef blue `rgba(125,174,255,…)` is a DELIBERATE platform accent. Leave it.

---

## HOW TO VERIFY (always run after any change)

```powershell
npm test
```
This runs `node --check script.js` + `node tests/verify.mjs`.
All checks must pass before reporting done.

---

## DEPLOYMENT — HOW IT WORKS

1. Owner edits are made locally (this folder).
2. Owner commits + pushes to GitHub manually.
3. **Cloudflare Pages/Workers auto-deploys from the push** — no build command,
   serves the repo root as static files. Live URL:
   `https://bhuvana-portfolio.bhuvana2024-in.workers.dev/`
4. Owner may later add a custom domain (none purchased yet).
5. Live-site checks after deploy: HF icon (Contact + Skills), stat panel
   dates/dashes, `View Certificate →` labels, `Earned` badge, math symbols
   background. If stale, hard-refresh (Ctrl+F5) — it's usually browser cache.

### Deployment checklist for the owner (manual)
```
git add <changed files>
git commit -m "<message>"
git push
# then check the live URL in an incognito window
```

---

## CURRENT STATE / FEATURES (as of 26 Sep 2026)

- **Background:** floating gold math symbols (31 symbols, `#math-bg`),
  reduced-motion safe; dimmed on mobile (opacity .18)
- **Hero:** name, badge, desc, buttons, photo circle
- **About:** bio + 3 stat cards (Internships → popup, Certifications → popup,
  Major Projects → scrolls to #projects)
- **Skills:** 18 skill cards (Devicon CDN icons)
- **Projects:** 5 cards — order: RAG Document Chatbot (GitHub + HF Space demo),
  Hybrid Movie Engine (GitHub + onrender demo), SQL Injection (GitHub),
  Video & Text Summarizer (GitHub), Svada Foods E-Commerce (freelance, LIVE
  CLIENT SITE https://www.svadafoods.com/ — no GitHub per client security).
  Plus a "Coming Soon" placeholder card LAST.
  - Cards: uniform 340px min-height, square-ish, tech tags on card face,
    drawer opens with ONLY link buttons on click (one at a time, click again
    to close), no glow/gradient headers
  - Animated icons per card (typing dots / snapping clapper / shield scan /
    condensing lines) in project-appropriate colors, no glow, always-on
- **Problem Solving:** LeetCode/HackerRank/CodeChef cards (no hover glow) +
  LIVE GitHub contribution graph (ghchart.rshah.org, auto-updates, links to
  profile, year label auto-computed in script.js)
- **Tools:** Jupyter/VS Code/PyCharm/Git + GitHub/GCP/Docker/Kaggle/Linux/Streamlit
- **Experience:** 4-entry timeline
- **Beyond the Code (id=beyond):** compact section, 2 small rounded-square
  cards (150px, radius 24px, skill-card style) — 📖 Reading and ✍️ Writing.
  Click opens a NEW CENTERED MODAL (separate from stat-panel!):
  - Reading modal: 3 books (Atomic Habits / Psychology of Money / Ikigai)
  - Writing modal: Instagram quotes link + Google Drive story link
  - Instagram: https://www.instagram.com/quotessence.official
  - Story: https://drive.google.com/file/d/1aJTrrAQ5mXr0zya-IFcmAaN_W5LoN837/
- **Let's Talk:** Formspree form (Submit button has NO glow)
- **Contact:** email/resume buttons (NO glow), 3 social circles
  (GitHub white-on-dark, LinkedIn blue, HF original colors — no glow on hover)
- **favicon.svg:** black "BB" on transparent (no rect background)
- **Certifications section (Learning Milestones) was DELETED from the page** —
  certs live only in the About stat-panel popup now
- **"Connect" nav button was removed**

### Known data quirks
- About stat card says "30 certifications" but popup lists 29 — owner approved.
- `.assetsignore.txt` was deleted from disk (tracked deletion — accepted).

---

## TESTS (tests/verify.mjs) — what they check
- HTML: main landmark, skip-link, nav aria, 3 stat cards, 5 project toggles,
  external links have rel="noopener noreferrer", images have
  alt/width/height/decoding, lazy-loading, no duplicate IDs, anchors valid
- CSS: reduced-motion media, focus-visible, deep-black body,
  project cards uniform height, formula styling active
- script.js: formulas background, aria-expanded updates, stat panel logic,
  reveal-on-scroll
- Archived effect files must exist

If you change section structure, UPDATE THE TESTS to match (they are
descriptions of intended state, not sacred text) — but never weaken
security/accessibility checks.

---

## RECOVERING FROM SESSION CONTEXT LOSS

If a future session lacks history:
1. Read this file fully
2. Run `npm test` to see current state
3. `git status` / `git diff --stat` (READ ONLY — never commit)
4. Ask the owner what they want to work on today

The owner may reference "the standard portfolio" = Meee\portfolio (read-only),
and "the log files" = `%USERPROFILE%\.local\share\opencode\log\opencode.log`
plus the opencode SQLite DB at
`%USERPROFILE%\.local\share\opencode\opencode.db`
(table `message`/`part` hold past session content; `part.data` has tool
inputs/outputs). These were used before to reconstruct history successfully.