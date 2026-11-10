/* Wspólny silnik aplikacji „Matematyka na maturę”: narzędzia do zadań, sprawdzanie odpowiedzi, interfejs. */
/* ====== Silnik zadań (bez DOM) ====== */
const t = String.raw;
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const isInt = x => Math.abs(x - Math.round(x)) < 1e-9;

function frac(x) { for (let d = 1; d <= 1000; d++) { const p = Math.round(x * d); if (Math.abs(p / d - x) < 1e-9) return [p, d]; } return null; }
function D(x, dig = 6) { if (Object.is(x, -0)) x = 0; return String(+x.toFixed(dig)).replace('.', '{,}'); }
function T(x) {
  if (Object.is(x, -0) || Math.abs(x) < 1e-12) return '0';
  if (isInt(x)) return N(Math.round(x));
  const s = +x.toFixed(4);
  if (Math.abs(s - x) < 1e-12) return D(x);
  const f = frac(x);
  if (f) { const [p, d] = f; return (p < 0 ? '-' : '') + t`\frac{${Math.abs(p)}}{${d}}`; }
  return D(x);
}
/* zawsze ułamek zwykły (3/8 zamiast 0,375) */
function TF(x) { const f = frac(x); if (!f || f[1] === 1) return T(x); return (f[0] < 0 ? '-' : '') + t`\frac{${Math.abs(f[0])}}{${f[1]}}`; }
/* liczba całkowita z odstępami tysięcy (12 500 → 12\,500) */
function N(n) { const s = String(Math.abs(n)); const g = s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : s; return (n < 0 ? '-' : '') + g; }
const P = x => (x < 0 ? `(${T(x)})` : T(x));
const M = s => t`\(${s}\)`;
function txt(x) {
  if (isInt(x)) { const s = String(Math.round(x)); return (s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : s).replace('-', '−'); }
  const s = +x.toFixed(4);
  if (Math.abs(s - x) < 1e-12) return String(s).replace('.', ',').replace('-', '−');
  const f = frac(x); if (f) return (f[0] < 0 ? '−' : '') + Math.abs(f[0]) + '/' + f[1];
  return String(+x.toFixed(6)).replace('.', ',').replace('-', '−');
}
const dg = x => `${T(x)}^\\circ`;
const L = s => `|${s}|`;
const K = s => t`|\sphericalangle ${s}|`;
const rad = d => d * Math.PI / 180, sin = d => Math.sin(rad(d)), cos = d => Math.cos(rad(d));

/* ---- liczby postaci k·√n·(π) ---- */
function R(k, n = 1, pi = 0) {
  n = Math.round(n);
  if (n === 0 || k === 0) return { k: 0, n: 1, pi: 0 };
  for (let i = 2; i * i <= n; i++) while (n % (i * i) === 0) { n /= i * i; k *= i; }
  return { k: +k.toPrecision(12), n, pi: pi ? 1 : 0 };
}
const rv = s => (typeof s === 'number' ? s : s.k * Math.sqrt(s.n) * (s.pi ? Math.PI : 1));
function rt(s) {
  if (typeof s === 'number') return T(s);
  const core = (s.n > 1 ? t`\sqrt{${s.n}}` : '') + (s.pi ? t`\pi` : '');
  if (!core || s.k === 0) return T(s.k);
  const sg = s.k < 0 ? '-' : '', f = frac(Math.abs(s.k));
  if (!f) return sg + D(Math.abs(s.k)) + core;
  const [p, q] = f, num = (p === 1 ? '' : p) + core;
  return sg + (q === 1 ? num : t`\frac{${num}}{${q}}`);
}
function rx(s) {
  if (typeof s === 'number') return txt(s);
  const core = (s.n > 1 ? '√' + s.n : '') + (s.pi ? 'π' : '');
  if (!core || s.k === 0) return txt(s.k);
  const sg = s.k < 0 ? '−' : '', f = frac(Math.abs(s.k));
  if (!f) return sg + txt(Math.abs(s.k)) + core;
  const [p, q] = f;
  return sg + (p === 1 ? '' : p) + core + (q === 1 ? '' : '/' + q);
}
/* √m w krokach rozwiązania: "\sqrt{48} = 4\sqrt{3}" albo "\sqrt{49} = 7" */
function sq(m) { const s = R(1, m); return s.k === 1 ? t`\sqrt{${m}}` : t`\sqrt{${m}} = ${rt(s)}`; }
/* ---- odczyt odpowiedzi: liczby, ułamki, √, π ---- */
function normalize(raw) {
  let s = String(raw).toLowerCase().trim().replace(/^[^=]*=/, '');
  s = s.replace(/[−–—]/g, '-').replace(/[·×⋅]/g, '*').replace(/:/g, '/').replace(/²/g, '^2').replace(/³/g, '^3');
  s = s.replace(/\s*(stopni|stopnie|stopnia|°|cm|mm|dm|km|ha|m|j\.?|jedn\.?)\s*(\^\s*[23])?\s*$/, '');
  return s.replace(/pierwiastek\s*z|pierw|sqrt|√/g, '√').replace(/pi|π/g, 'π').replace(/,/g, '.').replace(/\s+/g, '');
}
function evalExpr(s) {
  let i = 0;
  const peek = () => s[i];
  function num() { const m = /^(\d+(\.\d+)?|\.\d+)/.exec(s.slice(i)); if (!m) throw 0; i += m[0].length; return parseFloat(m[0]); }
  function primary() {
    const c = peek();
    if (c === '(') { i++; const v = expr(); if (peek() !== ')') throw 0; i++; return v; }
    if (c === 'π') { i++; return Math.PI; }
    if (c === '√') { i++; const v = power(); if (v < 0) throw 0; return Math.sqrt(v); }
    return num();
  }
  function power() { let v = primary(); if (peek() === '^') { i++; v = Math.pow(v, unary()); } return v; }
  function unary() { if (peek() === '-') { i++; return -unary(); } if (peek() === '+') { i++; return unary(); } return power(); }
  function term() {
    let v = unary();
    for (;;) {
      const c = peek();
      if (c === '*') { i++; v *= unary(); }
      else if (c === '/') { i++; const d = unary(); if (d === 0) throw 0; v /= d; }
      else if (c === '(' || c === 'π' || c === '√' || (c !== undefined && /[\d.]/.test(c))) v *= power();
      else break;
    }
    return v;
  }
  function expr() { let v = term(); for (;;) { const c = peek(); if (c === '+') { i++; v += term(); } else if (c === '-') { i++; v -= term(); } else break; } return v; }
  const v = expr(); if (i !== s.length) throw 0; return v;
}
function parseNum(raw) { const s = normalize(raw); if (!s) return NaN; try { const v = evalExpr(s); return Number.isFinite(v) ? v : NaN; } catch (e) { return NaN; } }

/* ====== Część wspólna dla wszystkich działów ====== */
const RETRY = { retry: true };
const DOK = '<span class="cmd">Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych.</span>';
const PF = '<span class="cmd">Oceń prawdziwość podanych zdań. Wybierz P, jeśli zdanie jest prawdziwe, albo F – jeśli jest fałszywe.</span>';
const zl = x => (isInt(x) ? N(Math.round(x)) : x.toFixed(2).replace('.', '{,}'));
const need = c => { if (!c) throw RETRY; };
const LEVEL_NAME = { 1: 'Łatwy', 2: 'Średni', 3: 'Trudny' };
function mk(o) { return Object.assign({ fields: [], choices: null, tf: null, hints: [], steps: [], fig: null, pts: 1, check: null }, o); }
/* pole odpowiedzi: liczba wymierna → wymagany gotowy wynik (plain); obiekt R(k, n) → wolno wpisać √ */
function F(label, ans, extra) { return Object.assign({ label, ans: rv(ans), show: rx(ans), plain: typeof ans === 'number' }, extra || {}); }
/* " + 3" / " - 3" oraz jednomiany i wielomiany w LaTeX-u */
const pm = x => (x < 0 ? ' - ' : ' + ') + T(Math.abs(x));
function poly(cs, v = 'x') {
  let s = ''; const n = cs.length - 1;
  cs.forEach((c, i) => {
    if (Math.abs(c) < 1e-12) return;
    const d = n - i, abs = Math.abs(c), vp = d === 0 ? '' : d === 1 ? v : `${v}^{${d}}`;
    const co = d > 0 && near(abs, 1) ? '' : T(abs);
    s += (s ? (c < 0 ? ' - ' : ' + ') : (c < 0 ? '-' : '')) + co + vp;
  });
  return s || '0';
}
/* (x - 3), (x + 2), x */
const xm = (r, v = 'x') => (r === 0 ? v : `(${v}${pm(-r)})`);
/* przedziały: IV(a, b, domkLewy, domkPrawy) */
const INF = Infinity;
function IV(a, b, lc, rc) {
  return (lc && a !== -INF ? t`\langle ` : '(') + (a === -INF ? t`-\infty` : T(a)) + t`,\ ` + (b === INF ? t`{+}\infty` : T(b)) + (rc && b !== INF ? t`\rangle` : ')');
}
const UN = (...p) => p.join(t`\cup`);
/* odpowiedzi ABCD: opts(poprawna, [błędne…]); element to 'latex' albo ['latex', wartość liczbowa] */
function opts(correct, wrongs, o) {
  o = o || {}; const n = o.n || 4;
  const key = x => (Array.isArray(x) ? 'v' + (+(+x[1]).toFixed(9)) : 's' + x), lab = x => (Array.isArray(x) ? x[0] : x);
  const seen = new Set([key(correct)]), labs = new Set([lab(correct)]), out = [];
  for (const w of shuffle(wrongs)) {
    if (out.length === n - 1) break;
    if (seen.has(key(w)) || labs.has(lab(w))) continue;
    seen.add(key(w)); labs.add(lab(w)); out.push(w);
  }
  if (out.length < n - 1) throw RETRY;
  const all = o.keep ? [correct].concat(out).sort((a, b) => o.keep.indexOf(lab(a)) - o.keep.indexOf(lab(b))) : shuffle([correct].concat(out));
  return { choices: all.map(x => (o.raw ? lab(x) : M(lab(x)))), ans: all.indexOf(correct) };
}

/* ---- wykres w układzie współrzędnych ---- */
function plot(o) {
  const [x0, x1] = o.x, [y0, y1] = o.y, u = Math.min(30, Math.floor(440 / (x1 - x0 + 1))), pad = 18;
  const W = (x1 - x0) * u + 2 * pad, H = (y1 - y0) * u + 2 * pad;
  const X = x => +(pad + (x - x0) * u).toFixed(2), Y = y => +(pad + (y1 - y) * u).toFixed(2);
  const id = 'c' + Math.random().toString(36).slice(2, 8);
  let s = `<svg class="plot" viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.alt || 'Wykres funkcji w układzie współrzędnych'}"><defs><clipPath id="${id}"><rect x="${pad - 2}" y="${pad - 2}" width="${W - 2 * pad + 4}" height="${H - 2 * pad + 4}"/></clipPath></defs>`;
  for (let x = x0; x <= x1; x++) s += `<line class="g" x1="${X(x)}" y1="${Y(y0)}" x2="${X(x)}" y2="${Y(y1)}"/>`;
  for (let y = y0; y <= y1; y++) s += `<line class="g" x1="${X(x0)}" y1="${Y(y)}" x2="${X(x1)}" y2="${Y(y)}"/>`;
  s += `<line class="ax" x1="${X(x0) - 8}" y1="${Y(0)}" x2="${X(x1) + 8}" y2="${Y(0)}"/><path class="ah" d="M${X(x1) + 14} ${Y(0)}l-9 -4v8z"/>`;
  s += `<line class="ax" x1="${X(0)}" y1="${Y(y0) + 8}" x2="${X(0)}" y2="${Y(y1) - 8}"/><path class="ah" d="M${X(0)} ${Y(y1) - 14}l-4 9h8z"/>`;
  s += `<text class="an" x="${X(x1) + 6}" y="${Y(0) + 15}">x</text><text class="an" x="${X(0) + 8}" y="${Y(y1) - 5}">y</text>`;
  const stepL = (x1 - x0) > 14 ? 2 : 1;
  for (let x = x0; x <= x1; x++) if (x !== 0) { s += `<line class="tk" x1="${X(x)}" y1="${Y(0) - 3}" x2="${X(x)}" y2="${Y(0) + 3}"/>`; if (x % stepL === 0 && x < x1) s += `<text class="tl" x="${X(x)}" y="${Y(0) + 14}" text-anchor="middle">${String(x).replace('-', '−')}</text>`; }
  for (let y = y0; y <= y1; y++) if (y !== 0) { s += `<line class="tk" x1="${X(0) - 3}" y1="${Y(y)}" x2="${X(0) + 3}" y2="${Y(y)}"/>`; if (y < y1) s += `<text class="tl" x="${X(0) - 7}" y="${Y(y) + 4}" text-anchor="end">${String(y).replace('-', '−')}</text>`; }
  s += `<text class="tl" x="${X(0) - 7}" y="${Y(0) + 14}" text-anchor="end">0</text><g clip-path="url(#${id})">`;
  (o.fns || []).forEach(fn => {
    const a = Math.max(x0, fn.from ?? x0), b = Math.min(x1, fn.to ?? x1), n = 240; let d = '', pen = false;
    for (let i = 0; i <= n; i++) {
      const x = a + (b - a) * i / n, y = fn.f(x);
      if (!Number.isFinite(y) || y > y1 + 3 || y < y0 - 3) { pen = false; continue; }
      d += (pen ? 'L' : 'M') + X(x) + ' ' + Y(y); pen = true;
    }
    s += `<path class="cv" d="${d}"/>`;
  });
  (o.lines || []).forEach(l => { s += `<polyline class="cv" points="${l.map(p => X(p[0]) + ',' + Y(p[1])).join(' ')}"/>`; });
  (o.dash || []).forEach(l => { s += `<line class="ds" x1="${X(l[0])}" y1="${Y(l[1])}" x2="${X(l[2])}" y2="${Y(l[3])}"/>`; });
  s += '</g>';
  (o.pts || []).forEach(p => { s += `<circle class="${p[2] ? 'po' : 'pt'}" cx="${X(p[0])}" cy="${Y(p[1])}" r="4.2"/>`; });
  (o.labels || []).forEach(l => { s += `<text class="pl" x="${X(l[0]) + (l[3] ?? 8)}" y="${Y(l[1]) + (l[4] ?? -8)}">${l[2]}</text>`; });
  return s + '</svg>';
}

/* ---- losowanie zadania ---- */
const MATURA = { cfgs: {} };
function generate(cfg, topic, level, avoid) {
  const tps = Object.keys(cfg.topics);
  for (let guard = 0; guard < 400; guard++) {
    const tp = topic === 'X' ? pick(tps) : topic, list = cfg.bank[tp][level];
    const i = Math.floor(Math.random() * list.length), key = `${tp}${level}${i}`;
    if (list.length > 1 && key === avoid && guard < 20) continue;
    let task;
    try { task = list[i](); } catch (e) { if (e === RETRY) continue; throw e; }
    task.topic = tp; task.level = level; task.key = key;
    return task;
  }
  throw new Error('Nie udało się wylosować zadania: ' + topic + level);
}

/* ---- sprawdzanie pola ---- */
function clean(raw) { return normalize(String(raw).replace(/\s*(%|zł|zl|lat|lata|szt\.?|kg|g|l|osób|osoby)\s*$/i, '')); }
function checkField(field, raw) {
  if (!String(raw).trim()) return 'empty';
  const s = clean(raw); let v;
  try { v = s ? evalExpr(s) : NaN; } catch (e) { v = NaN; }
  if (!Number.isFinite(v)) return 'invalid';
  if (field.plain && !/^-?(\d+(\.\d+)?|\.\d+)(\/\d+)?$/.test(s)) return 'form';
  const tol = field.tol || 1e-9;
  if (Math.abs(v - field.ans) <= tol * Math.max(1, Math.abs(field.ans))) return 'ok';
  const plain = /^-?(\d+(\.\d+)?|\.\d+)$/.test(s);
  const inexact = Math.abs(field.ans * 1000 - Math.round(field.ans * 1000)) > 1e-6;
  if (plain && inexact && Math.abs(v - field.ans) <= 0.01 * Math.abs(field.ans)) return 'approx';
  return 'bad';
}

/* ---- żartobliwe zachęty (zawsze pod informacją zwrotną, nigdy w treści zadania) ---- */
const QUIPS = {
  first: ['Pitagoras kiwa głową z uznaniem.', 'Kalkulator może iść na przerwę.', 'Tak trzymaj, a arkusz sam będzie się bał.', 'Czysta robota. Egzaminator nie ma się do czego przyczepić.', 'To był punkt zdobyty bez dogrywki.', 'Gdyby matura dawała punkty za styl, też byś je miał(a).'],
  ok: ['Liczy się meta, nie liczba podejść.', 'Za drugim razem smakuje nawet lepiej.', 'Poprawka w brudnopisie to też matematyka.', 'Błąd znaleziony samodzielnie jest wart dwa razy tyle.'],
  bad: ['Spokojnie, nawet Euler czasem kreślił.', 'Minus lubi się chować, sprawdź znaki.', 'To nie porażka, to dane do analizy.', 'Brudnopis jest od tego, żeby był brudny.', 'Jeszcze chwila i ten typ zadań będzie Twój.'],
  streak: { 3: 'Trzy z rzędu. Hat-trick!', 5: 'Pięć z rzędu. Ktoś tu się rozkręca.', 10: 'Dziesięć z rzędu! Może czas na poziom wyżej?', 15: 'Piętnaście z rzędu. CKE prosi o litość.', 20: 'Dwadzieścia z rzędu. To już nie seria, to styl życia.' }
};

if (typeof module !== 'undefined') module.exports = { DOK, PF, zl, t, ri, pick, shuffle, near, gcd, isInt, frac, D, T, TF, N, P, M, txt, R, rv, rt, rx, sq, mk, F, pm, poly, xm, IV, UN, INF, opts, plot, RETRY, need, MATURA, generate, checkField, clean, evalExpr, normalize, LEVEL_NAME, QUIPS };

/* ====== Interfejs ====== */
MATURA.dzial = function (cfg) {
  MATURA.cfgs[cfg.id] = cfg;
  if (typeof document === 'undefined') return;
  const TOPICS = Object.keys(cfg.topics);
  const dots = n => '<span class="lvl-dots">' + [1, 2, 3].map(i => `<i${i <= n ? ' class="on"' : ''}></i>`).join('') + '</span>';
  document.body.insertAdjacentHTML('afterbegin', `
<div class="wrap">
  <header class="top">
    <div class="brand">
      <a class="back" href="index.html">← Wszystkie działy</a>
      <h1>${cfg.title} <span class="seq">${cfg.seq || ''}</span></h1>
      <p>${cfg.lead}</p>
    </div>
    <div class="tally" aria-label="Twoje wyniki">
      <div><b id="t-ok">0</b>dobrze za 1. razem</div>
      <div><b id="t-all">0</b>zadań</div>
      <div><b id="t-streak">0</b>seria</div>
    </div>
  </header>
  <div class="controls">
    <div class="group" role="group" aria-label="Temat">
      <span class="lab">Temat</span>
      <div class="seg" id="topic-seg">${TOPICS.map(k => `<button type="button" data-topic="${k}">${cfg.short && cfg.short[k] || cfg.topics[k]}</button>`).join('')}<button type="button" data-topic="X">Wszystko naraz</button></div>
    </div>
    <div class="group" role="group" aria-label="Poziom trudności">
      <span class="lab">Poziom</span>
      <div class="seg" id="level-seg">${[1, 2, 3].map(l => `<button type="button" data-level="${l}">${dots(l)}${LEVEL_NAME[l]}</button>`).join('')}</div>
    </div>
  </div>
  <div class="main">
    <article class="sheet" id="sheet" aria-live="polite">
      <div class="eyebrow" id="eyebrow"></div>
      <p class="prompt" id="prompt">Ładuję zadanie…</p>
      <div class="figbox" id="fig" hidden></div>
      <form id="answer-form" autocomplete="off" novalidate>
        <div id="answer-area"></div>
        <div class="actions" style="margin-top:16px">
          <button class="btn primary" type="submit" id="btn-check">Sprawdź</button>
          <button class="btn" type="button" id="btn-hint">Podpowiedź 1 z 2</button>
          <button class="btn" type="button" id="btn-solve">Pokaż rozwiązanie</button>
          <button class="btn next" type="button" id="btn-next">Następne zadanie →</button>
        </div>
      </form>
      <div id="feedback" hidden></div>
      <p class="quip" id="quip" hidden></p>
      <div class="hints" id="hints"></div>
      <section class="solution" id="solution" hidden>
        <h3>Rozwiązanie krok po kroku</h3>
        <ol class="steps" id="steps"></ol>
        <div class="answer" id="final"></div>
      </section>
    </article>
    <aside class="side">
      <section class="panel"><h2>Ściąga</h2><div class="formulas" id="formulas"></div></section>
      <section class="panel">
        <h2>Twój postęp</h2>
        <p class="muted" style="margin:0;font-size:.85rem">Zadania rozwiązane dobrze za pierwszym razem / wszystkie zadania.</p>
        <table class="progress" id="progress"></table>
        <div class="reset" id="reset-area"><button type="button" class="linkbtn" id="btn-reset">Wyzeruj postęp</button></div>
      </section>
    </aside>
  </div>
  <footer class="note">Zadania są wzorowane na typach zadań z arkuszy CKE (matura podstawowa, Formuła 2023) i losowane z nowymi liczbami. Liczba punktów przy zadaniu pokazuje, ile mogłoby być warte na egzaminie.</footer>
</div>`);

  window.MathJax = {
    tex: { inlineMath: [['\\(', '\\)']], displayMath: [['\\[', '\\]']] }, svg: { fontCache: 'global' }, options: { enableMenu: false },
    startup: { typeset: false, ready: function () { MathJax.startup.defaultReady(); MathJax.startup.promise.then(function () { typeset(document.body); }); } }
  };
  const mjs = document.createElement('script'); mjs.src = 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js'; mjs.async = true; document.head.appendChild(mjs);

  const $ = id => document.getElementById(id);
  const state = { topic: TOPICS[0], level: 1, task: null, counted: false, wrongs: 0, hintsShown: 0, choice: null, tfSel: [], lastKey: null, lastInput: null };
  let stats = { cells: {}, streak: 0 };
  try { const s = JSON.parse(localStorage.getItem(cfg.store) || 'null'); if (s && s.cells) stats = s; if (s && s.topic) state.topic = s.topic; if (s && s.level) state.level = s.level; } catch (e) {}
  if (!cfg.bank[state.topic] && state.topic !== 'X') state.topic = TOPICS[0];
  if (![1, 2, 3].includes(state.level)) state.level = 1;
  function save() { try { localStorage.setItem(cfg.store, JSON.stringify(Object.assign({}, stats, { topic: state.topic, level: state.level }))); } catch (e) {} }
  function typeset(el) { const mj = window.MathJax; if (mj && mj.typesetPromise) return mj.typesetPromise([el]).catch(() => {}); }
  function setMath(el, html) { const mj = window.MathJax; if (mj && mj.typesetClear) { try { mj.typesetClear([el]); } catch (e) {} } el.innerHTML = html; typeset(el); }

  function renderFormulas() {
    const tps = state.topic === 'X' ? TOPICS : [state.topic];
    setMath($('formulas'), tps.map(tp => (tps.length > 1 ? `<h4 style="color:var(--accent)">${cfg.topics[tp]}</h4>` : '') +
      cfg.formulas[tp].map(([h, f]) => `<div><h4>${h}</h4><div class="f">${f}</div></div>`).join('')).join(''));
  }
  function renderProgress() {
    let ok = 0, all = 0, h = '<thead><tr><th></th><th class="c">Łatwy</th><th class="c">Średni</th><th class="c">Trudny</th></tr></thead><tbody>';
    TOPICS.forEach(tp => {
      h += `<tr><td>${cfg.short && cfg.short[tp] || cfg.topics[tp]}</td>`;
      [1, 2, 3].forEach(lv => {
        const c = stats.cells[tp + lv] || { ok: 0, all: 0 }; ok += c.ok; all += c.all;
        h += c.all ? `<td class="c"><div class="cell">${c.ok}/${c.all}<span class="bar"><i style="width:${Math.round(100 * c.ok / c.all)}%"></i></span></div></td>` : '<td class="c"><div class="cell none">–</div></td>';
      });
      h += '</tr>';
    });
    $('progress').innerHTML = h + '</tbody>';
    $('t-ok').textContent = ok; $('t-all').textContent = all; $('t-streak').textContent = stats.streak || 0;
  }
  function record(firstTryOk) {
    if (state.counted) return; state.counted = true;
    const key = state.task.topic + state.task.level, c = stats.cells[key] || (stats.cells[key] = { ok: 0, all: 0 });
    c.all++; if (firstTryOk) { c.ok++; stats.streak = (stats.streak || 0) + 1; } else stats.streak = 0;
    save(); renderProgress();
  }
  function quip(kind) {
    const q = $('quip'); if (!kind) { q.hidden = true; return; }
    q.textContent = kind === 'first' && QUIPS.streak[stats.streak] ? QUIPS.streak[stats.streak] : pick(QUIPS[kind]); q.hidden = false;
  }

  function newTask() {
    const tk = generate(cfg, state.topic, state.level, state.lastKey);
    Object.assign(state, { task: tk, lastKey: tk.key, counted: false, wrongs: 0, hintsShown: 0, choice: null, tfSel: [], lastInput: null });
    const sheet = $('sheet'); sheet.classList.remove('enter'); void sheet.offsetWidth; sheet.classList.add('enter');
    const kind = tk.choices || tk.tf ? 'zadanie zamknięte' : 'zadanie otwarte';
    $('eyebrow').innerHTML = `<span class="chip">${cfg.topics[tk.topic]}</span><span class="chip l${tk.level}">${LEVEL_NAME[tk.level]}</span><span class="chip pts">${kind} · ${tk.pts} pkt</span><span>${tk.skill}</span>`;
    setMath($('prompt'), tk.text);
    if (tk.fig) { setMath($('fig'), tk.fig); $('fig').hidden = false; } else { $('fig').innerHTML = ''; $('fig').hidden = true; }
    let a;
    if (tk.choices) {
      a = '<div class="choices" role="group" aria-label="Wybierz odpowiedź">' + tk.choices.map((c, i) => `<button type="button" class="choice" id="ch${i}" data-i="${i}" aria-pressed="false"><b>${'ABCD'[i]}.</b> ${c}</button>`).join('') + '</div>';
    } else if (tk.tf) {
      a = '<div class="tfs">' + tk.tf.map((r, i) => `<div class="tfrow" id="tf${i}"><span class="tftext">${r.s}</span><span class="tfbtns" role="group" aria-label="Zdanie ${i + 1}"><button type="button" data-i="${i}" data-v="1" aria-pressed="false" aria-label="Prawda">P</button><button type="button" data-i="${i}" data-v="0" aria-pressed="false" aria-label="Fałsz">F</button></span></div>`).join('') + '</div><p class="inputhelp">Przy każdym zdaniu zaznacz P (prawda) albo F (fałsz).</p>';
    } else {
      const expr = tk.fields.some(f => !f.plain);
      a = '<div class="fields">' + tk.fields.map((f, i) => `<label class="field" id="fw${i}"><span class="flabel">${f.label}</span><input id="f${i}" type="text" inputmode="text" spellcheck="false" autocapitalize="off" aria-label="Odpowiedź ${i + 1}">${f.unit ? `<span class="unit">${f.unit}</span>` : ''}<span class="tick" aria-hidden="true"></span></label>`).join('') + '</div>';
      a += '<div class="keys"><span class="klab">Wstaw:</span>' + (expr ? '<button type="button" class="key" data-ins="√" aria-label="Wstaw pierwiastek">√</button>' : '') + '<button type="button" class="key" data-ins="−" aria-label="Wstaw minus">−</button><button type="button" class="key" data-ins="/" aria-label="Wstaw kreskę ułamkową">/</button></div>';
      a += `<p class="inputhelp">${tk.help || (expr ? 'Ułamek wpisz jako 3/4, liczbę dziesiętną z przecinkiem: 4,5. Pierwiastek: przycisk √, np. 2√3.' : 'Wpisz gotowy wynik: liczbę całkowitą, ułamek (np. −3/4) albo liczbę dziesiętną z przecinkiem (np. 4,5).')}</p>`;
    }
    setMath($('answer-area'), a);
    $('feedback').hidden = true; quip(null); $('hints').innerHTML = ''; $('solution').hidden = true;
    $('btn-hint').disabled = false; $('btn-hint').textContent = 'Podpowiedź 1 z ' + tk.hints.length;
    const area = $('answer-area');
    if (tk.choices) area.querySelectorAll('.choice').forEach(b => b.addEventListener('click', () => {
      state.choice = +b.dataset.i;
      area.querySelectorAll('.choice').forEach(x => { x.setAttribute('aria-pressed', String(x === b)); x.classList.remove('ok', 'bad'); });
    }));
    else if (tk.tf) area.querySelectorAll('.tfbtns button').forEach(b => b.addEventListener('click', () => {
      const i = +b.dataset.i; state.tfSel[i] = b.dataset.v === '1';
      $('tf' + i).classList.remove('ok', 'bad');
      $('tf' + i).querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    }));
    else {
      area.querySelectorAll('input').forEach(inp => inp.addEventListener('focus', () => { state.lastInput = inp; }));
      area.querySelectorAll('.key').forEach(k => {
        k.addEventListener('mousedown', e => e.preventDefault());
        k.addEventListener('click', () => {
          const inp = state.lastInput || $('f0'); if (!inp) return;
          const s = inp.selectionStart ?? inp.value.length, e = inp.selectionEnd ?? inp.value.length;
          inp.setRangeText(k.dataset.ins, s, e, 'end'); inp.focus();
        });
      });
      const f0 = $('f0'); if (f0 && window.matchMedia('(pointer:fine)').matches) f0.focus({ preventScroll: true });
    }
  }

  function feedback(kind, html) { const fb = $('feedback'); fb.className = 'feedback ' + kind; fb.hidden = false; setMath(fb, html); }
  function good() {
    const first = state.wrongs === 0 && state.hintsShown === 0;
    record(state.wrongs === 0);
    feedback('ok', (state.wrongs === 0 ? 'Dobrze, za pierwszym razem!' : 'Dobrze!') + ' <span>Porównaj swój sposób z rozwiązaniem poniżej.</span>');
    quip(first ? 'first' : 'ok'); showSolution(false);
  }
  function wrong(msg) {
    state.wrongs++; record(false);
    const left = state.task.hints.length - state.hintsShown;
    const more = left > 0 ? ' Spróbuj z podpowiedzią.' : ' Możesz też zobaczyć pełne rozwiązanie.';
    feedback('bad', msg + ` <span>${more.trim()}</span>`); quip(state.wrongs === 1 ? 'bad' : null);
  }
  function check() {
    const tk = state.task; if (!tk) return;
    if (tk.choices) {
      if (state.choice === null) { feedback('info', 'Najpierw wybierz jedną z odpowiedzi.'); return; }
      const ok = state.choice === tk.ans; $('ch' + state.choice).classList.add(ok ? 'ok' : 'bad');
      if (ok) good(); else wrong('To nie ta odpowiedź.');
      return;
    }
    if (tk.tf) {
      if (tk.tf.some((r, i) => state.tfSel[i] === undefined)) { feedback('info', 'Oceń każde zdanie: P albo F.'); return; }
      const res = tk.tf.map((r, i) => state.tfSel[i] === r.v);
      res.forEach((ok, i) => { $('tf' + i).classList.remove('ok', 'bad'); $('tf' + i).classList.add(ok ? 'ok' : 'bad'); });
      if (res.every(Boolean)) good(); else wrong(`Dobrze ocenione zdania: ${res.filter(Boolean).length} z ${res.length}.`);
      return;
    }
    const res = tk.fields.map((f, i) => checkField(f, $('f' + i).value));
    const mark = (i, cls, sym) => { const w = $('fw' + i); w.classList.remove('ok', 'bad', 'approx'); if (cls) w.classList.add(cls); w.querySelector('.tick').textContent = sym; };
    if (res.every(x => x === 'empty')) { feedback('info', 'Wpisz odpowiedź w puste pole.'); return; }
    if (res.includes('invalid') || res.includes('form')) {
      res.forEach((x, i) => mark(i, x === 'invalid' || x === 'form' ? 'bad' : '', x === 'invalid' || x === 'form' ? '?' : ''));
      feedback('info', res.includes('invalid') ? 'Nie rozumiem zapisu w zaznaczonym polu. <span>Wpisz liczbę, np. −12, 4,5 albo 3/4.</span>' : 'Doprowadź wynik do końca. <span>W zaznaczonym polu wpisz gotową liczbę (np. −12, 4,5 albo 3/4), a nie działanie.</span>'); return;
    }
    res.forEach((x, i) => mark(i, x === 'ok' ? 'ok' : x === 'approx' ? 'approx' : 'bad', x === 'ok' ? '✓' : x === 'approx' ? '≈' : '✗'));
    if (res.every(x => x === 'ok')) { good(); return; }
    if (res.includes('approx') && !res.some(x => x === 'bad' || x === 'empty')) {
      feedback('info', 'Prawie! <span>W polu oznaczonym ≈ jest przybliżenie. Na maturze podaje się dokładny wynik, np. jako ułamek zwykły.</span>'); return;
    }
    const nOk = res.filter(x => x === 'ok').length;
    wrong(nOk ? `Częściowo: ${nOk} z ${res.length} dobrze. Popraw pola oznaczone ✗.` : 'Jeszcze nie.');
  }
  function hint() {
    const tk = state.task; if (!tk || state.hintsShown >= tk.hints.length) return;
    const i = state.hintsShown++, d = document.createElement('div'); d.className = 'hint';
    $('hints').appendChild(d); setMath(d, `<b>Podpowiedź ${i + 1} z ${tk.hints.length}</b>${tk.hints[i]}`);
    $('btn-hint').disabled = state.hintsShown >= tk.hints.length;
    $('btn-hint').textContent = state.hintsShown < tk.hints.length ? `Podpowiedź ${state.hintsShown + 1} z ${tk.hints.length}` : 'Podpowiedzi wykorzystane';
  }
  function showSolution(manual) {
    const tk = state.task; if (!tk) return;
    if (manual) {
      record(false);
      if ($('feedback').hidden || !$('feedback').classList.contains('ok')) { feedback('info', 'Przeczytaj rozwiązanie, a potem spróbuj podobnego zadania.'); quip(null); }
      if (tk.choices) $('ch' + tk.ans).classList.add('ok');
      if (tk.tf) tk.tf.forEach((r, i) => { $('tf' + i).querySelectorAll('button').forEach(b => b.classList.toggle('right', (b.dataset.v === '1') === r.v)); });
    }
    setMath($('steps'), tk.steps.map(s => `<li>${s}</li>`).join(''));
    setMath($('final'), `<span class="lab">Odpowiedź:</span>${tk.answer}`);
    $('solution').hidden = false;
    if (manual) $('solution').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function syncControls() {
    document.querySelectorAll('#topic-seg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.topic === state.topic)));
    document.querySelectorAll('#level-seg button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.level === state.level)));
  }
  document.querySelectorAll('#topic-seg button').forEach(b => b.addEventListener('click', () => { state.topic = b.dataset.topic; save(); syncControls(); renderFormulas(); newTask(); }));
  document.querySelectorAll('#level-seg button').forEach(b => b.addEventListener('click', () => { state.level = +b.dataset.level; save(); syncControls(); newTask(); }));
  $('answer-form').addEventListener('submit', e => { e.preventDefault(); check(); });
  $('btn-hint').addEventListener('click', hint);
  $('btn-solve').addEventListener('click', () => showSolution(true));
  $('btn-next').addEventListener('click', newTask);
  function resetUI() {
    const area = $('reset-area');
    area.innerHTML = '<span>Na pewno wyzerować cały postęp?</span><button type="button" class="linkbtn danger" id="r-yes">Tak, wyzeruj</button><button type="button" class="linkbtn" id="r-no">Anuluj</button>';
    $('r-yes').onclick = () => { stats = { cells: {}, streak: 0 }; save(); renderProgress(); restore(); };
    $('r-no').onclick = restore;
    function restore() { area.innerHTML = '<button type="button" class="linkbtn" id="btn-reset">Wyzeruj postęp</button>'; $('btn-reset').onclick = resetUI; }
  }
  $('btn-reset').onclick = resetUI;
  syncControls(); renderFormulas(); renderProgress(); newTask();
};
