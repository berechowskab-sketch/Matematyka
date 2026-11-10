/* Działy III–IV: Równania, nierówności i układy równań */
(function () {
const nz = (a, b) => { let v; do { v = ri(a, b); } while (v === 0); return v; };
const sys = (e1, e2) => t`\begin{cases} ${e1} \\ ${e2} \end{cases}`;
const lin2 = (a, b, c) => `${poly([a, 0], 'x')} ${b < 0 ? '-' : '+'} ${poly([Math.abs(b), 0], 'y')} = ${T(c)}`;
const SG = { '<': '<', '<=': t`\leq`, '>': '>', '>=': t`\geq` };
const cmp = (s, l, r) => (s === '<' ? l < r - 1e-12 : s === '<=' ? l <= r + 1e-12 : s === '>' ? l > r + 1e-12 : l >= r - 1e-12);
/* zbiory: półprosta i rozwiązania nierówności kwadratowej */
const ray = (k, left, cl) => (left ? IV(-INF, k, false, cl) : IV(k, INF, cl, false));
const inRay = (x, k, left, cl) => (left ? (cl ? x <= k : x < k) : (cl ? x >= k : x > k));
const qset = (r1, r2, inside, cl) => (inside ? IV(r1, r2, cl, cl) : UN(IV(-INF, r1, false, cl), IV(r2, INF, cl, false)));
const inQ = (x, r1, r2, inside, cl) => { const i = cl ? x >= r1 && x <= r2 : x > r1 && x < r2, o = cl ? x <= r1 || x >= r2 : x < r1 || x > r2; return inside ? i : o; };
/* kroki z deltą dla ax² + bx + c = 0 o wymiernych pierwiastkach */
function quadSteps(a, b, c) {
  const D0 = b * b - 4 * a * c, s = Math.sqrt(D0);
  return [M(t`\Delta = b^2 - 4ac = ${P(b)}^2 - 4\cdot ${P(a)}\cdot ${P(c)} = ${D0}`), M(t`\sqrt{\Delta} = ${T(s)}`),
    M(t`x_1 = \frac{-b - \sqrt{\Delta}}{2a} = \frac{${T(-b)} - ${T(s)}}{${T(2 * a)}} = ${TF((-b - s) / (2 * a))},\qquad x_2 = \frac{-b + \sqrt{\Delta}}{2a} = \frac{${T(-b)} + ${T(s)}}{${T(2 * a)}} = ${TF((-b + s) / (2 * a))}`)];
}
const qv = (a, b, c, x) => a * x * x + b * x + c;

const GL = {
1: [
  function linEq() {
    const x0 = ri(-8, 8), a = nz(-6, 9), c = nz(-6, 9), b = ri(-12, 12), d = (a - c) * x0 + b; need(a !== c && Math.abs(d) <= 40 && b !== 0 && d !== 0);
    return mk({ skill: 'równanie liniowe',
      text: t`Rozwiąż równanie ${M(`${poly([a, b])} = ${poly([c, d])}`)}.`,
      fields: [F(M('x ='), x0)],
      hints: [t`Przenieś wyrazy z ${M('x')} na lewą stronę, a liczby na prawą. Przy przenoszeniu zmieniaj znak.`, t`Po uporządkowaniu dostaniesz ${M(`${poly([a - c, 0])} = ${d - b}`)}.`],
      steps: [M(t`${poly([a, 0])} ${c < 0 ? '+' : '-'} ${poly([Math.abs(c), 0])} = ${d} ${b < 0 ? '+' : '-'} ${Math.abs(b)}`), M(`${poly([a - c, 0])} = ${d - b}`), M(`x = ${x0}`)],
      answer: M(`x = ${x0}`), check: () => near(a * x0 + b, c * x0 + d) });
  },
  function linIneq() {
    const a = pick([-5, -4, -3, -2, 2, 3, 4, 5]), k = ri(-6, 6), b = nz(-9, 9), c = a * k + b, s = pick(['<', '<=', '>', '>=']);
    const left = (s[0] === '<') === (a > 0), cl = s.length === 2;
    const o = opts(ray(k, left, cl), [ray(k, !left, cl), ray(k, left, !cl), ray(-k, left, cl), ray(-k, !left, cl), ray(k, !left, !cl)]);
    return mk(Object.assign({ skill: 'nierówność liniowa',
      text: DOK + t`Zbiorem wszystkich rozwiązań nierówności ${M(`${poly([a, b])} ${SG[s]} ${c}`)} jest przedział`,
      hints: [t`Rozwiązuj jak równanie: przenieś liczbę na prawą stronę, potem podziel przez współczynnik przy ${M('x')}.`, a < 0 ? t`Dzielisz przez liczbę ujemną (${M(a)}), więc zmień zwrot nierówności na przeciwny.` : t`Dzielisz przez liczbę dodatnią (${M(a)}), więc zwrot nierówności zostaje bez zmian.`],
      steps: [M(`${poly([a, 0])} ${SG[s]} ${c - b}`), a < 0 ? t`Dzielimy obie strony przez ${M(a)} i zmieniamy zwrot nierówności: ${M(`x ${SG[{ '<': '>', '<=': '>=', '>': '<', '>=': '<=' }[s]]} ${k}`)}.` : t`Dzielimy obie strony przez ${M(a)}: ${M(`x ${SG[s]} ${k}`)}.`, M(t`x \in ${ray(k, left, cl)}`)],
      answer: M(t`x \in ${ray(k, left, cl)}`),
      check: () => { for (let x = -12; x <= 12; x += 0.25) if (cmp(s, a * x + b, c) !== inRay(x, k, left, cl)) return false; return true; } }, o));
  }
],
2: [
  function system() {
    const x0 = ri(-5, 6), y0 = ri(-5, 6), a1 = nz(-4, 5), b1 = nz(-4, 5), a2 = nz(-4, 5), b2 = nz(-4, 5), det = a1 * b2 - a2 * b1; need(det !== 0 && (x0 !== 0 || y0 !== 0));
    const c1 = a1 * x0 + b1 * y0, c2 = a2 * x0 + b2 * y0, ky = b1 * a2 - b2 * a1, kc = c1 * a2 - c2 * a1;
    return mk({ skill: 'układ równań liniowych', pts: 2,
      text: t`Rozwiąż układ równań ${M(sys(lin2(a1, b1, c1), lin2(a2, b2, c2)))}`,
      fields: [F(M('x ='), x0), F(M('y ='), y0)],
      hints: [t`Metoda przeciwnych współczynników: pomnóż pierwsze równanie przez ${M(a2)}, a drugie przez ${M(a1)} – wtedy przy ${M('x')} będą te same współczynniki.`, t`Odejmij równania stronami. Zostanie równanie z samym ${M('y')}: ${M(`${poly([ky, 0], 'y')} = ${kc}`)}.`],
      steps: [t`Mnożymy pierwsze równanie przez ${M(a2)}, drugie przez ${M(a1)}: ${M(sys(lin2(a1 * a2, b1 * a2, c1 * a2), lin2(a1 * a2, b2 * a1, c2 * a1)))}`, t`Odejmujemy stronami: ${M(`${poly([ky, 0], 'y')} = ${kc}`)}, stąd ${M(`y = ${y0}`)}.`, t`Wstawiamy do pierwszego równania: ${M(t`${poly([a1, 0])} ${b1 * y0 < 0 ? '-' : '+'} ${Math.abs(b1 * y0)} = ${c1}`)}, stąd ${M(`x = ${x0}`)}.`],
      answer: M(t`x = ${x0},\quad y = ${y0}`), check: () => near(a1 * x0 + b1 * y0, c1) && near(a2 * x0 + b2 * y0, c2) && near(ky * y0, kc) });
  },
  function fracEq() {
    const m = pick([2, 3, 4, 5]), n = pick([2, 3, 4, 5]), x0 = ri(-9, 12), u = ri(-3, 4), v = ri(-3, 4), a = m * u - x0, b = x0 - n * v, c = u - v;
    need(m !== n && a !== 0 && b !== 0 && Math.abs(a) <= 9 && Math.abs(b) <= 9);
    const rhs = c * m * n - n * a - m * b;
    return mk({ skill: 'równanie z ułamkami', pts: 2,
      text: t`Rozwiąż równanie ${M(t`\dfrac{x${pm(a)}}{${m}} - \dfrac{x${pm(-b)}}{${n}} = ${c}`)}.`,
      fields: [F(M('x ='), x0)],
      hints: [t`Pozbądź się mianowników: pomnóż obie strony przez ${M(m * n)}.`, t`Uwaga na minus przed drugim ułamkiem – zmienia znak obu wyrazów licznika: ${M(t`${n}(x${pm(a)}) - ${m}(x${pm(-b)}) = ${c * m * n}`)}.`],
      steps: [t`Mnożymy obie strony przez ${M(m * n)}: ${M(t`${n}(x${pm(a)}) - ${m}(x${pm(-b)}) = ${c * m * n}`)}.`, M(t`${n}x${pm(n * a)} - ${m}x${pm(m * b)} = ${c * m * n}`), M(t`${poly([n - m, 0])} = ${rhs}`)].concat(n - m === 1 ? [] : [M(`x = ${x0}`)]),
      answer: M(`x = ${x0}`), check: () => near((x0 + a) / m - (x0 - b) / n, c) && near((n - m) * x0, rhs) });
  },
  function tickets() {
    const pn = pick([18, 20, 22, 24, 26, 28, 30]), pu = pn - pick([4, 6, 8, 10]), x = ri(3, 14), y = ri(3, 14), Nn = x + y, Sn = pn * x + pu * y; need(x !== y);
    return mk({ skill: 'zadanie tekstowe – układ równań', pts: 2,
      text: t`Grupa ${M(Nn)} osób poszła do kina. Bilet normalny kosztował ${M(pn)} zł, a ulgowy ${M(pu)} zł. Za wszystkie bilety zapłacono ${M(Sn)} zł. Ile kupiono biletów normalnych, a ile ulgowych?`,
      fields: [F('Normalnych:', x), F('Ulgowych:', y)],
      hints: [t`Oznacz: ${M('x')} – liczba biletów normalnych, ${M('y')} – ulgowych. Jedno równanie opisuje liczbę osób, drugie – zapłaconą kwotę.`, t`${M(sys(`x + y = ${Nn}`, `${pn}x + ${pu}y = ${Sn}`))} Z pierwszego równania wyznacz ${M(`y = ${Nn} - x`)} i wstaw do drugiego.`],
      steps: [M(sys(`x + y = ${Nn}`, `${pn}x + ${pu}y = ${Sn}`)), M(t`${pn}x + ${pu}(${Nn} - x) = ${Sn}`), M(t`${pn - pu}x = ${Sn} - ${pu * Nn} = ${Sn - pu * Nn}`), M(t`x = ${x},\qquad y = ${Nn} - ${x} = ${y}`)],
      answer: `bilety normalne: ${x}, bilety ulgowe: ${y}`, check: () => x + y === Nn && pn * x + pu * y === Sn && (pn - pu) * x === Sn - pu * Nn });
  }
],
3: [
  function sysParam() {
    const a1 = nz(-4, 5), b1 = nz(-5, 5), c1 = ri(-9, 9), k = pick([-3, -2, 2, 3]), c2 = ri(-12, 12); need(c2 !== k * c1 && Math.abs(a1) !== 0);
    const m = k * b1;
    return mk({ skill: 'układ sprzeczny – interpretacja geometryczna', pts: 2,
      text: t`Dany jest układ równań z niewiadomymi ${M('x')} i ${M('y')}: ${M(sys(lin2(a1, b1, c1), t`${poly([k * a1, 0], 'x')} + my = ${c2}`))} Wyznacz wartość ${M('m')}, dla której układ nie ma rozwiązań.`,
      fields: [F(M('m ='), m)],
      hints: [t`Każde równanie opisuje prostą. Układ nie ma rozwiązań, gdy proste są równoległe i się nie pokrywają.`, t`Proste są równoległe, gdy współczynniki przy ${M('x')} i ${M('y')} są proporcjonalne. Współczynnik przy ${M('x')} w drugim równaniu powstaje z pomnożenia współczynnika z pierwszego równania przez ${M(k)}.`],
      steps: [t`Współczynnik przy ${M('x')}: ${M(t`${k * a1} = ${k}\cdot ${P(a1)}`)}. Aby proste były równoległe, tak samo musi być przy ${M('y')}: ${M(t`m = ${k}\cdot ${P(b1)} = ${m}`)}.`, t`Sprawdzamy wyrazy wolne: ${M(t`${k}\cdot ${P(c1)} = ${k * c1} \neq ${c2}`)}, więc proste się nie pokrywają.`, t`Dla ${M(`m = ${m}`)} układ jest sprzeczny.`],
      answer: M(`m = ${m}`), check: () => a1 * m - k * a1 * b1 === 0 && c2 !== k * c1 });
  },
  function intIneq() {
    const a = pick([-4, -3, -2, 2, 3, 4, 5]), b = nz(-6, 6), c = nz(-5, 7), d = ri(-15, 15), Dc = a - c, E = d - a * b, s = pick(['<', '<=']); need(Dc !== 0 && Math.abs(Dc) > 1 && !isInt(E / Dc));
    const left = Dc > 0, bound = E / Dc, ans = left ? Math.ceil(bound) - 1 : Math.floor(bound) + 1;
    return mk({ skill: 'liczby całkowite spełniające nierówność', pts: 2,
      text: t`Wyznacz ${left ? 'największą' : 'najmniejszą'} liczbę całkowitą spełniającą nierówność ${M(t`${a}(x${pm(b)}) ${SG[s]} ${poly([c, d])}`)}.`,
      fields: [F('Szukana liczba:', ans)],
      hints: [t`Opuść nawias, przenieś wyrazy z ${M('x')} na lewą stronę, liczby na prawą: ${M(`${poly([Dc, 0])} ${SG[s]} ${E}`)}.`, Dc < 0 ? t`Dzieląc przez liczbę ujemną ${M(Dc)}, zmień zwrot nierówności. Potem wybierz odpowiednią liczbę całkowitą.` : t`Podziel przez ${M(Dc)} i wybierz największą liczbę całkowitą mniejszą od ${M(TF(bound))}.`],
      steps: [M(`${poly([a, a * b])} ${SG[s]} ${poly([c, d])}`), M(`${poly([Dc, 0])} ${SG[s]} ${E}`), Dc < 0 ? t`Dzielimy przez ${M(Dc)} i zmieniamy zwrot: ${M(t`x ${SG[s === '<' ? '>' : '>=']} ${TF(bound)}`)}, czyli ${M(t`x ${SG[s === '<' ? '>' : '>=']} ${T(+bound.toFixed(2))}${isInt(bound * 100) ? '' : t`\ldots`}`)}` : t`Dzielimy przez ${M(Dc)}: ${M(t`x ${SG[s]} ${TF(bound)}`)}, czyli ${M(t`x ${SG[s]} ${T(+(Math.trunc(bound * 100) / 100).toFixed(2))}${isInt(bound * 100) ? '' : t`\ldots`}`)}`, t`${left ? 'Największa' : 'Najmniejsza'} liczba całkowita spełniająca ten warunek to ${M(ans)}.`],
      answer: M(`${ans}`), check: () => { const ok = x => cmp(s, a * (x + b), c * x + d); return ok(ans) && !ok(left ? ans + 1 : ans - 1) && ok(left ? ans - 1 : ans + 1); } });
  },
  function shop() {
    const z = pick([2.5, 3, 3.5, 4, 4.5, 5]), dl = pick([1.5, 2, 2.5, 3, 3.5]), a1 = ri(2, 5), b1 = ri(1, 4), a2 = ri(1, 4), b2 = ri(2, 6); need(a1 * b2 - a2 * b1 !== 0 && z !== dl);
    const A = a1 * z + b1 * dl, B = a2 * z + b2 * dl, det = a1 * b2 - a2 * b1;
    const eq = (u, v, w) => `${poly([u, 0])} + ${poly([v, 0], 'y')} = ${zl(w)}`, pl = (n, one, few, many) => (n === 1 ? one : n < 5 ? few : many);
    return mk({ skill: 'zadanie tekstowe – układ równań', pts: 3,
      text: t`Za ${M(a1)} ${pl(a1, 'zeszyt', 'zeszyty', 'zeszytów')} i ${M(b1)} ${pl(b1, 'długopis', 'długopisy', 'długopisów')} zapłacono ${M(zl(A))} zł, a za ${M(a2)} ${pl(a2, 'zeszyt', 'zeszyty', 'zeszytów')} i ${M(b2)} ${pl(b2, 'długopis', 'długopisy', 'długopisów')} – ${M(zl(B))} zł. Oblicz cenę jednego zeszytu i cenę jednego długopisu.`,
      fields: [F('Zeszyt:', z, { unit: 'zł' }), F('Długopis:', dl, { unit: 'zł' })],
      hints: [t`Oznacz: ${M('x')} – cena zeszytu, ${M('y')} – cena długopisu. Każde zdanie o zakupach daje jedno równanie.`, t`${M(sys(eq(a1, b1, A), eq(a2, b2, B)))} Pomnóż pierwsze równanie przez ${M(b2)}, drugie przez ${M(b1)} i odejmij stronami, żeby pozbyć się ${M('y')}.`],
      steps: [M(sys(eq(a1, b1, A), eq(a2, b2, B))), t`Pierwsze równanie razy ${M(b2)}, drugie razy ${M(b1)}, odejmujemy stronami: ${M(t`${poly([det, 0])} = ${T(A * b2 - B * b1)}`)}.`, M(t`x = ${T(z)}`), t`Z pierwszego równania: ${M(t`${b1 === 1 ? '' : b1}y = ${zl(A)} - ${T(a1 * z)} = ${T(b1 * dl)}`)}, stąd ${M(`y = ${T(dl)}`)}.`],
      answer: t`zeszyt: ${M(zl(z))} zł, długopis: ${M(zl(dl))} zł`, check: () => near(a1 * z + b1 * dl, A) && near(a2 * z + b2 * dl, B) && near(det * z, A * b2 - B * b1) });
  }
]
};

const GK = {
1: [
  function quadRoots() {
    const r1 = ri(-8, 6), r2 = r1 + ri(1, 9), b = -(r1 + r2), c = r1 * r2; need(b !== 0 && c !== 0);
    return mk({ skill: 'równanie kwadratowe', pts: 2,
      text: t`Rozwiąż równanie ${M(`${poly([1, b, c])} = 0`)}.`,
      fields: [F('Mniejsze rozwiązanie:', r1), F('Większe rozwiązanie:', r2)],
      hints: [t`Odczytaj współczynniki ${M(t`a = 1,\ b = ${b},\ c = ${c}`)} i policz wyróżnik ${M(t`\Delta = b^2 - 4ac`)}.`, t`${M(t`\Delta = ${b * b - 4 * c}`)}, więc ${M(t`\sqrt{\Delta} = ${r2 - r1}`)}. Teraz ${M(t`x = \frac{-b \pm \sqrt{\Delta}}{2a}`)}.`],
      steps: quadSteps(1, b, c),
      answer: M(t`x = ${r1}\ \text{lub}\ x = ${r2}`), check: () => near(qv(1, b, c, r1), 0) && near(qv(1, b, c, r2), 0) && r1 < r2 });
  },
  function incomplete() {
    if (Math.random() < 0.5) {
      const a = pick([1, 2, 3, 4, -1, -2, -3]), k = nz(-9, 9), b = -a * k, lo = Math.min(0, k), hi = Math.max(0, k);
      return mk({ skill: 'równanie kwadratowe niezupełne', pts: 2,
        text: t`Rozwiąż równanie ${M(`${poly([a, b, 0])} = 0`)}.`,
        fields: [F('Mniejsze rozwiązanie:', lo), F('Większe rozwiązanie:', hi)],
        hints: [t`Nie ma wyrazu wolnego, więc wyłącz ${M('x')} przed nawias.`, t`Iloczyn jest równy zero, gdy przynajmniej jeden czynnik jest zerem. Nie dziel przez ${M('x')} – zgubisz rozwiązanie ${M('x = 0')}.`],
        steps: [M(t`${poly([a, 0])}\left(x${pm(-k)}\right) = 0`), M(t`x = 0\quad\text{lub}\quad x${pm(-k)} = 0`), M(t`x = 0\quad\text{lub}\quad x = ${k}`)],
        answer: M(t`x = ${lo}\ \text{lub}\ x = ${hi}`), check: () => near(qv(a, b, 0, lo), 0) && near(qv(a, b, 0, hi), 0) });
    }
    const a = pick([1, 2, 3, 4, 5]), k = ri(2, 9), c = a * k * k;
    return mk({ skill: 'równanie kwadratowe niezupełne', pts: 2,
      text: t`Rozwiąż równanie ${M(`${poly([a, 0, -c])} = 0`)}.`,
      fields: [F('Mniejsze rozwiązanie:', -k), F('Większe rozwiązanie:', k)],
      hints: [t`Przenieś liczbę na prawą stronę${a > 1 ? t` i podziel przez ${M(a)}` : ''}: ${M(`x^2 = ${k * k}`)}.`, t`Równanie ${M('x^2 = k^2')} ma dwa rozwiązania: dodatnie i ujemne.`],
      steps: [M(a > 1 ? t`${a}x^2 = ${c} \iff x^2 = ${k * k}` : `x^2 = ${k * k}`), M(t`x = ${k}\quad\text{lub}\quad x = ${-k}`)],
      answer: M(t`x = ${-k}\ \text{lub}\ x = ${k}`), check: () => near(qv(a, 0, -c, k), 0) && near(qv(a, 0, -c, -k), 0) });
  },
  function discCount() {
    const kind = ri(0, 2), LAB = ['nie ma rozwiązań rzeczywistych.', 'ma dokładnie jedno rozwiązanie rzeczywiste.', 'ma dokładnie dwa rozwiązania rzeczywiste.'];
    let a, b, c;
    for (let i = 0; ; i++) {
      need(i < 200); a = pick([1, 1, 2, 3, -1, 4]); b = ri(-10, 10); c = ri(-9, 16);
      const D0 = b * b - 4 * a * c; if (b !== 0 && c !== 0 && (kind === 0 ? D0 < 0 : kind === 1 ? D0 === 0 : D0 > 0)) break;
    }
    const D0 = b * b - 4 * a * c, o = opts(LAB[kind], LAB.filter((x, i) => i !== kind), { n: 3, raw: true, keep: LAB });
    return mk(Object.assign({ skill: 'liczba rozwiązań równania kwadratowego',
      text: DOK + t`Równanie ${M(`${poly([a, b, c])} = 0`)}`,
      hints: [t`O liczbie rozwiązań decyduje znak wyróżnika ${M(t`\Delta = b^2 - 4ac`)}.`, t`${M(t`\Delta > 0`)}: dwa rozwiązania, ${M(t`\Delta = 0`)}: jedno, ${M(t`\Delta < 0`)}: brak rozwiązań.`],
      steps: [M(t`\Delta = ${P(b)}^2 - 4\cdot ${P(a)}\cdot ${P(c)} = ${b * b} ${-4 * a * c < 0 ? '-' : '+'} ${Math.abs(4 * a * c)} = ${D0}`), t`${M(t`\Delta ${D0 < 0 ? '< 0' : D0 === 0 ? '= 0' : '> 0'}`)}, więc równanie ${LAB[kind]}`],
      answer: 'Równanie ' + LAB[kind],
      check: () => { let n = 0, prev = qv(a, b, c, -60); for (let x = -60 + 1 / 64; x <= 60; x += 1 / 64) { const v = qv(a, b, c, x); if (v === 0 || (prev !== 0 && v * prev < 0)) n++; prev = v; } return kind === 1 ? n <= 1 && D0 === 0 : n === (kind === 0 ? 0 : 2); } }, o));
  }
],
2: [
  function quadIneq() {
    const a = pick([1, 1, -1, 2, -2]), r1 = ri(-7, 5), r2 = r1 + ri(1, 8), b = -a * (r1 + r2), c = a * r1 * r2, s = pick(['<', '<=', '>', '>=']);
    const inside = (s[0] === '<') === (a > 0), cl = s.length === 2;
    const o = opts(qset(r1, r2, inside, cl), [qset(r1, r2, !inside, cl), qset(r1, r2, inside, !cl), qset(-r2, -r1, inside, cl), qset(-r2, -r1, !inside, cl), ray(r2, true, cl), ray(r1, false, cl)]);
    return mk(Object.assign({ skill: 'nierówność kwadratowa',
      text: DOK + t`Zbiorem wszystkich rozwiązań nierówności ${M(`${poly([a, b, c])} ${SG[s]} 0`)} jest`,
      hints: [t`Najpierw znajdź miejsca zerowe trójmianu ${M(poly([a, b, c]))} (delta albo postać iloczynowa).`, t`Miejsca zerowe to ${M(r1)} i ${M(r2)}. Naszkicuj parabolę: ramiona skierowane ${a > 0 ? 'w górę' : 'w dół'}, bo ${M(a > 0 ? 'a > 0' : 'a < 0')}. Odczytaj, gdzie wykres leży ${s[0] === '<' ? 'pod osią' : 'nad osią'} ${M('Ox')}.`],
      steps: quadSteps(a, b, c).concat([t`Ramiona paraboli są skierowane ${a > 0 ? 'w górę' : 'w dół'}, więc trójmian jest ${s[0] === '<' ? 'ujemny' : 'dodatni'} ${inside ? 'między miejscami zerowymi' : 'na zewnątrz miejsc zerowych'}. ${cl ? 'Nierówność jest nieostra, więc końce należą do zbioru rozwiązań.' : 'Nierówność jest ostra, więc końce nie należą do zbioru rozwiązań.'}`, M(t`x \in ${qset(r1, r2, inside, cl)}`)]),
      answer: M(t`x \in ${qset(r1, r2, inside, cl)}`),
      check: () => { for (let x = -20; x <= 20; x += 0.25) if (cmp(s, qv(a, b, c, x), 0) !== inQ(x, r1, r2, inside, cl)) return false; return true; } }, o));
  },
  function quadFrac() {
    const m = pick([2, 3, 4]), p = pick([-7, -5, -3, -1, 1, 3, 5, 7]), q = nz(-5, 5); need(p % m !== 0 && gcd(Math.abs(p), m) === 1);
    const a = m, b = -(m * q + p), c = p * q, x1 = Math.min(p / m, q), x2 = Math.max(p / m, q); need(b !== 0);
    return mk({ skill: 'równanie kwadratowe z ułamkowym rozwiązaniem', pts: 2,
      text: t`Rozwiąż równanie ${M(`${poly([a, b, c])} = 0`)}.`,
      fields: [F('Mniejsze rozwiązanie:', x1), F('Większe rozwiązanie:', x2)],
      hints: [t`Współczynniki: ${M(t`a = ${a},\ b = ${b},\ c = ${c}`)}. Policz ${M(t`\Delta = b^2 - 4ac`)}.`, t`${M(t`\Delta = ${b * b - 4 * a * c}`)}. W mianowniku wzoru na pierwiastki jest ${M('2a')}, czyli ${M(2 * a)}, a nie ${M(2)}.`],
      steps: quadSteps(a, b, c),
      answer: M(t`x = ${TF(x1)}\ \text{lub}\ x = ${TF(x2)}`), check: () => near(qv(a, b, c, x1), 0) && near(qv(a, b, c, x2), 0) && x1 < x2 });
  },
  function quadRearr() {
    const r1 = ri(-7, 5), r2 = r1 + ri(1, 8), p = nz(-4, 4), q = ri(-6, 6), b = -(r1 + r2) + p, c = r1 * r2 + q; need(b !== 0 && c !== 0 && r1 + r2 !== 0 && r1 * r2 !== 0);
    return mk({ skill: 'porządkowanie równania kwadratowego', pts: 2,
      text: t`Rozwiąż równanie ${M(`${poly([1, b, c])} = ${poly([p, q])}`)}.`,
      fields: [F('Mniejsze rozwiązanie:', r1), F('Większe rozwiązanie:', r2)],
      hints: [t`Przenieś wszystko na lewą stronę, tak aby po prawej zostało zero.`, t`Po uporządkowaniu: ${M(`${poly([1, -(r1 + r2), r1 * r2])} = 0`)}. Teraz delta.`],
      steps: [M(`${poly([1, -(r1 + r2), r1 * r2])} = 0`)].concat(quadSteps(1, -(r1 + r2), r1 * r2)),
      answer: M(t`x = ${r1}\ \text{lub}\ x = ${r2}`), check: () => [r1, r2].every(x => near(qv(1, b, c, x), p * x + q)) });
  }
],
3: [
  function ineqCount() {
    const r1 = ri(-7, 3), r2 = r1 + ri(2, 8), a = -(r1 + r2), bb = -r1 * r2, s = pick(['<', '<=']); need(a !== 0 && bb !== 0);
    let cnt = 0; for (let x = -40; x <= 40; x++) if (cmp(s, x * (x + a), bb)) cnt++;
    const cl = s === '<=';
    return mk({ skill: 'nierówność kwadratowa – liczby całkowite', pts: 3,
      text: t`Ile liczb całkowitych spełnia nierówność ${M(t`x(x${pm(a)}) ${SG[s]} ${bb}`)}?`,
      fields: [F('Liczba liczb całkowitych:', cnt)],
      hints: [t`Po prawej stronie musi być zero. Wymnóż nawias i przenieś ${M(bb)} na lewą stronę: ${M(`${poly([1, a, -bb])} ${SG[s]} 0`)}.`, t`Miejsca zerowe to ${M(r1)} i ${M(r2)}; parabola ma ramiona w górę, więc rozwiązania leżą między nimi. Policz liczby całkowite – sprawdź, czy końce się liczą.`],
      steps: [M(`${poly([1, a, -bb])} ${SG[s]} 0`)].concat(quadSteps(1, a, -bb), [M(t`x \in ${IV(r1, r2, cl, cl)}`), t`Liczby całkowite w tym zbiorze: od ${M(cl ? r1 : r1 + 1)} do ${M(cl ? r2 : r2 - 1)}, razem ${M(cnt)}.`]),
      answer: M(`${cnt}`), check: () => cnt === (cl ? r2 - r1 + 1 : r2 - r1 - 1) && near(qv(1, a, -bb, r1), 0) && near(qv(1, a, -bb, r2), 0) });
  },
  function paramOne() {
    const a = pick([1, 1, 4, 9]), c = pick([1, 4, 9, 16, 25, 36]), m = 2 * Math.sqrt(a * c);
    return mk({ skill: 'równanie z parametrem – jedno rozwiązanie', pts: 2,
      text: t`Równanie ${M(`${poly([a, 0, 0])} + mx + ${c} = 0`)} z niewiadomą ${M('x')} ma dokładnie jedno rozwiązanie. Wyznacz dodatnią wartość ${M('m')}, dla której tak jest.`,
      fields: [F(M('m ='), m)],
      hints: [t`Równanie kwadratowe ma dokładnie jedno rozwiązanie, gdy ${M(t`\Delta = 0`)}.`, t`${M(t`\Delta = m^2 - 4\cdot ${a}\cdot ${c} = m^2 - ${4 * a * c}`)}.`],
      steps: [M(t`\Delta = m^2 - 4\cdot ${a}\cdot ${c} = m^2 - ${4 * a * c}`), M(t`m^2 - ${4 * a * c} = 0 \iff m^2 = ${4 * a * c} \iff m = ${m}\ \text{lub}\ m = ${-m}`), t`Dodatnia wartość: ${M(`m = ${m}`)}.`],
      answer: M(`m = ${m}`), check: () => near(m * m - 4 * a * c, 0) && m > 0 });
  },
  function rectangle() {
    const x = ri(3, 12), d = ri(2, 9), Pp = x * (x + d);
    return mk({ skill: 'zadanie tekstowe – równanie kwadratowe', pts: 3,
      text: t`Jeden bok prostokąta jest o ${M(d)} cm dłuższy od drugiego. Pole tego prostokąta jest równe ${M(Pp)} cm². Oblicz długości boków prostokąta.`,
      fields: [F('Krótszy bok:', x, { unit: 'cm' }), F('Dłuższy bok:', x + d, { unit: 'cm' })],
      hints: [t`Oznacz krótszy bok ${M('x')}. Wtedy dłuższy to ${M(`x + ${d}`)}, a pole: ${M(`x(x + ${d}) = ${Pp}`)}.`, t`Uporządkuj do postaci ${M(`${poly([1, d, -Pp])} = 0`)} i policz deltę. Długość boku musi być dodatnia.`],
      steps: [M(t`x(x + ${d}) = ${Pp} \iff ${poly([1, d, -Pp])} = 0`)].concat(quadSteps(1, d, -Pp), [t`Długość nie może być ujemna, więc ${M(`x = ${x}`)}. Drugi bok: ${M(`${x} + ${d} = ${x + d}`)}.`]),
      answer: t`${M(x)} cm i ${M(x + d)} cm`, check: () => x * (x + d) === Pp && near(qv(1, d, -Pp, x), 0) });
  }
]
};

const fac = (k, r) => (k === 1 ? xm(r) : `(${poly([k, -k * r])})`);
const GW = {
1: [
  function factoredSum() {
    const rs = shuffle([-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]).slice(0, 3), ks = [pick([1, 1, 2, 3]), 1, pick([1, 2])];
    const lhs = rs.map((r0, i) => fac(ks[i], r0)).sort((u, v) => u.length - v.length).join(''), sum = rs[0] + rs[1] + rs[2], srt = rs.slice().sort((u, v) => u - v);
    return mk({ skill: 'równanie w postaci iloczynowej',
      text: t`Oblicz sumę wszystkich rozwiązań równania ${M(`${lhs} = 0`)}.`,
      fields: [F('Suma rozwiązań:', sum)],
      hints: [t`Iloczyn jest równy zero, gdy co najmniej jeden z czynników jest równy zero. Nie wymnażaj nawiasów!`, t`Przyrównaj każdy czynnik osobno do zera i rozwiąż trzy proste równania.`],
      steps: [t`Każdy czynnik przyrównujemy do zera: ${M(srt.map(x => `x = ${x}`).join(t`,\quad `))}.`, M(t`${srt.map(P).join(' + ')} = ${sum}`)],
      answer: M(`${sum}`), check: () => rs.every(x => near(rs.reduce((acc, r0, i) => acc * ks[i] * (x - r0), 1), 0)) && new Set(rs).size === 3 });
  },
  function countSol() {
    const k = ri(2, 6), mm = pick([1, 2, 3, 4, 5, 9]), j = ri(1, 7), POOL = [['x', [0]], [`(x^2 - ${k * k})`, [-k, k]], [`(x^2 + ${mm})`, []], [xm(k), [k]], [xm(-j), [-j]], [`(x^2 - ${k * k})`, [-k, k]]];
    const sel = shuffle(POOL).slice(0, 3); need(new Set(sel.map(x => x[0])).size === 3);
    const roots = [...new Set(sel.flatMap(x => x[1]))].sort((u, v) => u - v); need(roots.length >= 1 && roots.length <= 4);
    const o = opts([`${roots.length}`, roots.length], [1, 2, 3, 4, 5, 0].map(v => [`${v}`, v]));
    const f = x => sel.reduce((acc, s0) => acc * (s0[0] === 'x' ? x : s0[0].includes('^2 -') ? x * x - k * k : s0[0].includes('^2 +') ? x * x + mm : s0[1].length ? x - s0[1][0] : 1), 1);
    return mk(Object.assign({ skill: 'liczba rozwiązań równania wielomianowego',
      text: DOK + t`Liczba wszystkich rozwiązań rzeczywistych równania ${M(`${sel.map(x => x[0]).join('')} = 0`)} jest równa`,
      hints: [t`Przyrównaj każdy czynnik osobno do zera.`, t`Uwaga: czynnik postaci ${M('x^2 + c')} z dodatnim ${M('c')} nigdy nie jest zerem, a ${M('x^2 - k^2 = 0')} ma dwa rozwiązania. To samo rozwiązanie z dwóch czynników licz tylko raz.`],
      steps: sel.map(s0 => t`${M(`${s0[0].replace(/^\((.*)\)$/, '$1')} = 0`)}: ${s0[1].length ? M(s0[1].map(x => `x = ${x}`).join(t`\ \text{lub}\ `)) : 'brak rozwiązań (suma kwadratu i liczby dodatniej jest dodatnia)'}.`).concat([t`Różne rozwiązania: ${M(roots.join(',\\ '))}. Jest ich ${M(roots.length)}.`]),
      answer: M(`${roots.length}`),
      check: () => { let n = 0; for (let x = -12; x <= 12; x++) if (near(f(x), 0)) n++; for (let x = -12.5; x <= 12; x++) if (near(f(x), 0)) return false; return n === roots.length; } }, o));
  }
],
2: [
  function commonFactor() {
    const a = pick([1, 2, 3, -1]), k = ri(2, 8);
    return mk({ skill: 'wyłączanie wspólnego czynnika', pts: 2,
      text: t`Rozwiąż równanie ${M(`${poly([a, 0, -a * k * k, 0])} = 0`)}. Podaj wszystkie rozwiązania.`,
      fields: [F('Najmniejsze:', -k), F('Środkowe:', 0), F('Największe:', k)],
      hints: [t`Wyłącz przed nawias wspólny czynnik ${M(poly([a, 0]))}.`, t`W nawiasie zostanie ${M(`x^2 - ${k * k}`)}, czyli różnica kwadratów: ${M(t`(x - ${k})(x + ${k})`)}.`],
      steps: [M(t`${poly([a, 0])}\left(x^2 - ${k * k}\right) = 0`), M(t`${poly([a, 0])}(x - ${k})(x + ${k}) = 0`), M(t`x = 0\quad\text{lub}\quad x = ${k}\quad\text{lub}\quad x = ${-k}`)],
      answer: M(t`x \in \{${-k},\ 0,\ ${k}\}`), check: () => [-k, 0, k].every(x => near(a * x * x * x - a * k * k * x, 0)) });
  },
  function rationalZero() {
    const k = ri(2, 9), minus = Math.random() < 0.5, sol = minus ? -k : k;
    const LAB = [t`nie ma rozwiązań.`, t`ma dokładnie jedno rozwiązanie: ${M(`x = ${-k}`)}.`, t`ma dokładnie jedno rozwiązanie: ${M(`x = ${k}`)}.`, t`ma dokładnie dwa rozwiązania: ${M(`x = ${-k}`)} oraz ${M(`x = ${k}`)}.`];
    const ci = minus ? 1 : 2, o = opts(LAB[ci], LAB.filter((x, i) => i !== ci), { raw: true, keep: LAB });
    return mk(Object.assign({ skill: 'równanie wymierne – dziedzina',
      text: DOK + t`Równanie ${M(t`\dfrac{x^2 - ${k * k}}{x${pm(minus ? -k : k)}} = 0`)}`,
      hints: [t`Ułamek jest równy zero, gdy licznik jest równy zero, a mianownik – różny od zera.`, t`Licznik zeruje się dla ${M(`x = ${k}`)} i ${M(`x = ${-k}`)}. Sprawdź, czy któraś z tych liczb nie zeruje mianownika.`],
      steps: [t`Dziedzina: ${M(t`x${pm(minus ? -k : k)} \neq 0`)}, czyli ${M(t`x \neq ${-sol}`)}.`, t`Licznik: ${M(t`x^2 - ${k * k} = 0 \iff x = ${k}\ \text{lub}\ x = ${-k}`)}.`, t`Liczba ${M(-sol)} nie należy do dziedziny, więc jedynym rozwiązaniem jest ${M(`x = ${sol}`)}.`],
      answer: M(`x = ${sol}`), check: () => near(sol * sol - k * k, 0) && Math.abs(sol + (minus ? -k : k)) > 0.5 && near(-sol + (minus ? -k : k), 0) }, o));
  }
],
3: [
  function grouping() {
    const a = nz(-6, 6), three = Math.random() < 0.6;
    if (three) {
      const k = ri(1, 5); need(Math.abs(a) !== k);
      const rs = [-a, -k, k].sort((u, v) => u - v), cs = [1, a, -k * k, -a * k * k];
      return mk({ skill: 'równanie wielomianowe – grupowanie', pts: 3,
        text: t`Rozwiąż równanie ${M(`${poly(cs)} = 0`)}. Podaj wszystkie rozwiązania.`,
        fields: [F('Najmniejsze:', rs[0]), F('Środkowe:', rs[1]), F('Największe:', rs[2])],
        hints: [t`Pogrupuj wyrazy parami: z pierwszych dwóch wyłącz ${M('x^2')}, z dwóch ostatnich liczbę ${M(-k * k)}.`, t`W obu grupach pojawi się ten sam nawias ${M(xm(-a))} – wyłącz go: ${M(t`${xm(-a)}(x^2 - ${k * k}) = 0`)}.`],
        steps: [M(t`x^2${xm(-a)} - ${k * k}${xm(-a)} = 0`), M(t`${xm(-a)}\left(x^2 - ${k * k}\right) = 0`), M(t`${xm(-a)}(x - ${k})(x + ${k}) = 0`), M(t`x = ${-a}\quad\text{lub}\quad x = ${k}\quad\text{lub}\quad x = ${-k}`)],
        answer: M(t`x \in \{${rs.join(',\\ ')}\}`), check: () => rs.every(x => near(cs[0] * x ** 3 + cs[1] * x * x + cs[2] * x + cs[3], 0)) && new Set(rs).size === 3 });
    }
    const m = ri(1, 9), cs = [1, a, m, a * m];
    return mk({ skill: 'równanie wielomianowe – grupowanie', pts: 3,
      text: t`Równanie ${M(`${poly(cs)} = 0`)} ma dokładnie jedno rozwiązanie rzeczywiste. Wyznacz to rozwiązanie.`,
      fields: [F(M('x ='), -a)],
      hints: [t`Pogrupuj wyrazy parami: z pierwszych dwóch wyłącz ${M('x^2')}, z dwóch ostatnich liczbę ${M(m)}.`, t`Otrzymasz ${M(t`${xm(-a)}(x^2 + ${m}) = 0`)}. Czy ${M(`x^2 + ${m}`)} może być zerem?`],
      steps: [M(t`x^2${xm(-a)} + ${m}${xm(-a)} = 0`), M(t`${xm(-a)}\left(x^2 + ${m}\right) = 0`), t`${M(t`x^2 + ${m} > 0`)} dla każdego ${M('x')}, więc zostaje ${M(t`x${pm(a)} = 0`)}, czyli ${M(`x = ${-a}`)}.`],
      answer: M(`x = ${-a}`), check: () => { const x = -a; return near(x ** 3 + a * x * x + m * x + a * m, 0); } });
  },
  function rationalFact() {
    const [a, b, c, d] = shuffle([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7]).slice(0, 4), lo = Math.min(a, c), hi = Math.max(a, c);
    const num = shuffle([xm(a), xm(b), xm(c)]).join(''), den = shuffle([xm(b), xm(d)]).join('');
    return mk({ skill: 'równanie wymierne w postaci iloczynowej', pts: 2,
      text: t`Rozwiąż równanie ${M(t`\dfrac{${num}}{${den}} = 0`)}.`,
      fields: [F('Mniejsze rozwiązanie:', lo), F('Większe rozwiązanie:', hi)],
      hints: [t`Zacznij od dziedziny: mianownik nie może być zerem, więc ${M(t`x \neq ${b}`)} i ${M(t`x \neq ${d}`)}.`, t`Ułamek jest zerem, gdy licznik jest zerem. Z miejsc zerowych licznika odrzuć te, które nie należą do dziedziny.`],
      steps: [t`Dziedzina: ${M(t`x \neq ${b}`)} oraz ${M(t`x \neq ${d}`)}.`, t`Licznik jest zerem dla ${M(t`x = ${a},\ x = ${b},\ x = ${c}`)}.`, t`Liczba ${M(b)} nie należy do dziedziny, więc rozwiązaniami są ${M(`x = ${lo}`)} oraz ${M(`x = ${hi}`)}.`],
      answer: M(t`x = ${lo}\ \text{lub}\ x = ${hi}`), check: () => [a, c].every(x => (x - b) * (x - d) !== 0 && (x - a) * (x - b) * (x - c) === 0) && lo < hi });
  }
]
};

const r = String.raw;
MATURA.dzial({
  id: 'rownania', store: 'rownania-matura-v1', title: 'Równania i nierówności', seq: 'Δ = b² − 4ac',
  lead: 'Równania i nierówności liniowe, układy równań, równania kwadratowe z deltą oraz równania wielomianowe i wymierne w postaci iloczynowej.',
  topics: { L: 'Liniowe i układy równań', K: 'Kwadratowe', W: 'Wielomianowe i wymierne' },
  short: { L: 'Liniowe i układy', W: 'Wielomianowe' },
  bank: { L: GL, K: GK, W: GW },
  formulas: {
    L: [['równanie liniowe', r`wyrazy z \(x\) na jedną stronę, liczby na drugą; przy przenoszeniu zmieniamy znak`], ['nierówność liniowa', r`mnożąc lub dzieląc obie strony przez liczbę <b>ujemną</b>, zmieniamy zwrot nierówności`], ['układ równań', r`metoda podstawiania albo przeciwnych współczynników`], ['ile rozwiązań ma układ', r`proste przecinające się: jedno<br>proste równoległe różne: brak (układ sprzeczny)<br>proste pokrywające się: nieskończenie wiele`]],
    K: [['wyróżnik', r`\(\Delta = b^2 - 4ac\)`], ['pierwiastki', r`\(x_1 = \dfrac{-b - \sqrt\Delta}{2a},\quad x_2 = \dfrac{-b + \sqrt\Delta}{2a}\)<br>gdy \(\Delta = 0\): \(x_0 = \dfrac{-b}{2a}\)`], ['liczba rozwiązań', r`\(\Delta > 0\): dwa, \(\Delta = 0\): jedno, \(\Delta < 0\): brak`], ['postać iloczynowa', r`\(a(x - x_1)(x - x_2)\)`], ['nierówność kwadratowa', r`1. miejsca zerowe, 2. szkic paraboli (ramiona w górę dla \(a > 0\)), 3. odczytaj, gdzie wykres jest nad lub pod osią \(Ox\)`]],
    W: [['iloczyn równy zero', r`\(A\cdot B\cdot C = 0\) wtedy, gdy \(A = 0\) lub \(B = 0\) lub \(C = 0\)`], ['różnica kwadratów', r`\(x^2 - k^2 = (x - k)(x + k)\)<br>\(x^2 + k^2 > 0\), brak miejsc zerowych`], ['grupowanie', r`\(x^3 + ax^2 + bx + ab = x^2(x + a) + b(x + a) = (x + a)(x^2 + b)\)`], ['równanie wymierne', r`\(\dfrac{V(x)}{W(x)} = 0\) wtedy, gdy \(V(x) = 0\) i \(W(x) \neq 0\)<br>zawsze zacznij od dziedziny`]]
  }
});
})();
