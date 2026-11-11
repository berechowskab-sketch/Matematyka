/* Dział VI: Ciągi — arytmetyczny, geometryczny, inne ciągi.
   Zadania przeniesione z pierwszej wersji aplikacji (ciagi.html); poniżej jej lokalne narzędzia, a na końcu adapter do wspólnego silnika. */
(function () {
const E = { mk: mk, txt: txt };
const t = String.raw;
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const nz = (a, b) => { let x; do { x = ri(a, b); } while (x === 0); return x; };
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));

function frac(x) { for (let d = 1; d <= 1000; d++) { const p = Math.round(x * d); if (Math.abs(p / d - x) < 1e-9) return [p, d]; } return null; }
function D(x, dig = 6) { if (Object.is(x, -0)) x = 0; return String(+x.toFixed(dig)).replace('.', '{,}'); }
function T(x) {
  if (Object.is(x, -0) || Math.abs(x) < 1e-12) return '0';
  if (Number.isInteger(x)) return String(x);
  const f = frac(x);
  if (f) { const [p, d] = f; return (p < 0 ? '-' : '') + t`\frac{${Math.abs(p)}}{${d}}`; }
  return D(x);
}
const P = x => (x < 0 ? `(${T(x)})` : T(x));
const PW = x => (x < 0 || !Number.isInteger(x) ? t`\left(${T(x)}\right)` : T(x));
const PD = x => (x < 0 ? `(${D(x)})` : D(x));
const M = s => t`\(${s}\)`;
function txt(x) {
  if (Number.isInteger(x)) return String(x).replace('-', '−');
  const s = +x.toFixed(4);
  if (Math.abs(s - x) < 1e-12) return String(s).replace('.', ',').replace('-', '−');
  const f = frac(x); if (f) return (f[0] < 0 ? '−' : '') + Math.abs(f[0]) + '/' + f[1];
  return String(+x.toFixed(6)).replace('.', ',').replace('-', '−');
}
function poly(cs, v = 'n') {
  const deg = cs.length - 1; let s = '';
  cs.forEach((c, i) => {
    const p = deg - i; if (c === 0) return;
    const a = Math.abs(c);
    const vv = p === 0 ? '' : (p === 1 ? v : `${v}^{${p}}`);
    const term = p === 0 ? T(a) : ((a === 1 ? '' : T(a)) + vv);
    s += s === '' ? (c < 0 ? '-' : '') + term : ` ${c < 0 ? '-' : '+'} ${term}`;
  });
  return s || '0';
}
const pw = (b, e) => Math.pow(b, e);
const cf = (c, v) => (c === 0 ? '0' : c === 1 ? v : c === -1 ? '-' + v : c + v);
const ar = i => (i === 1 ? 'a_1' : `a_1 + ${cf(i - 1, 'r')}`);
function quadSteps(a, b, c, v) {
  const del = b * b - 4 * a * c, s = Math.sqrt(del);
  const r1 = (-b - s) / (2 * a), r2 = (-b + s) / (2 * a);
  return { del, s, r1, r2,
    tex: t`\Delta = ${P(b)}^2 - 4\cdot ${P(a)}\cdot ${P(c)} = ${del},\quad \sqrt{\Delta} = ${T(s)},\quad ${v}_1 = \frac{${T(-b)} - ${T(s)}}{${T(2 * a)}} = ${T(r1)},\quad ${v}_2 = \frac{${T(-b)} + ${T(s)}}{${T(2 * a)}} = ${T(r2)}` };
}

function mk(o) { return Object.assign({ fields: [], choices: null, hints: [], steps: [], plot: null, verify: null }, o); }
const F = (label, ans, extra) => Object.assign({ label, ans }, extra || {});
const SET_HELP = 'Jeśli jest kilka odpowiedzi, oddziel je średnikiem, np. 3; −1.';

/* ---------- CIĄG ARYTMETYCZNY ---------- */
const GA = {
1: [
  function nthTerm() {
    const a1 = ri(-9, 15), r = nz(-6, 7), n = ri(7, 25), an = a1 + (n - 1) * r;
    return mk({ verify: () => { let x = a1; for (let i = 1; i < n; i++) x += r; return x === an; }, skill: 'n-ty wyraz',
      text: t`W ciągu arytmetycznym ${M('(a_n)')} dane są ${M(`a_1 = ${a1}`)} oraz ${M(`r = ${r}`)}. Oblicz wyraz ${M(`a_{${n}}`)}.`,
      fields: [F(M(`a_{${n}} =`), an)],
      hints: [t`Skorzystaj ze wzoru ${M(t`a_n = a_1 + (n-1)\cdot r`)}.`, t`Różnicę mnożysz przez ${M(`${n}-1=${n - 1}`)}, a nie przez ${M(`${n}`)}.`],
      steps: [t`Wzór na ${M('n')}-ty wyraz ciągu arytmetycznego: ${M(t`a_n = a_1 + (n-1)\cdot r`)}.`,
        t`Podstawiamy ${M(`n = ${n}`)}: ${M(t`a_{${n}} = ${a1} + (${n}-1)\cdot ${P(r)} = ${a1} + ${n - 1}\cdot ${P(r)} = ${an}`)}.`],
      answer: M(`a_{${n}} = ${an}`), plot: { f: k => a1 + (k - 1) * r, hi: n } });
  },
  function fromTerms() {
    const a1 = ri(-10, 12), r = nz(-5, 6), n = ri(8, 15), an = a1 + (n - 1) * r;
    const first = [0, 1, 2, 3].map(i => a1 + i * r);
    return mk({ verify: () => { const d0 = first[1] - first[0]; let x = first[0]; for (let i = 1; i < n; i++) x += d0; return d0 === r && first[3] - first[2] === r && x === an; }, skill: 'różnica i n-ty wyraz',
      text: t`Początkowe wyrazy ciągu arytmetycznego to ${M(first.join(',\\ ') + t`,\ \ldots`)}. Wyznacz różnicę ${M('r')} tego ciągu i oblicz ${M(`a_{${n}}`)}.`,
      fields: [F(M('r ='), r), F(M(`a_{${n}} =`), an)],
      hints: [t`Różnica to ${M('r = a_2 - a_1')}. Sprawdź ją na kolejnej parze wyrazów.`, t`Potem użyj wzoru ${M(t`a_n = a_1 + (n-1)r`)}.`],
      steps: [t`${M(`r = a_2 - a_1 = ${first[1]} - ${P(first[0])} = ${r}`)} (sprawdzenie: ${M(`${first[2]} - ${P(first[1])} = ${r}`)}).`,
        M(t`a_{${n}} = a_1 + ${n - 1}r = ${a1} + ${n - 1}\cdot ${P(r)} = ${an}`)],
      answer: M(`r = ${r},\\quad a_{${n}} = ${an}`), plot: { f: k => a1 + (k - 1) * r, hi: n } });
  },
  function sumEnds() {
    const a1 = ri(-5, 12), r = nz(-3, 5), n = ri(8, 30), an = a1 + (n - 1) * r, S = (a1 + an) * n / 2;
    return mk({ verify: () => { let x = a1, tot = 0; for (let i = 1; i <= n; i++) { tot += x; if (i < n) x += r; } return tot === S && x === an; }, skill: 'suma wyrazów',
      text: t`Ciąg arytmetyczny ma ${M(`${n}`)} wyrazów. Pierwszy wyraz jest równy ${M(`${a1}`)}, a ostatni ${M(`${an}`)}. Oblicz sumę wszystkich wyrazów tego ciągu.`,
      fields: [F(M(`S_{${n}} =`), S)],
      hints: [t`Gdy znasz pierwszy i ostatni wyraz, użyj wzoru ${M(t`S_n = \frac{a_1 + a_n}{2}\cdot n`)}.`, t`Dodaj pierwszy i ostatni wyraz, podziel przez ${M(2)} i pomnóż przez liczbę wyrazów. Uważaj na znaki przy liczbach ujemnych.`],
      steps: [t`Wzór: ${M(t`S_n = \frac{a_1 + a_n}{2}\cdot n`)}.`,
        M(t`S_{${n}} = \frac{${a1} + ${P(an)}}{2}\cdot ${n} = \frac{${a1 + an}}{2}\cdot ${n} = ${S}`)],
      answer: M(`S_{${n}} = ${S}`), plot: { f: k => a1 + (k - 1) * r } });
  },
  function middle() {
    const x = ri(-8, 15), d = nz(-9, 9), a = x - d, c = x + d, last = Math.random() < 0.35;
    if (!last) return mk({ verify: () => x - a === c - x, skill: 'warunek 2b = a + c',
      text: t`Liczby ${M(`${a}`)}, ${M('x')}, ${M(`${c}`)} w podanej kolejności tworzą ciąg arytmetyczny. Oblicz ${M('x')}.`,
      fields: [F(M('x ='), x)],
      hints: [t`Środkowy wyraz ciągu arytmetycznego jest średnią arytmetyczną sąsiadów: ${M(t`b = \frac{a + c}{2}`)}.`, t`Dodaj oba skrajne wyrazy i podziel sumę przez ${M(2)}.`],
      steps: [t`Warunek ciągu arytmetycznego: ${M('2b = a + c')}, czyli ${M(`2x = ${a} + ${P(c)}`)}.`, M(t`2x = ${a + c} \;\Rightarrow\; x = ${x}`)],
      answer: M(`x = ${x}`), plot: { f: k => a + (k - 1) * d, hi: 2 } });
    return mk({ verify: () => c - x === x - a && 2 * x === a + c, skill: 'warunek 2b = a + c',
      text: t`Liczby ${M(`${a}`)}, ${M(`${x}`)}, ${M('y')} w podanej kolejności tworzą ciąg arytmetyczny. Oblicz ${M('y')}.`,
      fields: [F(M('y ='), c)],
      hints: [t`Zapisz warunek ${M('2b = a + c')} i wyznacz z niego ${M('c')}.`, t`Pomnóż środkowy wyraz przez ${M(2)} i odejmij pierwszy wyraz – zostanie ${M('c')}.`],
      steps: [t`${M(`2\\cdot ${P(x)} = ${a} + y`)}, więc ${M(`y = ${2 * x} - ${P(a)} = ${c}`)}.`, t`Sposób 2: ${M(`r = ${x} - ${P(a)} = ${d}`)}, więc ${M(`y = ${x} + ${P(d)} = ${c}`)}.`],
      answer: M(`y = ${c}`), plot: { f: k => a + (k - 1) * d, hi: 3 } });
  }
],
2: [
  function twoTerms() {
    const a1 = ri(-10, 12), r = nz(-6, 6), k = ri(2, 5), m = k + ri(2, 6), ak = a1 + (k - 1) * r, am = a1 + (m - 1) * r;
    return mk({ verify: () => { const seq = [a1]; for (let i = 1; i < m; i++) seq.push(seq[i - 1] + r); return seq[k - 1] === ak && seq[m - 1] === am; }, skill: 'a₁ i r z dwóch wyrazów',
      text: t`W ciągu arytmetycznym ${M('(a_n)')} dane są ${M(`a_{${k}} = ${ak}`)} oraz ${M(`a_{${m}} = ${am}`)}. Wyznacz pierwszy wyraz ${M('a_1')} i różnicę ${M('r')} tego ciągu.`,
      fields: [F(M('a_1 ='), a1), F(M('r ='), r)],
      hints: [t`Między ${M(`a_{${k}}`)} a ${M(`a_{${m}}`)} jest ${M(`${m - k}`)} „kroków” o długości ${M('r')}: ${M(`a_{${m}} - a_{${k}} = ${m - k}r`)}.`, t`Gdy znasz ${M('r')}, cofnij się od ${M(`a_{${k}}`)}: ${M(`a_1 = a_{${k}} - ${cf(k - 1, 'r')}`)}.`],
      steps: [M(t`a_{${m}} - a_{${k}} = (${m} - ${k})\,r \;\Rightarrow\; ${am} - ${P(ak)} = ${m - k}r \;\Rightarrow\; r = \frac{${am - ak}}{${m - k}} = ${r}`),
        M(t`a_1 = a_{${k}} - ${cf(k - 1, 'r')} = ${ak} - ${k - 1 === 1 ? P(r) : (k - 1) + '\\cdot ' + P(r)} = ${a1}`)],
      answer: M(`a_1 = ${a1},\\quad r = ${r}`), plot: { f: q => a1 + (q - 1) * r } });
  },
  function whichTerm() {
    const a1 = ri(-20, 20), r = nz(-7, 7), n = ri(10, 45), V = a1 + (n - 1) * r;
    return mk({ skill: 'który to wyraz?',
      text: t`Ciąg arytmetyczny ${M('(a_n)')} ma pierwszy wyraz ${M(`a_1 = ${a1}`)} i różnicę ${M(`r = ${r}`)}. Który wyraz tego ciągu jest równy ${M(`${V}`)}?`,
      fields: [F(M('n ='), n)],
      hints: [t`Ułóż równanie ${M(`${a1} + (n-1)\\cdot ${P(r)} = ${V}`)} i rozwiąż je.`, t`Wynik musi być liczbą naturalną dodatnią.`],
      steps: [M(t`a_n = ${a1} + (n-1)\cdot ${P(r)} = ${V}`), M(t`(n-1)\cdot ${P(r)} = ${V - a1} \;\Rightarrow\; n - 1 = ${n - 1} \;\Rightarrow\; n = ${n}`)],
      answer: t`To wyraz ${M(`a_{${n}}`)}.`, plot: null,
      verify: () => { const hits = []; for (let k = 1; k <= 500; k++) if (a1 + (k - 1) * r === V) hits.push(k); return hits.length === 1 && hits[0] === n; } });
  },
  function sumA1r() {
    const a1 = ri(-15, 15), r = nz(-5, 6), n = ri(10, 30), S = n * a1 + n * (n - 1) * r / 2;
    return mk({ verify: () => { let x = a1, tot = 0; for (let i = 1; i <= n; i++) { tot += x; x += r; } return tot === S; }, skill: 'suma n wyrazów',
      text: t`W ciągu arytmetycznym ${M('(a_n)')} dane są ${M(`a_1 = ${a1}`)} i ${M(`r = ${r}`)}. Oblicz sumę ${M(`${n}`)} początkowych wyrazów tego ciągu.`,
      fields: [F(M(`S_{${n}} =`), S)],
      hints: [t`Użyj wzoru ${M(t`S_n = \frac{2a_1 + (n-1)r}{2}\cdot n`)}. Nie musisz liczyć ostatniego wyrazu.`, t`W liczniku jest ${M('2a_1 + (n-1)r')}: różnicę mnożysz przez ${M('n - 1')}, a nie przez ${M('n')}.`],
      steps: [t`Wzór: ${M(t`S_n = \frac{2a_1 + (n-1)r}{2}\cdot n`)}.`,
        M(t`S_{${n}} = \frac{2\cdot ${P(a1)} + ${n - 1}\cdot ${P(r)}}{2}\cdot ${n} = \frac{${2 * a1 + (n - 1) * r}}{2}\cdot ${n} = ${S}`)],
      answer: M(`S_{${n}} = ${S}`), plot: { f: k => a1 + (k - 1) * r } });
  },
  function paramX() {
    const x = ri(-6, 8), p = ri(-5, 8), k = pick([2, 3]);
    let s = ri(-6, 9); if (((1 + k) * x + p + s) % 2 !== 0) s += 1;
    const c = ((1 + k) * x + p + s) / 2;
    return mk({ skill: 'wyrazy z niewiadomą',
      text: t`Liczby ${M(poly([1, p], 'x'))}, ${M(`${c}`)}, ${M(poly([k, s], 'x'))} w podanej kolejności tworzą ciąg arytmetyczny. Oblicz ${M('x')}.`,
      fields: [F(M('x ='), x)],
      hints: [t`Środkowy wyraz razy 2 równa się sumie skrajnych: ${M(`2\\cdot ${P(c)} = (${poly([1, p], 'x')}) + (${poly([k, s], 'x')})`)}.`, t`Po prawej stronie dodaj osobno wyrazy z ${M('x')} i osobno liczby, a potem rozwiąż równanie liniowe.`],
      steps: [t`Warunek ${M('2b = a + c')}: ${M(`2\\cdot ${P(c)} = (${poly([1, p], 'x')}) + (${poly([k, s], 'x')})`)}.`,
        M(t`${2 * c} = ${poly([1 + k, p + s], 'x')} \;\Rightarrow\; ${T(1 + k)}x = ${2 * c - p - s} \;\Rightarrow\; x = ${x}`),
        t`Sprawdzenie: wyrazy to ${M(`${x + p},\\ ${c},\\ ${k * x + s}`)} – różnica ${M(`${c - x - p}`)}.`],
      answer: M(`x = ${x}`), verify: () => 2 * c === (x + p) + (k * x + s) });
  },
  function word() {
    if (Math.random() < 0.5) {
      const f = ri(10, 24), d = ri(1, 4), n = ri(12, 30), an = f + (n - 1) * d, S = (f + an) * n / 2;
      return mk({ verify: () => { let x = f, tot = 0, last = f; for (let i = 1; i <= n; i++) { tot += x; last = x; x += d; } return tot === S && last === an; }, skill: 'zadanie z treścią',
        text: t`W amfiteatrze jest ${n} rzędów. W pierwszym rzędzie jest ${f} miejsc, a w każdym następnym o ${d} ${d === 1 ? 'miejsce' : 'miejsca'} więcej niż w poprzednim. Ile miejsc jest w ostatnim rzędzie, a ile w całym amfiteatrze?`,
        fields: [F('ostatni rząd:', an, { unit: 'miejsc' }), F('razem:', S, { unit: 'miejsc' })],
        hints: [t`Liczby miejsc w rzędach tworzą ciąg arytmetyczny: ${M(`a_1 = ${f}`)}, ${M(`r = ${d}`)}, ${M(`n = ${n}`)}.`, t`Ostatni rząd to ${M(`a_{${n}}`)}, wszystkie miejsca to ${M(`S_{${n}}`)}.`],
        steps: [t`${M(`a_1 = ${f},\\ r = ${d}`)}. Ostatni rząd: ${M(`a_{${n}} = ${f} + ${n - 1}\\cdot ${d} = ${an}`)}.`,
          t`Wszystkie miejsca: ${M(t`S_{${n}} = \frac{${f} + ${an}}{2}\cdot ${n} = ${S}`)}.`],
        answer: t`Ostatni rząd: ${an} miejsc, razem: ${S} miejsc.`, plot: { f: k => f + (k - 1) * d } });
    }
    const s = ri(5, 30) * 10, d = pick([10, 20, 25, 30, 50]), n = pick([10, 12, 15, 18, 24]), an = s + (n - 1) * d, S = (s + an) * n / 2;
    return mk({ verify: () => { let x = s, tot = 0, last = s; for (let i = 1; i <= n; i++) { tot += x; last = x; x += d; } return tot === S && last === an; }, skill: 'zadanie z treścią',
      text: t`Ola oszczędza na wakacje. W pierwszym miesiącu odłożyła ${s} zł, a w każdym następnym miesiącu odkładała o ${d} zł więcej niż w poprzednim. Ile odłożyła w ostatnim, ${n}. miesiącu, a ile łącznie przez ${n} miesięcy?`,
      fields: [F(`${n}. miesiąc:`, an, { unit: 'zł' }), F('łącznie:', S, { unit: 'zł' })],
      hints: [t`Kwoty tworzą ciąg arytmetyczny: ${M(`a_1 = ${s}`)}, ${M(`r = ${d}`)}.`, t`Łączna kwota to ${M(`S_{${n}}`)}.`],
      steps: [M(t`a_{${n}} = ${s} + ${n - 1}\cdot ${d} = ${an}`), M(t`S_{${n}} = \frac{${s} + ${an}}{2}\cdot ${n} = ${S}`)],
      answer: t`W ${n}. miesiącu ${an} zł, łącznie ${S} zł.`, plot: { f: k => s + (k - 1) * d } });
  }
],
3: [
  function multiples() {
    let lo, hi, d, label;
    if (Math.random() < 0.6) { lo = 10; hi = 99; d = ri(3, 19); label = 'dwucyfrowych'; }
    else { lo = 100; hi = 999; d = ri(11, 45); label = 'trzycyfrowych'; }
    const first = Math.ceil(lo / d) * d, last = Math.floor(hi / d) * d, n = (last - first) / d + 1, S = (first + last) * n / 2;
    return mk({ skill: 'suma wielokrotności',
      text: t`Ile jest liczb ${label} podzielnych przez ${M(`${d}`)}? Oblicz sumę wszystkich takich liczb.`,
      fields: [F('ile liczb:', n), F('suma:', S)],
      hints: [t`Te liczby tworzą ciąg arytmetyczny o różnicy ${M(`${d}`)}. Znajdź najmniejszą i największą z nich.`, t`Liczbę wyrazów wyznacz z ${M(`a_n = a_1 + (n-1)\\cdot ${d}`)} – nie zapomnij o „+1”.`],
      steps: [t`Najmniejsza taka liczba to ${M(`${first}`)}, największa ${M(`${last}`)}. Tworzą ciąg arytmetyczny: ${M(`a_1 = ${first},\\ r = ${d}`)}.`,
        M(t`${last} = ${first} + (n-1)\cdot ${d} \;\Rightarrow\; n - 1 = ${n - 1} \;\Rightarrow\; n = ${n}`),
        M(t`S_{${n}} = \frac{${first} + ${last}}{2}\cdot ${n} = ${S}`)],
      answer: t`Jest ${n} takich liczb, ich suma to ${S}.`,
      verify: () => { let c = 0, s = 0; for (let x = lo; x <= hi; x++) if (x % d === 0) { c++; s += x; } return c === n && s === S && n >= 3; } });
  },
  function snFormula() {
    const p = pick([1, 2, 3, -1, -2]), q = ri(-6, 8), k = ri(6, 15), a1 = p + q, r = 2 * p, ak = p * (2 * k - 1) + q;
    const Sn = n => p * n * n + q * n;
    return mk({ skill: 'ciąg z wzoru na Sₙ',
      text: t`Suma ${M('n')} początkowych wyrazów ciągu ${M('(a_n)')} jest dana wzorem ${M(`S_n = ${poly([p, q, 0])}`)} dla ${M(t`n \geq 1`)}. Wyznacz pierwszy wyraz, różnicę tego (arytmetycznego) ciągu oraz wyraz ${M(`a_{${k}}`)}.`,
      fields: [F(M('a_1 ='), a1), F(M('r ='), r), F(M(`a_{${k}} =`), ak)],
      hints: [t`${M('a_1 = S_1')}, a dla ${M(t`n \geq 2`)}: ${M('a_n = S_n - S_{n-1}')}.`, t`Policz ${M('a_2 = S_2 - S_1')} i odejmij ${M('a_1')}, żeby dostać ${M('r')}.`],
      steps: [M(t`a_1 = S_1 = ${T(p)} + ${P(q)} = ${a1}`),
        M(t`S_2 = ${Sn(2)},\quad a_2 = S_2 - S_1 = ${Sn(2)} - ${P(a1)} = ${a1 + r},\quad r = a_2 - a_1 = ${r}`),
        t`Ogólnie ${M(`a_n = S_n - S_{n-1} = ${poly([2 * p, q - p])}`)}, więc ${M(`a_{${k}} = ${ak}`)}. Albo: ${M(`a_{${k}} = S_{${k}} - S_{${k - 1}} = ${Sn(k)} - ${P(Sn(k - 1))} = ${ak}`)}.`],
      answer: M(`a_1 = ${a1},\\ r = ${r},\\ a_{${k}} = ${ak}`), plot: { f: n => p * (2 * n - 1) + q, hi: k },
      verify: () => Sn(k) - Sn(k - 1) === ak && Sn(1) === a1 && Sn(2) - 2 * Sn(1) === r });
  },
  function system() {
    let a1, r, i, j, k, X, Y, det;
    do { a1 = ri(-10, 10); r = nz(-5, 6); i = ri(1, 4); j = ri(i + 2, i + 7); k = ri(2, 10);
      det = (i + j - 2) - 2 * (k - 1); } while (k === i || k === j || det === 0);
    X = 2 * a1 + (i + j - 2) * r; Y = a1 + (k - 1) * r;
    return mk({ skill: 'układ równań',
      text: t`W ciągu arytmetycznym ${M('(a_n)')} spełnione są warunki ${M(`a_{${i}} + a_{${j}} = ${X}`)} oraz ${M(`a_{${k}} = ${Y}`)}. Wyznacz ${M('a_1')} i ${M('r')}.`,
      fields: [F(M('a_1 ='), a1), F(M('r ='), r)],
      hints: [t`Zapisz każdy wyraz przez ${M('a_1')} i ${M('r')}, np. ${M(`a_{${j}} = a_1 + ${j - 1}r`)}.`, t`Otrzymasz układ dwóch równań z niewiadomymi ${M('a_1')}, ${M('r')}.`],
      steps: [M(t`\begin{cases} (${ar(i)}) + (${ar(j)}) = ${X} \\ ${ar(k)} = ${Y} \end{cases} \;\Rightarrow\; \begin{cases} 2a_1 + ${i + j - 2}r = ${X} \\ a_1 = ${Y} - ${cf(k - 1, 'r')} \end{cases}`),
        t`Podstawiamy: ${M(t`2(${Y} - ${cf(k - 1, 'r')}) + ${i + j - 2}r = ${X} \;\Rightarrow\; ${cf(det, 'r')} = ${X - 2 * Y} \;\Rightarrow\; r = ${r}`)}.`,
        M(t`a_1 = ${Y} - ${k - 1 === 1 ? P(r) : (k - 1) + '\\cdot ' + P(r)} = ${a1}`)],
      answer: M(`a_1 = ${a1},\\quad r = ${r}`), plot: { f: n => a1 + (n - 1) * r },
      verify: () => (a1 + (i - 1) * r) + (a1 + (j - 1) * r) === X && a1 + (k - 1) * r === Y });
  },
  function threeNumbers() {
    const m = ri(2, 10), r = ri(1, 9), S = 3 * m, Pr = m * m - r * r;
    return mk({ skill: 'trzy liczby',
      text: t`Trzy liczby tworzą rosnący ciąg arytmetyczny. Ich suma jest równa ${M(`${S}`)}, a iloczyn pierwszej i trzeciej liczby jest równy ${M(`${Pr}`)}. Wyznacz te liczby.`,
      fields: [F('pierwsza:', m - r), F('druga:', m), F('trzecia:', m + r)],
      hints: [t`Oznacz liczby jako ${M('b - r,\\ b,\\ b + r')}. Ich suma to ${M('3b')}.`, t`${M('(b-r)(b+r) = b^2 - r^2')}. Ciąg jest rosnący, więc ${M('r > 0')}.`],
      steps: [t`Liczby: ${M('b-r,\\ b,\\ b+r')}. Suma: ${M(`3b = ${S}`)}, więc ${M(`b = ${m}`)}.`,
        M(t`(${m} - r)(${m} + r) = ${Pr} \;\Rightarrow\; ${m * m} - r^2 = ${Pr} \;\Rightarrow\; r^2 = ${r * r}`),
        t`Ciąg jest rosnący, więc ${M('r > 0')}, czyli ${M(`r = ${r}`)}.`],
      answer: t`Liczby: ${M(`${m - r},\\ ${m},\\ ${m + r}`)}.`,
      verify: () => (m - r) + m + (m + r) === S && (m - r) * (m + r) === Pr && r > 0 });
  },
  function findN() {
    const a1 = ri(1, 12), r = ri(1, 6), n = ri(6, 25), V = n * a1 + n * (n - 1) * r / 2;
    const q = quadSteps(r, 2 * a1 - r, -2 * V, 'n');
    return mk({ skill: 'ile wyrazów?',
      text: t`Ciąg arytmetyczny ma pierwszy wyraz ${M(`a_1 = ${a1}`)} i różnicę ${M(`r = ${r}`)}. Ile początkowych wyrazów tego ciągu trzeba dodać, aby otrzymać sumę ${M(`${V}`)}?`,
      fields: [F(M('n ='), n)],
      hints: [t`Podstaw do ${M(t`S_n = \frac{2a_1 + (n-1)r}{2}\cdot n`)} i przyrównaj do ${M(`${V}`)}.`, t`Wyjdzie równanie kwadratowe z niewiadomą ${M('n')}. Odrzuć rozwiązanie, które nie jest liczbą naturalną.`],
      steps: [M(t`\frac{2\cdot ${a1} + (n-1)\cdot ${r}}{2}\cdot n = ${V} \;\Rightarrow\; (${poly([r, 2 * a1 - r])})\,n = ${2 * V}`),
        M(t`${poly([r, 2 * a1 - r, -2 * V])} = 0`), M(q.tex),
        t`${M('n')} musi być liczbą naturalną, więc ${M(`n = ${n}`)}.`],
      answer: t`Liczba wyrazów, które trzeba dodać: ${M(`${n}`)}.`, plot: { f: k => a1 + (k - 1) * r },
      verify: () => { let s = 0; for (let k = 1; k <= 200; k++) { s += a1 + (k - 1) * r; if (s === V) return k === n && near(q.r2, n) && q.r1 < 1; } return false; } });
  },
  function arithToGeo() {
    for (let guard = 0; guard < 500; guard++) {
      const m = ri(3, 9), r = ri(1, 5), q = pick([2, 3]), g1 = ri(1, 14);
      const u = g1 - (m - r), v = g1 * q - m, w = g1 * q * q - (m + r);
      if (u < 1 || v < 1 || w < 1 || u > 20 || v > 30 || w > 40) continue;
      const A = m + u, B = m + w, C = (m + v) * (m + v);
      const other = A - B - r; if (other > 0) continue;
      const bq = -(A - B), cq = C - A * B, qs = quadSteps(1, bq, cq, 'r');
      if (qs.del < 0) continue;
      return mk({ skill: 'arytmetyczny → geometryczny',
        text: t`Trzy liczby, których suma jest równa ${M(`${3 * m}`)}, tworzą rosnący ciąg arytmetyczny. Jeśli do pierwszej z nich dodamy ${M(`${u}`)}, do drugiej ${M(`${v}`)}, a do trzeciej ${M(`${w}`)}, to otrzymamy ciąg geometryczny. Wyznacz te liczby.`,
        fields: [F('pierwsza:', m - r), F('druga:', m), F('trzecia:', m + r)],
        hints: [t`Zapisz liczby jako ${M('b-r,\\ b,\\ b+r')}. Z sumy od razu wyznaczysz ${M('b')}.`, t`Nowe liczby tworzą ciąg geometryczny, więc kwadrat środkowej równa się iloczynowi skrajnych.`],
        steps: [t`Liczby: ${M('b-r,\\ b,\\ b+r')}, suma ${M(`3b = ${3 * m}`)}, więc ${M(`b = ${m}`)}.`,
          t`Po dodaniu: ${M(`${A} - r,\\ ${m + v},\\ ${B} + r`)}. Warunek ciągu geometrycznego: ${M(`${m + v}^2 = (${A} - r)(${B} + r)`)}.`,
          M(t`${C} = ${poly([-1, A - B, A * B], 'r')} \;\Rightarrow\; ${poly([1, bq, cq], 'r')} = 0`), M(qs.tex),
          t`Ciąg arytmetyczny jest rosnący, więc ${M('r > 0')}: ${M(`r = ${r}`)}. Liczby: ${M(`${m - r},\\ ${m},\\ ${m + r}`)}, a po dodaniu ${M(`${g1},\\ ${g1 * q},\\ ${g1 * q * q}`)} (iloraz ${M(`${q}`)}).`],
        answer: t`Liczby: ${M(`${m - r},\\ ${m},\\ ${m + r}`)}.`,
        verify: () => { const x = m - r, y = m, z = m + r; const roots = [qs.r1, qs.r2].filter(v2 => v2 > 1e-9); return x + y + z === 3 * m && (y + v) ** 2 === (x + u) * (z + w) && roots.length === 1 && near(roots[0], r); } });
    }
    return GA[3][3]();
  }
]
};

/* ---------- CIĄG GEOMETRYCZNY ---------- */
const GG = {
1: [
  function nthTerm() {
    let a1, q, n;
    if (Math.random() < 0.7) { a1 = pick([1, 2, 3, 4, 5, -1, -2, -3]); q = pick([2, 3, -2, -3]); n = ri(4, Math.abs(q) === 3 ? 6 : 7); }
    else { q = 0.5; n = ri(4, 7); a1 = pw(2, n - 1) * pick([1, 3, 5]); }
    const an = a1 * pw(q, n - 1);
    return mk({ verify: () => { let x = a1; for (let i = 1; i < n; i++) x *= q; return near(x, an); }, skill: 'n-ty wyraz',
      text: t`W ciągu geometrycznym ${M('(a_n)')} dane są ${M(`a_1 = ${a1}`)} oraz ${M(`q = ${T(q)}`)}. Oblicz wyraz ${M(`a_{${n}}`)}.`,
      fields: [F(M(`a_{${n}} =`), an)],
      hints: [t`Skorzystaj ze wzoru ${M(t`a_n = a_1\cdot q^{n-1}`)}.`, t`Potęga to ${M(`${n}-1 = ${n - 1}`)}. Najpierw potęgujesz iloraz, dopiero potem mnożysz przez ${M('a_1')}.`],
      steps: [t`Wzór: ${M(t`a_n = a_1\cdot q^{n-1}`)}.`,
        M(t`a_{${n}} = ${a1}\cdot ${PW(q)}^{${n - 1}} = ${a1}\cdot ${P(pw(q, n - 1))} = ${an}`)],
      answer: M(`a_{${n}} = ${an}`), plot: { f: k => a1 * pw(q, k - 1), hi: n } });
  },
  function fromTerms() {
    const opt = pick([[2, 1], [3, 1], [-2, 1], [-3, 1], [0.5, 2], [-0.5, 2], [1 / 3, 3]]);
    const q = opt[0], den = opt[1];
    const a1 = den === 1 ? pick([1, 2, 3, 4, -1, -2]) : pw(den, 5) * (den === 2 ? pick([1, 2, 3]) : 1);
    const first = [0, 1, 2, 3].map(i => a1 * pw(q, i)), a6 = a1 * pw(q, 5);
    return mk({ verify: () => { const q0 = first[1] / first[0]; let x = first[0]; for (let i = 1; i < 6; i++) x *= q0; return near(q0, q) && near(first[3] / first[2], q) && near(x, a6); }, skill: 'iloraz i dalszy wyraz',
      text: t`Początkowe wyrazy ciągu geometrycznego to ${M(first.map(T).join(',\\ ') + t`,\ \ldots`)}. Wyznacz iloraz ${M('q')} tego ciągu i oblicz ${M('a_6')}.`,
      fields: [F(M('q ='), q), F(M('a_6 ='), a6)],
      hints: [t`Iloraz to ${M(t`q = \frac{a_2}{a_1}`)} – dzielisz, a nie odejmujesz.`, t`${M('a_6 = a_4\\cdot q^2')}.`],
      steps: [M(t`q = \frac{a_2}{a_1} = \frac{${T(first[1])}}{${T(first[0])}} = ${T(q)}`),
        M(t`a_6 = a_4\cdot q^2 = ${P(first[3])}\cdot ${PW(q)}^2 = ${T(a6)}`)],
      answer: M(`q = ${T(q)},\\quad a_6 = ${T(a6)}`), plot: { f: k => a1 * pw(q, k - 1), hi: 6 } });
  },
  function middle() {
    const d = pick([1, 2, 3, 5]); let u = ri(1, 6), v = ri(1, 6); while (v === u) v = ri(1, 6);
    const a = d * u * u, c = d * v * v, x = d * u * v;
    return mk({ verify: () => x > 0 && x * x === a * c && near(x / a, c / x), skill: 'warunek b² = a·c',
      text: t`Liczby ${M(`${a}`)}, ${M('x')}, ${M(`${c}`)} w podanej kolejności tworzą ciąg geometryczny o wyrazach dodatnich. Oblicz ${M('x')}.`,
      fields: [F(M('x ='), x)],
      hints: [t`W ciągu geometrycznym kwadrat środkowego wyrazu równa się iloczynowi sąsiadów: ${M('b^2 = a\\cdot c')}.`, t`Policz iloczyn skrajnych wyrazów i wyciągnij z niego pierwiastek. Sprawdź w treści, jaki znak ma mieć szukany wyraz.`],
      steps: [M(t`x^2 = ${a}\cdot ${c} = ${a * c}`), t`Wyrazy są dodatnie, więc ${M(t`x = \sqrt{${a * c}} = ${x}`)}.`],
      answer: M(`x = ${x}`), plot: { f: k => a * pw(v / u, k - 1), hi: 2 } });
  },
  function shortSum() {
    const a1 = ri(1, 5), q = pick([2, 3, -2]), n = pick([4, 5]), terms = Array.from({ length: n }, (_, i) => a1 * pw(q, i)), S = terms.reduce((s, x) => s + x, 0);
    return mk({ verify: () => near(a1 * (1 - Math.pow(q, n)) / (1 - q), S), skill: 'suma kilku wyrazów',
      text: t`Ciąg geometryczny ${M('(a_n)')} ma pierwszy wyraz ${M(`a_1 = ${a1}`)} i iloraz ${M(`q = ${q}`)}. Oblicz sumę ${M(`${n}`)} początkowych wyrazów tego ciągu.`,
      fields: [F(M(`S_{${n}} =`), S)],
      hints: [t`Możesz wypisać wyrazy i je dodać albo użyć wzoru ${M(t`S_n = a_1\cdot\frac{1-q^n}{1-q}`)}.`, t`Każdy następny wyraz powstaje z poprzedniego przez pomnożenie przez ${M('q')}. Uważaj na znaki, gdy ${M('q')} jest ujemne.`],
      steps: [t`Wyrazy: ${M(terms.join(',\\ '))}.`, M(t`S_{${n}} = ${terms.map((x, i) => (i ? P(x) : T(x))).join(' + ')} = ${S}`),
        t`Wzorem: ${M(t`S_{${n}} = ${a1}\cdot\frac{1 - ${PW(q)}^{${n}}}{1 - ${P(q)}} = ${a1}\cdot\frac{${1 - pw(q, n)}}{${1 - q}} = ${S}`)}.`],
      answer: M(`S_{${n}} = ${S}`), plot: { f: k => a1 * pw(q, k - 1) } });
  }
],
2: [
  function twoTerms() {
    if (Math.random() < 0.5) {
      const k = ri(2, 3); let q = pick([2, 3, 0.5]), a1 = q === 0.5 ? pw(2, k + 2) * pick([1, 3]) : pick([1, 2, 3, 4, 5]);
      const ak = a1 * pw(q, k - 1), am = a1 * pw(q, k + 1);
      return mk({ verify: () => { const seq = [a1]; for (let i = 1; i < k + 2; i++) seq.push(seq[i - 1] * q); return near(seq[k - 1], ak) && near(seq[k + 1], am); }, skill: 'q i a₁ z dwóch wyrazów',
        text: t`Ciąg geometryczny ${M('(a_n)')} ma wszystkie wyrazy dodatnie oraz ${M(`a_{${k}} = ${T(ak)}`)} i ${M(`a_{${k + 2}} = ${T(am)}`)}. Wyznacz iloraz ${M('q')} i pierwszy wyraz ${M('a_1')}.`,
        fields: [F(M('q ='), q), F(M('a_1 ='), a1)],
        hints: [t`${M(`a_{${k + 2}} = a_{${k}}\\cdot q^2`)}. Podziel wyrazy przez siebie.`, t`Z ${M('q^2')} wychodzą dwie wartości ${M('q')} – wybierz tę, przy której wszystkie wyrazy są dodatnie.`],
        steps: [M(t`q^2 = \frac{a_{${k + 2}}}{a_{${k}}} = \frac{${T(am)}}{${T(ak)}} = ${T(q * q)}`),
          t`${M(`q = ${T(q)}`)} lub ${M(`q = ${T(-q)}`)}. Wyrazy są dodatnie, więc ${M(`q = ${T(q)}`)}.`,
          M(t`a_1 = \frac{a_{${k}}}{q^{${k - 1}}} = \frac{${T(ak)}}{${PW(q)}^{${k - 1}}} = ${T(a1)}`)],
        answer: M(`q = ${T(q)},\\quad a_1 = ${T(a1)}`), plot: { f: n => a1 * pw(q, n - 1) } });
    }
    const q = pick([2, -2, 3, -3]), a1 = pick([1, 2, 3, -1, -2]), k = ri(1, 2), ak = a1 * pw(q, k - 1), am = a1 * pw(q, k + 2);
    return mk({ verify: () => { const seq = [a1]; for (let i = 1; i < k + 3; i++) seq.push(seq[i - 1] * q); return near(seq[k - 1], ak) && near(seq[k + 2], am); }, skill: 'q i a₁ z dwóch wyrazów',
      text: t`W ciągu geometrycznym ${M('(a_n)')} dane są ${M(`a_{${k}} = ${ak}`)} oraz ${M(`a_{${k + 3}} = ${am}`)}. Wyznacz iloraz ${M('q')} i pierwszy wyraz ${M('a_1')}.`,
      fields: [F(M('q ='), q), F(M('a_1 ='), a1)],
      hints: [t`${M(`a_{${k + 3}} = a_{${k}}\\cdot q^3`)}.`, t`Pierwiastek trzeciego stopnia z liczby ujemnej jest ujemny.`],
      steps: [M(t`q^3 = \frac{${am}}{${ak}} = ${pw(q, 3)} \;\Rightarrow\; q = ${q}`), k === 1 ? t`${M(`a_1 = ${a1}`)} jest dane.` : M(t`a_1 = \frac{a_2}{q} = \frac{${ak}}{${P(q)}} = ${a1}`)],
      answer: M(`q = ${q},\\quad a_1 = ${a1}`), plot: { f: n => a1 * pw(q, n - 1) } });
  },
  function sum() {
    let a1, q, n;
    if (Math.random() < 0.7) { a1 = nz(-4, 5); q = pick([2, 3, -2]); n = ri(5, q === 3 ? 6 : 8); }
    else { q = 0.5; n = ri(4, 6); a1 = pw(2, n - 1) * pick([1, 3]); }
    const S = a1 * (1 - pw(q, n)) / (1 - q);
    return mk({ skill: 'suma n wyrazów',
      text: t`W ciągu geometrycznym ${M('(a_n)')} dane są ${M(`a_1 = ${a1}`)} i ${M(`q = ${T(q)}`)}. Oblicz sumę ${M(`${n}`)} początkowych wyrazów tego ciągu.`,
      fields: [F(M(`S_{${n}} =`), S)],
      hints: [t`Wzór: ${M(t`S_n = a_1\cdot\frac{1-q^n}{1-q}`)} dla ${M(t`q \neq 1`)}.`, t`W liczniku jest ${M('q^n')}, a nie ${M('q^{n-1}')}.`],
      steps: [M(t`S_{${n}} = ${a1}\cdot\frac{1 - ${PW(q)}^{${n}}}{1 - ${P(q)}} = ${a1}\cdot\frac{${T(1 - pw(q, n))}}{${T(1 - q)}} = ${T(S)}`)],
      answer: M(`S_{${n}} = ${T(S)}`), plot: { f: k => a1 * pw(q, k - 1) },
      verify: () => { let s = 0; for (let k = 1; k <= n; k++) s += a1 * pw(q, k - 1); return near(s, S) && Number.isInteger(S); } });
  },
  function paramX() {
    const s = pick([2, 3]), p = s === 2 ? 3 * nz(-3, 3) : 4 * nz(-3, 3);
    const x1 = p / (s - 1), x2 = -p / (s + 1);
    return mk({ skill: 'wyrazy z niewiadomą',
      text: t`Liczby ${M('x')}, ${M(poly([1, p], 'x'))}, ${M(`${s * s}x`)} w podanej kolejności tworzą ciąg geometryczny. Wyznacz wszystkie możliwe wartości ${M('x')}.`,
      fields: [F(M('x ='), [x1, x2], { set: true })], help: SET_HELP,
      hints: [t`Warunek: ${M(`(${poly([1, p], 'x')})^2 = x\\cdot ${s * s}x`)}.`, t`Prawa strona to ${M(`(${s}x)^2`)}. Przenieś na jedną stronę i użyj wzoru ${M('a^2 - b^2 = (a-b)(a+b)')}.`],
      steps: [M(t`(${poly([1, p], 'x')})^2 = ${s * s}x^2 \;\Rightarrow\; (${poly([1, p], 'x')})^2 - (${s}x)^2 = 0`),
        M(t`(${poly([1 - s, p], 'x')})(${poly([1 + s, p], 'x')}) = 0`),
        t`${M(`x = ${T(x1)}`)} lub ${M(`x = ${T(x2)}`)}. Oba dają wyrazy różne od zera: ${M(`(${x1},\\ ${x1 + p},\\ ${s * s * x1})`)} oraz ${M(`(${x2},\\ ${x2 + p},\\ ${s * s * x2})`)}.`],
      answer: M(`x = ${x1}\\ \\text{ lub }\\ x = ${x2}`),
      verify: () => [x1, x2].every(x => Number.isInteger(x) && x !== 0 && (x + p) ** 2 === x * s * s * x) && x1 !== x2 });
  },
  function bacteria() {
    const N0 = pick([100, 150, 200, 250, 300, 500]), q = pick([2, 3]), h = ri(4, q === 2 ? 8 : 6), N = N0 * pw(q, h);
    return mk({ verify: () => { let x = N0; for (let i = 0; i < h; i++) x *= q; return x === N; }, skill: 'zadanie z treścią',
      text: t`Na początku doświadczenia w próbce było ${N0} bakterii. Co godzinę liczba bakterii ${q === 2 ? 'podwaja się' : 'potraja się'}. Ile bakterii będzie w próbce po ${h} godzinach?`,
      fields: [F('liczba bakterii:', N)],
      hints: [t`Liczba bakterii tworzy ciąg geometryczny o ilorazie ${M(`${q}`)}.`, t`Uważaj na numerację: po ${h} godzinach mnożysz przez ${M(`${q}`)} dokładnie ${h} razy.`],
      steps: [t`Stan początkowy to ${M(`a_1 = ${N0}`)}, po 1 godzinie ${M('a_2')}, …, po ${h} godzinach ${M(`a_{${h + 1}}`)}.`,
        M(t`a_{${h + 1}} = ${N0}\cdot ${q}^{${h}} = ${N0}\cdot ${pw(q, h)} = ${N}`)],
      answer: t`Po ${h} godzinach będzie ${N} bakterii.`, plot: { f: k => N0 * pw(q, k - 1), hi: h + 1 } });
  },
  function whichTerm() {
    const a1 = pick([1, 2, 3, 5]), q = pick([2, 3]), n = ri(5, q === 2 ? 10 : 8), V = a1 * pw(q, n - 1);
    return mk({ verify: () => { let x = a1, idx = 1; while (x < V && idx < 60) { x *= q; idx++; } return x === V && idx === n; }, skill: 'który to wyraz?',
      text: t`Ciąg geometryczny ma pierwszy wyraz ${M(`a_1 = ${a1}`)} i iloraz ${M(`q = ${q}`)}. Który wyraz tego ciągu jest równy ${M(`${V}`)}?`,
      fields: [F(M('n ='), n)],
      hints: [t`Ułóż równanie ${M(`${a1 === 1 ? '' : a1 + '\\cdot '}${q}^{n-1} = ${V}`)}.`, t`Zapisz prawą stronę jako potęgę liczby ${M(`${q}`)}.`],
      steps: [M(t`${a1 === 1 ? '' : a1 + '\\cdot '}${q}^{n-1} = ${V} \;\Rightarrow\; ${q}^{n-1} = ${pw(q, n - 1)} = ${q}^{${n - 1}}`), M(t`n - 1 = ${n - 1} \;\Rightarrow\; n = ${n}`)],
      answer: t`To wyraz ${M(`a_{${n}}`)}.`, plot: { f: k => a1 * pw(q, k - 1), hi: n } });
  }
],
3: [
  function a2sum13() {
    const q = pick([2, 3, 4]), a1 = ri(1, 6), a2 = a1 * q, B = a1 + a1 * q * q;
    const qs = quadSteps(a2, -B, a2, 'q');
    return mk({ skill: 'układ dla ciągu geometrycznego',
      text: t`W ciągu geometrycznym ${M('(a_n)')} dane są ${M(`a_2 = ${a2}`)} oraz ${M(`a_1 + a_3 = ${B}`)}. Ciąg jest rosnący. Wyznacz jego iloraz ${M('q')}, pierwszy wyraz ${M('a_1')} i sumę czterech początkowych wyrazów.`,
      fields: [F(M('q ='), q), F(M('a_1 ='), a1), F(M('S_4 ='), a1 * (1 + q + q * q + q * q * q))],
      hints: [t`Zapisz ${M(t`a_1 = \frac{a_2}{q}`)} oraz ${M('a_3 = a_2\\cdot q')}.`, t`Pomnóż równanie przez ${M('q')} – dostaniesz równanie kwadratowe. Dwa rozwiązania dają dwa ciągi – wybierz rosnący.`],
      steps: [M(t`\frac{${a2}}{q} + ${a2}q = ${B} \;\Big|\cdot q \;\Rightarrow\; ${poly([a2, -B, a2], 'q')} = 0`), M(qs.tex),
        t`Dla ${M(`q = ${T(qs.r1)}`)} ciąg ${M(`${T(a2 / qs.r1)},\\ ${a2},\\ ${T(a2 * qs.r1)},\\ldots`)} jest malejący. Dla ${M(`q = ${q}`)} ciąg ${M(`${a1},\\ ${a2},\\ ${a2 * q},\\ldots`)} jest rosnący.`,
        M(t`S_4 = ${a1}\cdot\frac{1 - ${q}^4}{1 - ${q}} = ${a1 * (1 + q + q * q + q * q * q)}`)],
      answer: M(`q = ${q},\\ a_1 = ${a1},\\ S_4 = ${a1 * (1 + q + q * q + q * q * q)}`), plot: { f: n => a1 * pw(q, n - 1) },
      verify: () => near(qs.r2, q) && near(qs.r1, 1 / q) && a1 * q === a2 && a1 + a1 * q * q === B });
  },
  function ball() {
    const cfg = pick([[16, 1 / 2, 4], [10, 1 / 2, 3], [8, 3 / 4, 3], [32, 3 / 4, 4], [27, 2 / 3, 3], [81, 2 / 3, 4], [125, 3 / 5, 3]]);
    const H = cfg[0], k = cfg[1], m = ri(2, cfg[2]);
    const bm = H * pw(k, m), b1 = H * k, sum = b1 * (1 - pw(k, m)) / (1 - k), dist = H + 2 * sum;
    return mk({ skill: 'odbijająca się piłka',
      text: t`Piłkę upuszczono z wysokości ${M(`${H}`)} m. Po każdym odbiciu od ziemi wznosi się na wysokość równą ${M(T(k))} wysokości, z której spadła. Na jaką wysokość wzniesie się po ${m}. odbiciu? Jaką drogę przebędzie od upuszczenia do ${m + 1}. uderzenia o ziemię?`,
      fields: [F(`wysokość po ${m}. odbiciu:`, bm, { unit: 'm', tol: 1e-6 }), F('droga:', dist, { unit: 'm', tol: 1e-6 })],
      hints: [t`Wysokości po kolejnych odbiciach tworzą ciąg geometryczny: ${M(`b_1 = ${H}\\cdot ${T(k)} = ${D(b1)}`)}, ${M(`q = ${T(k)}`)}.`, t`Droga: najpierw spadek z ${H} m, potem ${m} razy w górę i w dół – każdą wysokość liczysz dwa razy.`],
      steps: [M(t`b_{${m}} = ${H}\cdot\left(${T(k)}\right)^{${m}} = ${D(bm)}\ \text{m}`),
        M(t`b_1 + \ldots + b_{${m}} = ${D(b1)}\cdot\frac{1 - \left(${T(k)}\right)^{${m}}}{1 - ${T(k)}} = ${D(sum)}\ \text{m}`),
        M(t`\text{droga} = ${H} + 2\cdot ${D(sum)} = ${D(dist)}\ \text{m}`)],
      answer: t`Wysokość ${M(`${D(bm)}`)} m, droga ${M(`${D(dist)}`)} m.`, plot: { f: n => H * pw(k, n - 1) },
      verify: () => { let s = H, h = H; for (let i = 1; i <= m; i++) { h *= k; s += 2 * h; } return near(s, dist) && near(h, bm); } });
  },
  function threeNumbers() {
    const q = pick([2, 3]), a1 = ri(1, 5), a2 = a1 * q, a3 = a2 * q, S = a1 + a2 + a3, Pr = a1 * a2 * a3;
    const qs = quadSteps(a2, a2 - S, a2, 'q');
    return mk({ skill: 'trzy liczby',
      text: t`Trzy liczby dodatnie tworzą rosnący ciąg geometryczny. Ich iloczyn jest równy ${M(`${Pr}`)}, a suma ${M(`${S}`)}. Wyznacz te liczby.`,
      fields: [F('pierwsza:', a1), F('druga:', a2), F('trzecia:', a3)],
      hints: [t`Oznacz liczby ${M(t`\frac{b}{q},\ b,\ bq`)}. Ich iloczyn to ${M('b^3')}.`, t`Z sumy dostaniesz równanie kwadratowe z niewiadomą ${M('q')}.`],
      steps: [M(t`\frac{b}{q}\cdot b\cdot bq = b^3 = ${Pr} \;\Rightarrow\; b = ${a2}`),
        M(t`\frac{${a2}}{q} + ${a2} + ${a2}q = ${S} \;\Big|\cdot q \;\Rightarrow\; ${poly([a2, a2 - S, a2], 'q')} = 0`), M(qs.tex),
        t`Ciąg jest rosnący, więc ${M('q > 1')}: ${M(`q = ${q}`)}. Liczby: ${M(`${a1},\\ ${a2},\\ ${a3}`)}.`],
      answer: t`Liczby: ${M(`${a1},\\ ${a2},\\ ${a3}`)}.`,
      verify: () => near(Math.cbrt(Pr), a2) && near(qs.r2, q) && S === a1 + a2 + a3 });
  },
  function a1FromSum() {
    const q = pick([2, 3, -2]), n = ri(4, q === 3 ? 5 : 7), a1 = nz(-5, 6), S = a1 * (1 - pw(q, n)) / (1 - q);
    return mk({ skill: 'a₁ z sumy',
      text: t`Suma ${M(`${n}`)} początkowych wyrazów ciągu geometrycznego o ilorazie ${M(`q = ${q}`)} jest równa ${M(`${S}`)}. Oblicz pierwszy wyraz i wyraz ${M(`a_{${n}}`)} tego ciągu.`,
      fields: [F(M('a_1 ='), a1), F(M(`a_{${n}} =`), a1 * pw(q, n - 1))],
      hints: [t`Podstaw dane do ${M(t`S_n = a_1\cdot\frac{1-q^n}{1-q}`)} i wyznacz ${M('a_1')}.`, t`Najpierw policz wartość ułamka ${M(t`\frac{1-q^n}{1-q}`)} – to zwykła liczba. Potem podziel przez nią sumę.`],
      steps: [M(t`${S} = a_1\cdot\frac{1 - ${P(q)}^{${n}}}{1 - ${P(q)}} = a_1\cdot\frac{${1 - pw(q, n)}}{${1 - q}} = ${T((1 - pw(q, n)) / (1 - q))}\,a_1`),
        M(t`a_1 = ${a1},\qquad a_{${n}} = ${a1}\cdot ${P(q)}^{${n - 1}} = ${a1 * pw(q, n - 1)}`)],
      answer: M(`a_1 = ${a1},\\quad a_{${n}} = ${a1 * pw(q, n - 1)}`), plot: { f: k => a1 * pw(q, k - 1), hi: n },
      verify: () => Number.isInteger(S) });
  }
]
};

/* ---------- INNE CIĄGI ---------- */
function formulaPool() {
  const k = ri(3, 9);
  return pick([
    () => { const a = pick([1, 2, -1]), b = ri(-6, 6), c = ri(-9, 9); const f = n => a * n * n + b * n + c; return { tex: poly([a, b, c]), f, k, sub: t`${a === 1 ? '' : a === -1 ? '-' : T(a) + '\\cdot '}${k}^2 ${b < 0 ? '-' : '+'} ${Math.abs(b)}\cdot ${k} ${c < 0 ? '-' : '+'} ${Math.abs(c)}` }; },
    () => { const a = ri(1, 4), b = ri(-5, 5); const f = n => pw(-1, n) * (a * n + b); return { tex: t`(-1)^n\cdot(${poly([a, b])})`, f, k, sub: t`(-1)^{${k}}\cdot(${a === 1 ? '' : a + '\\cdot '}${k} ${b < 0 ? '-' : '+'} ${Math.abs(b)})` }; },
    () => { const kk = ri(3, 7), a = ri(1, 5); const f = n => pw(2, n) - a * n; return { tex: t`2^n - ${a === 1 ? '' : a}n`, f, k: kk, sub: t`2^{${kk}} - ${a === 1 ? '' : a + '\\cdot '}${kk}` }; },
    () => { const a = ri(1, 4), b = ri(-3, 6), s = ri(1, 5); const f = n => (a * n + b) / (n + s); return { tex: t`\frac{${poly([a, b])}}{${poly([1, s])}}`, f, k, sub: t`\frac{${a === 1 ? '' : a + '\\cdot '}${k} ${b < 0 ? '-' : '+'} ${Math.abs(b)}}{${k} + ${s}}` }; }
  ])();
}
const GR = {
1: [
  function formula() {
    const o = formulaPool(), val = o.f(o.k);
    return mk({ verify: () => { const js = o.sub.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))').replace(/\\cdot/g, '*').replace(/(\(-?\d+\)|\d+)\^(?:\{(\d+)\}|(\d))/g, (z, b, e1, e2) => `Math.pow(${b},${e1 || e2})`); return near(Function('return ' + js)(), val); }, skill: 'wyraz ze wzoru ogólnego',
      text: t`Ciąg ${M('(a_n)')} jest określony wzorem ${M(`a_n = ${o.tex}`)} dla ${M(t`n \geq 1`)}. Oblicz wyraz ${M(`a_{${o.k}}`)}.`,
      fields: [F(M(`a_{${o.k}} =`), val)], help: 'Ułamek wpisz jako np. 7/9.',
      hints: [t`Wstaw ${M(`n = ${o.k}`)} w miejsce każdego ${M('n')} we wzorze.`, t`Pamiętaj o kolejności działań: najpierw potęgowanie, potem mnożenie.`],
      steps: [M(t`a_{${o.k}} = ${o.sub} = ${T(val)}`)],
      answer: M(`a_{${o.k}} = ${T(val)}`), plot: { f: o.f, hi: o.k } });
  },
  function recursionLinear() {
    const a1 = ri(-3, 5), p = pick([2, 3, -1, -2]), q = ri(-4, 5);
    const a = [a1]; for (let i = 0; i < 3; i++) a.push(p * a[i] + q);
    const rec = t`a_{n+1} = ${p === 1 ? '' : p === -1 ? '-' : p}a_n ${q < 0 ? '-' : '+'} ${Math.abs(q)}`;
    return mk({ skill: 'ciąg rekurencyjny',
      text: t`Ciąg ${M('(a_n)')} jest określony wzorem rekurencyjnym: ${M(`a_1 = ${a1}`)}, ${M(rec)} dla ${M(t`n \geq 1`)}. Oblicz ${M('a_4')}.`,
      fields: [F(M('a_4 ='), a[3])],
      hints: [t`Wzór rekurencyjny podaje kolejny wyraz na podstawie poprzedniego. Licz po kolei: ${M('a_2')}, potem ${M('a_3')}, potem ${M('a_4')}.`, t`Do wzoru wstawiasz zawsze ostatnio obliczony wyraz: ${M('a_3')} liczysz z ${M('a_2')}, a nie z ${M('a_1')}.`],
      steps: [1, 2, 3].map(i => M(t`a_{${i + 1}} = ${p}\cdot ${P(a[i - 1])} ${q < 0 ? '-' : '+'} ${Math.abs(q)} = ${a[i]}`)),
      answer: M(`a_4 = ${a[3]}`), plot: { f: n => { let x = a1; for (let i = 1; i < n; i++) x = p * x + q; return x; }, hi: 4 },
      verify: () => Number.isFinite(a[3]) });
  },
  function fibLike() {
    const a1 = ri(-3, 5), a2 = ri(-2, 6), sign = pick([1, -1]);
    const a = [a1, a2]; for (let i = 2; i < 6; i++) a.push(a[i - 1] + sign * a[i - 2]);
    const rec = sign === 1 ? 'a_{n+2} = a_{n+1} + a_n' : 'a_{n+2} = a_{n+1} - a_n';
    return mk({ verify: () => { const g = i => (i === 1 ? a1 : i === 2 ? a2 : g(i - 1) + sign * g(i - 2)); return g(6) === a[5]; }, skill: 'ciąg rekurencyjny',
      text: t`Ciąg ${M('(a_n)')} jest określony wzorem rekurencyjnym: ${M(`a_1 = ${a1}`)}, ${M(`a_2 = ${a2}`)}, ${M(rec)} dla ${M(t`n \geq 1`)}. Oblicz ${M('a_6')}.`,
      fields: [F(M('a_6 ='), a[5])],
      hints: [t`Każdy wyraz od trzeciego liczysz z dwóch poprzednich. Licz po kolei ${M('a_3, a_4, a_5, a_6')}.`, t`Zapisuj wyniki po kolei, żeby nie pomylić wyrazu poprzedniego z przedostatnim. Uważaj na odejmowanie liczb ujemnych.`],
      steps: [2, 3, 4, 5].map(i => M(t`a_{${i + 1}} = a_{${i}} ${sign === 1 ? '+' : '-'} a_{${i - 1}} = ${a[i - 1]} ${sign === 1 ? '+' : '-'} ${P(a[i - 2])} = ${a[i]}`)),
      answer: M(`a_6 = ${a[5]}`), plot: { f: n => a[n - 1], N: 6, hi: 6 } });
  },
  function whichTermSimple() {
    const c = ri(-9, 9), n = ri(4, 12), V = n * n + c;
    return mk({ verify: () => { const hits = []; for (let i = 1; i <= 300; i++) if (i * i + c === V) hits.push(i); return hits.length === 1 && hits[0] === n; }, skill: 'który to wyraz?',
      text: t`Ciąg ${M('(a_n)')} jest określony wzorem ${M(`a_n = ${poly([1, 0, c])}`)} dla ${M(t`n \geq 1`)}. Który wyraz tego ciągu jest równy ${M(`${V}`)}?`,
      fields: [F(M('n ='), n)],
      hints: [t`Rozwiąż równanie ${M(`${poly([1, 0, c])} = ${V}`)}. Numer wyrazu musi być liczbą naturalną dodatnią.`, t`Przenieś liczbę na prawą stronę – dostaniesz równanie postaci ${M('n^2 = k')}. Z dwóch rozwiązań wybierz dodatnie.`],
      steps: [M(t`${poly([1, 0, c])} = ${V} \;\Rightarrow\; n^2 = ${n * n} \;\Rightarrow\; n = ${n}\ \text{lub}\ n = ${-n}`), t`Numer wyrazu jest dodatni, więc ${M(`n = ${n}`)}.`],
      answer: t`To wyraz ${M(`a_{${n}}`)}.`, plot: { f: k => k * k + c, hi: n } });
  }
],
2: [
  function monotonic() {
    const kind = ri(0, 6); let tex, ans, why, f;
    if (kind === 0) { const p = nz(-5, 5), q = ri(-9, 9); f = n => p * n + q; tex = poly([p, q]); ans = p > 0 ? 0 : 1; why = t`${M(`a_{n+1} - a_n = ${T(p)}(n+1) ${q < 0 ? '-' : '+'} ${Math.abs(q)} - (${poly([p, q])}) = ${p}`)} – ${p > 0 ? 'dodatnie' : 'ujemne'} dla każdego ${M('n')}.`; }
    else if (kind === 1) { const c = ri(0, 4); f = n => pw(-1, n) * (n + c); tex = t`(-1)^n\cdot(${poly([1, c])})`; ans = 2; why = t`${M(`a_1 = ${f(1)},\\ a_2 = ${f(2)},\\ a_3 = ${f(3)}`)} – wyrazy na przemian rosną i maleją.`; }
    else if (kind === 2) { const k = ri(5, 9); f = n => n * n - k * n; tex = poly([1, -k, 0]); ans = 2; why = t`${M(`a_{n+1} - a_n = 2n + 1 - ${k} = 2n - ${k - 1}`)} – ujemne dla małych ${M('n')} (np. ${M(`a_1 = ${f(1)},\\ a_2 = ${f(2)}`)}), dodatnie dla dużych (np. ${M(`a_${k - 1} = ${f(k - 1)},\\ a_${k} = ${f(k)}`)}).`; }
    else if (kind === 3) { const k = ri(0, 6), up = Math.random() < 0.5; f = up ? n => n * n + k * n : n => -n * n + k; tex = up ? poly([1, k, 0]) : poly([-1, 0, k]); ans = up ? 0 : 1; why = up ? t`${M(`a_{n+1} - a_n = 2n + 1${k ? ' + ' + k : ''} > 0`)} dla każdego ${M('n')}.` : t`${M('a_{n+1} - a_n = -(n+1)^2 + n^2 = -2n - 1 < 0')} dla każdego ${M('n')}.`; }
    else if (kind === 4) { const c = ri(2, 5); f = n => c * pw(2, n); tex = t`${c}\cdot 2^n`; ans = 0; why = t`${M(t`\frac{a_{n+1}}{a_n} = 2 > 1`)}, a wszystkie wyrazy są dodatnie, więc każdy kolejny jest większy.`; }
    else if (kind === 5) { const c = pick([16, 32, 48, 64]); f = n => c * pw(0.5, n); tex = t`${c}\cdot\left(\frac{1}{2}\right)^n`; ans = 1; why = t`Wyrazy są dodatnie i ${M(t`\frac{a_{n+1}}{a_n} = \frac{1}{2} < 1`)}, więc każdy kolejny jest mniejszy.`; }
    else { const b = pick([-2, -3]); f = n => pw(b, n); tex = t`(${b})^n`; ans = 2; why = t`Iloraz jest ujemny, więc znaki się zmieniają: ${M(`a_1 = ${f(1)},\\ a_2 = ${f(2)},\\ a_3 = ${f(3)}`)}.`; }
    const labels = ['rosnący', 'malejący', 'ani rosnący, ani malejący'];
    return mk({ verify: () => { let up = true, down = true; for (let i = 1; i < 14; i++) { if (!(f(i + 1) > f(i))) up = false; if (!(f(i + 1) < f(i))) down = false; } return ans === (up ? 0 : down ? 1 : 2); }, skill: 'monotoniczność',
      text: t`Ciąg ${M('(a_n)')} jest określony wzorem ${M(`a_n = ${tex}`)} dla ${M(t`n \geq 1`)}. Ten ciąg jest:`,
      choices: labels, ans,
      hints: [t`Zbadaj znak różnicy ${M('a_{n+1} - a_n')} albo wypisz kilka pierwszych wyrazów i zobacz, co się dzieje.`, t`Ciąg jest rosnący, gdy <b>każdy</b> następny wyraz jest większy od poprzedniego, a malejący – gdy każdy jest mniejszy. Jeśli raz rośnie, a raz maleje, nie jest ani rosnący, ani malejący.`],
      steps: [why, t`Ciąg jest ${labels[ans]}.`], answer: t`Odpowiedź: <b>${labels[ans]}</b>.`, plot: { f } });
  },
  function typeCheck() {
    const kind = ri(0, 4); let tex, ans, why, f;
    if (kind === 0) { const p = nz(-5, 5), q = ri(-8, 8); f = n => p * n + q; tex = poly([p, q]); ans = 0; why = t`${M(`a_{n+1} - a_n = ${p}`)} – różnica jest stała, więc ciąg jest arytmetyczny (${M(`r = ${p}`)}).`; }
    else if (kind === 1) { const c = pick([2, 3, 5, -1]), b = pick([2, 3, -2]); f = n => c * pw(b, n - 1); tex = t`${c === -1 ? '-' : c + '\\cdot '}${P(b)}^{n-1}`; ans = 1; why = t`${M(t`\frac{a_{n+1}}{a_n} = ${b}`)} – iloraz jest stały, więc ciąg jest geometryczny (${M(`q = ${b}`)}).`; }
    else if (kind === 2) { const c = ri(-5, 5); f = n => n * n + c; tex = poly([1, 0, c]); ans = 2; why = t`${M(`a_1 = ${f(1)},\\ a_2 = ${f(2)},\\ a_3 = ${f(3)}`)}. Różnice: ${M(`${f(2) - f(1)}`)} i ${M(`${f(3) - f(2)}`)} – nie są równe, więc ciąg nie jest arytmetyczny. ${M(`a_2^2 = ${f(2) ** 2} \\neq a_1\\cdot a_3 = ${f(1) * f(3)}`)}, więc nie jest geometryczny.`; }
    else if (kind === 3) { const c = nz(-3, 4); f = n => pw(2, n) + c; tex = t`2^n ${c < 0 ? '-' : '+'} ${Math.abs(c)}`; ans = 2; why = t`${M(`a_1 = ${f(1)},\\ a_2 = ${f(2)},\\ a_3 = ${f(3)}`)}. Różnice ${M(`${f(2) - f(1)}`)} i ${M(`${f(3) - f(2)}`)} są różne, a ${M(`a_2^2 = ${f(2) ** 2} \\neq a_1\\cdot a_3 = ${f(1) * f(3)}`)}.`; }
    else { const c = pick([6, 12, 60]); f = n => c / n; tex = t`\frac{${c}}{n}`; ans = 2; why = t`${M(`a_1 = ${c},\\ a_2 = ${c / 2},\\ a_3 = ${c / 3}`)}. Różnice ${M(`${T(c / 2 - c)}`)} i ${M(`${T(c / 3 - c / 2)}`)} są różne, ilorazy ${M(T(1 / 2))} i ${M(T(2 / 3))} też.`; }
    const labels = ['arytmetyczny', 'geometryczny', 'ani arytmetyczny, ani geometryczny'];
    return mk({ skill: 'arytmetyczny czy geometryczny?',
      text: t`Ciąg ${M('(a_n)')} jest określony wzorem ${M(`a_n = ${tex}`)} dla ${M(t`n \geq 1`)}. Ten ciąg jest:`,
      choices: labels, ans,
      hints: [t`Policz ${M('a_1, a_2, a_3')}. Sprawdź, czy różnice są równe (arytmetyczny) albo czy ilorazy są równe (geometryczny).`, t`Arytmetyczny: ${M('a_2 - a_1 = a_3 - a_2')}. Geometryczny: ${M(t`\frac{a_2}{a_1} = \frac{a_3}{a_2}`)}.`],
      steps: [why], answer: t`Odpowiedź: <b>${labels[ans]}</b>.`, plot: { f },
      verify: () => { const v = [1, 2, 3, 4].map(f), ar = near(v[1] - v[0], v[2] - v[1]) && near(v[2] - v[1], v[3] - v[2]), ge = v[0] !== 0 && near(v[1] / v[0], v[2] / v[1]) && near(v[2] / v[1], v[3] / v[2]); return (ans === 0 && ar && !ge) || (ans === 1 && ge && !ar) || (ans === 2 && !ar && !ge); } });
  },
  function negativeCount() {
    const n1 = ri(1, 4), n2 = n1 + ri(3, 9), neg = Math.random() < 0.6, sgn = neg ? 1 : -1;
    const f = n => sgn * (n - n1) * (n - n2), count = n2 - n1 - 1;
    return mk({ skill: neg ? 'wyrazy ujemne' : 'wyrazy dodatnie',
      text: t`Ciąg ${M('(a_n)')} jest określony wzorem ${M(`a_n = ${poly([sgn, -sgn * (n1 + n2), sgn * n1 * n2])}`)} dla ${M(t`n \geq 1`)}. Ile wyrazów tego ciągu jest ${neg ? 'ujemnych' : 'dodatnich'}?`,
      fields: [F('liczba wyrazów:', count)],
      hints: [t`Rozwiąż nierówność ${M(`${poly([sgn, -sgn * (n1 + n2), sgn * n1 * n2])} ${neg ? '<' : '>'} 0`)}: znajdź miejsca zerowe i naszkicuj parabolę.`, t`Licz tylko liczby naturalne ${M(t`n \geq 1`)} – i nie wliczaj miejsc zerowych.`],
      steps: [t`Miejsca zerowe: ${M(`n = ${n1}`)} i ${M(`n = ${n2}`)} (${M(`a_n = ${sgn === 1 ? '' : '-'}(n - ${n1})(n - ${n2})`)}).`,
        t`Ramiona paraboli skierowane ${neg ? 'w górę' : 'w dół'}, więc ${M(`a_n ${neg ? '<' : '>'} 0`)} dla ${M(`n \\in (${n1},\\ ${n2})`)}.`,
        t`Liczby naturalne w tym przedziale: ${M(`${n1 + 1}, \\ldots, ${n2 - 1}`)} – jest ich ${M(`${n2 - 1} - ${n1 + 1} + 1 = ${count}`)}.`],
      answer: t`Liczba ujemnych wyrazów: ${M(`${count}`)}.`, plot: { f, N: Math.min(12, n2 + 2) },
      verify: () => { let c = 0; for (let n = 1; n <= 300; n++) if (neg ? f(n) < 0 : f(n) > 0) c++; return c === count; } });
  },
  function whichTermQuad() {
    let n0, p, c, other;
    do { n0 = ri(4, 12); p = ri(-6, 6); c = ri(-10, 10); other = -p - n0; } while (other >= 1);
    const V = n0 * n0 + p * n0 + c, qs = quadSteps(1, p, c - V, 'n');
    return mk({ skill: 'który to wyraz?',
      text: t`Ciąg ${M('(a_n)')} jest określony wzorem ${M(`a_n = ${poly([1, p, c])}`)} dla ${M(t`n \geq 1`)}. Który wyraz tego ciągu jest równy ${M(`${V}`)}?`,
      fields: [F(M('n ='), n0)],
      hints: [t`Rozwiąż równanie kwadratowe ${M(`${poly([1, p, c])} = ${V}`)}.`, t`Odrzuć rozwiązanie, które nie jest liczbą naturalną dodatnią.`],
      steps: [M(t`${poly([1, p, c])} = ${V} \;\Rightarrow\; ${poly([1, p, c - V])} = 0`), M(qs.tex), t`${M('n')} musi być liczbą naturalną dodatnią, więc ${M(`n = ${n0}`)}.`],
      answer: t`To wyraz ${M(`a_{${n0}}`)}.`, plot: { f: n => n * n + p * n + c, hi: n0 },
      verify: () => { const hits = []; for (let n = 1; n <= 500; n++) if (n * n + p * n + c === V) hits.push(n); return hits.length === 1 && hits[0] === n0; } });
  },
  function rumour() {
    const a1 = pick([0.1, 0.2, 0.4, 0.5]), g = n => { let x = a1; for (let i = 1; i < n; i++) x = x + 0.5 * x * (1 - x); return x; };
    const a2 = g(2), a3 = g(3), a3r = Math.round(a3 * 1000) / 1000;
    return mk({ verify: () => { const b2 = a1 + a1 * (1 - a1) / 2, b3 = b2 + b2 * (1 - b2) / 2; return Math.abs(b3 - a3r) <= 0.0005 + 1e-12; }, skill: 'model rozchodzenia się plotki',
      text: t`Ułamek mieszkańców osiedla, którzy słyszeli plotkę po ${M('n')} dniach, opisuje ciąg: ${M(`a_1 = ${D(a1)}`)}, ${M(t`a_{n+1} = a_n + \frac{1}{2}a_n(1 - a_n)`)}. Oblicz ${M('a_3')}. Wynik zaokrąglij do części tysięcznych.`,
      fields: [F(M('a_3 \\approx'), a3r, { tol: 0.0011 })], help: 'Liczbę dziesiętną wpisz z przecinkiem, np. 0,381.',
      hints: [t`Najpierw policz ${M('a_2')} – wstaw ${M(`a_1 = ${D(a1)}`)} do wzoru. Potem w ten sam sposób ${M('a_3')}.`, t`Zaokrąglaj dopiero wynik końcowy. Części tysięczne to trzecie miejsce po przecinku.`],
      steps: [M(t`a_2 = ${D(a1)} + \frac{1}{2}\cdot ${D(a1)}\cdot(1 - ${D(a1)}) = ${D(a2)}`),
        M(t`a_3 = ${D(a2)} + \frac{1}{2}\cdot ${D(a2)}\cdot(1 - ${D(a2)}) = ${D(a3)} \approx ${D(a3r, 3)}`),
        t`Po trzech dniach plotkę słyszało około ${M(`${D(Math.round(a3 * 1000) / 10, 1)}\\%`)} mieszkańców.`],
      answer: M(t`a_3 \approx ${D(a3r, 3)}`), plot: { f: g, hi: 3 } });
  }
],
3: [
  function minTerm() {
    const k = ri(5, 15), c = ri(-10, 20), f = n => n * n - k * n + c;
    const nmin = Math.floor(k / 2), vmin = f(nmin), even = k % 2 === 0;
    return mk({ skill: 'najmniejszy wyraz',
      text: t`Ciąg ${M('(a_n)')} jest określony wzorem ${M(`a_n = ${poly([1, -k, c])}`)} dla ${M(t`n \geq 1`)}. Oblicz najmniejszy wyraz tego ciągu.`,
      fields: [F('najmniejszy wyraz:', vmin)],
      hints: [t`Wyrazy ciągu leżą na paraboli ${M(`y = ${poly([1, -k, c], 'x')}`)}. Gdzie jest jej wierzchołek?`, t`Numer wyrazu musi być liczbą naturalną. Gdy ${M('x_w')} nie jest całkowite, sprawdź dwie najbliższe liczby naturalne.`],
      steps: [M(t`x_w = \frac{${k}}{2} = ${T(k / 2)}`),
        even ? t`${M(`x_w = ${k / 2}`)} jest liczbą naturalną, więc najmniejszy jest wyraz ${M(`a_{${nmin}} = ${vmin}`)}.`
          : t`${M(`x_w`)} nie jest liczbą całkowitą. Sprawdzamy sąsiednie wyrazy: ${M(`a_{${nmin}} = ${f(nmin)}`)}, ${M(`a_{${nmin + 1}} = ${f(nmin + 1)}`)} – są równe, oba są najmniejsze.`],
      answer: t`Najmniejszy wyraz to ${M(`${vmin}`)}.`, plot: { f, N: Math.min(12, k + 1), hi: nmin },
      verify: () => { let m = Infinity; for (let n = 1; n <= 500; n++) m = Math.min(m, f(n)); return m === vmin; } });
  },
  function arithGeoIdx() {
    const cfg = pick([[2, 4, 1], [3, 9, 1], [2, 5, 2], [2, 6, 3], [3, 11, 1.5]]), k = cfg[0], m = cfg[1];
    const a1 = cfg[2] === 1.5 ? 2 * ri(1, 4) : ri(1, 6), r = a1 * cfg[2], n = ri(10, 20), S = n * a1 + n * (n - 1) * r / 2;
    const ak = a1 + (k - 1) * r, am = a1 + (m - 1) * r;
    return mk({ skill: 'arytmetyczny i geometryczny',
      text: t`Ciąg arytmetyczny ${M('(a_n)')} ma pierwszy wyraz ${M(`a_1 = ${a1}`)} i różnicę ${M(t`r \neq 0`)}. Wyrazy ${M('a_1')}, ${M(`a_{${k}}`)}, ${M(`a_{${m}}`)} w podanej kolejności tworzą ciąg geometryczny. Wyznacz ${M('r')} i oblicz sumę ${M(`${n}`)} początkowych wyrazów ciągu ${M('(a_n)')}.`,
      fields: [F(M('r ='), r), F(M(`S_{${n}} =`), S)],
      hints: [t`Zapisz ${M(`a_{${k}} = ${a1} + ${k - 1 === 1 ? '' : k - 1}r`)} i ${M(`a_{${m}} = ${a1} + ${m - 1}r`)}.`, t`Warunek ciągu geometrycznego: ${M(`a_{${k}}^2 = a_1\\cdot a_{${m}}`)}. Pamiętaj, że ${M(t`r \neq 0`)} – możesz przez nie podzielić.`],
      steps: [M(t`(${a1} + ${k - 1 === 1 ? '' : k - 1}r)^2 = ${a1}\cdot(${a1} + ${m - 1}r)`),
        M(t`${poly([(k - 1) ** 2, 2 * a1 * (k - 1), a1 * a1], 'r')} = ${poly([a1 * (m - 1), a1 * a1], 'r')} \;\Rightarrow\; ${poly([(k - 1) ** 2, 2 * a1 * (k - 1) - a1 * (m - 1), 0], 'r')} = 0`),
        M(t`r\,(${poly([(k - 1) ** 2, 2 * a1 * (k - 1) - a1 * (m - 1)], 'r')}) = 0 \;\Rightarrow\; r = 0\ \text{(odrzucamy)}\ \text{lub}\ r = ${T(r)}`),
        t`Sprawdzenie: ${M(`${a1},\\ ${ak},\\ ${am}`)} – iloraz ${M(T(ak / a1))}.`,
        M(t`S_{${n}} = \frac{2\cdot ${a1} + ${n - 1}\cdot ${T(r)}}{2}\cdot ${n} = ${T(S)}`)],
      answer: M(`r = ${T(r)},\\quad S_{${n}} = ${T(S)}`), plot: { f: q => a1 + (q - 1) * r },
      verify: () => r !== 0 && near(ak * ak, a1 * am) && Number.isInteger(S) && Number.isInteger(r) });
  },
  function snToAn() {
    const kind = ri(0, 1), k = ri(4, 6);
    if (kind === 0) {
      const b = pick([2, 3]), c = pick([1, 2, 3]), Sn = n => c * (pw(b, n) - 1), a1 = Sn(1), ak = Sn(k) - Sn(k - 1);
      return mk({ skill: 'aₙ z sumy Sₙ',
        text: t`Suma ${M('n')} początkowych wyrazów ciągu ${M('(a_n)')} jest dana wzorem ${M(`S_n = ${c === 1 ? '' : c}${c === 1 ? '' : '('}${b}^n - 1${c === 1 ? '' : ')'}`)}. Oblicz ${M('a_1')} i ${M(`a_{${k}}`)}.`,
        fields: [F(M('a_1 ='), a1), F(M(`a_{${k}} =`), ak)],
        hints: [t`${M('a_1 = S_1')}, a ${M(`a_{${k}} = S_{${k}} - S_{${k - 1}}`)}.`, t`Policz wartości ${M('S_n')} dla dwóch kolejnych numerów i odejmij mniejszą sumę od większej.`],
        steps: [M(t`a_1 = S_1 = ${a1}`), M(t`a_{${k}} = S_{${k}} - S_{${k - 1}} = ${Sn(k)} - ${Sn(k - 1)} = ${ak}`),
          t`Ten ciąg jest geometryczny: ${M(`a_n = ${c * (b - 1) === 1 ? '' : c * (b - 1) + '\\cdot '}${b}^{n-1}`)}.`],
        answer: M(`a_1 = ${a1},\\quad a_{${k}} = ${ak}`), plot: { f: n => Sn(n) - Sn(n - 1), hi: k },
        verify: () => ak === c * (b - 1) * pw(b, k - 1) });
    }
    const p = ri(-4, 5), c = nz(-6, 6), Sn = n => n * n + p * n + c, a1 = Sn(1), ak = Sn(k) - Sn(k - 1);
    return mk({ skill: 'aₙ z sumy Sₙ',
      text: t`Suma ${M('n')} początkowych wyrazów ciągu ${M('(a_n)')} jest dana wzorem ${M(`S_n = ${poly([1, p, c])}`)}. Oblicz ${M('a_1')} i ${M(`a_{${k}}`)}. Czy ten ciąg jest arytmetyczny?`,
      fields: [F(M('a_1 ='), a1), F(M(`a_{${k}} =`), ak)],
      hints: [t`${M('a_1 = S_1')}, a dla ${M(t`n \geq 2`)}: ${M('a_n = S_n - S_{n-1}')}.`, t`Wzór ${M('a_n = S_n - S_{n-1}')} nie działa dla ${M('n = 1')} – sprawdź, czy daje to samo co ${M('S_1')}.`],
      steps: [M(t`a_1 = S_1 = 1 ${p < 0 ? '-' : '+'} ${Math.abs(p)} ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${a1}`),
        t`Dla ${M(t`n \geq 2`)}: ${M(`a_n = S_n - S_{n-1} = ${poly([2, p - 1])}`)}, więc ${M(`a_{${k}} = ${ak}`)}.`,
        t`Wzór ${M(poly([2, p - 1]))} dla ${M('n=1')} dałby ${M(`${p + 1}`)}, a ${M(`a_1 = ${a1}`)}. Ciąg ${M(`${a1},\\ ${Sn(2) - Sn(1)},\\ ${Sn(3) - Sn(2)},\\ldots`)} nie jest arytmetyczny (arytmetyczny jest dopiero od drugiego wyrazu).`],
      answer: M(`a_1 = ${a1},\\quad a_{${k}} = ${ak}`), plot: { f: n => Sn(n) - Sn(n - 1), hi: k },
      verify: () => a1 !== p + 1 && ak === 2 * k + p - 1 });
  },
  function fibUnknown() {
    const a1 = ri(1, 6), a2 = ri(1, 9), a5 = 2 * a1 + 3 * a2;
    return mk({ skill: 'rekurencja z niewiadomą',
      text: t`Ciąg ${M('(a_n)')} spełnia warunek ${M('a_{n+2} = a_{n+1} + a_n')} dla ${M(t`n \geq 1`)}. Wiadomo, że ${M(`a_1 = ${a1}`)} oraz ${M(`a_5 = ${a5}`)}. Oblicz ${M('a_2')} i ${M('a_6')}.`,
      fields: [F(M('a_2 ='), a2), F(M('a_6 ='), 3 * a1 + 5 * a2)],
      hints: [t`Oznacz ${M('a_2 = x')} i wyraź ${M('a_3, a_4, a_5')} przez ${M('x')}.`, t`Wyraz ${M('a_5')} wyjdzie jako wyrażenie z ${M('x')}. Przyrównaj je do podanej wartości i rozwiąż równanie.`],
      steps: [M(t`a_3 = ${a1} + x,\quad a_4 = x + (${a1} + x) = ${poly([2, a1], 'x')},\quad a_5 = (${a1} + x) + (${poly([2, a1], 'x')}) = ${poly([3, 2 * a1], 'x')}`),
        M(t`${poly([3, 2 * a1], 'x')} = ${a5} \;\Rightarrow\; 3x = ${a5 - 2 * a1} \;\Rightarrow\; x = ${a2}`),
        M(t`a_4 = ${2 * a2 + a1},\quad a_6 = a_5 + a_4 = ${a5} + ${2 * a2 + a1} = ${3 * a1 + 5 * a2}`)],
      answer: M(`a_2 = ${a2},\\quad a_6 = ${3 * a1 + 5 * a2}`), plot: { f: n => { const s = [a1, a2]; for (let i = 2; i < n; i++) s.push(s[i - 1] + s[i - 2]); return s[n - 1]; }, N: 8, hi: 2 },
      verify: () => { const s = [a1, a2]; for (let i = 2; i < 6; i++) s.push(s[i - 1] + s[i - 2]); return s[4] === a5 && s[5] === 3 * a1 + 5 * a2; } });
  }
]
};

const BANK = { A: GA, G: GG, R: GR };
const TOPIC_NAME = { A: 'Ciąg arytmetyczny', G: 'Ciąg geometryczny', R: 'Inne ciągi' };

/* ---- wykres początkowych wyrazów ciągu (pokazywany z rozwiązaniem) ---- */
function plotSVG(spec) {
  const hi = spec.hi;
  let N = spec.N || (hi && hi <= 12 ? Math.max(hi, 7) : 10);
  const vals = [];
  for (let n = 1; n <= N; n++) vals.push(spec.f(n));
  if (vals.some(v => !Number.isFinite(v))) return '';
  const W = spec.W || 640, H = spec.W && spec.W < 480 ? 220 : 250, L = 20, R = 20, TOP = 26, B = 40;
  let mn = Math.min(0, ...vals), mx = Math.max(0, ...vals); if (mn === mx) mx = mn + 1;
  const span = mx - mn; mx += span * 0.06; if (mn < 0) mn -= span * 0.1;
  const x = n => L + (n - 0.5) * (W - L - R) / N;
  const y = v => TOP + (mx - v) * (H - TOP - B) / (mx - mn);
  const short = v => { const r = Math.abs(v) >= 100 ? Math.round(v) : +v.toFixed(3); return txt(r); };
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Wykres ${N} początkowych wyrazów ciągu">`;
  s += `<line class="axis" x1="${L}" x2="${W - R}" y1="${y(0)}" y2="${y(0)}"/>`;
  s += `<text class="zl" x="${W - R}" y="${y(0) - 5}" text-anchor="end">0</text>`;
  vals.forEach((v, i) => {
    const n = i + 1, cx = x(n), cy = y(v), isHi = n === hi;
    s += `<line class="guide" x1="${cx}" x2="${cx}" y1="${y(0)}" y2="${cy}"/>`;
    if (isHi) s += `<circle class="ring" cx="${cx}" cy="${cy}" r="9"/>`;
    s += `<circle class="pt${isHi ? ' hi' : ''}" cx="${cx}" cy="${cy}" r="5"/>`;
    const above = v >= 0;
    s += `<text class="vl" x="${cx}" y="${above ? cy - 10 : cy + 19}" text-anchor="middle">${short(v)}</text>`;
    s += `<text class="xl" x="${cx}" y="${H - 12}" text-anchor="middle">a${sub(n)}</text>`;
  });
  return s + '</svg>';
}
const SUBS = '₀₁₂₃₄₅₆₇₈₉';
const sub = n => String(n).split('').map(d => SUBS[+d]).join('');

const FORM = {
  A: [['n-ty wyraz', String.raw`\(a_n = a_1 + (n-1)\,r\)`], ['różnica', String.raw`\(r = a_{n+1} - a_n\)`],
      ['suma n wyrazów', String.raw`\(S_n = \dfrac{a_1 + a_n}{2}\cdot n\)<br>\(S_n = \dfrac{2a_1 + (n-1)r}{2}\cdot n\)`], ['trzy kolejne wyrazy a, b, c', String.raw`\(2b = a + c\)`]],
  G: [['n-ty wyraz', String.raw`\(a_n = a_1\cdot q^{\,n-1}\)`], ['iloraz', String.raw`\(q = \dfrac{a_{n+1}}{a_n}\)`],
      ['suma n wyrazów (q ≠ 1)', String.raw`\(S_n = a_1\cdot\dfrac{1 - q^n}{1 - q}\)`], ['trzy kolejne wyrazy a, b, c', String.raw`\(b^2 = a\cdot c\)`]],
  R: [['wyraz ze wzoru', String.raw`wstaw numer \(n\) do wzoru \(a_n\)`], ['monotoniczność', String.raw`\(a_{n+1} - a_n > 0\) – rosnący, \(< 0\) – malejący`],
      ['wyraz z sumy', String.raw`\(a_1 = S_1,\quad a_n = S_n - S_{n-1}\ (n \geq 2)\)`], ['rekurencja', String.raw`licz po kolei: \(a_1, a_2, a_3, \ldots\)`]]
};

/* ---- adapter: zadanie w starym formacie -> format wspólnego silnika ---- */
const dedupe = x => String(x).replace(/(\\frac\{[^{}]+\}\{[^{}]+\}) = \1(?![\d{^])/g, '$1');
function adapt(g, lv) {
  const f = function () {
    const k = g();
    k.fields = k.fields.map(fl => Object.assign({ show: fl.set ? fl.ans.map(txt).join('; ') : txt(fl.ans), plain: true }, fl));
    if (k.plot) { const svg = plotSVG(Object.assign({}, k.plot, { W: 560 })); if (svg) k.solFig = `<div class="plotbox"><p class="cap">Początkowe wyrazy ciągu${k.plot.hi ? ' (zielony – wyraz z zadania)' : ''}</p>${svg}</div>`; }
    k.steps = k.steps.map(dedupe); k.answer = dedupe(k.answer);
    k.check = k.verify || null;
    k.pts = k.choices ? 1 : Math.min(4, Math.max(lv === 1 ? 1 : 2, k.fields.length + (lv === 3 ? 1 : 0)));
    return E.mk(k);
  };
  Object.defineProperty(f, 'name', { value: g.name });
  return f;
}
const bank = {};
for (const tp of Object.keys(BANK)) { bank[tp] = {}; for (const lv of [1, 2, 3]) bank[tp][lv] = BANK[tp][lv].map(g => adapt(g, lv)); }

MATURA.dzial({
  id: 'ciagi', store: 'ciagi-matura-v1', title: 'Ciągi', seq: 'a₁, a₂, a₃, …',
  lead: 'Ciąg arytmetyczny, geometryczny i ciągi określone wzorem lub rekurencyjnie. Przy rozwiązaniu zobaczysz wykres początkowych wyrazów.',
  topics: TOPIC_NAME, short: { A: 'Arytmetyczny', G: 'Geometryczny' },
  bank: bank, formulas: FORM
});
})();
