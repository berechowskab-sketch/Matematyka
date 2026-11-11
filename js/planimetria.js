/* Dział VIII: Planimetria — trójkąty, czworokąty i wielokąty, koło i okrąg, podobieństwo.
   Zadania przeniesione z pierwszej wersji aplikacji (planimetria.html); na końcu adapter do wspólnego silnika. */
(function () {
const dg = x => `${T(x)}^\\circ`;
const L = s => `|${s}|`;
const K = s => t`|\sphericalangle ${s}|`;
const rad = d => d * Math.PI / 180, sin = d => Math.sin(rad(d)), cos = d => Math.cos(rad(d));
const FD = (label, ans) => F(label, ans, { unit: '°' });
/* ---- narzędzia do niezależnego sprawdzania wyników na współrzędnych ---- */
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const angAt = (v, p, q) => { const ux = p[0] - v[0], uy = p[1] - v[1], wx = q[0] - v[0], wy = q[1] - v[1]; return Math.acos(Math.max(-1, Math.min(1, (ux * wx + uy * wy) / (Math.hypot(ux, uy) * Math.hypot(wx, wy))))) * 180 / Math.PI; };
const areaP = ps => Math.abs(ps.reduce((acc, p, i) => { const q = ps[(i + 1) % ps.length]; return acc + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;

/* ---- geometria do rysunków ---- */
function triAng(al, be, c = 6) { const ga = 180 - al - be, b = c * sin(be) / sin(ga); return { A: [0, 0], B: [c, 0], C: [b * cos(al), b * sin(al)] }; }
function triSides(a, b, c) { const x = (b * b + c * c - a * a) / (2 * c), y = Math.sqrt(Math.max(0, b * b - x * x)); return { A: [0, 0], B: [c, 0], C: [x, y] }; }
const rightTri = (a, b) => ({ C: [0, 0], A: [b, 0], B: [0, a] });
const onC = (c, r, d) => [c[0] + r * cos(d), c[1] + r * sin(d)];
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
const lerp = (p, q, s) => [p[0] + (q[0] - p[0]) * s, p[1] + (q[1] - p[1]) * s];
const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
function foot(p, a, b) { const dx = b[0] - a[0], dy = b[1] - a[1], s = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy); return [a[0] + s * dx, a[1] + s * dy]; }
function meet(a, b, c, d) { /* przecięcie prostych AB i CD */
  const d1 = [b[0] - a[0], b[1] - a[1]], d2 = [d[0] - c[0], d[1] - c[1]], den = d1[0] * d2[1] - d1[1] * d2[0];
  const s = ((c[0] - a[0]) * d2[1] - (c[1] - a[1]) * d2[0]) / den; return [a[0] + s * d1[0], a[1] + s * d1[1]];
}
/* etykieta odcinka: tekst w zadaniu, a w rozwiązaniu odpowiedź */
const Q = (a, b, ans, o) => Object.assign({ a, b, t: '?', hl: 1, sol: rx(ans) }, o || {});
const Lb = (a, b, val, o) => Object.assign({ a, b, t: typeof val === 'string' ? val : rx(val) }, o || {});

/* ---- rysunek SVG (czysty tekst, bez DOM) ---- */
function figSVG(fg, sol) {
  const W = 440, PAD = 34, HMAX = 290, HMIN = 150, E = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const pts = fg.P || {}, cp = c => (typeof c === 'string' ? pts[c] : c);
  const xs = [], ys = [];
  Object.keys(pts).forEach(k => { xs.push(pts[k][0]); ys.push(pts[k][1]); });
  (fg.circles || []).forEach(c => { const p = cp(c.c); xs.push(p[0] - c.r, p[0] + c.r); ys.push(p[1] - c.r, p[1] + c.r); });
  let x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const bw = Math.max(x1 - x0, 1e-6), bh = Math.max(y1 - y0, 1e-6);
  const s = Math.min((W - 2 * PAD) / bw, (HMAX - 2 * PAD) / bh);
  const H = Math.max(HMIN, Math.round(bh * s + 2 * PAD));
  const ox = (W - bw * s) / 2, oy = (H - bh * s) / 2;
  const X = x => ox + (x - x0) * s, Y = y => oy + (y1 - y) * s;
  const S = p => { const q = cp(p); return [X(q[0]), Y(q[1])]; };
  const f1 = v => +v.toFixed(1);
  const lab = o => (sol && o.sol != null ? o.sol : o.t);
  const cls = o => (sol && o.sol != null ? 'lb a' : (o.hl ? 'lb h' : 'lb'));
  /* środek ciężkości figur — od niego odsuwamy etykiety */
  const core = [];
  (fg.polys || []).forEach(pl => (Array.isArray(pl) ? pl : pl.p).forEach(n => core.push(S(n))));
  if (!core.length) Object.keys(pts).forEach(k => core.push(S(k)));
  const C = core.reduce((a, p) => [a[0] + p[0] / core.length, a[1] + p[1] / core.length], [0, 0]);
  const unit = (dx, dy) => { const l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
  let o = '', ex0 = 0, ex1 = W, ey0 = 0, ey1 = H;
  const txtEl = (x, y, str, c) => {
    const w = (c === 'pn' ? 9.5 : 7.8) * String(str).length;
    ex0 = Math.min(ex0, x - w / 2 - 4); ex1 = Math.max(ex1, x + w / 2 + 4); ey0 = Math.min(ey0, y - 11); ey1 = Math.max(ey1, y + 11);
    return `<text class="${c}" x="${f1(x)}" y="${f1(y)}" text-anchor="middle" dominant-baseline="central">${E(str)}</text>`;
  };
  /* wycinki i pierścienie (wypełnienia) */
  (fg.sectors || []).forEach(q => {
    const c = S(q.c), r = q.r * s, a = [c[0] + r * cos(q.a1), c[1] - r * sin(q.a1)], b = [c[0] + r * cos(q.a2), c[1] - r * sin(q.a2)];
    o += `<path class="sector" d="M${f1(c[0])} ${f1(c[1])} L${f1(a[0])} ${f1(a[1])} A${f1(r)} ${f1(r)} 0 ${q.a2 - q.a1 > 180 ? 1 : 0} 0 ${f1(b[0])} ${f1(b[1])} Z"/>`;
  });
  (fg.circles || []).filter(c => c.fill).forEach(c => { const p = S(c.c); o += `<circle class="cir ${c.fill === 's' ? 'fs' : 'fw'}" cx="${f1(p[0])}" cy="${f1(p[1])}" r="${f1(c.r * s)}" style="stroke:none"/>`; });
  (fg.polys || []).forEach(pl => {
    const list = Array.isArray(pl) ? pl : pl.p, extra = Array.isArray(pl) ? '' : ' ' + (pl.c || '');
    o += `<polygon class="shape${extra}" points="${list.map(n => S(n).map(f1).join(',')).join(' ')}"/>`;
  });
  (fg.circles || []).forEach(c => { const p = S(c.c); o += `<circle class="cir${c.d ? ' d' : ''}${c.hl ? ' h' : ''}" cx="${f1(p[0])}" cy="${f1(p[1])}" r="${f1(c.r * s)}"/>`; });
  (fg.arcs || []).forEach(q => {
    const c = S(q.c), r = q.r * s, a = [c[0] + r * cos(q.a1), c[1] - r * sin(q.a1)], b = [c[0] + r * cos(q.a2), c[1] - r * sin(q.a2)];
    o += `<path class="hlarc" d="M${f1(a[0])} ${f1(a[1])} A${f1(r)} ${f1(r)} 0 ${q.a2 - q.a1 > 180 ? 1 : 0} 0 ${f1(b[0])} ${f1(b[1])}"/>`;
  });
  (fg.segs || []).forEach(g => { const a = S(g[0]), b = S(g[1]), fl = g[2] || ''; o += `<line class="ln${fl.includes('d') ? ' d' : ''}${fl.includes('h') ? ' h' : ''}${fl.includes('l') ? ' l' : ''}" x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}"/>`; });
  /* kreski równych odcinków */
  (fg.ticks || []).forEach(g => {
    const a = S(g[0]), b = S(g[1]), m = mid(a, b), d = unit(b[0] - a[0], b[1] - a[1]), n = [-d[1], d[0]], k = g[2] || 1;
    for (let i = 0; i < k; i++) { const off = (i - (k - 1) / 2) * 5, c = [m[0] + d[0] * off, m[1] + d[1] * off]; o += `<line class="tk" x1="${f1(c[0] - n[0] * 6)}" y1="${f1(c[1] - n[1] * 6)}" x2="${f1(c[0] + n[0] * 6)}" y2="${f1(c[1] + n[1] * 6)}"/>`; }
  });
  /* strzałki równoległości */
  (fg.par || []).forEach(g => {
    const a = S(g[0]), b = S(g[1]), m = lerp(a, b, g[2] || 0.5), d = unit(b[0] - a[0], b[1] - a[1]), n = [-d[1], d[0]];
    o += `<polyline class="am" style="stroke-width:1.6" points="${f1(m[0] - d[0] * 5 + n[0] * 5)},${f1(m[1] - d[1] * 5 + n[1] * 5)} ${f1(m[0] + d[0] * 2)},${f1(m[1] + d[1] * 2)} ${f1(m[0] - d[0] * 5 - n[0] * 5)},${f1(m[1] - d[1] * 5 - n[1] * 5)}"/>`;
  });
  /* kąty */
  let angLabels = '';
  (fg.angs || []).forEach(g => {
    const v = S(g.v), a = S(g.a), b = S(g.b);
    const t1 = Math.atan2(a[1] - v[1], a[0] - v[0]); let dl = Math.atan2(b[1] - v[1], b[0] - v[0]) - t1;
    while (dl > Math.PI) dl -= 2 * Math.PI; while (dl <= -Math.PI) dl += 2 * Math.PI;
    const deg = Math.abs(dl) * 180 / Math.PI, maxR = 0.42 * Math.min(Math.hypot(a[0] - v[0], a[1] - v[1]), Math.hypot(b[0] - v[0], b[1] - v[1]));
    let r = g.r || (deg < 30 ? 36 : deg < 55 ? 27 : 20); r = Math.max(12, Math.min(r, maxR));
    const u1 = [Math.cos(t1), Math.sin(t1)], u2 = [Math.cos(t1 + dl), Math.sin(t1 + dl)];
    const c = (sol && g.sol != null) ? 'am' : (g.hl ? 'am h' : 'am');
    if (g.right) {
      const q = 11; o += `<polyline class="${c}" points="${f1(v[0] + u1[0] * q)},${f1(v[1] + u1[1] * q)} ${f1(v[0] + (u1[0] + u2[0]) * q)},${f1(v[1] + (u1[1] + u2[1]) * q)} ${f1(v[0] + u2[0] * q)},${f1(v[1] + u2[1] * q)}"/>`;
    } else {
      o += `<path class="${c}" d="M${f1(v[0] + u1[0] * r)} ${f1(v[1] + u1[1] * r)} A${f1(r)} ${f1(r)} 0 0 ${dl > 0 ? 1 : 0} ${f1(v[0] + u2[0] * r)} ${f1(v[1] + u2[1] * r)}"/>`;
    }
    const tx = lab(g); if (tx == null || tx === '') return;
    const tm = t1 + dl / 2, w = 7.4 * String(tx).length, dist = (g.right ? 16 : r) + 8 + (deg < 40 ? w * 0.35 : w * 0.25) + (g.out || 0);
    angLabels += txtEl(v[0] + Math.cos(tm) * dist, v[1] + Math.sin(tm) * dist, tx, cls(g));
  });
  (fg.dots || []).forEach(n => { const p = S(n); o += `<circle class="dot" cx="${f1(p[0])}" cy="${f1(p[1])}" r="3.2"/>`; });
  /* etykiety długości */
  (fg.lens || []).forEach(g => {
    const a = S(g.a), b = S(g.b), m = lerp(a, b, g.at == null ? 0.5 : g.at), d = unit(b[0] - a[0], b[1] - a[1]);
    let n = [-d[1], d[0]];
    if (g.s) n = [n[0] * g.s, n[1] * g.s];
    else if ((m[0] - C[0]) * n[0] + (m[1] - C[1]) * n[1] < 0) n = [-n[0], -n[1]];
    const tx = lab(g), w = 7.6 * String(tx).length + 4, off = 7 + Math.abs(n[0]) * w / 2 + Math.abs(n[1]) * 8;
    o += txtEl(m[0] + n[0] * off, m[1] + n[1] * off, tx, cls(g));
  });
  o += angLabels;
  (fg.txt || []).forEach(g => { const p = S(g.p); o += txtEl(p[0], p[1], lab(g), sol && g.sol != null ? 'lb a' : (g.c || 'ft')); });
  /* nazwy punktów */
  const hide = fg.hide || [];
  Object.keys(pts).forEach(k => {
    if (k[0] === '_' || hide.includes(k)) return;
    const p = S(k), pos = fg.pos && fg.pos[k];
    let u = pos ? unit(pos[0], -pos[1]) : unit(p[0] - C[0], p[1] - C[1]);
    if (!pos && Math.hypot(p[0] - C[0], p[1] - C[1]) < 4) u = unit(0.8, 0.9);
    o += txtEl(p[0] + u[0] * 14, p[1] + u[1] * 14, k, 'pn');
  });
  const vw = ex1 - ex0, vh = ey1 - ey0;
  return `<svg class="fig" viewBox="${f1(ex0)} ${f1(ey0)} ${f1(vw)} ${f1(vh)}" width="${Math.round(vw)}" height="${Math.round(vh)}" role="img" aria-label="Rysunek pomocniczy do zadania">` + o + '</svg>';
}

const TRIPLES = [[3, 4, 5], [6, 8, 10], [9, 12, 15], [12, 16, 20], [5, 12, 13], [10, 24, 26], [8, 15, 17], [7, 24, 25], [20, 21, 29], [15, 20, 25]];
const legs = tr => (Math.random() < 0.5 ? [tr[0], tr[1], tr[2]] : [tr[1], tr[0], tr[2]]);
const RIGHT_C = t`W trójkącie prostokątnym ${M('ABC')} kąt przy wierzchołku ${M('C')} jest prosty`;
/* trójkąt prostokątny: kąt prosty przy C, |BC| = a (pion), |AC| = b (poziom) */
function rtFig(a, b, lens, angs, more) {
  return Object.assign({ P: rightTri(a, b), polys: [['A', 'B', 'C']], lens: lens || [], angs: [{ v: 'C', a: 'A', b: 'B', right: 1 }].concat(angs || []) }, more || {});
}

/* ---------- TRÓJKĄTY ---------- */
const GT = {
1: [
  function angleSum() {
    const v = Math.random();
    if (v < 0.4) {
      let a, b, g; do { a = ri(25, 95); b = ri(25, 90); g = 180 - a - b; } while (g < 25 || a === b || b === g || a === g);
      return mk({ verify: () => (() => { const q = triAng(a, b); return a + b + g === 180 && near(angAt(q.C, q.A, q.B), g, 1e-6); })(), skill: 'suma kątów trójkąta',
        text: t`W trójkącie ${M('ABC')} kąt przy wierzchołku ${M('A')} ma miarę ${M(dg(a))}, a kąt przy wierzchołku ${M('B')} ma miarę ${M(dg(b))}. Oblicz miarę kąta ${M('ACB')}.`,
        fields: [FD(M(K('ACB') + ' ='), g)],
        hints: [t`Suma miar kątów w każdym trójkącie jest równa ${M(dg(180))}.`, t`Dodaj dwa znane kąty i odejmij wynik od ${M(dg(180))}.`],
        steps: [t`Suma kątów trójkąta to ${M(dg(180))}, więc ${M(t`${K('ACB')} = 180^\circ - ${dg(a)} - ${dg(b)} = ${dg(g)}`)}.`],
        answer: M(`${K('ACB')} = ${dg(g)}`),
        fig: { P: triAng(a, b), polys: [['A', 'B', 'C']], angs: [{ v: 'A', a: 'B', b: 'C', t: a + '°' }, { v: 'B', a: 'C', b: 'A', t: b + '°' }, { v: 'C', a: 'A', b: 'B', t: '?', hl: 1, sol: g + '°' }] } });
    }
    if (v < 0.75) {
      if (Math.random() < 0.5) {
        const be = ri(30, 80), ga = 180 - 2 * be;
        return mk({ verify: () => (() => { const q = triAng(be, be); return near(angAt(q.C, q.A, q.B), ga, 1e-6) && near(dist(q.A, q.C), dist(q.B, q.C)); })(), skill: 'trójkąt równoramienny',
          text: t`Trójkąt ${M('ABC')} jest równoramienny, a jego ramiona ${M('AC')} i ${M('BC')} mają równe długości. Kąt ${M('BAC')} przy podstawie ma miarę ${M(dg(be))}. Oblicz miarę kąta ${M('ACB')}.`,
          fields: [FD(M(K('ACB') + ' ='), ga)],
          hints: [t`W trójkącie równoramiennym kąty przy podstawie mają równe miary: ${M(`${K('BAC')} = ${K('ABC')}`)}.`, t`Od ${M(dg(180))} odejmij oba kąty przy podstawie.`],
          steps: [t`Kąty przy podstawie są równe: ${M(`${K('ABC')} = ${K('BAC')} = ${dg(be)}`)}.`, M(t`${K('ACB')} = 180^\circ - 2\cdot ${dg(be)} = ${dg(ga)}`)],
          answer: M(`${K('ACB')} = ${dg(ga)}`),
          fig: { P: triAng(be, be), polys: [['A', 'B', 'C']], ticks: [['A', 'C', 1], ['B', 'C', 1]], angs: [{ v: 'A', a: 'B', b: 'C', t: be + '°' }, { v: 'C', a: 'A', b: 'B', t: '?', hl: 1, sol: ga + '°' }] } });
      }
      const ga = 2 * ri(10, 60), be = 90 - ga / 2;
      return mk({ verify: () => (() => { const q = triAng(be, be); return near(angAt(q.C, q.A, q.B), ga, 1e-6) && 2 * be + ga === 180; })(), skill: 'trójkąt równoramienny',
        text: t`Trójkąt ${M('ABC')} jest równoramienny, ${M(`${L('AC')} = ${L('BC')}`)}. Kąt ${M('ACB')} między ramionami ma miarę ${M(dg(ga))}. Oblicz miarę kąta ${M('BAC')}.`,
        fields: [FD(M(K('BAC') + ' ='), be)],
        hints: [t`Kąty przy podstawie ${M('AB')} są równe — oznacz każdy z nich przez ${M('x')}.`, t`Suma kątów: ${M(`2x + ${dg(ga)} = 180^\\circ`)}.`],
        steps: [t`Kąty przy podstawie są równe, oznaczmy je przez ${M('x')}: ${M(`2x + ${dg(ga)} = 180^\\circ`)}.`, M(t`2x = ${dg(180 - ga)} \;\Rightarrow\; x = ${dg(be)}`)],
        answer: M(`${K('BAC')} = ${dg(be)}`),
        fig: { P: triAng(be, be), polys: [['A', 'B', 'C']], ticks: [['A', 'C', 1], ['B', 'C', 1]], angs: [{ v: 'A', a: 'B', b: 'C', t: '?', hl: 1, sol: be + '°' }, { v: 'C', a: 'A', b: 'B', t: ga + '°' }] } });
    }
    let a, g; do { a = ri(30, 80); g = ri(30, 80); } while (a + g >= 160 || a + g <= 95 || Math.abs(a - g) < 6);
    const d = a + g, P0 = triAng(a, 180 - d); P0.D = [P0.B[0] + 3.2, 0];
    return mk({ verify: () => near(angAt(P0.C, P0.A, P0.B), g, 1e-6) && near(angAt(P0.B, P0.D, P0.C), d, 1e-6) && near(angAt(P0.A, P0.B, P0.C), a, 1e-6), skill: 'kąt zewnętrzny',
      text: t`Bok ${M('AB')} trójkąta ${M('ABC')} przedłużono poza wierzchołek ${M('B')} do punktu ${M('D')}. Kąt ${M('CBD')} ma miarę ${M(dg(d))}, a kąt ${M('BAC')} ma miarę ${M(dg(a))}. Oblicz miarę kąta ${M('ACB')}.`,
      fields: [FD(M(K('ACB') + ' ='), g)],
      hints: [t`Kąty ${M('ABC')} i ${M('CBD')} są przyległe, więc razem mają ${M(dg(180))}.`, t`Krócej: kąt zewnętrzny trójkąta jest równy sumie dwóch kątów wewnętrznych do niego nieprzyległych.`],
      steps: [t`Kąty przyległe: ${M(t`${K('ABC')} = 180^\circ - ${dg(d)} = ${dg(180 - d)}`)}.`, M(t`${K('ACB')} = 180^\circ - ${dg(a)} - ${dg(180 - d)} = ${dg(g)}`), t`Sprawdzenie: ${M(`${dg(a)} + ${dg(g)} = ${dg(d)}`)} — kąt zewnętrzny.`],
      answer: M(`${K('ACB')} = ${dg(g)}`),
      fig: { P: P0, polys: [['A', 'B', 'C']], segs: [['B', 'D']], angs: [{ v: 'A', a: 'B', b: 'C', t: a + '°' }, { v: 'B', a: 'D', b: 'C', t: d + '°' }, { v: 'C', a: 'A', b: 'B', t: '?', hl: 1, sol: g + '°' }] } });
  },
  function pythagoras() {
    const nm = { a: 'BC', b: 'AC', c: 'AB' }, ends = { a: ['B', 'C'], b: ['C', 'A'], c: ['A', 'B'] };
    let a, b, c, ask;
    if (Math.random() < 0.7) { [a, b, c] = legs(pick(TRIPLES)); ask = Math.random() < 0.55 ? 'c' : pick(['a', 'b']); }
    else if (Math.random() < 0.5) { do { a = ri(1, 9); b = ri(2, 9); } while (isInt(Math.sqrt(a * a + b * b))); c = R(1, a * a + b * b); ask = 'c'; }
    else { do { c = ri(4, 12); a = ri(2, c - 1); } while (isInt(Math.sqrt(c * c - a * a))); b = R(1, c * c - a * a); ask = 'b'; }
    const V = { a, b, c }, known = ['a', 'b', 'c'].filter(k => k !== ask), n2 = k => rv(V[k]) ** 2;
    const given = known.map(k => M(`${L(nm[k])} = ${rt(V[k])}`)).join(' oraz ');
    let steps;
    if (ask === 'c') steps = [M(t`${L('AB')}^2 = ${L('BC')}^2 + ${L('AC')}^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${a * a + b * b}`), M(`${L('AB')} = ${sq(a * a + b * b)}`)];
    else { const o = known.find(k => k !== 'c'), m = Math.round(n2('c') - n2(o)); steps = [M(t`${L(nm[ask])}^2 = ${L('AB')}^2 - ${L(nm[o])}^2 = ${rv(c)}^2 - ${rv(V[o])}^2 = ${Math.round(n2('c'))} - ${Math.round(n2(o))} = ${m}`), M(`${L(nm[ask])} = ${sq(m)}`)]; }
    return mk({ verify: () => near(rv(V.a) ** 2 + rv(V.b) ** 2, rv(V.c) ** 2), skill: 'twierdzenie Pitagorasa',
      text: t`${RIGHT_C}. Dane są ${given}. Oblicz długość ${ask === 'c' ? 'przeciwprostokątnej' : 'przyprostokątnej'} ${M(nm[ask])}.`,
      fields: [F(M(L(nm[ask]) + ' ='), V[ask])],
      hints: [t`Twierdzenie Pitagorasa: ${M(`${L('BC')}^2 + ${L('AC')}^2 = ${L('AB')}^2`)} — przeciwprostokątna leży naprzeciw kąta prostego.`, ask === 'c' ? t`Dodaj kwadraty przyprostokątnych i wyciągnij pierwiastek.` : t`Szukasz przyprostokątnej, więc od kwadratu przeciwprostokątnej odejmij kwadrat drugiej przyprostokątnej.`],
      steps, answer: M(`${L(nm[ask])} = ${rt(V[ask])}`),
      fig: rtFig(rv(a), rv(b), ['a', 'b', 'c'].map(k => (k === ask ? Q(ends[k][0], ends[k][1], V[k]) : Lb(ends[k][0], ends[k][1], V[k])))) });
  },
  function rightAreaPerim() {
    const [a, b, c] = legs(pick(TRIPLES)), Pv = a * b / 2, Ob = a + b + c;
    return mk({ verify: () => (() => { const q = rightTri(a, b); return near(areaP([q.A, q.B, q.C]), Pv) && near(dist(q.A, q.B) + dist(q.B, q.C) + dist(q.C, q.A), Ob); })(), skill: 'pole i obwód',
      text: t`Przyprostokątne trójkąta prostokątnego mają długości ${M(a)} i ${M(b)}. Oblicz pole i obwód tego trójkąta.`,
      fields: [F('pole:', Pv), F('obwód:', Ob)],
      hints: [t`Pole trójkąta prostokątnego to połowa iloczynu przyprostokątnych: ${M(t`P = \tfrac{1}{2}ab`)}.`, t`Do obwodu brakuje przeciwprostokątnej — policz ją z twierdzenia Pitagorasa.`],
      steps: [M(t`P = \tfrac{1}{2}\cdot ${a}\cdot ${b} = ${T(Pv)}`), M(t`c^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c} \;\Rightarrow\; c = ${c}`), M(t`\text{Ob} = ${a} + ${b} + ${c} = ${Ob}`)],
      answer: t`${M(`P = ${T(Pv)}`)}, obwód ${M(Ob)}.`,
      fig: rtFig(a, b, [Lb('B', 'C', a), Lb('C', 'A', b), Lb('A', 'B', 'c', { sol: String(c) })]) });
  },
  function equilateral() {
    const a = 2 * ri(1, 7), h = R(a / 2, 3), Pv = R(a * a / 4, 3), byPerim = Math.random() < 0.35;
    return mk({ verify: () => near(Math.sqrt(a * a - a * a / 4), rv(h)) && near(0.5 * a * a * sin(60), rv(Pv)), skill: 'trójkąt równoboczny',
      text: byPerim ? t`Obwód trójkąta równobocznego jest równy ${M(3 * a)}. Oblicz wysokość i pole tego trójkąta.` : t`Trójkąt równoboczny ma bok długości ${M(a)}. Oblicz wysokość i pole tego trójkąta.`,
      fields: [F(M('h ='), h), F(M('P ='), Pv)],
      hints: [t`Wysokość trójkąta równobocznego o boku ${M('a')}: ${M(t`h = \frac{a\sqrt{3}}{2}`)}.`, t`Pole: ${M(t`P = \frac{a^2\sqrt{3}}{4}`)} (albo ${M(t`P = \tfrac12 a\cdot h`)}).`],
      steps: (byPerim ? [t`Bok: ${M(`a = ${3 * a} : 3 = ${a}`)}.`] : []).concat([
        M(t`h = \frac{a\sqrt{3}}{2} = \frac{${a}\sqrt{3}}{2} = ${rt(h)}`),
        M(t`P = \frac{a^2\sqrt{3}}{4} = \frac{${a * a}\sqrt{3}}{4} = ${rt(Pv)}`)]),
      answer: M(`h = ${rt(h)},\\quad P = ${rt(Pv)}`),
      fig: { P: { A: [0, 0], B: [a, 0], C: [a / 2, a * Math.sqrt(3) / 2], H: [a / 2, 0] }, hide: ['H'], polys: [['A', 'B', 'C']], segs: [['C', 'H', 'd']],
        ticks: [['A', 'B', 1], ['B', 'C', 1], ['C', 'A', 1]], angs: [{ v: 'H', a: 'B', b: 'C', right: 1 }],
        lens: [Lb('C', 'A', byPerim ? 'a' : a, byPerim ? { sol: String(a) } : {}), Q('C', 'H', h, { t: 'h', s: -1, at: 0.45 })] } });
  }
],
2: [
  function special() {
    if (Math.random() < 0.6) {
      const k = ri(2, 9), V = { BC: k, AB: 2 * k, AC: R(k, 3) }, given = pick(['AB', 'BC', 'AC']), ask = ['AB', 'BC', 'AC'].filter(x => x !== given);
      const st = {
        AB: [t`${M('BC')} leży naprzeciw kąta ${M(dg(30))}, więc ${M(t`${L('BC')} = \tfrac12 ${L('AB')} = ${k}`)}.`, t`${M(t`${L('AC')} = ${L('BC')}\cdot\sqrt{3} = ${k}\sqrt{3}`)} (albo z twierdzenia Pitagorasa).`],
        BC: [t`${M('BC')} leży naprzeciw kąta ${M(dg(30))}, więc ${M(t`${L('AB')} = 2\cdot ${L('BC')} = ${2 * k}`)}.`, M(t`${L('AC')} = ${L('BC')}\cdot\sqrt{3} = ${k}\sqrt{3}`)],
        AC: [t`${M(t`${L('AC')} = ${L('BC')}\cdot\sqrt{3}`)}, więc ${M(t`${L('BC')} = \frac{${k}\sqrt{3}}{\sqrt{3}} = ${k}`)}.`, M(t`${L('AB')} = 2\cdot ${L('BC')} = ${2 * k}`)]
      }[given];
      const ends = { BC: ['B', 'C'], AC: ['C', 'A'], AB: ['A', 'B'] };
      return mk({ verify: () => near(rv(V.BC) ** 2 + rv(V.AC) ** 2, rv(V.AB) ** 2) && near(rv(V.BC) / rv(V.AB), sin(30)), skill: 'trójkąt 30°, 60°, 90°',
        text: t`${RIGHT_C}, a kąt ${M('BAC')} ma miarę ${M(dg(30))}. Wiadomo, że ${M(`${L(given)} = ${rt(V[given])}`)}. Oblicz długości dwóch pozostałych boków tego trójkąta.`,
        fields: ask.map(s => F(M(L(s) + ' ='), V[s])),
        hints: [t`W trójkącie o kątach ${M(t`30^\circ, 60^\circ, 90^\circ`)} przyprostokątna leżąca naprzeciw kąta ${M(dg(30))} jest dwa razy krótsza od przeciwprostokątnej.`, t`Druga przyprostokątna jest ${M(t`\sqrt{3}`)} razy dłuższa od krótszej — to połowa trójkąta równobocznego.`],
        steps: st, answer: M(ask.map(s => `${L(s)} = ${rt(V[s])}`).join(',\\quad ')),
        fig: rtFig(k, k * Math.sqrt(3), ['BC', 'AC', 'AB'].map(s => (s === given ? Lb(ends[s][0], ends[s][1], V[s]) : Q(ends[s][0], ends[s][1], V[s]))), [{ v: 'A', a: 'B', b: 'C', t: '30°' }]) });
    }
    if (Math.random() < 0.5) {
      const k = ri(2, 10), c = R(k, 2), Pv = k * k / 2;
      return mk({ verify: () => near(Math.hypot(k, k), rv(c)) && near(areaP([[0, 0], [k, 0], [0, k]]), Pv), skill: 'trójkąt 45°, 45°, 90°',
        text: t`Przyprostokątne ${M('AC')} i ${M('BC')} trójkąta prostokątnego równoramiennego ${M('ABC')} mają długość ${M(k)}. Oblicz długość przeciwprostokątnej i pole tego trójkąta.`,
        fields: [F(M(L('AB') + ' ='), c), F(M('P ='), Pv)],
        hints: [t`Przeciwprostokątna trójkąta prostokątnego równoramiennego jest ${M(t`\sqrt{2}`)} razy dłuższa od przyprostokątnej (to połowa kwadratu).`, t`Pole: połowa iloczynu przyprostokątnych.`],
        steps: [M(t`${L('AB')}^2 = ${k}^2 + ${k}^2 = ${2 * k * k} \;\Rightarrow\; ${L('AB')} = ${sq(2 * k * k)}`), M(t`P = \tfrac12\cdot ${k}\cdot ${k} = ${T(Pv)}`)],
        answer: M(`${L('AB')} = ${rt(c)},\\quad P = ${T(Pv)}`),
        fig: rtFig(k, k, [Lb('B', 'C', k), Lb('C', 'A', k), Q('A', 'B', c)], [{ v: 'A', a: 'B', b: 'C', t: '45°' }], { ticks: [['B', 'C', 1], ['C', 'A', 1]] }) });
    }
    const m = ri(1, 6), c = 2 * m, leg = R(m, 2);
    return mk({ verify: () => near(Math.hypot(rv(leg), rv(leg)), c) && near(rv(leg) ** 2 / 2, m * m), skill: 'trójkąt 45°, 45°, 90°',
      text: t`Przeciwprostokątna trójkąta prostokątnego równoramiennego ma długość ${M(c)}. Oblicz długość przyprostokątnej i pole tego trójkąta.`,
      fields: [F('przyprostokątna:', leg), F(M('P ='), m * m)],
      hints: [t`Jeśli przyprostokątna ma długość ${M('a')}, to przeciwprostokątna ma długość ${M(t`a\sqrt{2}`)}.`, t`Usuń niewymierność z mianownika: ${M(t`\frac{${c}}{\sqrt{2}} = \frac{${c}\sqrt{2}}{2}`)}.`],
      steps: [M(t`a\sqrt{2} = ${c} \;\Rightarrow\; a = \frac{${c}}{\sqrt{2}} = \frac{${c}\sqrt{2}}{2} = ${rt(leg)}`), M(t`P = \tfrac12 a^2 = \tfrac12\cdot ${2 * m * m} = ${m * m}`)],
      answer: t`Przyprostokątna ${M(rt(leg))}, pole ${M(m * m)}.`,
      fig: rtFig(m * Math.SQRT2, m * Math.SQRT2, [Q('B', 'C', leg, { t: 'a' }), Lb('A', 'B', c)], [{ v: 'A', a: 'B', b: 'C', t: '45°' }], { ticks: [['B', 'C', 1], ['C', 'A', 1]] }) });
  },
  function rightTrig() {
    const base = pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17], [7, 24, 25], [24, 7, 25], [20, 21, 29], [21, 20, 29]]);
    if (Math.random() < 0.5) {
      const k = pick([1, 2, 3]), [a, b, c] = base.map(x => x * k);
      return mk({ verify: () => (() => { const al = Math.atan2(a, b); return a * a + b * b === c * c && near(Math.sin(al), a / c) && near(Math.cos(al), b / c) && near(Math.tan(al), a / b); })(), skill: 'sinus, cosinus, tangens',
        text: t`${RIGHT_C}, ${M(`${L('BC')} = ${a}`)} oraz ${M(`${L('AC')} = ${b}`)}. Kąt ${M('BAC')} oznaczamy przez ${M(t`\alpha`)}. Oblicz ${M(t`\sin\alpha`)}, ${M(t`\cos\alpha`)} i ${M(t`\operatorname{tg}\alpha`)}.`,
        fields: [F(M(t`\sin\alpha =`), a / c), F(M(t`\cos\alpha =`), b / c), F(M(t`\operatorname{tg}\alpha =`), a / b)],
        help: 'Wynik wpisz jako ułamek, np. 5/13 — nie musisz go skracać.',
        hints: [t`Najpierw policz przeciwprostokątną ${M('AB')} z twierdzenia Pitagorasa.`, t`${M(t`\sin\alpha`)} = przyprostokątna naprzeciw ${M(t`\alpha`)} / przeciwprostokątna, ${M(t`\cos\alpha`)} = przyprostokątna przy ${M(t`\alpha`)} / przeciwprostokątna, ${M(t`\operatorname{tg}\alpha`)} = naprzeciw / przy.`],
        steps: [M(t`${L('AB')}^2 = ${a}^2 + ${b}^2 = ${a * a + b * b} \;\Rightarrow\; ${L('AB')} = ${c}`),
          M(t`\sin\alpha = \frac{${L('BC')}}{${L('AB')}} = \frac{${a}}{${c}} = ${TF(a / c)}`), M(t`\cos\alpha = \frac{${L('AC')}}{${L('AB')}} = \frac{${b}}{${c}} = ${TF(b / c)}`), M(t`\operatorname{tg}\alpha = \frac{${L('BC')}}{${L('AC')}} = \frac{${a}}{${b}} = ${TF(a / b)}`)],
        answer: M(t`\sin\alpha = ${TF(a / c)},\ \cos\alpha = ${TF(b / c)},\ \operatorname{tg}\alpha = ${TF(a / b)}`),
        fig: rtFig(a, b, [Lb('B', 'C', a), Lb('C', 'A', b), Lb('A', 'B', '?', { hl: 1, sol: String(c) })], [{ v: 'A', a: 'B', b: 'C', t: 'α' }]) });
    }
    const [a0, b0, c0] = base, k = ri(1, 4), V = { BC: a0 * k, AC: b0 * k, AB: c0 * k };
    const fn = pick(['sin', 'cos', 'tg']), [X, Y, p, q] = { sin: ['BC', 'AB', a0, c0], cos: ['AC', 'AB', b0, c0], tg: ['BC', 'AC', a0, b0] }[fn];
    const G = pick([X, Y]), O = G === X ? Y : X, Th = ['BC', 'AC', 'AB'].find(s => s !== X && s !== Y);
    const fnT = fn === 'tg' ? t`\operatorname{tg}` : '\\' + fn;
    const s2 = G === X ? M(t`${L(Y)} = ${L(X)}\cdot\frac{${q}}{${p}} = ${V[X]}\cdot\frac{${q}}{${p}} = ${V[Y]}`) : M(t`${L(X)} = ${L(Y)}\cdot\frac{${p}}{${q}} = ${V[Y]}\cdot\frac{${p}}{${q}} = ${V[X]}`);
    const s3 = Th === 'AB' ? M(t`${L('AB')}^2 = ${V.BC}^2 + ${V.AC}^2 = ${V.AB ** 2} \;\Rightarrow\; ${L('AB')} = ${V.AB}`)
      : M(t`${L(Th)}^2 = ${V.AB}^2 - ${V[Th === 'BC' ? 'AC' : 'BC']}^2 = ${V[Th] ** 2} \;\Rightarrow\; ${L(Th)} = ${V[Th]}`);
    const ends = { BC: ['B', 'C'], AC: ['C', 'A'], AB: ['A', 'B'] };
    return mk({ verify: () => V.BC ** 2 + V.AC ** 2 === V.AB ** 2 && near(fn === 'sin' ? V.BC / V.AB : fn === 'cos' ? V.AC / V.AB : V.BC / V.AC, p / q), skill: 'funkcje trygonometryczne',
      text: t`${RIGHT_C}, a ${M(t`\alpha = ${K('BAC')}`)}. Wiadomo, że ${M(t`${fnT}\alpha = \frac{${p}}{${q}}`)} oraz ${M(`${L(G)} = ${V[G]}`)}. Oblicz długości dwóch pozostałych boków trójkąta.`,
      fields: [O, Th].map(s => F(M(L(s) + ' ='), V[s])),
      hints: [t`Zapisz definicję: ${M(t`${fnT}\alpha = \frac{${L(X)}}{${L(Y)}}`)} i podstaw znany bok.`, t`Trzeci bok policzysz z twierdzenia Pitagorasa.`],
      steps: [t`Z definicji ${M(t`${fnT}\alpha = \frac{${L(X)}}{${L(Y)}} = \frac{${p}}{${q}}`)}.`, s2, s3],
      answer: M([O, Th].map(s => `${L(s)} = ${V[s]}`).join(',\\quad ')),
      fig: rtFig(V.BC, V.AC, ['BC', 'AC', 'AB'].map(s => (s === G ? Lb(ends[s][0], ends[s][1], V[s]) : Q(ends[s][0], ends[s][1], V[s]))), [{ v: 'A', a: 'B', b: 'C', t: 'α' }]) });
  },
  function areaSin() {
    const g = pick([30, 45, 60, 120, 135, 150]), n = { 30: 1, 150: 1, 45: 2, 135: 2, 60: 3, 120: 3 }[g];
    const a = ri(3, 12), b = ri(4, 14), sv = R(1 / 2, n), Pv = R(a * b / 4, n);
    return mk({ verify: () => near(areaP([[0, 0], [b, 0], [a * cos(g), a * sin(g)]]), rv(Pv)), skill: 'pole z sinusem',
      text: t`W trójkącie ${M('ABC')} dane są ${M(`${L('AC')} = ${b}`)}, ${M(`${L('BC')} = ${a}`)} oraz ${M(`${K('ACB')} = ${dg(g)}`)}. Oblicz pole tego trójkąta.`,
      fields: [F(M('P ='), Pv)],
      hints: [t`Gdy znasz dwa boki i kąt między nimi: ${M(t`P = \tfrac12\cdot a\cdot b\cdot\sin\gamma`)}.`,
        g > 90 ? t`Dla kąta rozwartego: ${M(t`\sin(180^\circ - \gamma) = \sin\gamma`)}, np. ${M(t`\sin 120^\circ = \sin 60^\circ`)}.` : t`${M(t`\sin 30^\circ = \tfrac12`)}, ${M(t`\sin 45^\circ = \tfrac{\sqrt2}{2}`)}, ${M(t`\sin 60^\circ = \tfrac{\sqrt3}{2}`)}.`],
      steps: [g > 90 ? M(t`\sin ${dg(g)} = \sin(180^\circ - ${dg(g)}) = \sin ${dg(180 - g)} = ${rt(sv)}`) : M(t`\sin ${dg(g)} = ${rt(sv)}`),
        M(t`P = \tfrac12\cdot ${b}\cdot ${a}\cdot ${rt(sv)} = ${rt(Pv)}`)],
      answer: M(`P = ${rt(Pv)}`),
      fig: { P: { C: [0, 0], A: [b, 0], B: [a * cos(g), a * sin(g)] }, polys: [['A', 'B', 'C']], lens: [Lb('C', 'A', b), Lb('C', 'B', a)], angs: [{ v: 'C', a: 'A', b: 'B', t: g + '°' }] } });
  },
  function triangleType() {
    const kind = ri(0, 3); let s;
    if (kind === 1) s = pick(TRIPLES).slice();
    else for (;;) {
      s = [ri(2, 14), ri(2, 14), ri(3, 18)].sort((x, y) => x - y);
      const [a, b, c] = s, d = a * a + b * b - c * c;
      if (kind === 0 && a + b > c && d > 0 && !(a === b && b === c)) break;
      if (kind === 2 && a + b > c && d < 0) break;
      if (kind === 3 && a + b <= c) break;
    }
    const [a, b, c] = s, sum = a * a + b * b, rel = sum > c * c ? '>' : sum === c * c ? '=' : '<';
    const NAMES = ['ostrokątny', 'prostokątny', 'rozwartokątny', 'taki trójkąt nie istnieje'];
    const steps = [t`Najdłuższy odcinek ma długość ${M(c)}. Nierówność trójkąta: ${M(`${a} + ${b} = ${a + b} ${a + b > c ? '>' : t`\leq`} ${c}`)}.`];
    if (kind === 3) steps.push(t`Suma dwóch krótszych odcinków nie jest większa od najdłuższego, więc trójkąt o takich bokach nie istnieje.`);
    else steps.push(M(t`${c}^2 = ${c * c},\qquad ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${sum}`),
      t`${M(`${a}^2 + ${b}^2 ${rel} ${c}^2`)}, więc trójkąt jest ${NAMES[kind]}${kind === 1 ? ' (twierdzenie odwrotne do twierdzenia Pitagorasa)' : ''}. Z twierdzenia cosinusów ${M(t`\cos\gamma = \frac{a^2 + b^2 - c^2}{2ab}`)} ma znak ${kind === 0 ? 'dodatni' : kind === 1 ? 'zerowy' : 'ujemny'}.`);
    return mk({ verify: () => (() => { if (a + b <= c) return kind === 3; const cg = (a * a + b * b - c * c) / (2 * a * b); return c >= a && c >= b && kind === (Math.abs(cg) < 1e-12 ? 1 : cg > 0 ? 0 : 2); })(), skill: 'rodzaj trójkąta',
      text: t`Odcinki o długościach ${M(shuffle(s).join(',\\ '))} mają być bokami trójkąta. Rozstrzygnij, czy taki trójkąt istnieje, a jeśli tak — jaki to trójkąt.`,
      choices: NAMES.map(x => x.replace(/^\w/, ch => ch.toUpperCase())), ans: kind,
      hints: [t`Najpierw nierówność trójkąta: suma dwóch krótszych boków musi być większa od najdłuższego.`, t`Potem porównaj kwadrat najdłuższego boku z sumą kwadratów pozostałych: suma większa → ostrokątny, równa → prostokątny, mniejsza → rozwartokątny.`],
      steps, answer: kind === 3 ? 'Taki trójkąt nie istnieje.' : `Trójkąt jest ${NAMES[kind]}.` });
  }
],
3: [
  function rightCircles() {
    const [a, b, c] = legs(pick([[3, 4, 5], [6, 8, 10], [8, 15, 17], [9, 12, 15], [12, 16, 20], [20, 21, 29], [15, 20, 25]]));
    const Rr = c / 2, r = (a + b - c) / 2, P0 = rightTri(a, b), Pv = a * b / 2, p = (a + b + c) / 2;
    P0._O = mid(P0.A, P0.B); P0._I = [r, r]; P0._T = [r, 0];
    return mk({ verify: () => (() => { const q = rightTri(a, b), O = mid(q.A, q.B), dI = Math.abs(a * r + b * r - a * b) / Math.hypot(a, b); return near(dist(O, q.C), Rr) && near(dist(O, q.A), Rr) && near(dI, r); })(), skill: 'okrąg wpisany i opisany',
      text: t`Przyprostokątne trójkąta prostokątnego ${M('ABC')} mają długości ${M(`${L('BC')} = ${a}`)} i ${M(`${L('AC')} = ${b}`)}. Oblicz promień ${M('R')} okręgu opisanego na tym trójkącie i promień ${M('r')} okręgu wpisanego w ten trójkąt.`,
      fields: [F(M('R ='), Rr), F(M('r ='), r)],
      hints: [t`Środek okręgu opisanego na trójkącie prostokątnym leży w środku przeciwprostokątnej, więc ${M(t`R = \frac{c}{2}`)}.`, t`Promień okręgu wpisanego w trójkąt prostokątny: ${M(t`r = \frac{a + b - c}{2}`)} (albo ${M(t`r = \frac{P}{p}`)}, gdzie ${M('p')} to połowa obwodu).`],
      steps: [M(t`c = \sqrt{${a}^2 + ${b}^2} = \sqrt{${c * c}} = ${c}`), M(t`R = \frac{c}{2} = \frac{${c}}{2} = ${T(Rr)}`), M(t`r = \frac{a + b - c}{2} = \frac{${a} + ${b} - ${c}}{2} = ${T(r)}`),
        t`Sprawdzenie: ${M(t`P = \tfrac12\cdot ${a}\cdot ${b} = ${T(Pv)}`)}, ${M(t`p = \frac{${a} + ${b} + ${c}}{2} = ${T(p)}`)}, ${M(t`r = \frac{P}{p} = ${T(r)}`)}.`],
      answer: M(`R = ${T(Rr)},\\quad r = ${T(r)}`),
      fig: { P: P0, polys: [['A', 'B', 'C']], circles: [{ c: '_O', r: Rr, d: 1 }, { c: '_I', r }], segs: [['_O', 'C', 'h'], ['_I', '_T', 'h']], dots: ['_O', '_I'],
        angs: [{ v: 'C', a: 'A', b: 'B', right: 1 }], lens: [Lb('B', 'C', a), Lb('C', 'A', b, { at: 0.62 }), { a: '_O', b: 'C', t: 'R', hl: 1, sol: 'R = ' + txt(Rr), at: 0.45 }, { a: '_I', b: '_T', t: 'r', hl: 1, sol: 'r = ' + txt(r), s: -1 }] } });
  },
  function equiCircles() {
    const v = ri(1, 3), k = ri(1, 5);
    const val = v === 3 ? { a: 6 * k, h: R(3 * k, 3), r: R(k, 3), R: R(2 * k, 3) } : { a: R(2 * k, 3), h: 3 * k, r: k, R: 2 * k };
    const cfg = {
      1: { text: t`Wysokość trójkąta równobocznego ma długość ${M(3 * k)}. Oblicz długość boku tego trójkąta oraz promień okręgu wpisanego w ten trójkąt.`, ask: ['a', 'r'],
        steps: [t`Środek okręgu wpisanego dzieli wysokość w stosunku ${M('2 : 1')}, więc ${M(t`r = \tfrac13 h = \tfrac13\cdot ${3 * k} = ${k}`)}.`, M(t`h = \frac{a\sqrt3}{2} \;\Rightarrow\; a = \frac{2h}{\sqrt3} = \frac{2h\sqrt3}{3} = \frac{${6 * k}\sqrt3}{3} = ${rt(val.a)}`)] },
      2: { text: t`Promień okręgu opisanego na trójkącie równobocznym ma długość ${M(2 * k)}. Oblicz promień okręgu wpisanego w ten trójkąt oraz długość boku trójkąta.`, ask: ['r', 'a'],
        steps: [M(t`R = \tfrac23 h \;\Rightarrow\; h = \tfrac32 R = ${3 * k}`), M(t`r = \tfrac13 h = ${k}`), M(t`a = \frac{2h}{\sqrt3} = \frac{${6 * k}\sqrt3}{3} = ${rt(val.a)}`)] },
      3: { text: t`Trójkąt równoboczny ma bok długości ${M(6 * k)}. Oblicz promień okręgu wpisanego w ten trójkąt i promień okręgu opisanego na nim.`, ask: ['r', 'R'],
        steps: [M(t`h = \frac{a\sqrt3}{2} = \frac{${6 * k}\sqrt3}{2} = ${rt(val.h)}`), M(t`r = \tfrac13 h = ${rt(val.r)}`), M(t`R = \tfrac23 h = ${rt(val.R)}`)] }
    }[v];
    const sq3 = Math.sqrt(3), P0 = { A: [0, 0], B: [6, 0], C: [3, 3 * sq3], S: [3, sq3], _H: [3, 0] };
    const given = { 1: 'h', 2: 'R', 3: 'a' }[v];
    const lb = (key, a, b, o) => (cfg.ask.includes(key) ? Q(a, b, val[key], Object.assign({ t: key }, o)) : key === given ? Lb(a, b, val[key], o) : null);
    return mk({ verify: () => (() => { const A1 = rv(val.a), h1 = rv(val.h); return near(h1, A1 * Math.sqrt(3) / 2) && near(rv(val.r), A1 / (2 * Math.sqrt(3))) && near(rv(val.R), A1 / Math.sqrt(3)) && near(rv(val.r) + rv(val.R), h1); })(), skill: 'punkty szczególne trójkąta',
      text: cfg.text, fields: cfg.ask.map(key => F(M(key + ' ='), val[key])),
      hints: [t`W trójkącie równobocznym środki okręgów wpisanego i opisanego pokrywają się ze środkiem ciężkości, który dzieli każdą wysokość w stosunku ${M('2 : 1')}.`, t`Zatem ${M(t`r = \tfrac13 h`)}, ${M(t`R = \tfrac23 h`)}, a ${M(t`h = \frac{a\sqrt3}{2}`)}.`],
      steps: cfg.steps, answer: M(cfg.ask.map(key => `${key} = ${rt(val[key])}`).join(',\\quad ')),
      fig: { P: P0, hide: ['S'], polys: [['A', 'B', 'C']], circles: [{ c: 'S', r: sq3 }, { c: 'S', r: 2 * sq3, d: 1 }], segs: [['C', '_H', 'd'], ['S', 'A', 'h']], dots: ['S'],
        angs: [{ v: '_H', a: 'B', b: 'C', right: 1 }],
        lens: [lb('a', 'B', 'C'), lb('r', 'S', '_H', { s: -1 }), lb('R', 'S', 'A'), lb('h', 'C', '_H', { s: 1, at: 0.3 })].filter(Boolean) } });
  },
  function altitudeHyp() {
    const k = pick([2, 4, 5, 10]), sw = Math.random() < 0.5, b = (sw ? 3 : 4) * k, a = (sw ? 4 : 3) * k, c = 5 * k;
    const h = a * b / c, AD = b * b / c, DB = a * a / c;
    return mk({ verify: () => near(Math.hypot(AD, h), b) && near(Math.hypot(c - AD, h), a) && near(AD + DB, c), skill: 'wysokość na przeciwprostokątną',
      text: t`${RIGHT_C}, ${M(`${L('AC')} = ${b}`)} i ${M(`${L('BC')} = ${a}`)}. Odcinek ${M('CD')} jest wysokością tego trójkąta. Oblicz ${M(L('CD'))} oraz długości odcinków ${M('AD')} i ${M('DB')}, na które spodek wysokości dzieli przeciwprostokątną.`,
      fields: [F(M(L('CD') + ' ='), h), F(M(L('AD') + ' ='), AD), F(M(L('DB') + ' ='), DB)],
      hints: [t`Policz ${M(L('AB'))}, a potem pole na dwa sposoby: ${M(t`\tfrac12\cdot ${L('AC')}\cdot ${L('BC')} = \tfrac12\cdot ${L('AB')}\cdot ${L('CD')}`)}.`, t`Trójkąty ${M('ADC')} i ${M('ACB')} są podobne (wspólny kąt przy ${M('A')} i kąty proste), więc ${M(t`\frac{${L('AD')}}{${L('AC')}} = \frac{${L('AC')}}{${L('AB')}}`)}.`],
      steps: [M(t`${L('AB')} = \sqrt{${b}^2 + ${a}^2} = \sqrt{${c * c}} = ${c}`), M(t`${L('CD')} = \frac{${L('AC')}\cdot ${L('BC')}}{${L('AB')}} = \frac{${b}\cdot ${a}}{${c}} = ${T(h)}`),
        M(t`${L('AD')} = \frac{${L('AC')}^2}{${L('AB')}} = \frac{${b * b}}{${c}} = ${T(AD)}`), M(t`${L('DB')} = ${L('AB')} - ${L('AD')} = ${c} - ${T(AD)} = ${T(DB)}`)],
      answer: M(`${L('CD')} = ${T(h)},\\ ${L('AD')} = ${T(AD)},\\ ${L('DB')} = ${T(DB)}`),
      fig: { P: { A: [0, 0], B: [c, 0], D: [AD, 0], C: [AD, h] }, polys: [['A', 'B', 'C']], segs: [['C', 'D', 'h']],
        angs: [{ v: 'C', a: 'A', b: 'B', right: 1 }, { v: 'D', a: 'B', b: 'C', right: 1 }],
        lens: [Lb('A', 'C', b), Lb('C', 'B', a), Q('C', 'D', h, { t: 'h', s: -1 }), Q('A', 'D', AD, { t: 'x' }), Q('D', 'B', DB, { t: 'y' })] } });
  },
  function cosLaw() {
    const T60 = [[3, 8, 7], [5, 8, 7], [7, 15, 13], [8, 15, 13], [5, 21, 19], [16, 21, 19], [6, 16, 14], [10, 16, 14]], T120 = [[3, 5, 7], [7, 8, 13], [5, 16, 19], [6, 10, 14], [9, 15, 21]];
    const g = pick([60, 120]), cv = g === 60 ? t`\tfrac12` : t`-\tfrac12`;
    if (Math.random() < 0.6) {
      let a, b; if (Math.random() < 0.75) [a, b] = shuffle(pick(g === 60 ? T60 : T120).slice(0, 2)); else { a = ri(2, 9); b = ri(2, 9); }
      const c2 = a * a + b * b + (g === 60 ? -a * b : a * b), c = R(1, c2);
      return mk({ verify: () => near(dist([b, 0], [a * cos(g), a * sin(g)]), rv(c)), skill: 'twierdzenie cosinusów',
        text: t`W trójkącie ${M('ABC')} dane są ${M(`${L('AC')} = ${b}`)}, ${M(`${L('BC')} = ${a}`)} oraz ${M(`${K('ACB')} = ${dg(g)}`)}. Oblicz długość boku ${M('AB')}.`,
        fields: [F(M(L('AB') + ' ='), c)],
        hints: [t`Znasz dwa boki i kąt między nimi — użyj twierdzenia cosinusów: ${M(t`c^2 = a^2 + b^2 - 2ab\cos\gamma`)}.`, t`${M(t`\cos 60^\circ = \tfrac12`)}, ${M(t`\cos 120^\circ = -\tfrac12`)}.`],
        steps: [M(t`${L('AB')}^2 = ${b}^2 + ${a}^2 - 2\cdot ${b}\cdot ${a}\cdot\cos ${dg(g)} = ${b * b} + ${a * a} - ${2 * a * b}\cdot\left(${cv}\right) = ${c2}`), M(`${L('AB')} = ${sq(c2)}`)],
        answer: M(`${L('AB')} = ${rt(c)}`),
        fig: { P: { C: [0, 0], A: [b, 0], B: [a * cos(g), a * sin(g)] }, polys: [['A', 'B', 'C']], lens: [Lb('C', 'A', b), Lb('C', 'B', a), Q('A', 'B', c)], angs: [{ v: 'C', a: 'A', b: 'B', t: g + '°' }] } });
    }
    const [a, b, c] = pick(g === 60 ? T60 : T120), num = a * a + b * b - c * c;
    return mk({ skill: 'twierdzenie cosinusów',
      text: t`Boki trójkąta mają długości ${M(a)}, ${M(b)} i ${M(c)}. Oblicz miarę kąta leżącego naprzeciw boku o długości ${M(c)}.`,
      fields: [F(M(t`\gamma =`), g, { unit: '°' })],
      hints: [t`Wstaw boki do twierdzenia cosinusów ${M(t`c^2 = a^2 + b^2 - 2ab\cos\gamma`)} i wyznacz ${M(t`\cos\gamma`)}.`, t`${M(t`\cos\gamma = \tfrac12`)} dla ${M(dg(60))}, ${M(t`\cos\gamma = -\tfrac12`)} dla ${M(dg(120))}.`],
      steps: [M(t`${c}^2 = ${a}^2 + ${b}^2 - 2\cdot ${a}\cdot ${b}\cdot\cos\gamma`), M(t`\cos\gamma = \frac{${a * a} + ${b * b} - ${c * c}}{${2 * a * b}} = \frac{${num}}{${2 * a * b}} = ${cv}`), M(`\\gamma = ${dg(g)}`)],
      answer: M(`\\gamma = ${dg(g)}`),
      fig: { P: { C: [0, 0], A: [b, 0], B: [a * cos(g), a * sin(g)] }, polys: [['A', 'B', 'C']], lens: [Lb('C', 'A', b), Lb('C', 'B', a), Lb('A', 'B', c)], angs: [{ v: 'C', a: 'A', b: 'B', t: 'γ', hl: 1, sol: g + '°' }] },
      verify: () => near(num / (2 * a * b), g === 60 ? 0.5 : -0.5) });
  }
]
};

/* ---------- CZWOROKĄTY I WIELOKĄTY ---------- */
const rectP = (w, h) => ({ A: [0, 0], B: [w, 0], C: [w, h], D: [0, h] });
function rhombP(p, q) { return { A: [-p, 0], B: [0, -q], C: [p, 0], D: [0, q], _S: [0, 0] }; }
function regPoly(n, r = 3, names) { const P0 = {}; for (let i = 0; i < n; i++) P0[names ? names[i] : '_P' + i] = onC([0, 0], r, (names ? 180 : 90) + 360 * i / n * (names ? 1 : -1)); return P0; }
const GC = {
1: [
  function rectSquare() {
    const v = ri(1, 3);
    if (v === 1) {
      const tr = pick(TRIPLES), w = tr[1], hh = tr[0], d = tr[2];
      return mk({ verify: () => near(Math.hypot(w, hh), d) && near(areaP([[0, 0], [w, 0], [w, hh], [0, hh]]), w * hh), skill: 'prostokąt',
        text: t`Boki prostokąta ${M('ABCD')} mają długości ${M(w)} i ${M(hh)}. Oblicz długość przekątnej i pole tego prostokąta.`,
        fields: [F('przekątna:', d), F('pole:', w * hh)],
        hints: [t`Przekątna dzieli prostokąt na dwa trójkąty prostokątne — użyj twierdzenia Pitagorasa.`, t`Pole prostokąta: ${M(t`P = a\cdot b`)}.`],
        steps: [M(t`d^2 = ${w}^2 + ${hh}^2 = ${w * w} + ${hh * hh} = ${d * d} \;\Rightarrow\; d = ${d}`), M(t`P = ${w}\cdot ${hh} = ${w * hh}`)],
        answer: M(`d = ${d},\\quad P = ${w * hh}`),
        fig: { P: rectP(w, hh), polys: [['A', 'B', 'C', 'D']], segs: [['A', 'C', 'h']], lens: [Lb('A', 'B', w), Lb('B', 'C', hh), Q('A', 'C', d, { t: 'd' })] } });
    }
    if (v === 2) {
      const a = ri(2, 12), d = R(a, 2);
      return mk({ verify: () => near(Math.hypot(a, a), rv(d)), skill: 'kwadrat',
        text: t`Kwadrat ${M('ABCD')} ma bok długości ${M(a)}. Oblicz długość przekątnej i pole tego kwadratu.`,
        fields: [F('przekątna:', d), F('pole:', a * a)],
        hints: [t`Przekątna kwadratu o boku ${M('a')} ma długość ${M(t`a\sqrt{2}`)} (z twierdzenia Pitagorasa: ${M('a^2 + a^2 = 2a^2')}).`, t`Pole kwadratu to ${M('a^2')}. W wyniku zostaw ${M(t`\sqrt{2}`)} – nie zamieniaj go na przybliżenie.`],
        steps: [M(t`d = a\sqrt{2} = ${rt(d)}`), M(t`P = a^2 = ${a}^2 = ${a * a}`)],
        answer: M(`d = ${rt(d)},\\quad P = ${a * a}`),
        fig: { P: rectP(a, a), polys: [['A', 'B', 'C', 'D']], segs: [['A', 'C', 'h']], lens: [Lb('A', 'B', a), Q('A', 'C', d, { t: 'd' })], angs: [{ v: 'B', a: 'C', b: 'A', right: 1 }] } });
    }
    let dS, a, steps;
    if (Math.random() < 0.5) { const k = ri(2, 10); dS = R(k, 2); a = k; steps = [M(t`a\sqrt{2} = ${k}\sqrt{2} \;\Rightarrow\; a = ${k}`), M(t`P = a^2 = ${k * k}`)]; }
    else { const m = ri(1, 7); dS = 2 * m; a = R(m, 2); steps = [M(t`a\sqrt{2} = ${2 * m} \;\Rightarrow\; a = \frac{${2 * m}}{\sqrt{2}} = \frac{${2 * m}\sqrt{2}}{2} = ${rt(a)}`), t`${M(t`P = a^2 = ${2 * m * m}`)} (albo ${M(t`P = \frac{d^2}{2} = \frac{${4 * m * m}}{2} = ${2 * m * m}`)}).`]; }
    const av = rv(a);
    return mk({ verify: () => near(av * Math.SQRT2, rv(dS)) && near(rv(dS) ** 2 / 2, av * av), skill: 'kwadrat',
      text: t`Przekątna kwadratu ma długość ${M(rt(dS))}. Oblicz długość boku i pole tego kwadratu.`,
      fields: [F('bok:', a), F('pole:', av * av)],
      hints: [t`Przekątna kwadratu o boku ${M('a')} ma długość ${M(t`a\sqrt{2}`)}, więc ${M(t`a = \frac{d}{\sqrt2}`)}.`, t`Pole kwadratu możesz też policzyć jako ${M(t`\frac{d^2}{2}`)} — kwadrat jest rombem.`],
      steps, answer: M(`a = ${rt(a)},\\quad P = ${T(av * av)}`),
      fig: { P: rectP(av, av), polys: [['A', 'B', 'C', 'D']], segs: [['A', 'C', 'h']], lens: [Q('A', 'B', a, { t: 'a' }), Lb('A', 'C', dS, { s: -1 })], angs: [{ v: 'B', a: 'C', b: 'A', right: 1 }] } });
  },
  function rhombDiag() {
    const [p, q, s] = pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [8, 15, 17], [9, 12, 15], [12, 9, 15]]);
    const e = 2 * p, f = 2 * q, Pv = e * f / 2;
    return mk({ verify: () => near(Math.hypot(e / 2, f / 2), s) && near(areaP([[-p, 0], [0, -q], [p, 0], [0, q]]), Pv), skill: 'romb',
      text: t`Przekątne rombu ${M('ABCD')} mają długości ${M(`${L('AC')} = ${e}`)} i ${M(`${L('BD')} = ${f}`)}. Oblicz pole tego rombu i długość jego boku.`,
      fields: [F('pole:', Pv), F('bok:', s)],
      hints: [t`Pole rombu to połowa iloczynu przekątnych: ${M(t`P = \frac{e\cdot f}{2}`)}.`, t`Przekątne rombu są prostopadłe i dzielą się na połowy — bok jest przeciwprostokątną trójkąta o przyprostokątnych ${M(p)} i ${M(q)}.`],
      steps: [M(t`P = \frac{${e}\cdot ${f}}{2} = ${Pv}`), M(t`a^2 = ${p}^2 + ${q}^2 = ${p * p} + ${q * q} = ${s * s} \;\Rightarrow\; a = ${s}`)],
      answer: t`Pole ${M(Pv)}, bok ${M(s)}.`,
      fig: { P: rhombP(p, q), polys: [['A', 'B', 'C', 'D']], segs: [['A', 'C', 'd'], ['B', 'D', 'd']], angs: [{ v: '_S', a: 'C', b: 'D', right: 1 }],
        lens: [Lb('A', 'C', e, { at: 0.25, s: 1 }), Lb('B', 'D', f, { at: 0.78, s: -1 }), Q('D', 'C', s, { t: 'a' })] } });
  },
  function trapezoidArea() {
    const a = ri(8, 20), b = ri(3, a - 3), h = ri(3, 12), Pv = (a + b) * h / 2, dx = (a - b) * (0.25 + Math.random() * 0.35);
    const fig = (hl) => ({ P: { A: [0, 0], B: [a, 0], C: [dx + b, h], D: [dx, h], _H: [dx, 0] }, polys: [['A', 'B', 'C', 'D']], segs: [['D', '_H', 'd']], angs: [{ v: '_H', a: 'B', b: 'D', right: 1 }],
      lens: [Lb('A', 'B', a), Lb('D', 'C', b), hl ? Q('D', '_H', h, { t: 'h', s: 1 }) : Lb('D', '_H', h, { s: 1 })], par: [['A', 'B'], ['D', 'C']] });
    if (Math.random() < 0.6) return mk({ verify: () => near(areaP([[0, 0], [a, 0], [dx + b, h], [dx, h]]), Pv), skill: 'pole trapezu',
      text: t`Podstawy trapezu ${M('ABCD')} mają długości ${M(a)} i ${M(b)}, a wysokość trapezu jest równa ${M(h)}. Oblicz pole tego trapezu.`,
      fields: [F('pole:', Pv)],
      hints: [t`Pole trapezu: ${M(t`P = \frac{a + b}{2}\cdot h`)} — średnia arytmetyczna podstaw razy wysokość.`, t`Najpierw dodaj długości podstaw i podziel przez ${M(2)}, potem pomnóż przez wysokość.`],
      steps: [M(t`P = \frac{${a} + ${b}}{2}\cdot ${h} = \frac{${a + b}}{2}\cdot ${h} = ${T(Pv)}`)],
      answer: M(`P = ${T(Pv)}`), fig: fig(false) });
    return mk({ verify: () => near(areaP([[0, 0], [a, 0], [dx + b, h], [dx, h]]), Pv), skill: 'pole trapezu',
      text: t`Pole trapezu jest równe ${M(T(Pv))}, a jego podstawy mają długości ${M(a)} i ${M(b)}. Oblicz wysokość tego trapezu.`,
      fields: [F(M('h ='), h)],
      hints: [t`Wstaw dane do wzoru ${M(t`P = \frac{a + b}{2}\cdot h`)} i wyznacz ${M('h')}.`, t`Średnia podstaw to zwykła liczba – podziel przez nią pole, a dostaniesz wysokość.`],
      steps: [M(t`${T(Pv)} = \frac{${a} + ${b}}{2}\cdot h = ${T((a + b) / 2)}\cdot h`), M(t`h = \frac{${T(Pv)}}{${T((a + b) / 2)}} = ${h}`)],
      answer: M(`h = ${h}`), fig: fig(true) });
  },
  function polygonAngles() {
    const v = ri(1, 4);
    if (v <= 2) {
      let al, ob, text, steps, hints;
      if (v === 1) {
        const d = 2 * ri(5, 40); al = (180 - d) / 2; ob = (180 + d) / 2;
        text = t`Jeden z kątów równoległoboku jest o ${M(dg(d))} większy od drugiego. Oblicz miary kątów tego równoległoboku.`;
        hints = [t`Kąty leżące przy tym samym boku równoległoboku sumują się do ${M(dg(180))}.`, t`Oznacz mniejszy kąt przez ${M('x')} — większy to ${M(`x + ${dg(d)}`)}.`];
        steps = [M(t`x + (x + ${dg(d)}) = 180^\circ \;\Rightarrow\; 2x = ${dg(180 - d)} \;\Rightarrow\; x = ${dg(al)}`), t`Drugi kąt: ${M(`${dg(al)} + ${dg(d)} = ${dg(ob)}`)}.`];
      } else {
        const kk = pick([2, 3, 4, 5, 8]), word = { 2: 'dwa', 3: 'trzy', 4: 'cztery', 5: 'pięć', 8: 'osiem' }[kk]; al = 180 / (kk + 1); ob = 180 - al;
        text = t`W równoległoboku jeden z kątów jest ${word} razy większy od sąsiedniego kąta. Oblicz miary kątów tego równoległoboku.`;
        hints = [t`Kąty leżące przy tym samym boku równoległoboku sumują się do ${M(dg(180))}.`, t`Oznacz mniejszy kąt przez ${M('x')} — większy to ${M(`${kk}x`)}.`];
        steps = [M(t`x + ${kk}x = 180^\circ \;\Rightarrow\; ${kk + 1}x = 180^\circ \;\Rightarrow\; x = ${dg(al)}`), t`Drugi kąt: ${M(t`${kk}\cdot ${dg(al)} = ${dg(ob)}`)}.`];
      }
      const P0 = { A: [0, 0], B: [6, 0], D: [3.4 * cos(al), 3.4 * sin(al)] }; P0.C = add(P0.B, P0.D);
      return mk({ verify: () => near(al + ob, 180) && al < ob && near(angAt(P0.A, P0.B, P0.D), al, 1e-6) && near(angAt(P0.B, P0.C, P0.A), ob, 1e-6), skill: 'kąty równoległoboku', text, hints, steps,
        fields: [FD('kąt ostry:', al), FD('kąt rozwarty:', ob)], answer: t`Kąty mają miary ${M(dg(al))} i ${M(dg(ob))}.`,
        fig: { P: P0, polys: [['A', 'B', 'C', 'D']], angs: [{ v: 'A', a: 'B', b: 'D', t: 'α', hl: 1, sol: al + '°' }, { v: 'B', a: 'C', b: 'A', t: 'β', hl: 1, sol: ob + '°' }] } });
    }
    if (v === 3) {
      const n = pick([5, 6, 8, 9, 10, 12]), nm = { 5: 'pięciokąta', 6: 'sześciokąta', 8: 'ośmiokąta', 9: 'dziewięciokąta', 10: 'dziesięciokąta', 12: 'dwunastokąta' }[n];
      const sum = (n - 2) * 180, ang = sum / n;
      return mk({ verify: () => (() => { const q = regPoly(n); return near(angAt(q._P0, q._P1, q['_P' + (n - 1)]), ang, 1e-6) && near(ang * n, sum); })(), skill: 'kąty wielokąta',
        text: t`Oblicz sumę miar kątów wewnętrznych ${nm} foremnego oraz miarę jednego jego kąta wewnętrznego.`,
        fields: [FD('suma kątów:', sum), FD('jeden kąt:', ang)],
        hints: [t`Suma kątów wewnętrznych ${M('n')}-kąta wypukłego: ${M(t`(n-2)\cdot 180^\circ`)}.`, t`W wielokącie foremnym wszystkie kąty są równe — podziel sumę przez ${M('n')}.`],
        steps: [M(t`S = (${n} - 2)\cdot 180^\circ = ${dg(sum)}`), M(t`\text{jeden kąt} = \frac{${dg(sum)}}{${n}} = ${dg(ang)}`)],
        answer: t`Suma ${M(dg(sum))}, jeden kąt ${M(dg(ang))}.`,
        fig: { P: regPoly(n), polys: [Array.from({ length: n }, (_, i) => '_P' + i)], angs: [{ v: '_P0', a: '_P1', b: '_P' + (n - 1), t: '?', hl: 1, sol: ang + '°' }] } });
    }
    let a, b; do { a = ri(40, 85); b = ri(40, 85); } while (Math.abs(a - b) < 6);
    const P0 = { A: [0, 0], B: [8, 0], D: [3 / Math.tan(rad(a)), 3], C: [8 - 3 / Math.tan(rad(b)), 3] };
    return mk({ verify: () => near(angAt(P0.D, P0.A, P0.C), 180 - a, 1e-6) && near(angAt(P0.C, P0.D, P0.B), 180 - b, 1e-6), skill: 'kąty trapezu',
      text: t`W trapezie ${M('ABCD')} podstawy ${M('AB')} i ${M('CD')} są równoległe, ${M(`${K('DAB')} = ${dg(a)}`)} oraz ${M(`${K('ABC')} = ${dg(b)}`)}. Oblicz miary kątów ${M('ADC')} i ${M('BCD')}.`,
      fields: [FD(M(K('ADC') + ' ='), 180 - a), FD(M(K('BCD') + ' ='), 180 - b)],
      hints: [t`Kąty przy tym samym ramieniu trapezu sumują się do ${M(dg(180))} — to kąty jednostronne przy prostych równoległych.`, t`Przy każdym ramieniu leży jeden kąt ostry i jeden rozwarty. Odejmij znany kąt od ${M(dg(180))}.`],
      steps: [M(t`${K('ADC')} = 180^\circ - ${dg(a)} = ${dg(180 - a)}`), M(t`${K('BCD')} = 180^\circ - ${dg(b)} = ${dg(180 - b)}`)],
      answer: M(`${K('ADC')} = ${dg(180 - a)},\\quad ${K('BCD')} = ${dg(180 - b)}`),
      fig: { P: P0, polys: [['A', 'B', 'C', 'D']], par: [['A', 'B'], ['D', 'C']], angs: [{ v: 'A', a: 'B', b: 'D', t: a + '°' }, { v: 'B', a: 'C', b: 'A', t: b + '°' }, { v: 'D', a: 'A', b: 'C', t: '?', hl: 1, sol: (180 - a) + '°' }, { v: 'C', a: 'D', b: 'B', t: '?', hl: 1, sol: (180 - b) + '°' }] } });
  }
],
2: [
  function isoTrapezoid() {
    const [x, h, c] = pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [9, 12, 15], [8, 15, 17]]);
    const b = ri(3, 12), a = b + 2 * x, Pv = (a + b) / 2 * h;
    return mk({ verify: () => near(dist([0, 0], [x, h]), c) && near(dist([a, 0], [x + b, h]), c) && near(areaP([[0, 0], [a, 0], [x + b, h], [x, h]]), Pv), skill: 'trapez równoramienny',
      text: t`Trapez równoramienny ${M('ABCD')} ma podstawy ${M(`${L('AB')} = ${a}`)} i ${M(`${L('CD')} = ${b}`)} oraz ramiona długości ${M(c)}. Oblicz wysokość i pole tego trapezu.`,
      fields: [F(M('h ='), h), F('pole:', Pv)],
      hints: [t`Poprowadź wysokości z wierzchołków ${M('D')} i ${M('C')}. Odcinają one na dłuższej podstawie dwa odcinki długości ${M(t`\frac{a-b}{2}`)}.`, t`Wysokość policzysz z twierdzenia Pitagorasa w trójkącie ${M('AHD')}.`],
      steps: [M(t`${L('AH')} = \frac{${a} - ${b}}{2} = ${x}`), M(t`h^2 = ${c}^2 - ${x}^2 = ${c * c} - ${x * x} = ${h * h} \;\Rightarrow\; h = ${h}`), M(t`P = \frac{${a} + ${b}}{2}\cdot ${h} = ${T(Pv)}`)],
      answer: M(`h = ${h},\\quad P = ${T(Pv)}`),
      fig: { P: { A: [0, 0], B: [a, 0], C: [x + b, h], D: [x, h], H: [x, 0], _G: [x + b, 0] }, polys: [['A', 'B', 'C', 'D']], segs: [['D', 'H', 'd'], ['C', '_G', 'd']],
        angs: [{ v: 'H', a: 'B', b: 'D', right: 1 }], ticks: [['A', 'D', 1], ['B', 'C', 1]], pos: { H: [0.3, -1] },
        lens: [Lb('A', 'B', a, { at: 0.62 }), Lb('D', 'C', b), Lb('A', 'D', c), Q('D', 'H', h, { t: 'h', s: -1 })] } });
  },
  function rhombAngle() {
    const al = pick([30, 45, 60]), a = ri(2, 10), P0 = { A: [0, 0], B: [a, 0], D: [a * cos(al), a * sin(al)] }; P0.C = add(P0.B, P0.D);
    if (al === 60) {
      const Pv = R(a * a / 2, 3), d2 = R(a, 3);
      return mk({ verify: () => near(areaP([P0.A, P0.B, P0.C, P0.D]), rv(Pv)) && near(dist(P0.B, P0.D), a) && near(dist(P0.A, P0.C), rv(d2)), skill: 'romb z kątem',
        text: t`Romb ${M('ABCD')} ma bok długości ${M(a)} i kąt ostry ${M('DAB')} o mierze ${M(dg(60))}. Oblicz pole rombu oraz długości jego przekątnych.`,
        fields: [F('pole:', Pv), F('krótsza przekątna:', a), F('dłuższa przekątna:', d2)],
        hints: [t`Krótsza przekątna ${M('BD')} dzieli romb na dwa trójkąty równoboczne o boku ${M(a)}.`, t`Dłuższa przekątna to dwie wysokości takiego trójkąta. Pole: ${M(t`P = a^2\sin\alpha`)} albo ${M(t`P = \frac{e\cdot f}{2}`)}.`],
        steps: [t`Trójkąt ${M('ABD')} jest równoramienny z kątem ${M(dg(60))}, więc równoboczny: ${M(`${L('BD')} = ${a}`)}.`, M(t`${L('AC')} = 2\cdot\frac{${a}\sqrt{3}}{2} = ${rt(d2)}`), M(t`P = \frac{${L('AC')}\cdot ${L('BD')}}{2} = \frac{${rt(d2)}\cdot ${a}}{2} = ${rt(Pv)}`)],
        answer: t`Pole ${M(rt(Pv))}, przekątne ${M(a)} i ${M(rt(d2))}.`,
        fig: { P: P0, polys: [['A', 'B', 'C', 'D']], segs: [['A', 'C', 'd'], ['B', 'D', 'd']], angs: [{ v: 'A', a: 'B', b: 'D', t: '60°' }], lens: [Lb('A', 'B', a), Q('B', 'D', a, { t: 'e', at: 0.4 }), Q('A', 'C', d2, { t: 'f', at: 0.7, s: -1 })] } });
    }
    const Pv = al === 30 ? a * a / 2 : R(a * a / 2, 2), h = al === 30 ? a / 2 : R(a / 2, 2), sv = al === 30 ? t`\tfrac12` : t`\tfrac{\sqrt2}{2}`;
    P0._H = [a * cos(al), 0];
    return mk({ verify: () => near(areaP([P0.A, P0.B, P0.C, P0.D]), rv(Pv)) && near(P0.D[1], rv(h)), skill: 'romb z kątem',
      text: t`Romb ${M('ABCD')} ma bok długości ${M(a)} i kąt ostry o mierze ${M(dg(al))}. Oblicz pole i wysokość tego rombu.`,
      fields: [F('pole:', Pv), F(M('h ='), h)],
      hints: [t`Pole rombu (jak każdego równoległoboku): ${M(t`P = a^2\cdot\sin\alpha`)}.`, t`Wysokość: ${M(t`h = a\cdot\sin\alpha`)} (albo ${M(t`h = \frac{P}{a}`)}).`],
      steps: [M(t`P = ${a}^2\cdot\sin ${dg(al)} = ${a * a}\cdot ${sv} = ${rt(Pv)}`), M(t`h = \frac{P}{a} = \frac{${rt(Pv)}}{${a}} = ${rt(h)}`)],
      answer: M(`P = ${rt(Pv)},\\quad h = ${rt(h)}`),
      fig: { P: P0, polys: [['A', 'B', 'C', 'D']], segs: [['D', '_H', 'd']], angs: [{ v: 'A', a: 'B', b: 'D', t: al + '°' }, { v: '_H', a: 'B', b: 'D', right: 1 }], lens: [Lb('A', 'B', a, { at: 0.35 }), Q('D', '_H', h, { t: 'h', s: -1 })] } });
  },
  function regularPoly() {
    const r = Math.random();
    if (r < 0.5) {
      const a = ri(2, 10), Pv = R(3 * a * a / 2, 3), ds = R(a, 3), P0 = regPoly(6, a, ['A', 'B', 'C', 'D', 'E', 'F']); P0._S = [0, 0];
      return mk({ verify: () => near(areaP(['A', 'B', 'C', 'D', 'E', 'F'].map(z => P0[z])), rv(Pv)) && near(dist(P0.A, P0.B), a) && near(dist(P0.A, P0.D), 2 * a) && near(dist(P0.A, P0.C), rv(ds)), skill: 'sześciokąt foremny',
        text: t`Sześciokąt foremny ${M('ABCDEF')} ma bok długości ${M(a)}. Oblicz pole tego sześciokąta oraz długości jego przekątnych: dłuższej i krótszej.`,
        fields: [F('pole:', Pv), F('dłuższa przekątna:', 2 * a), F('krótsza przekątna:', ds)],
        hints: [t`Sześciokąt foremny składa się z sześciu trójkątów równobocznych o boku ${M(a)}.`, t`Dłuższa przekątna (np. ${M('AD')}) to dwa boki takiego trójkąta, a krótsza (np. ${M('AC')}) to dwie jego wysokości.`],
        steps: [M(t`P = 6\cdot\frac{${a}^2\sqrt{3}}{4} = \frac{${6 * a * a}\sqrt{3}}{4} = ${rt(Pv)}`), M(t`${L('AD')} = 2\cdot ${a} = ${2 * a}`), M(t`${L('AC')} = 2\cdot\frac{${a}\sqrt{3}}{2} = ${rt(ds)}`)],
        answer: t`Pole ${M(rt(Pv))}, przekątne ${M(2 * a)} i ${M(rt(ds))}.`,
        fig: { P: P0, polys: [['A', 'B', 'C', 'D', 'E', 'F']], segs: [['A', 'D', 'd'], ['A', 'C', 'h']], dots: ['_S'], lens: [Lb('A', 'F', a), Q('A', 'D', 2 * a, { at: 0.75, s: -1 }), Q('A', 'C', ds, { s: -1 })] } });
    }
    if (r < 0.75) {
      const [n, ang] = pick([[5, 108], [6, 120], [8, 135], [9, 140], [10, 144], [12, 150], [15, 156], [18, 160], [20, 162]]);
      return mk({ verify: () => near((n - 2) * 180 / n, ang), skill: 'wielokąt foremny',
        text: t`Kąt wewnętrzny wielokąta foremnego ma miarę ${M(dg(ang))}. Ile boków ma ten wielokąt?`,
        fields: [F(M('n ='), n)],
        hints: [t`Kąt wewnętrzny ${M('n')}-kąta foremnego ma miarę ${M(t`\frac{(n-2)\cdot 180^\circ}{n}`)} — ułóż równanie.`, t`Krócej: kąt zewnętrzny ma ${M(`180^\\circ - ${dg(ang)} = ${dg(180 - ang)}`)}, a wszystkie kąty zewnętrzne sumują się do ${M(dg(360))}.`],
        steps: [M(t`\frac{(n-2)\cdot 180}{n} = ${ang} \;\Rightarrow\; 180n - 360 = ${ang}n \;\Rightarrow\; ${180 - ang}n = 360`), M(t`n = \frac{360}{${180 - ang}} = ${n}`)],
        answer: t`Wielokąt ma ${M(n)} boków.` });
    }
    const [n, ext] = pick([[5, 72], [6, 60], [8, 45], [9, 40], [10, 36], [12, 30], [15, 24], [18, 20], [20, 18], [24, 15]]);
    return mk({ verify: () => near(360 / n, ext), skill: 'wielokąt foremny',
      text: t`Kąt zewnętrzny wielokąta foremnego ma miarę ${M(dg(ext))}. Ile boków ma ten wielokąt i jaką miarę ma jego kąt wewnętrzny?`,
      fields: [F(M('n ='), n), FD('kąt wewnętrzny:', 180 - ext)],
      hints: [t`Kąty zewnętrzne wielokąta wypukłego (po jednym przy każdym wierzchołku) sumują się do ${M(dg(360))}.`, t`Kąt wewnętrzny i zewnętrzny przy tym samym wierzchołku sumują się do ${M(dg(180))}.`],
      steps: [M(t`n = \frac{360^\circ}{${dg(ext)}} = ${n}`), M(t`\text{kąt wewnętrzny} = 180^\circ - ${dg(ext)} = ${dg(180 - ext)}`)],
      answer: t`${M(`n = ${n}`)}, kąt wewnętrzny ${M(dg(180 - ext))}.` });
  },
  function parallelogramArea() {
    let a, b, ha, Pv, hb, cs;
    for (;;) { b = ri(4, 12); a = ri(b + 1, b + 8); ha = ri(2, b - 1); Pv = a * ha; hb = Pv / b; cs = Math.sqrt(1 - (ha / b) ** 2); if (isInt(hb * 10) && a * cs <= b * 0.95) break; }
    const P0 = { A: [0, 0], B: [a, 0], D: [b * cs, ha] }; P0.C = add(P0.B, P0.D); P0._H = [b * cs, 0]; P0._G = foot(P0.B, P0.A, P0.D);
    return mk({ verify: () => near(areaP([P0.A, P0.B, P0.C, P0.D]), Pv) && near(dist(P0.B, P0._G), hb) && near(dist(P0.A, P0.D), b), skill: 'pole równoległoboku',
      text: t`Boki równoległoboku ${M('ABCD')} mają długości ${M(`${L('AB')} = ${a}`)} i ${M(`${L('AD')} = ${b}`)}. Wysokość opuszczona na bok ${M('AB')} ma długość ${M(ha)}. Oblicz pole równoległoboku i długość wysokości opuszczonej na bok ${M('AD')}.`,
      fields: [F('pole:', Pv), F(t`wysokość na ${M('AD')}:`, hb)],
      hints: [t`Pole równoległoboku = bok · wysokość opuszczona na ten bok: ${M(t`P = ${L('AB')}\cdot h_{AB}`)}.`, t`To samo pole policzysz z drugiego boku: ${M(t`P = ${L('AD')}\cdot h_{AD}`)} — wyznacz z tego ${M('h_{AD}')}.`],
      steps: [M(t`P = ${a}\cdot ${ha} = ${Pv}`), M(t`P = ${L('AD')}\cdot h_{AD} \;\Rightarrow\; h_{AD} = \frac{${Pv}}{${b}} = ${T(hb)}`)],
      answer: M(`P = ${Pv},\\quad h_{AD} = ${T(hb)}`),
      fig: { P: P0, polys: [['A', 'B', 'C', 'D']], segs: [['D', '_H', 'd'], ['B', '_G', 'h']], angs: [{ v: '_H', a: 'B', b: 'D', right: 1 }, { v: '_G', a: 'D', b: 'B', right: 1 }],
        lens: [Lb('A', 'B', a, { at: 0.7 }), Lb('A', 'D', b, { at: 0.75 }), Lb('D', '_H', ha, { s: -1 }), Q('B', '_G', hb, { t: 'h', s: -1 })] } });
  }
],
3: [
  function trapezoidAngle() {
    if (Math.random() < 0.6) {
      const c = 2 * ri(2, 6), a = ri(c + 3, c + 12), b = a - c, h = R(c / 2, 3), Pv = R((a + b) / 2 * c / 2, 3), hv = c * Math.sqrt(3) / 2;
      return mk({ verify: () => near(dist([0, 0], [c / 2, hv]), c) && near(angAt([0, 0], [a, 0], [c / 2, hv]), 60, 1e-6) && near(hv, rv(h)) && near(areaP([[0, 0], [a, 0], [a - c / 2, hv], [c / 2, hv]]), rv(Pv)) && near(a - c, b), skill: 'trapez z kątem 60°',
        text: t`W trapezie równoramiennym ${M('ABCD')} dłuższa podstawa ${M('AB')} ma długość ${M(a)}, ramię ma długość ${M(c)}, a kąt ostry trapezu ma miarę ${M(dg(60))}. Oblicz długość krótszej podstawy, wysokość i pole tego trapezu.`,
        fields: [F(M(L('CD') + ' ='), b), F(M('h ='), h), F('pole:', Pv)],
        hints: [t`Poprowadź wysokość ${M('DH')}. Trójkąt ${M('AHD')} ma kąty ${M(t`30^\circ, 60^\circ, 90^\circ`)}.`, t`${M(t`${L('AH')} = c\cdot\cos 60^\circ = \frac{c}{2}`)}, ${M(t`h = c\cdot\sin 60^\circ = \frac{c\sqrt3}{2}`)}, a ${M(t`${L('CD')} = ${L('AB')} - 2\cdot ${L('AH')}`)}.`],
        steps: [M(t`${L('AH')} = ${c}\cdot\cos 60^\circ = ${c / 2}`), M(t`h = ${c}\cdot\sin 60^\circ = \frac{${c}\sqrt{3}}{2} = ${rt(h)}`), M(t`${L('CD')} = ${a} - 2\cdot ${c / 2} = ${b}`), M(t`P = \frac{${a} + ${b}}{2}\cdot ${rt(h)} = ${T((a + b) / 2)}\cdot ${rt(h)} = ${rt(Pv)}`)],
        answer: M(`${L('CD')} = ${b},\\ h = ${rt(h)},\\ P = ${rt(Pv)}`),
        fig: { P: { A: [0, 0], B: [a, 0], C: [a - c / 2, hv], D: [c / 2, hv], H: [c / 2, 0] }, polys: [['A', 'B', 'C', 'D']], segs: [['D', 'H', 'd']], ticks: [['A', 'D', 1], ['B', 'C', 1]], pos: { H: [0.3, -1] },
          angs: [{ v: 'A', a: 'B', b: 'D', t: '60°' }, { v: 'H', a: 'B', b: 'D', right: 1 }], lens: [Lb('A', 'B', a, { at: 0.6 }), Lb('A', 'D', c), Q('D', 'C', b), Q('D', 'H', h, { t: 'h', s: -1 })] } });
    }
    const h = ri(2, 6), a = ri(2 * h + 3, 2 * h + 12), b = a - 2 * h, leg = R(h, 2), Pv = (a + b) / 2 * h;
    return mk({ verify: () => near(dist([0, 0], [h, h]), rv(leg)) && near(angAt([0, 0], [a, 0], [h, h]), 45, 1e-6) && near(areaP([[0, 0], [a, 0], [a - h, h], [h, h]]), Pv), skill: 'trapez z kątem 45°',
      text: t`W trapezie równoramiennym ${M('ABCD')} kąt ostry ma miarę ${M(dg(45))}, dłuższa podstawa ${M('AB')} ma długość ${M(a)}, a wysokość trapezu jest równa ${M(h)}. Oblicz długość krótszej podstawy, długość ramienia i pole trapezu.`,
      fields: [F(M(L('CD') + ' ='), b), F('ramię:', leg), F('pole:', Pv)],
      hints: [t`Wysokość ${M('DH')} odcina trójkąt prostokątny równoramienny (kąty ${M(t`45^\circ, 45^\circ, 90^\circ`)}), więc ${M(`${L('AH')} = h`)}.`, t`Ramię jest przeciwprostokątną tego trójkąta: ${M(t`h\sqrt2`)}.`],
      steps: [M(t`${L('AH')} = h = ${h}`), M(t`${L('CD')} = ${a} - 2\cdot ${h} = ${b}`), M(t`${L('AD')} = ${h}\sqrt{2}`), M(t`P = \frac{${a} + ${b}}{2}\cdot ${h} = ${T(Pv)}`)],
      answer: M(`${L('CD')} = ${b},\\ ${L('AD')} = ${rt(leg)},\\ P = ${T(Pv)}`),
      fig: { P: { A: [0, 0], B: [a, 0], C: [a - h, h], D: [h, h], H: [h, 0] }, polys: [['A', 'B', 'C', 'D']], segs: [['D', 'H', 'd']], ticks: [['A', 'D', 1], ['B', 'C', 1]], pos: { H: [0.3, -1] },
        angs: [{ v: 'A', a: 'B', b: 'D', t: '45°' }, { v: 'H', a: 'B', b: 'D', right: 1 }], lens: [Lb('A', 'B', a, { at: 0.6 }), Q('A', 'D', leg), Q('D', 'C', b), Lb('D', 'H', h, { s: -1 })] } });
  },
  function rectSystem() {
    const [x, y, d] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25], [20, 21, 29]]);
    const s = x + y, Pv = x * y, del = s * s - 4 * Pv, sd = Math.sqrt(del);
    return mk({ skill: 'układ równań w prostokącie',
      text: t`Obwód prostokąta jest równy ${M(2 * s)}, a jego przekątna ma długość ${M(d)}. Oblicz długości boków i pole tego prostokąta.`,
      fields: [F('krótszy bok:', x), F('dłuższy bok:', y), F('pole:', Pv)],
      hints: [t`Oznacz boki przez ${M('a')} i ${M('b')}: ${M(`a + b = ${s}`)} oraz ${M(`a^2 + b^2 = ${d * d}`)}.`, t`Ze wzoru ${M('(a+b)^2 = a^2 + 2ab + b^2')} od razu dostaniesz ${M('ab')}, czyli pole.`],
      steps: [M(t`a + b = \frac{${2 * s}}{2} = ${s},\qquad a^2 + b^2 = ${d}^2 = ${d * d}`), M(t`(a+b)^2 = a^2 + b^2 + 2ab \;\Rightarrow\; ${s * s} = ${d * d} + 2ab \;\Rightarrow\; ab = ${Pv}`),
        t`${M('a')} i ${M('b')} są rozwiązaniami równania ${M(`t^2 - ${s}t + ${Pv} = 0`)}: ${M(t`\Delta = ${s * s} - ${4 * Pv} = ${del},\ \sqrt{\Delta} = ${sd},\ t_1 = \frac{${s} - ${sd}}{2} = ${x},\ t_2 = \frac{${s} + ${sd}}{2} = ${y}`)}.`],
      answer: t`Boki ${M(x)} i ${M(y)}, pole ${M(Pv)}.`,
      fig: { P: rectP(y, x), polys: [['A', 'B', 'C', 'D']], segs: [['A', 'C', 'd']], lens: [Q('A', 'B', y, { t: 'b' }), Q('B', 'C', x, { t: 'a' }), Lb('A', 'C', d, { s: -1, at: 0.55 })] },
      verify: () => x * x + y * y === d * d && x < y });
  },
  function rhombSideDiag() {
    const k = ri(1, 5), s = 5 * k; let p = 3 * k, q = 4 * k; if (Math.random() < 0.5) [p, q] = [q, p];
    const e = 2 * p, f = 2 * q, Pv = e * f / 2, h = Pv / s;
    return mk({ verify: () => near(dist([-p, 0], [0, -q]), s) && near(areaP([[-p, 0], [0, -q], [p, 0], [0, q]]), Pv) && near(h * s, Pv) && f === 2 * q, skill: 'romb: bok i przekątna',
      text: t`Bok rombu ${M('ABCD')} ma długość ${M(s)}, a przekątna ${M('AC')} ma długość ${M(e)}. Oblicz długość przekątnej ${M('BD')}, pole rombu i jego wysokość.`,
      fields: [F(M(L('BD') + ' ='), f), F('pole:', Pv), F(M('h ='), h)],
      hints: [t`Przekątne rombu są prostopadłe i dzielą się na połowy: ${M(t`\left(\tfrac{e}{2}\right)^2 + \left(\tfrac{f}{2}\right)^2 = a^2`)}.`, t`Pole rombu: ${M(t`P = \frac{e\cdot f}{2} = a\cdot h`)}, stąd ${M(t`h = \frac{P}{a}`)}.`],
      steps: [M(t`\left(\tfrac{f}{2}\right)^2 = ${s}^2 - ${p}^2 = ${s * s - p * p} \;\Rightarrow\; \tfrac{f}{2} = ${q} \;\Rightarrow\; ${L('BD')} = ${f}`), M(t`P = \frac{${e}\cdot ${f}}{2} = ${Pv}`), M(t`h = \frac{P}{a} = \frac{${Pv}}{${s}} = ${T(h)}`)],
      answer: M(`${L('BD')} = ${f},\\ P = ${Pv},\\ h = ${T(h)}`),
      fig: { P: rhombP(p, q), polys: [['A', 'B', 'C', 'D']], segs: [['A', 'C', 'd'], ['B', 'D', 'd']], angs: [{ v: '_S', a: 'C', b: 'D', right: 1 }],
        lens: [Lb('A', 'C', e, { at: 0.25, s: 1 }), Q('B', 'D', f, { at: 0.78, s: -1 }), Lb('D', 'C', s)] } });
  },
  function parallelogramCos() {
    const [a, b, d] = pick([[3, 5, 7], [5, 3, 7], [7, 8, 13], [8, 7, 13], [5, 16, 19], [16, 5, 19], [6, 10, 14], [10, 6, 14], [9, 15, 21], [15, 9, 21]]);
    const Pv = R(a * b / 2, 3), P0 = { A: [0, 0], B: [a, 0], D: [b / 2, b * Math.sqrt(3) / 2] }; P0.C = add(P0.B, P0.D);
    return mk({ skill: 'równoległobok i cosinusy',
      text: t`W równoległoboku ${M('ABCD')} dane są ${M(`${L('AB')} = ${a}`)}, ${M(`${L('AD')} = ${b}`)} oraz ${M(`${K('DAB')} = ${dg(60)}`)}. Oblicz pole tego równoległoboku i długość jego dłuższej przekątnej.`,
      fields: [F('pole:', Pv), F('dłuższa przekątna:', d)],
      hints: [t`Pole równoległoboku: ${M(t`P = a\cdot b\cdot\sin\alpha`)}.`, t`Dłuższa przekątna ${M('AC')} leży naprzeciw kąta rozwartego ${M(`${K('ABC')} = ${dg(120)}`)}. Zastosuj twierdzenie cosinusów w trójkącie ${M('ABC')}.`],
      steps: [M(t`P = ${a}\cdot ${b}\cdot\sin 60^\circ = ${a * b}\cdot\frac{\sqrt3}{2} = ${rt(Pv)}`), t`${M(t`${K('ABC')} = 180^\circ - 60^\circ = 120^\circ`)}, ${M(`${L('BC')} = ${L('AD')} = ${b}`)}.`,
        M(t`${L('AC')}^2 = ${a}^2 + ${b}^2 - 2\cdot ${a}\cdot ${b}\cdot\cos 120^\circ = ${a * a} + ${b * b} + ${a * b} = ${d * d}`), M(`${L('AC')} = ${d}`)],
      answer: t`Pole ${M(rt(Pv))}, dłuższa przekątna ${M(d)}.`,
      fig: { P: P0, polys: [['A', 'B', 'C', 'D']], segs: [['A', 'C', 'h']], angs: [{ v: 'A', a: 'B', b: 'D', t: '60°' }], lens: [Lb('A', 'B', a), Lb('A', 'D', b), Q('A', 'C', d, { at: 0.6, s: -1 })] },
      verify: () => a * a + b * b + a * b === d * d });
  }
]
};

/* ---------- KOŁO I OKRĄG ---------- */
const O0 = [0, 0];
const PI_HELP = 'Liczbę π wpisz przyciskiem π albo jako pi, np. 12π lub 12pi. Pierwiastek: przycisk √ albo sqrt, np. 2√3.';
const GO = {
1: [
  function circleBasics() {
    const v = ri(1, 3), r = ri(2, 12), Lv = R(2 * r, 1, 1), Pa = R(r * r, 1, 1);
    const cfg = {
      1: { text: t`Promień koła ma długość ${M(r)}. Oblicz obwód i pole tego koła.`, fields: [F('obwód:', Lv), F('pole:', Pa)], steps: [] },
      2: { text: t`Średnica koła ma długość ${M(2 * r)}. Oblicz obwód i pole tego koła.`, fields: [F('obwód:', Lv), F('pole:', Pa)], steps: [M(t`r = \frac{${2 * r}}{2} = ${r}`)] },
      3: { text: t`Obwód koła jest równy ${M(rt(Lv))}. Oblicz promień i pole tego koła.`, fields: [F(M('r ='), r), F('pole:', Pa)], steps: [M(t`2\pi r = ${rt(Lv)} \;\Rightarrow\; r = ${r}`)] }
    }[v];
    return mk({ verify: () => near(2 * Math.PI * r, rv(Lv)) && near(Math.PI * r * r, rv(Pa)), skill: 'obwód i pole koła', text: cfg.text, fields: cfg.fields, help: PI_HELP,
      hints: [t`Obwód koła: ${M(t`L = 2\pi r`)}, pole: ${M(t`P = \pi r^2`)}.`, v === 2 ? t`Promień to połowa średnicy.` : v === 3 ? t`Z równania ${M(t`2\pi r = ${rt(Lv)}`)} wyznacz ${M('r')}.` : t`Wynik zostaw z ${M(t`\pi`)} — nie zaokrąglaj.`],
      steps: cfg.steps.concat(v === 3 ? [M(t`P = \pi\cdot ${r}^2 = ${rt(Pa)}`)] : [M(t`L = 2\pi\cdot ${r} = ${rt(Lv)}`), M(t`P = \pi\cdot ${r}^2 = ${rt(Pa)}`)]),
      answer: M(`L = ${rt(Lv)},\\quad P = ${rt(Pa)}`),
      fig: { P: { S: O0, A: [r, 0], B: [-r, 0] }, hide: v === 2 ? [] : ['B'], circles: [{ c: 'S', r }], dots: ['S'], pos: { S: [0, 1] }, segs: [[v === 2 ? 'B' : 'S', 'A']],
        lens: [v === 2 ? Lb('B', 'A', 2 * r, { s: 1 }) : v === 1 ? Lb('S', 'A', r, { s: 1 }) : Q('S', 'A', r, { t: 'r', s: 1 })] } });
  },
  function inscribedCentral() {
    const be = ri(20, 80), al = 2 * be, P0 = { S: O0, A: onC(O0, 4, 270 - be), B: onC(O0, 4, 270 + be), C: onC(O0, 4, ri(60, 120)) };
    const fromCentral = Math.random() < 0.5;
    return mk({ verify: () => near(angAt(P0.C, P0.A, P0.B), be, 1e-6) && near(angAt(P0.S, P0.A, P0.B), al, 1e-6), skill: 'kąt wpisany i środkowy',
      text: fromCentral ? t`Punkty ${M('A')}, ${M('B')} i ${M('C')} leżą na okręgu o środku ${M('S')} (jak na rysunku). Kąt środkowy ${M('ASB')} ma miarę ${M(dg(al))}. Oblicz miarę kąta wpisanego ${M('ACB')}.`
        : t`Punkty ${M('A')}, ${M('B')} i ${M('C')} leżą na okręgu o środku ${M('S')} (jak na rysunku). Kąt wpisany ${M('ACB')} ma miarę ${M(dg(be))}. Oblicz miarę kąta środkowego ${M('ASB')}.`,
      fields: [fromCentral ? FD(M(K('ACB') + ' ='), be) : FD(M(K('ASB') + ' ='), al)],
      hints: [t`Kąt wpisany jest równy połowie kąta środkowego opartego na tym samym łuku.`, t`Podziel miarę kąta środkowego przez ${M(2)}. Gdy dany jest kąt wpisany, a szukasz środkowego – pomnóż przez ${M(2)}.`],
      steps: [fromCentral ? t`Kąty ${M('ACB')} i ${M('ASB')} są oparte na tym samym łuku ${M('AB')}, więc ${M(t`${K('ACB')} = \tfrac12\cdot ${dg(al)} = ${dg(be)}`)}.` : t`Kąty ${M('ASB')} i ${M('ACB')} są oparte na tym samym łuku ${M('AB')}, więc ${M(t`${K('ASB')} = 2\cdot ${dg(be)} = ${dg(al)}`)}.`],
      answer: fromCentral ? M(`${K('ACB')} = ${dg(be)}`) : M(`${K('ASB')} = ${dg(al)}`),
      fig: { P: P0, circles: [{ c: 'S', r: 4 }], dots: ['S'], segs: [['S', 'A'], ['S', 'B'], ['C', 'A'], ['C', 'B']], pos: { S: [1, 0.4] },
        angs: [fromCentral ? { v: 'S', a: 'A', b: 'B', t: al + '°' } : { v: 'S', a: 'A', b: 'B', t: '?', hl: 1, sol: al + '°' }, fromCentral ? { v: 'C', a: 'A', b: 'B', t: '?', hl: 1, sol: be + '°' } : { v: 'C', a: 'A', b: 'B', t: be + '°' }] } });
  },
  function diameterAngle() {
    let al; do { al = ri(15, 75); } while (al === 45);
    return mk({ verify: () => (() => { const Cc = onC(O0, 4, 2 * al); return near(angAt(Cc, [-4, 0], [4, 0]), 90, 1e-6) && near(angAt([4, 0], Cc, [-4, 0]), 90 - al, 1e-6) && near(angAt([-4, 0], [4, 0], Cc), al, 1e-6); })(), skill: 'kąt oparty na średnicy',
      text: t`Odcinek ${M('AB')} jest średnicą okręgu o środku ${M('S')}, a punkt ${M('C')} leży na tym okręgu. Kąt ${M('CAB')} ma miarę ${M(dg(al))}. Oblicz miary kątów ${M('ACB')} i ${M('ABC')}.`,
      fields: [FD(M(K('ACB') + ' ='), 90), FD(M(K('ABC') + ' ='), 90 - al)],
      hints: [t`Kąt wpisany oparty na średnicy (na półokręgu) jest prosty.`, t`Potem skorzystaj z sumy kątów w trójkącie ${M('ABC')}.`],
      steps: [t`Kąt ${M('ACB')} jest wpisany i oparty na półokręgu, więc ${M(`${K('ACB')} = ${dg(90)}`)}.`, M(t`${K('ABC')} = 180^\circ - 90^\circ - ${dg(al)} = ${dg(90 - al)}`)],
      answer: M(`${K('ACB')} = ${dg(90)},\\quad ${K('ABC')} = ${dg(90 - al)}`),
      fig: { P: { S: O0, A: [-4, 0], B: [4, 0], C: onC(O0, 4, 2 * al) }, circles: [{ c: 'S', r: 4 }], polys: [['A', 'B', 'C']], dots: ['S'], pos: { S: [0, -1] },
        angs: [{ v: 'A', a: 'B', b: 'C', t: al + '°' }, { v: 'C', a: 'A', b: 'B', t: '?', hl: 1, sol: '90°' }, { v: 'B', a: 'C', b: 'A', t: '?', hl: 1, sol: (90 - al) + '°' }] } });
  },
  function tangentLen() {
    const [r, tl, d] = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [4, 3, 5], [7, 24, 25], [12, 5, 13], [8, 6, 10], [12, 16, 20]]);
    const v = ri(1, 3), th = Math.acos(r / d) * 180 / Math.PI, A = onC(O0, r, th), P0 = { S: O0, P: [d, 0], A, _T: lerp([d, 0], A, 1.35) };
    const cfg = {
      1: { text: t`Promień okręgu ma długość ${M(r)}, a ${M(`${L('PS')} = ${d}`)}. Oblicz długość odcinka stycznej ${M('PA')}.`, f: F(M(L('PA') + ' ='), tl), s: [M(t`${L('PA')}^2 = ${L('PS')}^2 - ${L('SA')}^2 = ${d}^2 - ${r}^2 = ${d * d - r * r} \;\Rightarrow\; ${L('PA')} = ${tl}`)] },
      2: { text: t`Promień okręgu ma długość ${M(r)}, a ${M(`${L('PA')} = ${tl}`)}. Oblicz odległość punktu ${M('P')} od środka okręgu.`, f: F(M(L('PS') + ' ='), d), s: [M(t`${L('PS')}^2 = ${L('SA')}^2 + ${L('PA')}^2 = ${r}^2 + ${tl}^2 = ${d * d} \;\Rightarrow\; ${L('PS')} = ${d}`)] },
      3: { text: t`Wiadomo, że ${M(`${L('PA')} = ${tl}`)} i ${M(`${L('PS')} = ${d}`)}. Oblicz promień okręgu.`, f: F(M('r ='), r), s: [M(t`r^2 = ${L('PS')}^2 - ${L('PA')}^2 = ${d}^2 - ${tl}^2 = ${r * r} \;\Rightarrow\; r = ${r}`)] }
    }[v];
    return mk({ verify: () => near(dist(P0.P, P0.A), tl) && near(angAt(P0.A, P0.S, P0.P), 90, 1e-6) && r * r + tl * tl === d * d, skill: 'styczna do okręgu',
      text: t`Prosta ${M('PA')} jest styczna do okręgu o środku ${M('S')} w punkcie ${M('A')}. ` + cfg.text, fields: [cfg.f],
      hints: [t`Promień poprowadzony do punktu styczności jest prostopadły do stycznej.`, t`Trójkąt ${M('PAS')} jest prostokątny (kąt prosty przy ${M('A')}) — użyj twierdzenia Pitagorasa.`],
      steps: [t`${M('SA')} jest prostopadły do stycznej, więc trójkąt ${M('PAS')} jest prostokątny.`].concat(cfg.s), answer: M(`${cfg.f.label.replace(/\\\(|\\\)/g, '')} ${cfg.f.show}`),
      fig: { P: P0, circles: [{ c: 'S', r }], dots: ['S'], segs: [['P', '_T'], ['S', 'A'], ['S', 'P', 'd']], angs: [{ v: 'A', a: 'S', b: 'P', right: 1 }],
        lens: [v === 3 ? Q('S', 'A', r, { t: 'r' }) : Lb('S', 'A', r), v === 1 ? Q('A', 'P', tl) : Lb('A', 'P', tl), v === 2 ? Q('S', 'P', d, { s: -1 }) : Lb('S', 'P', d, { s: -1 })] } });
  }
],
2: [
  function arcSector() {
    const [r, al] = pick([[6, 60], [6, 120], [3, 120], [9, 40], [12, 30], [10, 36], [8, 45], [4, 90], [6, 150], [12, 150], [10, 72], [5, 72], [9, 80], [12, 75], [4, 135], [8, 135]]);
    const arc = R(r * al / 180, 1, 1), sec = R(r * r * al / 360, 1, 1), a1 = 20, a2 = 20 + al, fr = TF(al / 360);
    const P0 = { S: O0, A: onC(O0, r, a1), B: onC(O0, r, a2) }, byArc = Math.random() < 0.3;
    const base = { P: P0, sectors: [{ c: 'S', r, a1, a2 }], circles: [{ c: 'S', r }], arcs: [{ c: 'S', r, a1, a2 }], segs: [['S', 'A'], ['S', 'B']], dots: ['S'], lens: [Lb('S', 'A', r)] };
    if (!byArc) return mk({ verify: () => near(2 * Math.PI * r * al / 360, rv(arc)) && near(Math.PI * r * r * al / 360, rv(sec)), skill: 'łuk i wycinek', help: PI_HELP,
      text: t`Promień koła o środku ${M('S')} ma długość ${M(r)}, a kąt środkowy ${M('ASB')} ma miarę ${M(dg(al))}. Oblicz długość łuku ${M('AB')} wyznaczonego przez ten kąt oraz pole wycinka koła ${M('ASB')}.`,
      fields: [F('długość łuku:', arc), F('pole wycinka:', sec)],
      hints: [t`Łuk i wycinek to taka część całego okręgu i koła, jaką kąt środkowy stanowi z ${M(dg(360))}.`, t`${M(t`l = \frac{\alpha}{360^\circ}\cdot 2\pi r`)}, ${M(t`P = \frac{\alpha}{360^\circ}\cdot\pi r^2`)}.`],
      steps: [M(t`\frac{${dg(al)}}{360^\circ} = ${fr}`), M(t`l = ${fr}\cdot 2\pi\cdot ${r} = ${rt(arc)}`), M(t`P = ${fr}\cdot\pi\cdot ${r}^2 = ${rt(sec)}`)],
      answer: M(`l = ${rt(arc)},\\quad P = ${rt(sec)}`), fig: Object.assign(base, { angs: [{ v: 'S', a: 'A', b: 'B', t: al + '°' }] }) });
    return mk({ verify: () => near(2 * Math.PI * r * al / 360, rv(arc)) && near(Math.PI * r * r * al / 360, rv(sec)), skill: 'łuk i wycinek', help: PI_HELP,
      text: t`Łuk ${M('AB')} okręgu o środku ${M('S')} i promieniu ${M(r)} ma długość ${M(rt(arc))}. Oblicz miarę kąta środkowego ${M('ASB')} opartego na tym łuku oraz pole wycinka koła ${M('ASB')}.`,
      fields: [FD(M(K('ASB') + ' ='), al), F('pole wycinka:', sec)],
      hints: [t`Długość łuku: ${M(t`l = \frac{\alpha}{360^\circ}\cdot 2\pi r`)} — wstaw dane i wyznacz ${M(t`\alpha`)}.`, t`Pole wycinka: ${M(t`P = \frac{\alpha}{360^\circ}\cdot\pi r^2`)}.`],
      steps: [M(t`\frac{\alpha}{360^\circ}\cdot 2\pi\cdot ${r} = ${rt(arc)} \;\Rightarrow\; \frac{\alpha}{360^\circ} = \frac{${rt(arc)}}{${2 * r}\pi} = ${fr} \;\Rightarrow\; \alpha = ${dg(al)}`), M(t`P = ${fr}\cdot\pi\cdot ${r}^2 = ${rt(sec)}`)],
      answer: M(`${K('ASB')} = ${dg(al)},\\quad P = ${rt(sec)}`), fig: Object.assign(base, { angs: [{ v: 'S', a: 'A', b: 'B', t: 'α', hl: 1, sol: al + '°' }] }) });
  },
  function chordDist() {
    const [d, h, r] = pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10], [8, 15, 17], [15, 8, 17], [7, 24, 25], [9, 12, 15], [12, 9, 15]]);
    const v = ri(1, 3), P0 = { S: O0, A: [-h, -d], B: [h, -d], M: [0, -d] };
    const cfg = {
      1: { text: t`Cięciwa ${M('AB')} okręgu o środku ${M('S')} i promieniu ${M(r)} jest odległa od środka okręgu o ${M(d)}. Oblicz długość cięciwy ${M('AB')}.`, f: F(M(L('AB') + ' ='), 2 * h),
        s: [M(t`${L('MB')}^2 = r^2 - ${L('SM')}^2 = ${r}^2 - ${d}^2 = ${h * h} \;\Rightarrow\; ${L('MB')} = ${h}`), M(t`${L('AB')} = 2\cdot ${h} = ${2 * h}`)] },
      2: { text: t`Cięciwa ${M('AB')} okręgu o środku ${M('S')} i promieniu ${M(r)} ma długość ${M(2 * h)}. Oblicz odległość tej cięciwy od środka okręgu.`, f: F(M('d ='), d),
        s: [M(t`${L('MB')} = \tfrac12\cdot ${2 * h} = ${h}`), M(t`d^2 = r^2 - ${L('MB')}^2 = ${r}^2 - ${h}^2 = ${d * d} \;\Rightarrow\; d = ${d}`)] },
      3: { text: t`Cięciwa ${M('AB')} okręgu o środku ${M('S')} ma długość ${M(2 * h)} i jest odległa od środka okręgu o ${M(d)}. Oblicz promień tego okręgu.`, f: F(M('r ='), r),
        s: [M(t`${L('MB')} = \tfrac12\cdot ${2 * h} = ${h}`), M(t`r^2 = ${h}^2 + ${d}^2 = ${r * r} \;\Rightarrow\; r = ${r}`)] }
    }[v];
    return mk({ verify: () => near(dist(P0.S, P0.B), r) && near(dist(P0.A, P0.B), 2 * h) && near(dist(P0.S, P0.M), d), skill: 'cięciwa', text: cfg.text, fields: [cfg.f],
      hints: [t`Odcinek ${M('SM')} łączący środek okręgu ze środkiem cięciwy jest do niej prostopadły.`, t`Trójkąt ${M('SMB')} jest prostokątny: ${M(`${L('SM')} = d`)}, ${M(t`${L('MB')} = \tfrac12 ${L('AB')}`)}, ${M(`${L('SB')} = r`)}.`],
      steps: cfg.s, answer: M(`${cfg.f.label.replace(/\\\(|\\\)/g, '')} ${cfg.f.show}`),
      fig: { P: P0, circles: [{ c: 'S', r }], dots: ['S'], segs: [['A', 'B'], ['S', 'M', 'd'], ['S', 'B']], angs: [{ v: 'M', a: 'B', b: 'S', right: 1 }], pos: { M: [0, -1], S: [-1, 0.3] },
        lens: [v === 3 ? Q('S', 'B', r, { t: 'r' }) : Lb('S', 'B', r), v === 2 ? Q('S', 'M', d, { t: 'd', s: 1 }) : Lb('S', 'M', d, { s: 1 }), v === 1 ? Q('A', 'B', 2 * h, { s: 1, at: 0.3 }) : Lb('A', 'B', 2 * h, { s: 1, at: 0.3 })] } });
  },
  function twoTangents() {
    if (Math.random() < 0.6) {
      const al = 2 * ri(15, 60), d = 3 / sin(al / 2), th = 90 - al / 2, P0 = { S: O0, P: [d, 0], A: onC(O0, 3, th), B: onC(O0, 3, -th) };
      return mk({ verify: () => near(angAt(P0.S, P0.A, P0.B), 180 - al, 1e-6) && near(angAt(P0.A, P0.B, P0.P), 90 - al / 2, 1e-6) && near(angAt(P0.P, P0.A, P0.B), al, 1e-6) && near(angAt(P0.A, P0.S, P0.P), 90, 1e-6), skill: 'dwie styczne',
        text: t`Z punktu ${M('P')} poprowadzono dwie styczne do okręgu o środku ${M('S')}, styczne w punktach ${M('A')} i ${M('B')}. Kąt ${M('APB')} ma miarę ${M(dg(al))}. Oblicz miary kątów ${M('ASB')} i ${M('PAB')}.`,
        fields: [FD(M(K('ASB') + ' ='), 180 - al), FD(M(K('PAB') + ' ='), 90 - al / 2)],
        hints: [t`Promienie ${M('SA')} i ${M('SB')} są prostopadłe do stycznych, więc w czworokącie ${M('PASB')} dwa kąty są proste.`, t`Odcinki stycznych poprowadzonych z jednego punktu są równe: ${M(`${L('PA')} = ${L('PB')}`)}, więc trójkąt ${M('PAB')} jest równoramienny.`],
        steps: [M(t`${K('ASB')} = 360^\circ - 90^\circ - 90^\circ - ${dg(al)} = ${dg(180 - al)}`), t`${M(`${L('PA')} = ${L('PB')}`)}, więc ${M(t`${K('PAB')} = ${K('PBA')} = \frac{180^\circ - ${dg(al)}}{2} = ${dg(90 - al / 2)}`)}.`],
        answer: M(`${K('ASB')} = ${dg(180 - al)},\\quad ${K('PAB')} = ${dg(90 - al / 2)}`),
        fig: { P: P0, circles: [{ c: 'S', r: 3 }], dots: ['S'], segs: [['P', 'A'], ['P', 'B'], ['S', 'A'], ['S', 'B'], ['A', 'B', 'l']], ticks: [['P', 'A', 1], ['P', 'B', 1]],
          angs: [{ v: 'P', a: 'A', b: 'B', t: al + '°' }, { v: 'S', a: 'A', b: 'B', t: '?', hl: 1, sol: (180 - al) + '°' }, { v: 'A', a: 'B', b: 'P', t: '?', hl: 1, sol: (90 - al / 2) + '°' }, { v: 'B', a: 'S', b: 'P', right: 1 }] } });
    }
    const r = ri(2, 9), P0 = { S: O0, P: [6, 0], A: onC(O0, 3, 60), B: onC(O0, 3, -60) };
    return mk({ verify: () => near(r / Math.sin(rad(30)), 2 * r) && near(r / Math.tan(rad(30)), r * Math.sqrt(3)) && near(angAt(P0.P, P0.A, P0.B), 60, 1e-6), skill: 'dwie styczne',
      text: t`Z punktu ${M('P')} poprowadzono dwie styczne do okręgu o środku ${M('S')} i promieniu ${M(r)}, styczne w punktach ${M('A')} i ${M('B')}. Kąt między stycznymi ma miarę ${M(dg(60))}. Oblicz ${M(L('PS'))} oraz długość odcinka stycznej ${M('PA')}.`,
      fields: [F(M(L('PS') + ' ='), 2 * r), F(M(L('PA') + ' ='), R(r, 3))],
      hints: [t`Odcinek ${M('PS')} dzieli kąt między stycznymi na połowy, więc ${M(`${K('APS')} = ${dg(30)}`)}.`, t`W trójkącie prostokątnym ${M('PAS')} promień ${M('SA')} leży naprzeciw kąta ${M(dg(30))}.`],
      steps: [t`Trójkąt ${M('PAS')} jest prostokątny (${M('SA')} jest prostopadły do ${M('PA')}), a ${M(`${K('APS')} = ${dg(30)}`)}.`, M(t`${L('PS')} = 2\cdot ${L('SA')} = 2\cdot ${r} = ${2 * r}`), M(t`${L('PA')} = ${L('SA')}\cdot\sqrt3 = ${r}\sqrt{3}`)],
      answer: M(`${L('PS')} = ${2 * r},\\quad ${L('PA')} = ${r}\\sqrt{3}`),
      fig: { P: P0, circles: [{ c: 'S', r: 3 }], dots: ['S'], segs: [['P', 'A'], ['P', 'B'], ['S', 'A'], ['S', 'P', 'd']], angs: [{ v: 'P', a: 'A', b: 'B', t: '60°' }, { v: 'A', a: 'S', b: 'P', right: 1 }],
        lens: [Lb('S', 'A', r), Q('A', 'P', R(r, 3)), Q('S', 'P', 2 * r, { at: 0.3, s: -1 })] } });
  },
  function circleSquare() {
    if (Math.random() < 0.55) {
      const a = 2 * ri(1, 7), h = a / 2;
      return mk({ verify: () => near(Math.PI * (a / 2) ** 2, rv(R(a * a / 4, 1, 1))) && near(Math.PI * Math.hypot(a / 2, a / 2) ** 2, rv(R(a * a / 2, 1, 1))), skill: 'koło i kwadrat', help: PI_HELP,
        text: t`Kwadrat ${M('ABCD')} ma bok długości ${M(a)}. Oblicz pole koła wpisanego w ten kwadrat i pole koła opisanego na tym kwadracie.`,
        fields: [F('pole koła wpisanego:', R(a * a / 4, 1, 1)), F('pole koła opisanego:', R(a * a / 2, 1, 1))],
        hints: [t`Promień koła wpisanego w kwadrat to połowa boku.`, t`Promień koła opisanego to połowa przekątnej: ${M(t`R = \frac{a\sqrt2}{2}`)}.`],
        steps: [M(t`r = \frac{${a}}{2} = ${h},\qquad P = \pi\cdot ${h}^2 = ${rt(R(h * h, 1, 1))}`), M(t`R = \frac{${a}\sqrt2}{2} = ${rt(R(h, 2))},\qquad P = \pi\cdot\left(${rt(R(h, 2))}\right)^2 = ${rt(R(2 * h * h, 1, 1))}`)],
        answer: t`Koło wpisane: ${M(rt(R(a * a / 4, 1, 1)))}, opisane: ${M(rt(R(a * a / 2, 1, 1)))}.`,
        fig: { P: { A: [-h, -h], B: [h, -h], C: [h, h], D: [-h, h], _S: O0, _M: [h, 0] }, polys: [['A', 'B', 'C', 'D']], circles: [{ c: '_S', r: h, hl: 1 }, { c: '_S', r: h * Math.SQRT2, d: 1 }], dots: ['_S'], segs: [['_S', 'C', 'l']], lens: [Lb('A', 'B', a)] } });
    }
    const tr = pick(TRIPLES), y = tr[1], x = tr[0], d = tr[2];
    return mk({ verify: () => near(Math.hypot(x, y) / 2, d / 2) && near(Math.PI * (Math.hypot(x, y) / 2) ** 2, rv(R(d * d / 4, 1, 1))), skill: 'prostokąt w okręgu', help: PI_HELP,
      text: t`Prostokąt o bokach długości ${M(x)} i ${M(y)} jest wpisany w okrąg. Oblicz promień tego okręgu i pole koła, które ten okrąg ogranicza.`,
      fields: [F(M('R ='), d / 2), F('pole koła:', R(d * d / 4, 1, 1))],
      hints: [t`Kąty prostokąta są wpisane w okrąg i proste, więc przekątna prostokąta jest średnicą okręgu.`, t`Policz przekątną z twierdzenia Pitagorasa, a ${M(t`R = \frac{d}{2}`)}.`],
      steps: [M(t`d^2 = ${x}^2 + ${y}^2 = ${d * d} \;\Rightarrow\; d = ${d}`), M(t`R = \frac{${d}}{2} = ${T(d / 2)}`), M(t`P = \pi R^2 = \pi\cdot\left(${T(d / 2)}\right)^2 = ${rt(R(d * d / 4, 1, 1))}`)],
      answer: M(`R = ${T(d / 2)},\\quad P = ${rt(R(d * d / 4, 1, 1))}`),
      fig: { P: { A: [-y / 2, -x / 2], B: [y / 2, -x / 2], C: [y / 2, x / 2], D: [-y / 2, x / 2], _S: O0 }, polys: [['A', 'B', 'C', 'D']], circles: [{ c: '_S', r: d / 2 }], dots: ['_S'], segs: [['A', 'C', 'd']],
        lens: [Lb('A', 'B', y), Lb('B', 'C', x), Q('_S', 'C', d / 2, { t: 'R', s: 1 })] } });
  }
],
3: [
  function equiInCircle() {
    const tri = (rr) => ({ A: onC(O0, rr, 210), B: onC(O0, rr, 330), C: onC(O0, rr, 90), S: O0, _H: [0, -rr / 2] });
    if (Math.random() < 0.5) {
      const Rr = ri(2, 8), a = R(Rr, 3), Pv = R(3 * Rr * Rr / 4, 3);
      return mk({ verify: () => (() => { const q = tri(Rr); return near(dist(q.A, q.B), rv(a)) && near(areaP([q.A, q.B, q.C]), rv(Pv)); })(), skill: 'trójkąt wpisany w okrąg',
        text: t`Trójkąt równoboczny ${M('ABC')} jest wpisany w okrąg o promieniu ${M(Rr)}. Oblicz długość boku i pole tego trójkąta.`,
        fields: [F(M('a ='), a), F(M('P ='), Pv)],
        hints: [t`Środek okręgu opisanego na trójkącie równobocznym dzieli wysokość w stosunku ${M('2 : 1')}, więc ${M(t`R = \tfrac23 h`)}.`, t`${M(t`h = \frac{a\sqrt3}{2}`)}, stąd ${M(t`a = R\sqrt3`)}.`],
        steps: [M(t`h = \tfrac32 R = ${T(1.5 * Rr)}`), M(t`a = \frac{2h}{\sqrt3} = \frac{${T(3 * Rr)}\sqrt3}{3} = ${rt(a)}`), M(t`P = \frac{a^2\sqrt3}{4} = \frac{${3 * Rr * Rr}\sqrt3}{4} = ${rt(Pv)}`)],
        answer: M(`a = ${rt(a)},\\quad P = ${rt(Pv)}`),
        fig: { P: tri(3), hide: ['S'], polys: [['A', 'B', 'C']], circles: [{ c: 'S', r: 3 }], dots: ['S'], segs: [['S', 'A', 'h']], lens: [Lb('S', 'A', Rr), Q('A', 'B', a, { t: 'a' })] } });
    }
    const k = ri(1, 4), a = 6 * k;
    return mk({ verify: () => near(Math.PI * (a / (2 * Math.sqrt(3))) ** 2, rv(R(3 * k * k, 1, 1))) && near(Math.PI * (a / Math.sqrt(3)) ** 2, rv(R(12 * k * k, 1, 1))), skill: 'koła i trójkąt równoboczny', help: PI_HELP,
      text: t`Trójkąt równoboczny ma bok długości ${M(a)}. Oblicz pole koła wpisanego w ten trójkąt oraz pole koła opisanego na tym trójkącie.`,
      fields: [F('pole koła wpisanego:', R(3 * k * k, 1, 1)), F('pole koła opisanego:', R(12 * k * k, 1, 1))],
      hints: [t`${M(t`h = \frac{a\sqrt3}{2}`)}, a promienie to ${M(t`r = \tfrac13 h`)} i ${M(t`R = \tfrac23 h`)}.`, t`Pole koła: ${M(t`\pi r^2`)}. Kwadrat pierwiastka: ${M(t`(k\sqrt3)^2 = 3k^2`)}.`],
      steps: [M(t`h = \frac{${a}\sqrt3}{2} = ${rt(R(3 * k, 3))}`), M(t`r = \tfrac13 h = ${rt(R(k, 3))},\qquad \pi r^2 = ${rt(R(3 * k * k, 1, 1))}`), M(t`R = \tfrac23 h = ${rt(R(2 * k, 3))},\qquad \pi R^2 = ${rt(R(12 * k * k, 1, 1))}`)],
      answer: t`Koło wpisane: ${M(rt(R(3 * k * k, 1, 1)))}, opisane: ${M(rt(R(12 * k * k, 1, 1)))}.`,
      fig: { P: tri(3), hide: ['S'], polys: [['A', 'B', 'C']], circles: [{ c: 'S', r: 3, d: 1 }, { c: 'S', r: 1.5, hl: 1 }], dots: ['S'], segs: [['S', '_H', 'h'], ['S', 'A', 'l']], lens: [Lb('A', 'B', a), Lb('S', '_H', 'r', { s: -1 }), Lb('S', 'A', 'R')] } });
  },
  function circleAngles() {
    const al = 2 * ri(45, 75), off = ri(-Math.floor(al / 5), Math.floor(al / 5));
    const P0 = { S: O0, A: onC(O0, 4, 270 - al / 2), B: onC(O0, 4, 270 + al / 2), C: onC(O0, 4, 90 + ri(-35, 35)), D: onC(O0, 4, 270 + off) };
    return mk({ verify: () => near(angAt(P0.A, P0.B, P0.S), 90 - al / 2, 1e-6) && near(angAt(P0.C, P0.A, P0.B), al / 2, 1e-6) && near(angAt(P0.D, P0.A, P0.B), 180 - al / 2, 1e-6), skill: 'kąty w okręgu',
      text: t`Punkty ${M('A')}, ${M('B')}, ${M('C')} i ${M('D')} leżą na okręgu o środku ${M('S')} — ${M('C')} na dłuższym, a ${M('D')} na krótszym łuku ${M('AB')} (jak na rysunku). Kąt środkowy ${M('ASB')} ma miarę ${M(dg(al))}. Oblicz miary kątów ${M('SAB')}, ${M('ACB')} i ${M('ADB')}.`,
      fields: [FD(M(K('SAB') + ' ='), 90 - al / 2), FD(M(K('ACB') + ' ='), al / 2), FD(M(K('ADB') + ' ='), 180 - al / 2)],
      hints: [t`Trójkąt ${M('ASB')} jest równoramienny, bo ${M(`${L('SA')} = ${L('SB')} = r`)}.`, t`Kąt wpisany ${M('ACB')} jest oparty na tym samym łuku co kąt środkowy ${M('ASB')}. Kąt ${M('ADB')} jest oparty na dłuższym łuku ${M('AB')} — odpowiada mu kąt środkowy ${M(`360^\\circ - ${dg(al)}`)}.`],
      steps: [M(t`${K('SAB')} = \frac{180^\circ - ${dg(al)}}{2} = ${dg(90 - al / 2)}`), M(t`${K('ACB')} = \tfrac12\cdot ${dg(al)} = ${dg(al / 2)}`), M(t`${K('ADB')} = \tfrac12\cdot(360^\circ - ${dg(al)}) = ${dg(180 - al / 2)}`)],
      answer: M(`${K('SAB')} = ${dg(90 - al / 2)},\\ ${K('ACB')} = ${dg(al / 2)},\\ ${K('ADB')} = ${dg(180 - al / 2)}`),
      fig: { P: P0, circles: [{ c: 'S', r: 4 }], dots: ['S'], segs: [['S', 'A'], ['S', 'B'], ['A', 'B', 'l'], ['C', 'A'], ['C', 'B'], ['D', 'A'], ['D', 'B']], pos: { S: [1, 0.2] },
        angs: [{ v: 'S', a: 'A', b: 'B', t: al + '°' }, { v: 'A', a: 'B', b: 'S', t: '?', hl: 1, sol: (90 - al / 2) + '°', r: 30 }, { v: 'C', a: 'A', b: 'B', t: '?', hl: 1, sol: al / 2 + '°' }, { v: 'D', a: 'A', b: 'B', t: '?', hl: 1, sol: (180 - al / 2) + '°', r: 14 }] } });
  },
  function annulus() {
    const [r, a, Ro] = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [4, 3, 5], [9, 12, 15], [7, 24, 25], [8, 6, 10]]);
    const ring = R(a * a, 1, 1), withR = Math.random() < 0.5, P0 = { S: O0, A: [-a, -r], B: [a, -r], M: [0, -r] };
    return mk({ verify: () => near(Math.hypot(a, r), Ro) && near(Math.PI * (Ro * Ro - r * r), rv(ring)), skill: 'pierścień kołowy', help: PI_HELP,
      text: withR ? t`Dwa okręgi mają wspólny środek ${M('S')}, a promień mniejszego z nich jest równy ${M(r)}. Cięciwa ${M('AB')} większego okręgu jest styczna do mniejszego okręgu w punkcie ${M('M')} i ma długość ${M(2 * a)}. Oblicz promień większego okręgu i pole pierścienia między okręgami.`
        : t`Dwa okręgi mają wspólny środek ${M('S')}. Cięciwa ${M('AB')} większego okręgu jest styczna do mniejszego okręgu w punkcie ${M('M')} i ma długość ${M(2 * a)}. Oblicz pole pierścienia między tymi okręgami.`,
      fields: (withR ? [F(M('R ='), Ro)] : []).concat([F('pole pierścienia:', ring)]),
      hints: [t`Promień ${M('SM')} mniejszego okręgu jest prostopadły do stycznej ${M('AB')} i dzieli cięciwę na połowy: ${M(`${L('MB')} = ${a}`)}.`, t`Pole pierścienia to ${M(t`\pi R^2 - \pi r^2 = \pi(R^2 - r^2)`)}, a z twierdzenia Pitagorasa w trójkącie ${M('SMB')}: ${M(`R^2 - r^2 = ${L('MB')}^2`)}.`],
      steps: [t`${M('SM')} jest prostopadły do ${M('AB')}, więc ${M(t`${L('MB')} = \tfrac12\cdot ${2 * a} = ${a}`)}.`].concat(withR ? [M(t`R^2 = r^2 + ${L('MB')}^2 = ${r}^2 + ${a}^2 = ${Ro * Ro} \;\Rightarrow\; R = ${Ro}`)] : [M(t`R^2 = r^2 + ${L('MB')}^2 \;\Rightarrow\; R^2 - r^2 = ${a}^2 = ${a * a}`)]).concat([M(t`P = \pi(R^2 - r^2) = ${rt(ring)}`)]),
      answer: withR ? M(`R = ${Ro},\\quad P = ${rt(ring)}`) : M(`P = ${rt(ring)}`),
      fig: { P: P0, circles: [{ c: 'S', r: Ro, fill: 's' }, { c: 'S', r, fill: 'w' }], dots: ['S'], segs: [['A', 'B'], ['S', 'M', 'd'], ['S', 'B']], angs: [{ v: 'M', a: 'B', b: 'S', right: 1 }], pos: { M: [0, -1], S: [-1, 0.4] },
        lens: [withR ? Lb('S', 'M', r, { s: 1 }) : Lb('S', 'M', 'r', { s: 1 }), withR ? Q('S', 'B', Ro, { t: 'R' }) : Lb('S', 'B', 'R'), Lb('A', 'M', a, { s: -1 })] } });
  },
  function arcInscribed() {
    const [r, be] = pick([[3, 30], [6, 30], [9, 20], [12, 15], [6, 45], [4, 45], [9, 40], [10, 36], [6, 60], [3, 60], [12, 45], [10, 18], [5, 36], [8, 30]]);
    const al = 2 * be, arc = R(r * be / 90, 1, 1), sec = R(r * r * be / 180, 1, 1), fr = TF(al / 360);
    const P0 = { S: O0, A: onC(O0, r, 270 - be), B: onC(O0, r, 270 + be), C: onC(O0, r, 90 + ri(-30, 30)) };
    return mk({ verify: () => near(angAt(P0.C, P0.A, P0.B), be, 1e-6) && near(2 * Math.PI * r * al / 360, rv(arc)) && near(Math.PI * r * r * al / 360, rv(sec)), skill: 'łuk i kąt wpisany', help: PI_HELP,
      text: t`Kąt wpisany ${M('ACB')} w okręgu o środku ${M('S')} i promieniu ${M(r)} ma miarę ${M(dg(be))}. Oblicz długość łuku ${M('AB')}, na którym jest oparty ten kąt, oraz pole wycinka koła ${M('ASB')}.`,
      fields: [F('długość łuku:', arc), F('pole wycinka:', sec)],
      hints: [t`Kąt środkowy ${M('ASB')} oparty na tym samym łuku jest dwa razy większy od kąta wpisanego.`, t`${M(t`l = \frac{\alpha}{360^\circ}\cdot 2\pi r`)}, ${M(t`P = \frac{\alpha}{360^\circ}\cdot\pi r^2`)}, gdzie ${M(t`\alpha = ${K('ASB')}`)}.`],
      steps: [M(t`${K('ASB')} = 2\cdot ${dg(be)} = ${dg(al)}`), M(t`l = \frac{${dg(al)}}{360^\circ}\cdot 2\pi\cdot ${r} = ${fr}\cdot ${2 * r}\pi = ${rt(arc)}`), M(t`P = ${fr}\cdot\pi\cdot ${r}^2 = ${rt(sec)}`)],
      answer: M(`l = ${rt(arc)},\\quad P = ${rt(sec)}`),
      fig: { P: P0, sectors: [{ c: 'S', r, a1: 270 - be, a2: 270 + be }], circles: [{ c: 'S', r }], arcs: [{ c: 'S', r, a1: 270 - be, a2: 270 + be }], dots: ['S'], segs: [['S', 'A'], ['S', 'B'], ['C', 'A'], ['C', 'B']], pos: { S: [1, 0.3] },
        angs: [{ v: 'C', a: 'A', b: 'B', t: be + '°' }, { v: 'S', a: 'A', b: 'B', t: '?', hl: 1, sol: al + '°' }], lens: [Lb('S', 'A', r, { s: 1 })] } });
  }
]
};

/* ---------- PODOBIEŃSTWO I TWIERDZENIE TALESA ---------- */
function thalesFig(oa, ab, oc, cd, lab) {
  const u1 = [cos(30), sin(30)], u2 = [cos(-8), sin(-8)], sc = (u, d) => [u[0] * d, u[1] * d];
  return { P: { O: O0, A: sc(u1, oa), B: sc(u1, oa + ab), C: sc(u2, oc), D: sc(u2, oc + cd), _E: sc(u1, (oa + ab) * 1.16), _F: sc(u2, (oc + cd) * 1.16) },
    segs: [['O', '_E'], ['O', '_F'], ['A', 'C', 'h'], ['B', 'D', 'h']], par: [['C', 'A', 0.55], ['D', 'B', 0.55]], pos: { O: [-1, 0], A: [-0.4, 1], B: [-0.4, 1], C: [0.2, -1], D: [0.2, -1] },
    lens: [Object.assign({ a: 'O', b: 'A', s: -1 }, lab.OA), Object.assign({ a: 'A', b: 'B', s: -1 }, lab.AB), Object.assign({ a: 'O', b: 'C', s: 1 }, lab.OC), Object.assign({ a: 'C', b: 'D', s: 1 }, lab.CD)] };
}
const twoTri = (k, sh, names2) => {
  const base = sh || [[0, 0], [4, 0], [1.3, 2.6]], w = Math.max(...base.map(q => q[0])), off = w * 1.35, P0 = {};
  k = k > 1 ? Math.min(k, 1.7) : Math.max(k, 0.7);
  ['A', 'B', 'C'].forEach((n, i) => { P0[n] = base[i]; P0[names2 ? names2[i] : n + "'"] = [off + base[i][0] * k, base[i][1] * k]; });
  return P0;
};
const GS = {
1: [
  function scalePerimArea() {
    const k = pick([2, 3, 4, 1.5, 2.5]), Ob = 2 * ri(5, 15), Pv = 4 * ri(2, 9);
    return mk({ verify: () => (() => { const q = [[0, 0], [4, 0], [0, 3]], s2 = q.map(z => [z[0] * k, z[1] * k]), per = z => dist(z[0], z[1]) + dist(z[1], z[2]) + dist(z[2], z[0]); return near(per(s2) / per(q) * Ob, k * Ob) && near(areaP(s2) / areaP(q) * Pv, k * k * Pv); })(), skill: 'skala podobieństwa',
      text: t`Trójkąt ${M("A'B'C'")} jest podobny do trójkąta ${M('ABC')} w skali ${M(`k = ${T(k)}`)}. Obwód trójkąta ${M('ABC')} jest równy ${M(Ob)}, a jego pole jest równe ${M(Pv)}. Oblicz obwód i pole trójkąta ${M("A'B'C'")}.`,
      fields: [F('obwód:', k * Ob), F('pole:', k * k * Pv)],
      hints: [t`W figurach podobnych w skali ${M('k')} każdy odcinek — a więc i obwód — jest ${M('k')} razy dłuższy.`, t`Pole figury podobnej w skali ${M('k')} jest ${M('k^2')} razy większe.`],
      steps: [M(t`\text{Ob}' = ${T(k)}\cdot ${Ob} = ${T(k * Ob)}`), M(t`P' = ${T(k)}^2\cdot ${Pv} = ${T(k * k)}\cdot ${Pv} = ${T(k * k * Pv)}`)],
      answer: t`Obwód ${M(T(k * Ob))}, pole ${M(T(k * k * Pv))}.`,
      fig: { P: Object.assign(twoTri(k), { _t1: [2, -0.9], _t2: [5.4 + 2 * Math.min(k, 1.7), -0.9] }), polys: [['A', 'B', 'C'], ["A'", "B'", "C'"]], pos: { "C'": [0, 1], C: [0, 1] },
        txt: [{ p: '_t1', t: 'P = ' + Pv }, { p: '_t2', t: 'P = ?', sol: 'P = ' + txt(k * k * Pv), c: 'lb h' }] } });
  },
  function thalesBasic() {
    const [p, q] = pick([[1, 2], [3, 2], [2, 1], [5, 2], [3, 1], [2, 3], [4, 3], [3, 4]]), u = ri(1, 4), w = ri(1, 4);
    const V = { OA: q * u, AB: q * w, OC: p * u, CD: p * w }, ask = pick(['OA', 'AB', 'OC', 'CD']), given = ['OA', 'AB', 'OC', 'CD'].filter(s => s !== ask);
    const fr = ['OA', 'AB', 'OC', 'CD'].map(s => (s === ask ? 'x' : V[s]));
    const num = { OA: [V.AB, V.OC, V.CD], AB: [V.OA, V.CD, V.OC], OC: [V.OA, V.CD, V.AB], CD: [V.AB, V.OC, V.OA] }[ask];
    const lab = {}; ['OA', 'AB', 'OC', 'CD'].forEach(s => { lab[s] = s === ask ? { t: 'x', hl: 1, sol: txt(V[s]) } : { t: txt(V[s]) }; });
    return mk({ skill: 'twierdzenie Talesa',
      text: t`Ramiona kąta o wierzchołku ${M('O')} przecięto dwiema prostymi równoległymi: pierwsza przecina ramiona w punktach ${M('A')} i ${M('C')}, druga — w punktach ${M('B')} i ${M('D')} (jak na rysunku). Wiadomo, że ${given.map(s => M(`${L(s)} = ${V[s]}`)).join(', ')}. Oblicz ${M(L(ask))}.`,
      fields: [F(M(L(ask) + ' ='), V[ask])],
      hints: [t`Z twierdzenia Talesa odcinki na jednym ramieniu są proporcjonalne do odpowiednich odcinków na drugim: ${M(t`\frac{${L('OA')}}{${L('AB')}} = \frac{${L('OC')}}{${L('CD')}}`)}.`, t`Oznacz szukany odcinek przez ${M('x')} i pomnóż proporcję „na krzyż”.`],
      steps: [M(t`\frac{${fr[0]}}{${fr[1]}} = \frac{${fr[2]}}{${fr[3]}}`), M(t`x = \frac{${num[0]}\cdot ${num[1]}}{${num[2]}} = ${T(V[ask])}`)],
      answer: M(`${L(ask)} = ${T(V[ask])}`),
      fig: thalesFig(V.OA, V.AB, V.OC, V.CD, lab),
      verify: () => near(V.OA / V.AB, V.OC / V.CD) && near(num[0] * num[1] / num[2], V[ask]) });
  },
  function scaleSides() {
    const tri = pick([[4, 6, 8], [3, 5, 7], [4, 5, 6], [2, 3, 4], [5, 6, 9], [6, 8, 10], [3, 4, 6], [4, 7, 9]]), k = pick([1.5, 2, 2.5, 3, 0.5]);
    const [a, b, c] = tri, [a2, b2, c2] = tri.map(x => x * k), T0 = triSides(a, b, c), sh = [T0.A, T0.B, T0.C];
    const P0 = twoTri(k, sh);
    return mk({ verify: () => near(a2 / a, k) && near(b2 / b, k) && near(c2 / c, k) && a <= b && b <= c, skill: 'trójkąty podobne',
      text: t`Boki trójkąta ${M('ABC')} mają długości ${M(`${L('BC')} = ${a}`)}, ${M(`${L('AC')} = ${b}`)}, ${M(`${L('AB')} = ${c}`)}. Najkrótszy bok trójkąta ${M("A'B'C'")} podobnego do trójkąta ${M('ABC')} ma długość ${M(T(a2))}. Oblicz skalę podobieństwa trójkąta ${M("A'B'C'")} do trójkąta ${M('ABC')} oraz długości pozostałych boków trójkąta ${M("A'B'C'")}.`,
      fields: [F(M('k ='), k), F('średni bok:', b2), F('najdłuższy bok:', c2)],
      hints: [t`Najkrótszemu bokowi jednego trójkąta odpowiada najkrótszy bok drugiego: ${M(t`k = \frac{${T(a2)}}{${a}}`)}.`, t`Pozostałe boki trójkąta ${M('ABC')} pomnóż przez ${M('k')}.`],
      steps: [M(t`k = \frac{${T(a2)}}{${a}} = ${T(k)}`), M(t`${T(k)}\cdot ${b} = ${T(b2)},\qquad ${T(k)}\cdot ${c} = ${T(c2)}`)],
      answer: M(`k = ${T(k)},\\ \\text{boki: } ${T(b2)}\\ \\text{i}\\ ${T(c2)}`),
      fig: { P: P0, polys: [['A', 'B', 'C'], ["A'", "B'", "C'"]], lens: [Lb('B', 'C', a), Lb('A', 'C', b), Lb('A', 'B', c), Lb("B'", "C'", a2), Q("A'", "C'", b2), Q("A'", "B'", c2)] } });
  },
  function shadow() {
    const [h2, s2] = pick([[1.5, 2], [1.8, 1.2], [2, 2.5], [1.6, 2], [1.2, 1.5], [2, 1.6], [1.5, 1], [1.8, 2.4]]);
    let s1, h1; do { s1 = ri(4, 40); h1 = s1 * h2 / s2; } while (!isInt(h1 * 10) || h1 < 4 || h1 > 40);
    const obj = pick([['drzewo', 'drzewa'], ['maszt', 'masztu'], ['budynek', 'budynku'], ['latarnia', 'latarni']]), who = pick(['Pal o wysokości', 'Uczeń o wzroście']);
    const vis = 0.45 * h1 / h2, x0 = s1 * 1.18;
    return mk({ verify: () => near(h1 / s1, h2 / s2), skill: 'cień i podobieństwo',
      text: t`${who} ${M(T(h2) + t`\ \text{m}`)} rzuca cień długości ${M(T(s2) + t`\ \text{m}`)}. W tej samej chwili cień, który rzuca ${obj[0]}, ma długość ${M(s1 + t`\ \text{m}`)}. Jaką wysokość ma ${obj[0]}?`,
      fields: [F('wysokość:', h1, { unit: 'm' })],
      hints: [t`Promienie słońca padają równolegle, więc trójkąty utworzone przez przedmiot, jego cień i promień słońca są podobne.`, t`Stosunek wysokości do długości cienia jest w obu trójkątach taki sam: ${M(t`\frac{h}{${s1}} = \frac{${T(h2)}}{${T(s2)}}`)}.`],
      steps: [M(t`\frac{h}{${s1}} = \frac{${T(h2)}}{${T(s2)}} \;\Rightarrow\; h = \frac{${s1}\cdot ${T(h2)}}{${T(s2)}} = ${T(h1)}\ \text{m}`)],
      answer: t`${obj[0][0].toUpperCase() + obj[0].slice(1)} ma ${M(T(h1) + t`\ \text{m}`)} wysokości.`,
      fig: { P: { _a: O0, _b: [0, h1], _c: [s1, 0], _d: [x0, 0], _e: [x0, h2 * vis], _f: [x0 + s2 * vis, 0], _g: [-s1 * 0.06, 0], _h: [x0 + s2 * vis * 1.25, 0] },
        segs: [['_g', '_h', 'l'], ['_a', '_b', 'h'], ['_b', '_c', 'd'], ['_d', '_e'], ['_e', '_f', 'd']], polys: [],
        angs: [{ v: '_a', a: '_c', b: '_b', right: 1 }, { v: '_d', a: '_f', b: '_e', right: 1 }],
        lens: [Q('_a', '_b', h1, { s: 1, sol: txt(h1) + ' m', t: 'h' }), Lb('_a', '_c', txt(s1) + ' m', { s: -1 }), Lb('_d', '_e', txt(h2) + ' m', { s: 1 }), Lb('_d', '_f', txt(s2) + ' m', { s: -1 })] } });
  }
],
2: [
  function thalesTriangle() {
    let m, n, e, AB; do { m = ri(2, 8); n = ri(2, 9); e = ri(3, 12); AB = e * (m + n) / m; } while (!isInt(AB * 10));
    const ask = pick(['AB', 'AB', 'DA', 'DE']), V = { CD: m, DA: n, DE: e, AB }, given = ['CD', 'DA', 'DE', 'AB'].filter(s => s !== ask);
    const st = {
      AB: [M(t`${L('CA')} = ${m} + ${n} = ${m + n}`), M(t`\frac{${L('DE')}}{${L('AB')}} = \frac{${L('CD')}}{${L('CA')}} \;\Rightarrow\; \frac{${e}}{${L('AB')}} = \frac{${m}}{${m + n}}`), M(t`${L('AB')} = \frac{${e}\cdot ${m + n}}{${m}} = ${T(AB)}`)],
      DE: [M(t`${L('CA')} = ${m} + ${n} = ${m + n}`), M(t`\frac{${L('DE')}}{${L('AB')}} = \frac{${L('CD')}}{${L('CA')}}`), M(t`${L('DE')} = \frac{${T(AB)}\cdot ${m}}{${m + n}} = ${e}`)],
      DA: [M(t`\frac{${L('CD')}}{${L('CA')}} = \frac{${L('DE')}}{${L('AB')}}`), M(t`${L('CA')} = \frac{${m}\cdot ${T(AB)}}{${e}} = ${m + n}`), M(t`${L('DA')} = ${L('CA')} - ${L('CD')} = ${m + n} - ${m} = ${n}`)]
    }[ask];
    const C = [(m + n) * cos(62), (m + n) * sin(62)], P0 = { A: O0, B: [AB, 0], C, D: lerp(C, O0, m / (m + n)), E: lerp(C, [AB, 0], m / (m + n)) };
    const lb = (s, a, b, o) => (s === ask ? Q(a, b, V[s], o) : Lb(a, b, V[s], o));
    return mk({ verify: () => near(dist(P0.D, P0.E), e) && near(dist(P0.A, P0.B), AB) && near(dist(P0.C, P0.D), m) && near(dist(P0.D, P0.A), n), skill: 'Tales w trójkącie',
      text: t`W trójkącie ${M('ABC')} punkt ${M('D')} leży na boku ${M('AC')}, a punkt ${M('E')} na boku ${M('BC')}, przy czym ${M(t`DE \parallel AB`)}. Dane są: ${given.map(s => M(`${L(s)} = ${T(V[s])}`)).join(', ')}. Oblicz ${M(L(ask))}.`,
      fields: [F(M(L(ask) + ' ='), V[ask])],
      hints: [t`Trójkąty ${M('DEC')} i ${M('ABC')} są podobne (${M(t`DE \parallel AB`)}, wspólny kąt przy ${M('C')}).`, t`Odpowiednie boki są proporcjonalne: ${M(t`\frac{${L('DE')}}{${L('AB')}} = \frac{${L('CD')}}{${L('CA')}}`)}, gdzie ${M(`${L('CA')} = ${L('CD')} + ${L('DA')}`)}.`],
      steps: st, answer: M(`${L(ask)} = ${T(V[ask])}`),
      fig: { P: P0, polys: [['A', 'B', 'C']], segs: [['D', 'E', 'h']], par: [['A', 'B', 0.5], ['D', 'E', 0.5]], pos: { D: [-1, 0.2], E: [1, 0.2] },
        lens: [lb('CD', 'C', 'D', { s: 1 }), lb('DA', 'D', 'A', { s: 1 }), lb('DE', 'D', 'E', { s: -1 }), lb('AB', 'A', 'B', { s: -1 })] } });
  },
  function areaRatio() {
    const [p, q] = pick([[3, 2], [2, 1], [5, 3], [4, 3], [5, 2], [3, 1], [5, 4]]), k = p / q;
    const u = q === 1 ? ri(2, 9) : ri(1, 5), w = ri(2, 6) + 3, P1 = q * q * u, P2 = p * p * u, Ob1 = q * w, Ob2 = p * w;
    return mk({ verify: () => near(P2 / P1, k * k) && near(Ob2 / Ob1, k) && P2 > P1, skill: 'pola figur podobnych',
      text: t`Pola dwóch trójkątów podobnych są równe ${M(P1)} i ${M(P2)}. Obwód mniejszego z tych trójkątów jest równy ${M(Ob1)}. Oblicz skalę podobieństwa większego trójkąta do mniejszego oraz obwód większego trójkąta.`,
      fields: [F(M('k ='), k), F('obwód większego:', Ob2)],
      hints: [t`Stosunek pól figur podobnych jest równy kwadratowi skali: ${M(t`\frac{P_2}{P_1} = k^2`)}.`, t`Stosunek obwodów jest równy samej skali ${M('k')}.`],
      steps: [M(t`k^2 = \frac{${P2}}{${P1}} = ${TF(k * k)} \;\Rightarrow\; k = ${TF(k)}`), M(t`\text{Ob}_2 = k\cdot \text{Ob}_1 = ${T(k)}\cdot ${Ob1} = ${Ob2}`)],
      answer: M(`k = ${T(k)},\\quad \\text{Ob}_2 = ${Ob2}`),
      fig: { P: Object.assign(twoTri(k, [[0, 0], [4, 0], [2.6, 2.4]], ['_A2', '_B2', '_C2']), { _t1: [2, -0.9], _t2: [5.4 + 2 * Math.min(k, 1.7), -0.9] }), hide: ['A', 'B', 'C'], polys: [['A', 'B', 'C'], ['_A2', '_B2', '_C2']],
        txt: [{ p: '_t1', t: 'P = ' + P1 }, { p: '_t2', t: 'P = ' + P2 }] } });
  },
  function midsegment() {
    const e = ri(3, 12), Pd = ri(3, 20), v1 = Math.random() < 0.5, C = [2.2, 4], P0 = { A: O0, B: [6, 0], C, D: mid(O0, C), E: mid([6, 0], C) };
    return mk({ verify: () => near(dist(P0.D, P0.E) / dist(P0.A, P0.B), 0.5) && near(areaP([P0.D, P0.E, P0.C]) / areaP([P0.A, P0.B, P0.C]), 0.25), skill: 'odcinek łączący środki boków',
      text: v1 ? t`Punkty ${M('D')} i ${M('E')} są środkami boków ${M('AC')} i ${M('BC')} trójkąta ${M('ABC')}. Odcinek ${M('DE')} ma długość ${M(e)}, a pole trójkąta ${M('DEC')} jest równe ${M(Pd)}. Oblicz długość boku ${M('AB')} i pole trójkąta ${M('ABC')}.`
        : t`Punkty ${M('D')} i ${M('E')} są środkami boków ${M('AC')} i ${M('BC')} trójkąta ${M('ABC')}, ${M(`${L('AB')} = ${2 * e}`)}, a pole trójkąta ${M('ABC')} jest równe ${M(4 * Pd)}. Oblicz długość odcinka ${M('DE')} i pole czworokąta ${M('ABED')}.`,
      fields: v1 ? [F(M(L('AB') + ' ='), 2 * e), F('pole ABC:', 4 * Pd)] : [F(M(L('DE') + ' ='), e), F('pole ABED:', 3 * Pd)],
      hints: [t`Trójkąt ${M('DEC')} jest podobny do trójkąta ${M('ABC')} w skali ${M(t`\tfrac12`)}: ${M(t`${L('CD')} : ${L('CA')} = 1 : 2`)} i ${M(t`DE \parallel AB`)}.`, t`Odcinek łączący środki dwóch boków ma połowę długości trzeciego boku, a pole trójkąta ${M('DEC')} to ${M(t`\left(\tfrac12\right)^2 = \tfrac14`)} pola trójkąta ${M('ABC')}.`],
      steps: v1 ? [M(t`${L('AB')} = 2\cdot ${L('DE')} = ${2 * e}`), M(t`P_{ABC} = 2^2\cdot P_{DEC} = 4\cdot ${Pd} = ${4 * Pd}`)]
        : [M(t`${L('DE')} = \tfrac12\cdot ${2 * e} = ${e}`), M(t`P_{DEC} = \tfrac14\cdot ${4 * Pd} = ${Pd}`), M(t`P_{ABED} = ${4 * Pd} - ${Pd} = ${3 * Pd}`)],
      answer: v1 ? M(`${L('AB')} = ${2 * e},\\quad P_{ABC} = ${4 * Pd}`) : M(`${L('DE')} = ${e},\\quad P_{ABED} = ${3 * Pd}`),
      fig: { P: P0, polys: [['A', 'B', 'C'], { p: ['D', 'E', 'C'], c: 's' }], segs: [['D', 'E', 'h']], ticks: [['A', 'D', 1], ['D', 'C', 1], ['B', 'E', 2], ['E', 'C', 2]], pos: { D: [-1, 0.2], E: [1, 0.2] },
        lens: [v1 ? Lb('D', 'E', e, { s: -1 }) : Q('D', 'E', e, { s: -1 }), v1 ? Q('A', 'B', 2 * e, { s: -1 }) : Lb('A', 'B', 2 * e, { s: -1 })] } });
  },
  function mapScale() {
    const s = pick([10000, 20000, 25000, 50000]); let a, b; do { a = ri(2, 8); b = ri(2, 8); } while (a === b);
    const A = a * s / 100, B = b * s / 100, Ob = 2 * (A + B), m2 = A * B, ha = m2 / 10000;
    return mk({ verify: () => (() => { const wa = a * s / 100, wb = b * s / 100; return near(wa + wb + wa + wb, Ob) && near(wa * wb / 10000, ha); })(), skill: 'skala mapy',
      text: t`Na mapie w skali ${M(`1 : ${N(s)}`)} działka ma kształt prostokąta o wymiarach ${M(a + t`\ \text{cm}`)} na ${M(b + t`\ \text{cm}`)}. Oblicz rzeczywisty obwód tej działki (w metrach) i jej rzeczywiste pole (w hektarach).`,
      fields: [F('obwód:', Ob, { unit: 'm' }), F('pole:', ha, { unit: 'ha' })],
      hints: [t`Skala ${M(`1 : ${N(s)}`)} oznacza, że ${M(t`1\ \text{cm}`)} na mapie to ${M(N(s) + t`\ \text{cm} = ` + N(s / 100) + t`\ \text{m}`)} w terenie.`, t`Pole policz z rzeczywistych wymiarów w ${M(t`\text{m}^2`)}, a potem zamień: ${M(t`1\ \text{ha} = 10\,000\ \text{m}^2`)}.`],
      steps: [M(t`${a}\ \text{cm} \to ${a}\cdot ${N(s / 100)}\ \text{m} = ${N(A)}\ \text{m},\qquad ${b}\ \text{cm} \to ${N(B)}\ \text{m}`), M(t`\text{Ob} = 2\cdot(${N(A)} + ${N(B)}) = ${N(Ob)}\ \text{m}`), M(t`P = ${N(A)}\cdot ${N(B)} = ${N(m2)}\ \text{m}^2 = ${T(ha)}\ \text{ha}`)],
      answer: t`Obwód ${M(N(Ob) + t`\ \text{m}`)}, pole ${M(T(ha) + t`\ \text{ha}`)}.`,
      fig: { P: rectP(Math.max(a, b), Math.min(a, b)), polys: [['A', 'B', 'C', 'D']], hide: ['A', 'B', 'C', 'D'], lens: [Lb('A', 'B', Math.max(a, b) + ' cm'), Lb('B', 'C', Math.min(a, b) + ' cm')] } });
  }
],
3: [
  function trapezDiag() {
    const m = pick([2, 3, 1.5, 2.5]), half = m % 1 !== 0, cd = half ? 2 * ri(1, 4) : ri(2, 7), ab = cd * m, SC = half ? 2 * ri(1, 4) : ri(2, 6), AS = SC * m;
    const hh = 0.5 * ab, dx = (ab - cd) / 2 * 0.8, P0 = { A: O0, B: [ab, 0], C: [dx + cd, hh], D: [dx, hh] }; P0.S = meet(P0.A, P0.C, P0.B, P0.D);
    const v1 = Math.random() < 0.6, base = { P: P0, polys: [['A', 'B', 'C', 'D']], segs: [['A', 'C'], ['B', 'D']], dots: ['S'], par: [['A', 'B'], ['D', 'C']], pos: { S: [0, -1] } };
    const hints = [t`Trójkąty ${M('ABS')} i ${M('CDS')} są podobne: kąty przy ${M('S')} są wierzchołkowe, a kąty ${M('SAB')} i ${M('SCD')} — naprzemianległe (${M(t`AB \parallel CD`)}).`, t`Skala podobieństwa to ${M(t`k = \frac{${L('AB')}}{${L('CD')}}`)}, więc ${M(`${L('AS')} = k\\cdot ${L('SC')}`)}, a stosunek pól to ${M('k^2')}.`];
    if (v1) return mk({ verify: () => near(dist(P0.A, P0.S) / dist(P0.S, P0.C), m) && near(AS / SC, m) && near(ab / cd, m) && near(areaP([P0.A, P0.B, P0.S]) / areaP([P0.C, P0.D, P0.S]), m * m), skill: 'przekątne trapezu', hints, help: 'Stosunek wpisz jako liczbę lub ułamek, np. 9/4.',
      text: t`W trapezie ${M('ABCD')} podstawy ${M('AB')} i ${M('CD')} mają długości ${M(T(ab))} i ${M(cd)}. Przekątne trapezu przecinają się w punkcie ${M('S')}, a ${M(`${L('AS')} = ${T(AS)}`)}. Oblicz ${M(L('SC'))} oraz stosunek pola trójkąta ${M('ABS')} do pola trójkąta ${M('CDS')}.`,
      fields: [F(M(L('SC') + ' ='), SC), F(M(t`P_{ABS} : P_{CDS} =`), m * m)],
      steps: [M(t`k = \frac{${T(ab)}}{${cd}} = ${T(m)}`), M(t`${L('SC')} = \frac{${L('AS')}}{k} = \frac{${T(AS)}}{${T(m)}} = ${SC}`), M(t`P_{ABS} : P_{CDS} = k^2 = ${T(m * m)}`)],
      answer: M(`${L('SC')} = ${SC},\\quad P_{ABS} : P_{CDS} = ${T(m * m)}`),
      fig: Object.assign(base, { lens: [Lb('A', 'B', ab), Lb('D', 'C', cd), Lb('A', 'S', AS, { s: 1 }), Q('S', 'C', SC, { s: 1 })] }) });
    return mk({ verify: () => near(dist(P0.A, P0.S) / dist(P0.S, P0.C), m) && near(AS / SC, m) && near(ab / cd, m), skill: 'przekątne trapezu', hints,
      text: t`W trapezie ${M('ABCD')} podstawy ${M('AB')} i ${M('CD')} mają długości ${M(T(ab))} i ${M(cd)}, a przekątna ${M('AC')} ma długość ${M(T(AS + SC))}. Przekątne przecinają się w punkcie ${M('S')}. Oblicz długości odcinków ${M('AS')} i ${M('SC')}.`,
      fields: [F(M(L('AS') + ' ='), AS), F(M(L('SC') + ' ='), SC)],
      steps: [t`${M(t`k = \frac{${T(ab)}}{${cd}} = ${T(m)}`)}, więc ${M(t`${L('AS')} = ${T(m)}\cdot ${L('SC')}`)}.`, M(t`${L('AS')} + ${L('SC')} = ${T(AS + SC)} \;\Rightarrow\; ${T(m + 1)}\cdot ${L('SC')} = ${T(AS + SC)} \;\Rightarrow\; ${L('SC')} = ${SC}`), M(t`${L('AS')} = ${T(m)}\cdot ${SC} = ${T(AS)}`)],
      answer: M(`${L('AS')} = ${T(AS)},\\quad ${L('SC')} = ${SC}`),
      fig: Object.assign(base, { lens: [Lb('A', 'B', ab), Lb('D', 'C', cd), Q('A', 'S', AS, { s: 1 }), Q('S', 'C', SC, { s: 1 })] }) });
  },
  function thalesQuadratic() {
    let x0, x1, p, q, s;
    for (;;) {
      x0 = ri(2, 8); x1 = ri(x0 + 1, x0 + 7); s = x1 - x0; const pq = x0 * x1, divs = [];
      for (let d = 2; d <= 12; d++) if (pq % d === 0 && pq / d <= 15 && pq / d >= 2 && d !== x0) divs.push(d);
      if (divs.length) { p = pick(divs); q = pq / p; break; }
    }
    const del = s * s + 4 * p * q, sd = Math.sqrt(del);
    return mk({ skill: 'Tales i równanie kwadratowe',
      text: t`Ramiona kąta o wierzchołku ${M('O')} przecięto prostymi równoległymi ${M('AC')} i ${M('BD')} — punkty ${M('A')} i ${M('B')} leżą na jednym ramieniu, a ${M('C')} i ${M('D')} na drugim (jak na rysunku). Wiadomo, że ${M(`${L('OA')} = x`)}, ${M(`${L('AB')} = ${p}`)}, ${M(`${L('OC')} = ${q}`)} oraz ${M(`${L('CD')} = x + ${s}`)}. Oblicz ${M('x')}.`,
      fields: [F(M('x ='), x0)],
      hints: [t`Z twierdzenia Talesa: ${M(t`\frac{${L('OA')}}{${L('AB')}} = \frac{${L('OC')}}{${L('CD')}}`)}.`, t`Po pomnożeniu „na krzyż” dostaniesz równanie kwadratowe. Długość odcinka musi być dodatnia.`],
      steps: [M(t`\frac{x}{${p}} = \frac{${q}}{x + ${s}} \;\Rightarrow\; x(x + ${s}) = ${p * q}`), M(t`x^2 + ${s === 1 ? '' : s}x - ${p * q} = 0`),
        M(t`\Delta = ${s}^2 + 4\cdot ${p * q} = ${del},\quad \sqrt{\Delta} = ${sd},\quad x_1 = \frac{-${s} - ${sd}}{2} = ${-x1},\quad x_2 = \frac{-${s} + ${sd}}{2} = ${x0}`),
        t`Długość odcinka jest dodatnia, więc ${M(`x = ${x0}`)}.`],
      answer: M(`x = ${x0}`),
      fig: thalesFig(x0, p, q, x0 + s, { OA: { t: 'x', hl: 1, sol: String(x0) }, AB: { t: String(p) }, OC: { t: String(q) }, CD: { t: 'x + ' + s, hl: 1, sol: String(x0 + s) } }),
      verify: () => x0 * (x0 + s) === p * q && isInt(sd) });
  },
  function squareInTriangle() {
    const [a, b] = pick([[3, 6], [6, 3], [4, 12], [12, 4], [6, 12], [12, 6], [10, 15], [15, 10], [9, 18], [18, 9], [4, 4], [6, 6], [12, 18], [18, 12]]);
    const x = a * b / (a + b), P0 = Object.assign(rightTri(a, b), { D: [x, 0], E: [x, x], F: [0, x] });
    return mk({ verify: () => near(x / b + x / a, 1), skill: 'kwadrat w trójkącie',
      text: t`W trójkąt prostokątny ${M('ABC')} o przyprostokątnych ${M(`${L('AC')} = ${b}`)} i ${M(`${L('BC')} = ${a}`)} wpisano kwadrat ${M('CDEF')} tak, że punkt ${M('D')} leży na boku ${M('AC')}, punkt ${M('F')} na boku ${M('BC')}, a punkt ${M('E')} na przeciwprostokątnej ${M('AB')}. Oblicz długość boku kwadratu i jego pole.`,
      fields: [F('bok kwadratu:', x), F('pole kwadratu:', x * x)],
      hints: [t`Trójkąt ${M('ADE')} jest podobny do trójkąta ${M('ACB')}: oba są prostokątne i mają wspólny kąt przy wierzchołku ${M('A')}.`, t`Oznacz bok kwadratu przez ${M('x')}: ${M(`${L('DE')} = x`)}, ${M(`${L('AD')} = ${b} - x`)}. Z podobieństwa: ${M(t`\frac{x}{${b} - x} = \frac{${a}}{${b}}`)}.`],
      steps: [t`Trójkąty ${M('ADE')} i ${M('ACB')} są podobne, więc ${M(t`\frac{${L('DE')}}{${L('AD')}} = \frac{${L('CB')}}{${L('CA')}}`)}, czyli ${M(t`\frac{x}{${b} - x} = \frac{${a}}{${b}}`)}.`, M(t`${b}x = ${a}(${b} - x) \;\Rightarrow\; ${a + b}x = ${a * b} \;\Rightarrow\; x = ${T(x)}`), M(t`P = x^2 = ${T(x * x)}`)],
      answer: t`Bok ${M(T(x))}, pole ${M(T(x * x))}.`,
      fig: { P: P0, polys: [['A', 'B', 'C'], { p: ['C', 'D', 'E', 'F'], c: 's' }], angs: [{ v: 'C', a: 'A', b: 'B', right: 1 }], pos: { D: [-0.5, -1], F: [-1, -0.5], E: [0.7, 0.7] },
        lens: [Lb('C', 'A', b, { at: (x + b) / (2 * b) }), Lb('C', 'B', a, { at: (x + a) / (2 * a) }), Q('D', 'E', x, { t: 'x', s: 1 })] } });
  },
  function areaSplit() {
    const C = [2.4, 4.2], A = O0, B = [6, 0];
    if (Math.random() < 0.55) {
      const [m, n] = pick([[1, 1], [1, 2], [2, 1], [2, 3], [3, 2], [1, 3], [3, 1], [3, 4]]), u = ri(1, 5), Pd = m * m * u, Pa = (m + n) ** 2 * u, k = m / (m + n);
      const P0 = { A, B, C, D: lerp(C, A, k), E: lerp(C, B, k) }; P0._t = [(P0.D[0] + P0.E[0] + C[0]) / 3, (P0.D[1] + P0.E[1] + C[1]) / 3]; P0._u = [3, (P0.D[1]) * 0.45];
      return mk({ verify: () => near(areaP([P0.D, P0.E, P0.C]) / areaP([A, B, C]), Pd / Pa) && near(dist(C, P0.D) / dist(P0.D, A), m / n), skill: 'podział trójkąta',
        text: t`W trójkącie ${M('ABC')} punkt ${M('D')} leży na boku ${M('AC')}, a punkt ${M('E')} na boku ${M('BC')}, przy czym ${M(t`DE \parallel AB`)} oraz ${M(`${L('CD')} : ${L('DA')} = ${m} : ${n}`)}. Pole trójkąta ${M('DEC')} jest równe ${M(Pd)}. Oblicz pole trójkąta ${M('ABC')} i pole trapezu ${M('ABED')}.`,
        fields: [F('pole ABC:', Pa), F('pole ABED:', Pa - Pd)],
        hints: [t`Trójkąt ${M('DEC')} jest podobny do trójkąta ${M('ABC')} w skali ${M(t`\frac{${L('CD')}}{${L('CA')}} = \frac{${m}}{${m + n}}`)}.`, t`Stosunek pól figur podobnych to kwadrat skali.`],
        steps: [t`${M(`${L('CD')} : ${L('CA')} = ${m} : ${m + n}`)}, więc skala ${M(t`k = ${TF(k)}`)}.`, M(t`\frac{P_{DEC}}{P_{ABC}} = k^2 = ${TF(k * k)} \;\Rightarrow\; P_{ABC} = ${Pd}\cdot ${TF(1 / (k * k))} = ${Pa}`), M(t`P_{ABED} = ${Pa} - ${Pd} = ${Pa - Pd}`)],
        answer: M(`P_{ABC} = ${Pa},\\quad P_{ABED} = ${Pa - Pd}`),
        fig: { P: P0, polys: [['A', 'B', 'C'], { p: ['D', 'E', 'C'], c: 's' }], segs: [['D', 'E', 'h']], par: [['A', 'B'], ['D', 'E']], pos: { D: [-1, 0.2], E: [1, 0.2] },
          txt: [{ p: '_t', t: String(Pd), c: 'lb' }, { p: '_u', t: '?', c: 'lb h', sol: String(Pa - Pd) }] } });
    }
    const a = 2 * ri(2, 9), de = R(a / 2, 2), k = Math.SQRT1_2, P0 = { A, B, C, D: lerp(C, A, k), E: lerp(C, B, k) };
    return mk({ verify: () => near(areaP([P0.D, P0.E, C]) / areaP([A, B, C]), 0.5) && near(dist(P0.D, P0.E) / dist(A, B) * a, rv(de)), skill: 'podział trójkąta',
      text: t`Prosta równoległa do boku ${M('AB')} trójkąta ${M('ABC')} przecina boki ${M('AC')} i ${M('BC')} w punktach ${M('D')} i ${M('E')} i dzieli ten trójkąt na dwie części o równych polach. Oblicz ${M(L('DE'))}, jeśli ${M(`${L('AB')} = ${a}`)}.`,
      fields: [F(M(L('DE') + ' ='), de)],
      hints: [t`Trójkąt ${M('DEC')} jest podobny do trójkąta ${M('ABC')}, a jego pole to połowa pola ${M('ABC')}.`, t`Stosunek pól to kwadrat skali: ${M(t`k^2 = \tfrac12`)}, więc ${M(t`k = \frac{\sqrt2}{2}`)}.`],
      steps: [M(t`P_{DEC} = \tfrac12 P_{ABC} \;\Rightarrow\; k^2 = \tfrac12 \;\Rightarrow\; k = \frac{1}{\sqrt2} = \frac{\sqrt2}{2}`), M(t`${L('DE')} = k\cdot ${L('AB')} = \frac{\sqrt2}{2}\cdot ${a} = ${rt(de)}`)],
      answer: M(`${L('DE')} = ${rt(de)}`),
      fig: { P: P0, polys: [['A', 'B', 'C'], { p: ['D', 'E', 'C'], c: 's' }], segs: [['D', 'E', 'h']], par: [['A', 'B'], ['D', 'E']], pos: { D: [-1, 0.2], E: [1, 0.2] }, lens: [Lb('A', 'B', a, { s: -1 }), Q('D', 'E', de, { s: -1 })] } });
  }
]
};

const BANK = { T: GT, C: GC, O: GO, S: GS };
const TOPIC_NAME = { T: 'Trójkąty', C: 'Czworokąty i wielokąty', O: 'Koło i okrąg', S: 'Podobieństwo i Tales' };

const r = String.raw;
const FORM = {
  T: [['suma kątów trójkąta', r`\(\alpha + \beta + \gamma = 180^\circ\)`], ['twierdzenie Pitagorasa', r`\(a^2 + b^2 = c^2\)`],
      ['trójkąt równoboczny', r`\(h = \dfrac{a\sqrt3}{2},\quad P = \dfrac{a^2\sqrt3}{4}\)<br>\(r = \tfrac13 h,\quad R = \tfrac23 h\)`],
      ['pole trójkąta', r`\(P = \tfrac12 a\cdot h = \tfrac12 ab\sin\gamma\)`],
      ['trójkąt prostokątny', r`\(\sin\alpha = \dfrac{a}{c},\ \ \cos\alpha = \dfrac{b}{c},\ \ \operatorname{tg}\alpha = \dfrac{a}{b}\)<br>\(R = \dfrac{c}{2},\quad r = \dfrac{a + b - c}{2}\)`],
      ['twierdzenie cosinusów', r`\(c^2 = a^2 + b^2 - 2ab\cos\gamma\)`],
      ['wartości funkcji', r`\(\begin{array}{c|ccc} & 30^\circ & 45^\circ & 60^\circ\\ \hline \sin & \frac12 & \frac{\sqrt2}{2} & \frac{\sqrt3}{2}\\ \cos & \frac{\sqrt3}{2} & \frac{\sqrt2}{2} & \frac12\\ \operatorname{tg} & \frac{\sqrt3}{3} & 1 & \sqrt3 \end{array}\)<br>\(\sin(180^\circ - \alpha) = \sin\alpha\)<br>\(\cos(180^\circ - \alpha) = -\cos\alpha\)`]],
  C: [['suma kątów n-kąta', r`\((n - 2)\cdot 180^\circ\)`], ['prostokąt i kwadrat', r`\(d^2 = a^2 + b^2,\qquad d_{\text{kwadratu}} = a\sqrt2\)`],
      ['równoległobok', r`\(P = a\cdot h_a = ab\sin\alpha\)<br>kąty przy jednym boku: \(\alpha + \beta = 180^\circ\)`], ['romb', r`\(P = \dfrac{e\cdot f}{2} = a\cdot h = a^2\sin\alpha\)<br>przekątne prostopadłe, dzielą się na połowy`],
      ['trapez', r`\(P = \dfrac{a + b}{2}\cdot h\)`], ['sześciokąt foremny', r`\(P = 6\cdot\dfrac{a^2\sqrt3}{4}\)`]],
  O: [['okrąg i koło', r`\(L = 2\pi r,\qquad P = \pi r^2\)`], ['łuk i wycinek', r`\(l = \dfrac{\alpha}{360^\circ}\cdot 2\pi r,\qquad P = \dfrac{\alpha}{360^\circ}\cdot\pi r^2\)`],
      ['kąty w okręgu', r`kąt wpisany \(= \tfrac12\) kąta środkowego opartego na tym samym łuku; kąt wpisany oparty na średnicy ma \(90^\circ\)`],
      ['styczna', r`styczna jest prostopadła do promienia w punkcie styczności; odcinki stycznych z jednego punktu są równe`],
      ['cięciwa', r`\(\left(\tfrac{c}{2}\right)^2 + d^2 = r^2\) (\(d\) — odległość cięciwy od środka)`]],
  S: [['twierdzenie Talesa', r`\(\dfrac{|OA|}{|AB|} = \dfrac{|OC|}{|CD|}\), gdy \(AC \parallel BD\)`], ['figury podobne w skali k', r`długości i obwód: \(\cdot k\), pole: \(\cdot k^2\)`],
      ['cechy podobieństwa trójkątów', r`bok–bok–bok, bok–kąt–bok, kąt–kąt`], ['odcinek łączący środki boków', r`jest równoległy do trzeciego boku i ma połowę jego długości`]]
};

/* ---- adapter: rysunek ze specyfikacji -> gotowy SVG; punkty wg liczby pól i poziomu ---- */
const hasSol = fg => ['lens', 'angs', 'txt'].some(k => (fg[k] || []).some(g => g.sol != null));
const dedupe = x => String(x).replace(/(\\frac\{[^{}]+\}\{[^{}]+\}) = \1(?![\d{^])/g, '$1');
function adapt(g, lv) {
  const f = function () {
    const k = g(), spec = k.fig;
    if (spec) { k.fig = '<p class="cap">Rysunek pomocniczy</p>' + figSVG(spec, false); if (hasSol(spec)) k.solFig = '<p class="cap">Rysunek z wynikami</p>' + figSVG(spec, true); }
    k.steps = k.steps.map(dedupe); k.answer = dedupe(k.answer);
    k.check = k.verify || null;
    k.pts = k.choices ? 1 : Math.min(4, Math.max(lv === 1 ? 1 : 2, k.fields.length + (lv === 3 ? 1 : 0)));
    return k;
  };
  Object.defineProperty(f, 'name', { value: g.name });
  return f;
}
const bank = {};
for (const tp of Object.keys(BANK)) { bank[tp] = {}; for (const lv of [1, 2, 3]) bank[tp][lv] = BANK[tp][lv].map(g => adapt(g, lv)); }

MATURA.dzial({
  id: 'planimetria', store: 'planimetria-matura-v1', title: 'Planimetria', seq: 'α + β + γ = 180°',
  lead: 'Trójkąty, czworokąty, koło i okrąg oraz podobieństwo. Każde zadanie ma rysunek, a rozwiązanie – rysunek z wynikami.',
  topics: TOPIC_NAME, short: { C: 'Czworokąty', S: 'Podobieństwo' },
  bank: bank, formulas: FORM
});
})();
