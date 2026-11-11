/* Dział V: Funkcje — własności i wykres, funkcja liniowa, kwadratowa, wykładnicza i inne */
(function () {
const nz = (a, b) => { let v; do { v = ri(a, b); } while (v === 0); return v; };
const cap = (s, svg) => `<p class="cap">${s}</p>` + svg;
const ray = (k, left, cl) => (left ? IV(-INF, k, false, cl) : IV(k, INF, cl, false));
const canon = (a, p, q) => (a === 1 ? '' : a === -1 ? '-' : T(a)) + (p === 0 ? 'x^2' : `(x${pm(-p)})^2`) + (q === 0 ? '' : pm(q));
const pt = (n, x, y) => `${n} = (${T(x)},\\ ${T(y)})`;

/* łamana o wierzchołkach w punktach kratowych: na przemian rośnie i maleje */
function polyGraph() {
  const n = pick([3, 4]); let x = -ri(4, 6); const xs = [x];
  for (let i = 0; i < n; i++) { x += ri(2, 3); xs.push(x); }
  need(xs[n] <= 7);
  let dir = pick([1, -1]), y = ri(-3, 4); const ys = [y];
  for (let i = 0; i < n; i++) { y += dir * ri(2, 5); need(y >= -4 && y <= 5); ys.push(y); dir = -dir; }
  const f = v => { for (let i = 0; i < n; i++) if (v >= xs[i] && v <= xs[i + 1]) return ys[i] + (ys[i + 1] - ys[i]) * (v - xs[i]) / (xs[i + 1] - xs[i]); return NaN; };
  let zeros = ys.filter(v => v === 0).length; for (let i = 0; i < n; i++) if (ys[i] * ys[i + 1] < 0) zeros++;
  const fig = cap(t`Wykres funkcji ${M('f')}`, plot({ x: [-7, 8], y: [-5, 6], lines: [xs.map((v, i) => [v, ys[i]])], pts: [[xs[0], ys[0]], [xs[n], ys[n]]] }));
  const intro = t`Na rysunku przedstawiono wykres funkcji ${M('f')} określonej dla ${M(t`x \in ${IV(xs[0], xs[n], true, true)}`)}. `;
  /* niezależne przeliczenie własności: gęste próbkowanie */
  const scan = () => { let mn = INF, mx = -INF, z = 0, prev = null; for (let k = 0; k <= (xs[n] - xs[0]) * 60; k++) { const v = f(xs[0] + k / 60); mn = Math.min(mn, v); mx = Math.max(mx, v); if (Math.abs(v) < 1e-9) { z++; prev = null; } else { if (prev !== null && prev * v < 0) z++; prev = v; } } return { mn, mx, z }; };
  return { n, xs, ys, f, zeros, fig, intro, scan, min: Math.min(...ys), max: Math.max(...ys) };
}
const monoOn = (f, l, r0, dir) => { for (let k = 0; k < 120; k++) { const a = f(l + (r0 - l) * k / 120), b = f(l + (r0 - l) * (k + 1) / 120); if (dir * (b - a) <= 1e-12) return false; } return true; };

const GO = {
1: [
  function valFormula() {
    if (Math.random() < 0.6) {
      const a = pick([-3, -2, -1, 1, 2, 3]), b = nz(-6, 6), c = ri(-8, 8), k = pick([-4, -3, -2, -1, 2, 3, 4]), val = a * k * k + b * k + c;
      return mk({ skill: 'wartość funkcji dla danego argumentu',
        text: t`Funkcja ${M('f')} jest określona wzorem ${M(`f(x) = ${poly([a, b, c])}`)} dla każdej liczby rzeczywistej ${M('x')}. Oblicz ${M(`f(${k})`)}.`,
        fields: [F(M(`f(${k}) =`), val)],
        hints: [t`W miejsce każdego ${M('x')} we wzorze wstaw ${M(k)}${k < 0 ? ' – koniecznie w nawiasie' : ''}.`, t`Najpierw potęga: ${M(`${P(k)}^2 = ${k * k}`)}. ${k < 0 ? 'Kwadrat liczby ujemnej jest dodatni.' : ''}`],
        steps: [M(t`f(${k}) = ${a === 1 ? '' : a === -1 ? '-' : `${a}\\cdot `}${P(k)}^2 ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : `${Math.abs(b)}\\cdot `}${P(k)}${c ? pm(c) : ''}`), M(t`= ${a * k * k}${pm(b * k)}${c ? pm(c) : ''} = ${val}`)],
        answer: M(`f(${k}) = ${val}`), check: () => { let s = 0; s += a * Math.pow(k, 2); s += b * k; s += c; return s === val; } });
    }
    const a = pick([1, 2, 3, -1, -2]), b = nz(-7, 7), c = nz(-5, 5), k = ri(-6, 6); need(k !== c && (a * k + b) !== 0);
    const val = (a * k + b) / (k - c);
    return mk({ skill: 'wartość funkcji dla danego argumentu',
      text: t`Funkcja ${M('f')} jest określona wzorem ${M(t`f(x) = \dfrac{${poly([a, b])}}{x${pm(-c)}}`)} dla każdej liczby rzeczywistej ${M(t`x \neq ${c}`)}. Oblicz ${M(`f(${k})`)}. Wynik podaj jako liczbę całkowitą albo ułamek nieskracalny.`,
      fields: [F(M(`f(${k}) =`), val)],
      hints: [t`Wstaw ${M(k)} w miejsce ${M('x')} osobno w liczniku i w mianowniku.`, t`Licznik: ${M(a * k + b)}, mianownik: ${M(k - c)}. Skróć ułamek i ustal znak.`],
      steps: [M(t`f(${k}) = \frac{${a === 1 ? '' : a === -1 ? '-' : `${a}\\cdot `}${P(k)}${pm(b)}}{${k}${pm(-c)}} = \frac{${a * k + b}}{${k - c}} = ${TF(val)}`)],
      answer: M(`f(${k}) = ${TF(val)}`), check: () => near(val * (k - c), a * k + b) });
  },
  function graphValue() {
    const g = polyGraph(), i = ri(1, g.n - 1), xa = g.xs[i], askMax = Math.random() < 0.5, sc = g.scan();
    return mk({ skill: 'odczytywanie wartości z wykresu', fig: g.fig,
      text: g.intro + t`Odczytaj z wykresu wartość ${M(`f(${xa})`)} oraz ${askMax ? 'największą' : 'najmniejszą'} wartość funkcji ${M('f')}.`,
      fields: [F(M(`f(${xa}) =`), g.ys[i]), F(askMax ? 'Największa wartość:' : 'Najmniejsza wartość:', askMax ? g.max : g.min)],
      hints: [t`${M(`f(${xa})`)}: znajdź ${M(xa)} na osi ${M('Ox')}, idź pionowo do wykresu i odczytaj wysokość punktu na osi ${M('Oy')}.`, t`${askMax ? 'Największa' : 'Najmniejsza'} wartość to współrzędna ${M('y')} ${askMax ? 'najwyżej' : 'najniżej'} położonego punktu wykresu (nie jego ${M('x')}!).`],
      steps: [t`Punkt wykresu o pierwszej współrzędnej ${M(xa)} to ${M(`(${xa},\\ ${g.ys[i]})`)}, więc ${M(`f(${xa}) = ${g.ys[i]}`)}.`, t`${askMax ? 'Najwyżej' : 'Najniżej'} położony punkt wykresu to ${M(`(${g.xs[g.ys.indexOf(askMax ? g.max : g.min)]},\\ ${askMax ? g.max : g.min})`)}, więc ${askMax ? 'największa' : 'najmniejsza'} wartość to ${M(askMax ? g.max : g.min)}.`],
      answer: M(t`f(${xa}) = ${g.ys[i]},\quad ${askMax ? 'y_{max}' : 'y_{min}'} = ${askMax ? g.max : g.min}`), check: () => near(g.f(xa), g.ys[i]) && near(askMax ? sc.mx : sc.mn, askMax ? g.max : g.min) });
  }
],
2: [
  function graphRange() {
    const g = polyGraph(), sc = g.scan(), a = g.xs[0], b = g.xs[g.n], y0 = Math.min(g.ys[0], g.ys[g.n]), y1 = Math.max(g.ys[0], g.ys[g.n]);
    const cand = [[a, b, 1], [g.min, g.max, 0], [y0, y1, 1], [a, g.max, 1], [g.min, b, 1], [g.min + 1, g.max, 1], [g.min, g.max + 1, 1], [g.min - 1, g.max, 1]].filter(c => c[0] < c[1]);
    const o = opts(IV(g.min, g.max, true, true), cand.map(c => IV(c[0], c[1], !!c[2], !!c[2])));
    return mk(Object.assign({ skill: 'zbiór wartości funkcji z wykresu', fig: g.fig,
      text: DOK + g.intro + t`Zbiorem wartości funkcji ${M('f')} jest`,
      hints: [t`Zbiór wartości odczytujemy na osi ${M('Oy')} – to wszystkie „wysokości”, na których leży jakiś punkt wykresu. Na osi ${M('Ox')} odczytujemy dziedzinę.`, t`Znajdź najniżej i najwyżej położony punkt wykresu. Końce wykresu zaznaczono pełnymi kropkami.`],
      steps: [t`Najniższy punkt wykresu ma ${M(`y = ${g.min}`)}, najwyższy ${M(`y = ${g.max}`)}.`, t`Wykres jest linią ciągłą, więc funkcja przyjmuje wszystkie wartości pomiędzy.`, M(t`ZW_f = ${IV(g.min, g.max, true, true)}`)],
      answer: M(IV(g.min, g.max, true, true)), check: () => near(sc.mn, g.min) && near(sc.mx, g.max) }, o));
  },
  function graphMono() {
    const g = polyGraph(), dir = pick([1, -1]), segs = [];
    for (let i = 0; i < g.n; i++) segs.push([g.xs[i], g.xs[i + 1], Math.sign(g.ys[i + 1] - g.ys[i])]);
    const good = pick(segs.filter(s => s[2] === dir)), cand = segs.filter(s => s[2] !== dir).map(s => [s[0], s[1]]);
    for (let i = 0; i + 2 <= g.n; i++) cand.push([g.xs[i], g.xs[i + 2]]);
    for (let i = 0; i < g.n; i++) { const lo = Math.min(g.ys[i], g.ys[i + 1]), hi = Math.max(g.ys[i], g.ys[i + 1]); cand.push([lo, hi]); }
    cand.push([g.xs[0], g.xs[g.n]]);
    const wrong = cand.filter(c => c[0] < c[1] && c[0] >= g.xs[0] && c[1] <= g.xs[g.n] && !monoOn(g.f, c[0], c[1], dir)).map(c => IV(c[0], c[1], true, true));
    const o = opts(IV(good[0], good[1], true, true), wrong);
    return mk(Object.assign({ skill: 'monotoniczność funkcji z wykresu', fig: g.fig,
      text: DOK + g.intro + t`Funkcja ${M('f')} jest ${dir > 0 ? 'rosnąca' : 'malejąca'} w przedziale`,
      hints: [t`Czytaj wykres od lewej do prawej: funkcja jest ${dir > 0 ? 'rosnąca tam, gdzie wykres się wznosi' : 'malejąca tam, gdzie wykres opada'}.`, t`Przedziały monotoniczności zapisujemy za pomocą argumentów, czyli liczb z osi ${M('Ox')} – a nie wartości z osi ${M('Oy')}.`],
      steps: [t`Wykres ${dir > 0 ? 'wznosi się' : 'opada'} od punktu ${M(`(${good[0]},\\ ${g.f(good[0])})`)} do punktu ${M(`(${good[1]},\\ ${g.f(good[1])})`)}.`, t`Odczytujemy argumenty: od ${M(good[0])} do ${M(good[1])}.`, t`Funkcja jest ${dir > 0 ? 'rosnąca' : 'malejąca'} w przedziale ${M(IV(good[0], good[1], true, true))}.`],
      answer: M(IV(good[0], good[1], true, true)), check: () => monoOn(g.f, good[0], good[1], dir) }, o));
  }
],
3: [
  function piecewise() {
    const k = ri(-2, 3), a = ri(-5, 5), b = pick([-3, -2, 2, 3, 4]), c = ri(-6, 6), p = k - ri(1, 4), q = k + ri(0, 4), fp = p * p + a, fq = b * q + c, val = fp + fq;
    const f = x => (x < k ? x * x + a : b * x + c);
    return mk({ skill: 'funkcja określona kilkoma wzorami', pts: 2,
      text: t`Funkcja ${M('f')} jest określona wzorem ${M(t`f(x) = \begin{cases} ${poly([1, 0, a])} & \text{dla } x < ${k} \\ ${poly([b, c])} & \text{dla } x \geq ${k} \end{cases}`)} Oblicz ${M(`f(${p}) + f(${q})`)}.`,
      fields: [F(M(`f(${p}) + f(${q}) =`), val)],
      hints: [t`Dla każdego argumentu najpierw sprawdź, który warunek spełnia: ${M(`${p} < ${k}`)}, a ${M(t`${q} \geq ${k}`)}.`, t`${M(`f(${p})`)} licz z pierwszego wzoru, ${M(`f(${q})`)} z drugiego.`],
      steps: [t`${M(`${p} < ${k}`)}, więc ${M(`f(${p}) = ${P(p)}^2${a ? pm(a) : ''} = ${fp}`)}.`, t`${M(t`${q} \geq ${k}`)}, więc ${M(t`f(${q}) = ${b}\cdot ${P(q)}${c ? pm(c) : ''} = ${fq}`)}.`, M(`f(${p}) + f(${q}) = ${fp}${pm(fq)} = ${val}`)],
      answer: M(`${val}`), check: () => f(p) + f(q) === val && p < k && q >= k });
  },
  function graphPF() {
    const g = polyGraph(), sc = g.scan(), i = ri(0, g.n - 1), dirI = Math.sign(g.ys[i + 1] - g.ys[i]), tr = () => Math.random() < 0.5;
    const nzv = g.xs.map((x, j) => j).filter(j => g.ys[j] !== 0), j0 = pick(nzv);
    const makers = [
      () => { const v = tr(), k = v ? g.zeros : g.zeros + pick(g.zeros > 0 ? [-1, 1] : [1]); return { s: t`Liczba miejsc zerowych funkcji ${M('f')} jest równa ${M(k)}.`, v, why: t`Wykres ma z osią ${M('Ox')} dokładnie ${M(g.zeros)} ${g.zeros === 1 ? 'punkt wspólny' : g.zeros < 5 && g.zeros > 1 ? 'punkty wspólne' : 'punktów wspólnych'}.`, chk: () => (sc.z === k) === v }; },
      () => { const v = tr(), alt = g.xs[g.ys.indexOf(g.max)], k = v || alt === g.max ? g.max : alt, vv = k === g.max; return { s: t`Największa wartość funkcji ${M('f')} jest równa ${M(k)}.`, v: vv, why: t`Najwyższy punkt wykresu to ${M(`(${g.xs[g.ys.indexOf(g.max)]},\\ ${g.max})`)}; największa wartość to jego druga współrzędna, czyli ${M(g.max)}.`, chk: () => near(sc.mx, k) === vv }; },
      () => { const pos = tr(), v = (g.ys[j0] > 0) === pos; return { s: t`${M(`f(${g.xs[j0]}) ${pos ? '>' : '<'} 0`)}`, v, why: t`${M(`f(${g.xs[j0]}) = ${g.ys[j0]}`)}, a to liczba ${g.ys[j0] > 0 ? 'dodatnia' : 'ujemna'}.`, chk: () => (pos ? g.f(g.xs[j0]) > 0 : g.f(g.xs[j0]) < 0) === v }; },
      () => { const up = tr(), v = (dirI > 0) === up; return { s: t`Funkcja ${M('f')} jest ${up ? 'rosnąca' : 'malejąca'} w przedziale ${M(IV(g.xs[i], g.xs[i + 1], true, true))}.`, v, why: t`W przedziale ${M(IV(g.xs[i], g.xs[i + 1], true, true))} wykres ${dirI > 0 ? 'się wznosi – funkcja jest rosnąca' : 'opada – funkcja jest malejąca'}.`, chk: () => monoOn(g.f, g.xs[i], g.xs[i + 1], up ? 1 : -1) === v }; }
    ];
    const st = shuffle(makers).slice(0, 2).map(m => m());
    return mk({ skill: 'własności funkcji z wykresu', fig: g.fig,
      text: PF + g.intro,
      tf: st.map(x => ({ s: x.s, v: x.v })),
      hints: [t`Miejsca zerowe to punkty wspólne wykresu z osią ${M('Ox')}; wartości funkcji czytamy na osi ${M('Oy')}.`, t`Każde zdanie sprawdź osobno, wskazując na wykresie konkretny punkt albo fragment linii.`],
      steps: st.map((x, n0) => t`Zdanie ${n0 + 1}: ${x.why} Zdanie jest ${x.v ? 'prawdziwe (P)' : 'fałszywe (F)'}.`),
      answer: st.map(x => (x.v ? 'P' : 'F')).join(', '), check: () => st.every(x => x.chk()) });
  }
]
};

const GL = {
1: [
  function linZero() {
    const a = pick([-5, -4, -3, -2, 2, 3, 4, 5]), b = nz(-12, 12), z = -b / a;
    return mk({ skill: 'miejsce zerowe funkcji liniowej',
      text: t`Wyznacz miejsce zerowe funkcji liniowej ${M(`f(x) = ${poly([a, b])}`)}.`,
      fields: [F(M('x_0 ='), z)],
      hints: [t`Miejsce zerowe to argument, dla którego wartość funkcji jest równa zero. Rozwiąż równanie ${M(`${poly([a, b])} = 0`)}.`, t`${M(`${poly([a, 0])} = ${-b}`)}. Podziel przez ${M(a)} – wynik może być ułamkiem.`],
      steps: [M(`${poly([a, b])} = 0`), M(`${poly([a, 0])} = ${-b}`), M(`x = ${TF(z)}`)],
      answer: M(`x_0 = ${TF(z)}`), check: () => near(a * z + b, 0) });
  },
  function linPF() {
    const a = pick([-4, -3, -2, -1, 2, 3, 4]), b = nz(-8, 8), tr = () => Math.random() < 0.5, z = -b / a; const f = x => a * x + b;
    const makers = [
      () => { const up = tr(), v = (a > 0) === up; return { s: t`Funkcja ${M('f')} jest ${up ? 'rosnąca' : 'malejąca'}.`, v, why: t`Współczynnik kierunkowy ${M(`a = ${a}`)} jest ${a > 0 ? 'dodatni, więc funkcja jest rosnąca' : 'ujemny, więc funkcja jest malejąca'}.`, chk: () => ((up ? f(3) > f(1) : f(3) < f(1)) === v) }; },
      () => { const k = tr() ? b : pick([-b, a]), v = k === b; return { s: t`Wykres funkcji ${M('f')} przecina oś ${M('Oy')} w punkcie ${M(`(0,\\ ${k})`)}.`, v, why: t`${M(`f(0) = ${b}`)}, więc wykres przecina oś ${M('Oy')} w punkcie ${M(`(0,\\ ${b})`)}.`, chk: () => (f(0) === k) === v }; },
      () => { const x0 = pick([-2, -1, 1, 2, 3]), v = tr(), y = a * x0 + b + (v ? 0 : pick([-1, 1, 2])); return { s: t`Punkt ${M(`(${x0},\\ ${y})`)} należy do wykresu funkcji ${M('f')}.`, v, why: t`${M(t`f(${x0}) = ${a}\cdot ${P(x0)}${pm(b)} = ${a * x0 + b}`)}${v ? '' : t`, a nie ${M(y)}`}.`, chk: () => (f(x0) === y) === v }; },
      () => { const k = tr() ? z : pick([-z, b / a + 1]), v = near(k, z); return { s: t`Miejscem zerowym funkcji ${M('f')} jest liczba ${M(TF(k))}.`, v, why: t`${M(t`${poly([a, b])} = 0 \iff x = ${TF(z)}`)}.`, chk: () => near(f(k), 0) === v }; }
    ];
    const st = shuffle(makers).slice(0, 2).map(m => m());
    return mk({ skill: 'własności funkcji liniowej',
      text: PF + t`Funkcja liniowa ${M('f')} jest określona wzorem ${M(`f(x) = ${poly([a, b])}`)}.`,
      tf: st.map(x => ({ s: x.s, v: x.v })),
      hints: [t`We wzorze ${M('f(x) = ax + b')} liczba ${M('a')} decyduje o monotoniczności, a ${M('b')} to wartość dla ${M('x = 0')}.`, t`To, czy punkt należy do wykresu, sprawdzisz, wstawiając jego pierwszą współrzędną do wzoru.`],
      steps: st.map((x, n0) => t`Zdanie ${n0 + 1}: ${x.why} Zdanie jest ${x.v ? 'prawdziwe (P)' : 'fałszywe (F)'}.`),
      answer: st.map(x => (x.v ? 'P' : 'F')).join(', '),
      check: () => st.every(x => x.chk()) });
  },
  function pointOn() {
    const a = nz(-5, 5), b = nz(-7, 7), x0 = pick([-4, -3, -2, 2, 3, 4]), y0 = a * x0 + b;
    return mk({ skill: 'punkt na wykresie funkcji liniowej',
      text: t`Wykres funkcji liniowej ${M(`f(x) = ax${pm(b)}`)} przechodzi przez punkt ${M(pt('P', x0, y0))}. Wyznacz współczynnik ${M('a')}.`,
      fields: [F(M('a ='), a)],
      hints: [t`Skoro punkt ${M('P')} leży na wykresie, to ${M(`f(${x0}) = ${y0}`)}.`, t`Wstaw ${M(`x = ${x0}`)} i ${M(`y = ${y0}`)} do wzoru: ${M(t`${y0} = a\cdot ${P(x0)}${pm(b)}`)}.`],
      steps: [M(t`${y0} = a\cdot ${P(x0)}${pm(b)}`), M(t`${poly([x0, 0], 'a')} = ${y0 - b}`), M(`a = ${a}`)],
      answer: M(`a = ${a}`), check: () => a * x0 + b === y0 });
  }
],
2: [
  function twoPoints() {
    const a = nz(-4, 4), b = ri(-6, 6), x1 = ri(-4, 2), x2 = x1 + ri(1, 5), y1 = a * x1 + b, y2 = a * x2 + b;
    return mk({ skill: 'wzór funkcji liniowej z dwóch punktów', pts: 2,
      text: t`Wykres funkcji liniowej ${M('f(x) = ax + b')} przechodzi przez punkty ${M(pt('A', x1, y1))} i ${M(pt('B', x2, y2))}. Wyznacz współczynniki ${M('a')} i ${M('b')}.`,
      fields: [F(M('a ='), a), F(M('b ='), b)],
      hints: [t`Współczynnik kierunkowy: ${M(t`a = \dfrac{y_B - y_A}{x_B - x_A}`)} – przyrost wartości podzielony przez przyrost argumentów.`, t`Gdy znasz już ${M('a')}, wstaw współrzędne jednego z punktów do wzoru ${M('y = ax + b')} i wylicz ${M('b')}.`],
      steps: [M(t`a = \frac{${y2} - ${P(y1)}}{${x2} - ${P(x1)}} = \frac{${y2 - y1}}{${x2 - x1}} = ${a}`), t`Wstawiamy punkt ${M('A')}: ${M(t`${y1} = ${a}\cdot ${P(x1)} + b`)}, czyli ${M(t`${y1} = ${a * x1} + b`)}.`, M(`b = ${b}`)],
      answer: M(t`a = ${a},\quad b = ${b}`), check: () => a * x1 + b === y1 && a * x2 + b === y2 && x1 !== x2 });
  },
  function paramMono() {
    const p = pick([-3, -2, -1, 1, 2, 3]), k = ri(-5, 5), q = -p * k, d = nz(-7, 7), inc = Math.random() < 0.5; need(q !== 0);
    const left = (p > 0) !== inc, coef = `${poly([p, q], 'm')}`;
    const o = opts(ray(k, left, false), [ray(k, !left, false), ray(-k, left, false), ray(-k, !left, false), ray(q, left, false), ray(q, !left, false), ray(-q, left, false)]);
    return mk(Object.assign({ skill: 'monotoniczność funkcji liniowej z parametrem',
      text: DOK + t`Funkcja liniowa ${M(`f(x) = (${coef})x${pm(d)}`)} jest ${inc ? 'rosnąca' : 'malejąca'} dla`,
      hints: [t`Funkcja liniowa jest ${inc ? 'rosnąca, gdy współczynnik kierunkowy jest dodatni' : 'malejąca, gdy współczynnik kierunkowy jest ujemny'}.`, t`Rozwiąż nierówność ${M(`${coef} ${inc ? '>' : '<'} 0`)}.${p < 0 ? ' Przy dzieleniu przez liczbę ujemną zmień zwrot.' : ''}`],
      steps: [M(`${coef} ${inc ? '>' : '<'} 0`), M(`${poly([p, 0], 'm')} ${inc ? '>' : '<'} ${-q}`), p < 0 ? t`Dzielimy przez ${M(p)} i zmieniamy zwrot: ${M(`m ${left ? '<' : '>'} ${k}`)}.` : M(`m ${left ? '<' : '>'} ${k}`), M(t`m \in ${ray(k, left, false)}`)],
      answer: M(t`m \in ${ray(k, left, false)}`),
      check: () => { for (let m = -20; m <= 20; m += 0.25) { const c = p * m + q; if ((inc ? c > 0 : c < 0) !== (left ? m < k : m > k)) return false; } return true; } }, o));
  }
],
3: [
  function threeVal() {
    const a = nz(-4, 4), b = ri(-7, 7), x1 = ri(-5, 1), x2 = x1 + ri(2, 4), x3 = x2 + ri(2, 6), y1 = a * x1 + b, y2 = a * x2 + b, y3 = a * x3 + b;
    return mk({ skill: 'funkcja liniowa – wartość w trzecim punkcie', pts: 2,
      text: t`Funkcja liniowa ${M('f')} spełnia warunki ${M(`f(${x1}) = ${y1}`)} oraz ${M(`f(${x2}) = ${y2}`)}. Oblicz ${M(`f(${x3})`)}.`,
      fields: [F(M(`f(${x3}) =`), y3)],
      hints: [t`Najpierw wyznacz wzór ${M('f(x) = ax + b')}. Współczynnik kierunkowy to ${M(t`a = \dfrac{f(${x2}) - f(${x1})}{${x2} - ${P(x1)}}`)}.`, t`${M(`a = ${a}`)}. Wstaw jeden z warunków, żeby znaleźć ${M('b')}, a potem policz ${M(`f(${x3})`)}.`],
      steps: [M(t`a = \frac{${y2} - ${P(y1)}}{${x2} - ${P(x1)}} = \frac{${y2 - y1}}{${x2 - x1}} = ${a}`), t`${M(t`${y1} = ${a}\cdot ${P(x1)} + b`)}, stąd ${M(`b = ${b}`)}, czyli ${M(`f(x) = ${poly([a, b])}`)}.`, M(t`f(${x3}) = ${a}\cdot ${x3}${b ? pm(b) : ''} = ${y3}`)],
      answer: M(`f(${x3}) = ${y3}`), check: () => near((y2 - y1) / (x2 - x1) * (x3 - x1) + y1, y3) });
  },
  function taxi() {
    const k = pick([2.5, 3, 3.5, 4]), p = pick([6, 7, 8, 9, 10]), d1 = ri(3, 7), d2 = d1 + ri(3, 8), d3 = d2 + ri(2, 10), c1 = p + k * d1, c2 = p + k * d2, c3 = p + k * d3;
    return mk({ skill: 'model liniowy w zadaniu tekstowym', pts: 3,
      text: t`Koszt przejazdu taksówką jest sumą stałej opłaty początkowej i opłaty proporcjonalnej do liczby przejechanych kilometrów. Za przejazd ${M(d1)} km zapłacono ${M(zl(c1))} zł, a za przejazd ${M(d2)} km – ${M(zl(c2))} zł. Oblicz koszt przejazdu ${M(d3)} km.`,
      fields: [F(`Koszt przejazdu ${d3} km:`, c3, { unit: 'zł' })],
      hints: [t`Koszt to funkcja liniowa liczby kilometrów: ${M('k(x) = ax + b')}, gdzie ${M('a')} – cena za kilometr, ${M('b')} – opłata początkowa.`, t`Dodatkowe ${M(`${d2} - ${d1} = ${d2 - d1}`)} km kosztowało ${M(t`${zl(c2)} - ${zl(c1)} = ${zl(c2 - c1)}`)} zł. Ile kosztuje jeden kilometr?`],
      steps: [t`Cena za kilometr: ${M(t`a = \frac{${zl(c2)} - ${zl(c1)}}{${d2} - ${d1}} = \frac{${zl(c2 - c1)}}{${d2 - d1}} = ${zl(k)}`)} zł.`, t`Opłata początkowa: ${M(t`b = ${zl(c1)} - ${d1}\cdot ${zl(k)} = ${p}`)} zł.`, M(t`k(${d3}) = ${zl(k)}\cdot ${d3} + ${p} = ${zl(c3)}\ \text{zł}`)],
      answer: M(t`${zl(c3)}\ \text{zł}`), check: () => near(c1 + (c2 - c1) / (d2 - d1) * (d3 - d1), c3) });
  },
  function linArea() {
    const z = nz(-6, 6), b = nz(-8, 8), a = -b / z, area = Math.abs(z * b) / 2; need(isInt(a * 2) && Math.abs(a) <= 4);
    return mk({ skill: 'wykres funkcji liniowej i osie układu', pts: 2,
      text: t`Wykres funkcji liniowej ${M(`f(x) = ${poly([a, b])}`)} wraz z osiami układu współrzędnych ogranicza trójkąt. Oblicz pole tego trójkąta.`,
      fields: [F('Pole trójkąta:', area)],
      hints: [t`Wierzchołki trójkąta to początek układu oraz punkty przecięcia wykresu z osiami. Z osią ${M('Oy')}: ${M(`(0,\\ ${b})`)}.`, t`Punkt przecięcia z osią ${M('Ox')} to miejsce zerowe: ${M(`x_0 = ${z}`)}. Trójkąt jest prostokątny, a przyprostokątne mają długości ${M(Math.abs(z))} i ${M(Math.abs(b))}.`],
      steps: [t`Przecięcie z osią ${M('Oy')}: ${M(`f(0) = ${b}`)}, punkt ${M(`(0,\\ ${b})`)}.`, t`Przecięcie z osią ${M('Ox')}: ${M(t`${poly([a, b])} = 0 \iff x = ${z}`)}, punkt ${M(`(${z},\\ 0)`)}.`, M(t`P = \tfrac12\cdot ${Math.abs(z)}\cdot ${Math.abs(b)} = ${T(area)}`)],
      answer: M(`P = ${T(area)}`), check: () => near(a * z + b, 0) && near(area, 0.5 * Math.abs(-b / a) * Math.abs(b)) });
  }
]
};

const qf = (a, b, c) => x => a * x * x + b * x + c;
const GK = {
1: [
  function vertexCanon() {
    const a = pick([-3, -2, -1, 1, 2, 3]), p = nz(-7, 7), q = nz(-9, 9);
    return mk({ skill: 'wierzchołek z postaci kanonicznej',
      text: t`Funkcja kwadratowa ${M('f')} jest określona wzorem ${M(`f(x) = ${canon(a, p, q)}`)}. Wyznacz współrzędne wierzchołka ${M('W = (p,\\ q)')} paraboli będącej wykresem tej funkcji.`,
      fields: [F(M('p ='), p), F(M('q ='), q)],
      hints: [t`Postać kanoniczna to ${M('f(x) = a(x - p)^2 + q')}. Wierzchołek ma współrzędne ${M('(p,\\ q)')}.`, t`Uwaga na znak: w nawiasie jest ${M('x - p')}, więc ${M(`(x${pm(-p)})`)} oznacza ${M(`p = ${p}`)}.`],
      steps: [M(t`${canon(a, p, q)} = ${a === 1 ? '' : a === -1 ? '-' : a}\left(x - ${P(p)}\right)^2 + ${P(q)}`), M(t`p = ${p},\qquad q = ${q}`)],
      answer: M(`W = (${p},\\ ${q})`), check: () => { const f = x => a * (x - p) ** 2 + q; return near(f(p), q) && (a > 0 ? f(p - 1) > q && f(p + 1) > q : f(p - 1) < q && f(p + 1) < q) && near(f(p - 2), f(p + 2)); } });
  },
  function axisFromZeros() {
    const a = pick([-2, -1, 1, 2, 3]), x1 = ri(-8, 5), x2 = x1 + ri(1, 9), ax = (x1 + x2) / 2;
    return mk({ skill: 'oś symetrii paraboli',
      text: t`Funkcja kwadratowa jest określona wzorem ${M(`f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}${xm(x1)}${xm(x2)}`)}. Osią symetrii wykresu tej funkcji jest prosta o równaniu ${M('x = p')}. Wyznacz ${M('p')}.`,
      fields: [F(M('p ='), ax)],
      hints: [t`Z postaci iloczynowej odczytaj miejsca zerowe: ${M(`x_1 = ${x1}`)}, ${M(`x_2 = ${x2}`)}.`, t`Oś symetrii paraboli przechodzi dokładnie w połowie między miejscami zerowymi: ${M(t`p = \dfrac{x_1 + x_2}{2}`)}.`],
      steps: [M(t`x_1 = ${x1},\qquad x_2 = ${x2}`), M(t`p = \frac{${x1} + ${P(x2)}}{2} = ${T(ax)}`)],
      answer: M(`x = ${T(ax)}`), check: () => { const f = x => a * (x - x1) * (x - x2); return near(f(ax - 1.5), f(ax + 1.5)) && near(f(x1), 0); } });
  },
  function graphParabola() {
    const a = pick([1, -1]), k = pick([1, 2]), q = -a * k * k, p = pick([-3, -2, -1, 1, 2, 3]);
    const f = x => a * (x - p) ** 2 + q, opt = (sp, sq) => canon(a, sp * p, sq * q);
    const o = opts(opt(1, 1), [opt(-1, 1), opt(1, -1), opt(-1, -1)]);
    return mk(Object.assign({ skill: 'wzór funkcji kwadratowej z wykresu',
      fig: cap(t`Wykres funkcji ${M('f')}`, plot({ x: [-7, 7], y: [-6, 6], fns: [{ f }], pts: [[p, q], [p - k, 0], [p + k, 0]] })),
      text: DOK + t`Na rysunku przedstawiono fragment wykresu funkcji kwadratowej ${M('f')}. Wierzchołek paraboli oraz jej punkty przecięcia z osią ${M('Ox')} mają współrzędne całkowite. Funkcja ${M('f')} jest określona wzorem`,
      hints: [t`Odczytaj współrzędne wierzchołka ${M('W = (p,\\ q)')} i wstaw do postaci kanonicznej ${M('f(x) = a(x - p)^2 + q')}.`, t`Wierzchołek to ${M(`(${p},\\ ${q})`)}. Pamiętaj, że w nawiasie jest ${M('x - p')}: dla ${M(`p = ${p}`)} to ${M(`x${pm(-p)}`)}.`],
      steps: [t`Wierzchołek paraboli: ${M(`W = (${p},\\ ${q})`)}, więc ${M(`p = ${p}`)}, ${M(`q = ${q}`)}.`, t`Ramiona są skierowane ${a > 0 ? 'w górę' : 'w dół'}, co zgadza się ze współczynnikiem ${M(`a = ${a}`)} we wszystkich odpowiedziach.`, M(`f(x) = ${canon(a, p, q)}`), t`Sprawdzenie: ${M(t`f(${p + k}) = ${a === 1 ? '' : '-'}${k}^2${pm(q)} = 0`)} – zgadza się z miejscem zerowym na rysunku.`],
      answer: M(`f(x) = ${canon(a, p, q)}`), check: () => near(f(p), q) && near(f(p + k), 0) && near(f(p - k), 0) }, o));
  }
],
2: [
  function vertexGeneral() {
    const a = pick([-3, -2, -1, 1, 2, 3]), p = nz(-5, 5), q = ri(-9, 9), b = -2 * a * p, c = a * p * p + q; need(c !== 0);
    return mk({ skill: 'wierzchołek paraboli z postaci ogólnej', pts: 2,
      text: t`Wyznacz współrzędne wierzchołka ${M('W = (p,\\ q)')} paraboli będącej wykresem funkcji ${M(`f(x) = ${poly([a, b, c])}`)}.`,
      fields: [F(M('p ='), p), F(M('q ='), q)],
      hints: [t`Pierwsza współrzędna wierzchołka: ${M(t`p = \dfrac{-b}{2a}`)}.`, t`Drugą współrzędną najprościej policzyć jako wartość funkcji w wierzchołku: ${M('q = f(p)')}.`],
      steps: [M(t`p = \frac{-b}{2a} = \frac{${-b}}{${2 * a}} = ${p}`), M(t`q = f(${p}) = ${a === 1 ? '' : a === -1 ? '-' : `${a}\\cdot `}${P(p)}^2 ${b < 0 ? '-' : '+'} ${Math.abs(b)}\cdot ${P(p)}${pm(c)} = ${a * p * p}${pm(b * p)}${pm(c)} = ${q}`)],
      answer: M(`W = (${p},\\ ${q})`), check: () => { const f = qf(a, b, c); return near(f(p), q) && near(f(p - 1), f(p + 1)) && (a > 0 ? f(p + 0.5) > q : f(p + 0.5) < q); } });
  },
  function rangeQ() {
    const a = pick([-3, -2, -1, 1, 2, 3]), p = nz(-6, 6), q = nz(-8, 8), up = a > 0; need(p !== q && p !== -q);
    const R1 = (v, u, cl) => (u ? IV(v, INF, cl, false) : IV(-INF, v, false, cl));
    const o = opts(R1(q, up, true), [R1(q, !up, true), R1(p, up, true), R1(p, !up, true), R1(-q, up, true), R1(q, up, false)]);
    const f = x => a * (x - p) ** 2 + q;
    return mk(Object.assign({ skill: 'zbiór wartości funkcji kwadratowej',
      text: DOK + t`Zbiorem wartości funkcji kwadratowej ${M(`f(x) = ${canon(a, p, q)}`)} jest`,
      hints: [t`Wierzchołek paraboli to ${M(`(${p},\\ ${q})`)}. O zbiorze wartości decyduje druga współrzędna wierzchołka.`, t`Ramiona paraboli są skierowane ${up ? 'w górę' : 'w dół'} (${M(up ? 'a > 0' : 'a < 0')}), więc w wierzchołku funkcja przyjmuje wartość ${up ? 'najmniejszą' : 'największą'}.`],
      steps: [t`Wierzchołek: ${M(`W = (${p},\\ ${q})`)}.`, t`${M(`a = ${a} ${up ? '> 0' : '< 0'}`)}, więc ramiona są skierowane ${up ? 'w górę' : 'w dół'} i ${M(q)} jest ${up ? 'najmniejszą' : 'największą'} wartością funkcji.`, M(t`ZW_f = ${R1(q, up, true)}`)],
      answer: M(R1(q, up, true)), check: () => { for (let x = -30; x <= 30; x += 0.5) if (up ? f(x) < q : f(x) > q) return false; return near(f(p), q); } }, o));
  },
  function zerosToCoef() {
    const x1 = ri(-7, 5), x2 = x1 + ri(1, 8), b = -(x1 + x2), c = x1 * x2; need(c !== 0);
    const term = v => (v < 0 ? ' - ' : ' + ') + poly([Math.abs(v), 0]);
    return mk({ skill: 'od miejsc zerowych do wzoru', pts: 2,
      text: t`Funkcja kwadratowa ${M('f(x) = x^2 + bx + c')} ma dwa miejsca zerowe: ${M(x1)} oraz ${M(x2)}. Wyznacz współczynniki ${M('b')} i ${M('c')}.`,
      fields: [F(M('b ='), b), F(M('c ='), c)],
      hints: [t`Zapisz wzór w postaci iloczynowej ${M('f(x) = a(x - x_1)(x - x_2)')}. Tutaj ${M('a = 1')}.`, t`Wymnóż nawiasy ${M(`${xm(x1)}${xm(x2)}`)} i porównaj z ${M('x^2 + bx + c')}.`],
      steps: [M(`f(x) = ${xm(x1)}${xm(x2)}`), M(t`= x^2${term(-x2)}${term(-x1)}${pm(x1 * x2)} = ${poly([1, b, c])}`), M(t`b = ${b},\qquad c = ${c}`)],
      answer: M(t`b = ${b},\quad c = ${c}`), check: () => near(qf(1, b, c)(x1), 0) && near(qf(1, b, c)(x2), 0) && x1 * x2 !== 0 });
  }
],
3: [
  function minMaxInterval() {
    const a = pick([-2, -1, 1, 2]), p = ri(-3, 4), q = ri(-6, 6), b = -2 * a * p, c = a * p * p + q, u = p + pick([-4, -3, -2, -1, 1]), v = u + ri(2, 5), f = qf(a, b, c); need(b !== 0);
    const inside = u < p && p < v, vals = [f(u), f(v)].concat(inside ? [q] : []), mn = Math.min(...vals), mx = Math.max(...vals);
    return mk({ skill: 'najmniejsza i największa wartość w przedziale', pts: 3,
      text: t`Wyznacz najmniejszą i największą wartość funkcji kwadratowej ${M(`f(x) = ${poly([a, b, c])}`)} w przedziale ${M(IV(u, v, true, true))}.`,
      fields: [F('Najmniejsza wartość:', mn), F('Największa wartość:', mx)],
      hints: [t`Policz pierwszą współrzędną wierzchołka ${M(t`p = \dfrac{-b}{2a}`)} i sprawdź, czy należy do przedziału ${M(IV(u, v, true, true))}.`, t`Policz wartości na końcach przedziału: ${M(`f(${u})`)} i ${M(`f(${v})`)}${inside ? t`, a także ${M(`f(${p})`)}, bo wierzchołek leży w przedziale` : ' (wierzchołek jest poza przedziałem, więc go pomijamy)'}. Wybierz najmniejszą i największą z nich.`],
      steps: [t`${M(t`p = \frac{-b}{2a} = \frac{${-b}}{${2 * a}} = ${p}`)} – ${inside ? 'należy' : 'nie należy'} do przedziału ${M(IV(u, v, true, true))}.`, M(t`f(${u}) = ${f(u)},\qquad f(${v}) = ${f(v)}${inside ? t`,\qquad f(${p}) = ${q}` : ''}`), t`Najmniejsza z tych wartości to ${M(mn)}, największa to ${M(mx)}.`],
      answer: M(t`y_{min} = ${mn},\quad y_{max} = ${mx}`), check: () => { let lo = INF, hi = -INF; for (let k = 0; k <= 4000; k++) { const y = f(u + (v - u) * k / 4000); lo = Math.min(lo, y); hi = Math.max(hi, y); } return Math.abs(lo - mn) < 1e-4 && Math.abs(hi - mx) < 1e-4; } });
  },
  function findA() {
    const a = pick([-3, -2, -1, 2, 3, 0.5, -0.5]), p = ri(-5, 5), q = ri(-7, 7), dx = pick([-2, 2, -1, 1, 3]), x0 = p + dx, y0 = a * dx * dx + q; need(p !== 0 && isInt(y0) && !(a === 0.5 && Math.abs(dx) !== 2) && !(a === -0.5 && Math.abs(dx) !== 2));
    return mk({ skill: 'wyznaczanie współczynnika a', pts: 2,
      text: t`Wierzchołkiem paraboli będącej wykresem funkcji kwadratowej ${M('f')} jest punkt ${M(pt('W', p, q))}. Do wykresu należy też punkt ${M(pt('A', x0, y0))}. Funkcję zapisano w postaci ${M('f(x) = a(x - p)^2 + q')}. Wyznacz współczynnik ${M('a')}.`,
      fields: [F(M('a ='), a)],
      hints: [t`Wstaw współrzędne wierzchołka do postaci kanonicznej: ${M(`f(x) = ${canon(1, p, q).replace(/^/, 'a')}`)}.`, t`Punkt ${M('A')} leży na wykresie, więc ${M(`f(${x0}) = ${y0}`)}. Z tego równania wylicz ${M('a')}.`],
      steps: [M(`f(x) = a${canon(1, p, q)}`), M(t`${y0} = a\cdot\left(${x0}${pm(-p)}\right)^2${q ? pm(q) : ''} = ${dx * dx === 1 ? '' : dx * dx}a${q ? pm(q) : ''}`), M(t`${dx * dx === 1 ? '' : dx * dx}a = ${y0 - q} \iff a = ${TF(a)}`)],
      answer: M(`a = ${TF(a)}`), check: () => near(a * (x0 - p) ** 2 + q, y0) && x0 !== p });
  }
]
};

const GW = {
1: [
  function expVal() {
    const [a, at] = pick([[2, '2'], [3, '3'], [4, '4'], [5, '5'], [0.5, t`\left(\frac12\right)`], [1 / 3, t`\left(\frac13\right)`], [9, '9'], [16, '16']]);
    const k = pick(a === 9 || a === 16 ? [0.5, -0.5, 2] : a === 4 ? [-2, -1, 0.5, 3, 0] : [-3, -2, -1, 0, 2, 3, 4]), val = Math.pow(a, k); need(val <= 256 && val >= 1 / 256);
    return mk({ skill: 'wartość funkcji wykładniczej',
      text: t`Funkcja wykładnicza ${M('f')} jest określona wzorem ${M(`f(x) = ${at}^x`)}. Oblicz ${M(`f(${TF(k)})`)}. Wynik podaj jako liczbę całkowitą albo ułamek zwykły.`,
      fields: [F(M(`f(${TF(k)}) =`), +val.toFixed(12))],
      hints: [t`Wstaw ${M(TF(k))} w miejsce wykładnika: ${M(`f(${TF(k)}) = ${at}^{${TF(k)}}`)}.`, t`Przypomnij sobie: ${M(t`a^{-n} = \frac{1}{a^n}`)}, ${M('a^0 = 1')}, ${M(t`a^{\frac12} = \sqrt{a}`)}.`],
      steps: [M(`f(${TF(k)}) = ${at}^{${TF(k)}} = ${TF(val)}`)],
      answer: M(TF(val)), check: () => near(Math.log(val) / Math.log(a), k) });
  },
  function expPoint() {
    const [a, k] = pick([[2, 3], [2, 4], [3, 2], [3, 3], [4, 2], [5, 2], [0.5, 2], [0.5, 3], [1 / 3, 2], [2, -1], [2, -2], [3, -1], [4, -1], [0.5, -2], [0.5, -3], [1 / 3, -2], [6, 2], [0.25, -1]]), v = Math.pow(a, k);
    return mk({ skill: 'podstawa funkcji wykładniczej',
      text: t`Punkt ${M(pt('P', k, +v.toFixed(12)))} należy do wykresu funkcji wykładniczej ${M('f(x) = a^x')}, gdzie ${M('a > 0')}. Wyznacz ${M('a')}.`,
      fields: [F(M('a ='), +a.toFixed(12))],
      hints: [t`Wstaw współrzędne punktu do wzoru: ${M(`a^{${k}} = ${TF(v)}`)}.`, k > 0 ? t`Szukasz dodatniej liczby, która podniesiona do potęgi ${M(k)} daje ${M(TF(v))}.` : t`Ujemny wykładnik odwraca liczbę: ${M(t`a^{${k}} = \frac{1}{a^{${-k}}}`)}, więc ${M(t`a^{${-k}} = ${TF(1 / v)}`)}.`],
      steps: [M(`a^{${k}} = ${TF(v)}`)].concat(k < 0 ? [M(t`\frac{1}{a^{${-k}}} = ${TF(v)} \iff a^{${-k}} = ${TF(1 / v)}`)] : [], [t`${M('a > 0')}, więc ${M(`a = ${TF(a)}`)}.`]),
      answer: M(`a = ${TF(a)}`), check: () => near(Math.pow(a, k), v) && a > 0 });
  }
],
2: [
  function shiftFormula() {
    const p = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), q = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), kind = pick(['sq', 'exp']), base = pick([2, 3]);
    const g = (sp, sq0) => (kind === 'sq' ? canon(1, sp * p, sq0 * q) : t`${base}^{x${pm(-sp * p)}}${pm(sq0 * q)}`);
    const o = opts(g(1, 1), [g(-1, 1), g(1, -1), g(-1, -1)]);
    const f0 = x => (kind === 'sq' ? x * x : Math.pow(base, x)), gv = x => (kind === 'sq' ? (x - p) ** 2 + q : Math.pow(base, x - p) + q);
    return mk(Object.assign({ skill: 'przesunięcie wykresu funkcji',
      text: DOK + t`Wykres funkcji ${M(`f(x) = ${kind === 'sq' ? 'x^2' : `${base}^x`}`)} przesunięto o ${M(Math.abs(p))} ${Math.abs(p) === 1 ? 'jednostkę' : Math.abs(p) < 5 ? 'jednostki' : 'jednostek'} w ${p > 0 ? 'prawo' : 'lewo'} wzdłuż osi ${M('Ox')} oraz o ${M(Math.abs(q))} ${Math.abs(q) === 1 ? 'jednostkę' : Math.abs(q) < 5 ? 'jednostki' : 'jednostek'} w ${q > 0 ? 'górę' : 'dół'} wzdłuż osi ${M('Oy')}. Otrzymano wykres funkcji ${M('g')} określonej wzorem`,
      hints: [t`Przesunięcie o ${M('p')} w prawo i ${M('q')} w górę: ${M('g(x) = f(x - p) + q')}.`, t`Przesunięcie w prawo to ${M('x - p')} (z minusem!), w lewo to ${M('x + p')}. Przesunięcie w górę dodaje liczbę do całego wzoru, w dół – odejmuje.`],
      steps: [t`Przesunięcie o ${M(Math.abs(p))} w ${p > 0 ? 'prawo' : 'lewo'}: zamiast ${M('x')} piszemy ${M(`x${pm(-p)}`)}.`, t`Przesunięcie o ${M(Math.abs(q))} w ${q > 0 ? 'górę' : 'dół'}: do wzoru ${q > 0 ? 'dodajemy' : 'odejmujemy'} ${M(Math.abs(q))}.`, M(`g(x) = ${g(1, 1)}`)],
      answer: M(`g(x) = ${g(1, 1)}`), check: () => [-2, 0, 1, 3].every(x => near(gv(x + p), f0(x) + q)) }, o));
  },
  function hyperbola() {
    const x0 = nz(-6, 6), y0 = nz(-6, 6), a = x0 * y0, divs = [-12, -8, -6, -4, -3, -2, -1, 1, 2, 3, 4, 6, 8, 12].filter(d => a % d === 0 && d !== x0), k = pick(divs);
    return mk({ skill: 'proporcjonalność odwrotna', pts: 2,
      text: t`Do wykresu funkcji ${M(t`f(x) = \dfrac{a}{x}`)}, określonej dla ${M(t`x \neq 0`)}, należy punkt ${M(pt('P', x0, y0))}. Wyznacz ${M('a')} oraz oblicz ${M(`f(${k})`)}.`,
      fields: [F(M('a ='), a), F(M(`f(${k}) =`), a / k)],
      hints: [t`Wstaw współrzędne punktu ${M('P')}: ${M(t`${y0} = \dfrac{a}{${x0}}`)}.`, t`${M(t`a = ${P(y0)}\cdot ${P(x0)}`)}. Potem policz ${M(t`f(${k}) = \dfrac{a}{${k}}`)}.`],
      steps: [M(t`${y0} = \frac{a}{${x0}} \iff a = ${P(y0)}\cdot ${P(x0)} = ${a}`), M(t`f(${k}) = \frac{${a}}{${k}} = ${a / k}`)],
      answer: M(t`a = ${a},\quad f(${k}) = ${a / k}`), check: () => near(a / x0, y0) && isInt(a / k) });
  }
],
3: [
  function growth() {
    const N0 = pick([100, 200, 250, 400, 500, 1000]), Tt = pick([2, 3, 4, 6]), n = ri(3, 5), halving = Math.random() < 0.4, inv = Math.random() < 0.4;
    const fin = halving ? N0 * 32 / Math.pow(2, n) : N0 * Math.pow(2, n), start = halving ? N0 * 32 : N0, unit = halving ? 'mg' : '';
    const ctx = halving ? t`Masa pewnej substancji promieniotwórczej zmniejsza się o połowę co ${M(Tt)} ${Tt < 5 ? 'godziny' : 'godzin'}. Na początku było ${M(N(start))} mg tej substancji.` : t`Liczba bakterii w hodowli podwaja się co ${M(Tt)} ${Tt < 5 ? 'godziny' : 'godzin'}. Na początku było ${M(N(start))} bakterii.`;
    const sim = () => { let v = start; for (let h = Tt; h <= n * Tt; h += Tt) v = halving ? v / 2 : v * 2; return v; };
    return mk({ skill: 'wzrost i zanik wykładniczy', pts: 2,
      text: ctx + (inv ? t` Po ilu godzinach ${halving ? 'masa substancji zmaleje do' : 'liczba bakterii wzrośnie do'} ${M(N(fin))}${halving ? ' mg' : ''}?` : t` Oblicz ${halving ? 'masę substancji' : 'liczbę bakterii'} po ${M(n * Tt)} godzinach.`),
      fields: [inv ? F('Czas:', n * Tt, { unit: 'godz.' }) : F(halving ? 'Masa:' : 'Liczba bakterii:', fin, { unit })],
      hints: [inv ? t`Sprawdź, ile razy trzeba ${halving ? 'podzielić' : 'pomnożyć'} ${M(N(start))} przez ${M(2)}, żeby otrzymać ${M(N(fin))}.` : t`Policz, ile okresów po ${M(Tt)} godz. mieści się w ${M(n * Tt)} godzinach: ${M(`${n * Tt} : ${Tt}`)}.`, t`Po ${M('n')} okresach wielkość jest równa ${M(halving ? t`${N(start)}\cdot\left(\tfrac12\right)^n` : t`${N(start)}\cdot 2^n`)}.`],
      steps: inv ? [M(halving ? t`${N(start)}\cdot\left(\tfrac12\right)^n = ${N(fin)} \iff 2^n = ${start / fin}` : t`${N(start)}\cdot 2^n = ${N(fin)} \iff 2^n = ${fin / start}`), M(`n = ${n}`), t`Czas: ${M(t`${n}\cdot ${Tt} = ${n * Tt}`)} godzin.`] : [t`Liczba okresów: ${M(`${n * Tt} : ${Tt} = ${n}`)}.`, M(halving ? t`${N(start)}\cdot\left(\tfrac12\right)^{${n}} = \frac{${N(start)}}{${Math.pow(2, n)}} = ${T(fin)}` : t`${N(start)}\cdot 2^{${n}} = ${N(start)}\cdot ${Math.pow(2, n)} = ${N(fin)}`)],
      answer: inv ? t`po ${M(n * Tt)} godzinach` : M(T(fin)) + (halving ? ' mg' : ''), check: () => near(sim(), fin) });
  },
  function expTwo() {
    const [a, k] = pick([[2, 3], [3, 2], [4, 2], [0.5, 2], [0.5, 3], [1 / 3, 2], [2, -2], [3, -1], [0.5, -2], [5, 2], [4, -1]]), j = pick([-2, -1, 1, 2, 3].filter(v => v !== k)), v = Math.pow(a, k), w = Math.pow(a, j);
    return mk({ skill: 'funkcja wykładnicza – wzór z punktu', pts: 2,
      text: t`Do wykresu funkcji wykładniczej ${M('f(x) = a^x')} (gdzie ${M('a > 0')}) należy punkt ${M(pt('P', k, +v.toFixed(12)))}. Oblicz ${M(`f(${j})`)}. Wynik podaj jako liczbę całkowitą albo ułamek zwykły.`,
      fields: [F(M(`f(${j}) =`), +w.toFixed(12))],
      hints: [t`Najpierw wyznacz podstawę: z warunku ${M(`a^{${k}} = ${TF(v)}`)} i ${M('a > 0')}.`, t`${M(`a = ${TF(a)}`)}. Teraz policz ${M(`f(${j}) = a^{${j}}`)}.`],
      steps: [t`${M(`a^{${k}} = ${TF(v)}`)} i ${M('a > 0')}, więc ${M(`a = ${TF(a)}`)}.`, M(t`f(${j}) = \left(${TF(a)}\right)^{${j}} = ${TF(w)}`)],
      answer: M(`f(${j}) = ${TF(w)}`), check: () => near(Math.pow(v, j / k), w) });
  },
  function rangeShift() {
    const base = pick([2, 3, 5]), q = nz(-7, 7), inv = Math.random() < 0.3, bt = inv ? t`\left(\frac{1}{${base}}\right)` : `${base}`;
    const o = opts(IV(q, INF, false, false), [IV(q, INF, true, false), IV(-INF, q, false, false), IV(0, INF, false, false), IV(-q, INF, false, false), IV(-INF, INF, false, false)]);
    const g = x => Math.pow(inv ? 1 / base : base, x) + q;
    return mk(Object.assign({ skill: 'zbiór wartości funkcji wykładniczej',
      text: DOK + t`Zbiorem wartości funkcji ${M(`g(x) = ${bt}^x${pm(q)}`)}, określonej dla każdej liczby rzeczywistej ${M('x')}, jest przedział`,
      hints: [t`Funkcja ${M(`f(x) = ${bt}^x`)} przyjmuje wszystkie wartości dodatnie i tylko takie: jej zbiór wartości to ${M(IV(0, INF, false, false))}.`, t`Wykres ${M('g')} to wykres ${M('f')} przesunięty o ${M(Math.abs(q))} w ${q > 0 ? 'górę' : 'dół'}, więc cały zbiór wartości też się przesuwa.`],
      steps: [M(t`${bt}^x > 0\ \text{dla każdego}\ x`), M(t`${bt}^x${pm(q)} > ${q}`), t`Wartość ${M(q)} nie jest przyjmowana (nawias okrągły): ${M(t`ZW_g = ${IV(q, INF, false, false)}`)}.`],
      answer: M(IV(q, INF, false, false)), check: () => { for (let x = -20; x <= 12; x += 0.5) if (!(g(x) > q)) return false; return g(inv ? 20 : -20) - q < 1e-5 && g(inv ? -12 : 12) > q + 1000; } }, o));
  }
]
};

const r = String.raw;
MATURA.dzial({
  id: 'funkcje', store: 'funkcje-matura-v1', title: 'Funkcje', seq: 'y = f(x)',
  lead: 'Odczytywanie własności z wykresu, funkcja liniowa i kwadratowa, funkcja wykładnicza, proporcjonalność odwrotna i przesunięcia wykresów.',
  topics: { O: 'Własności i wykres', L: 'Funkcja liniowa', K: 'Funkcja kwadratowa', W: 'Wykładnicza i inne' },
  short: { O: 'Wykres', L: 'Liniowa', K: 'Kwadratowa', W: 'Wykładnicza i inne' },
  bank: { O: GO, L: GL, K: GK, W: GW },
  formulas: {
    O: [['jak czytać wykres', r`dziedzina i argumenty: oś \(Ox\)<br>zbiór wartości: oś \(Oy\)`], ['miejsce zerowe', r`argument \(x\), dla którego \(f(x) = 0\); punkt wspólny wykresu z osią \(Ox\)`], ['monotoniczność', r`rosnąca: wykres wznosi się (od lewej do prawej)<br>malejąca: wykres opada<br>przedziały zapisujemy na osi \(Ox\)`], ['kropki na wykresie', r`pełna kropka: punkt należy do wykresu<br>pusta kropka: punkt nie należy`]],
    L: [['wzór', r`\(f(x) = ax + b\)`], ['współczynnik kierunkowy', r`\(a = \dfrac{y_2 - y_1}{x_2 - x_1}\)<br>\(a > 0\): rosnąca, \(a < 0\): malejąca, \(a = 0\): stała`], ['punkty charakterystyczne', r`przecięcie z \(Oy\): \((0,\ b)\)<br>miejsce zerowe: \(x_0 = -\dfrac{b}{a}\)`]],
    K: [['postać ogólna', r`\(f(x) = ax^2 + bx + c\)`], ['postać kanoniczna', r`\(f(x) = a(x - p)^2 + q\)<br>wierzchołek \(W = (p,\ q)\)`], ['wierzchołek', r`\(p = \dfrac{-b}{2a},\quad q = f(p) = \dfrac{-\Delta}{4a}\)`], ['postać iloczynowa', r`\(f(x) = a(x - x_1)(x - x_2)\)<br>oś symetrii: \(x = \dfrac{x_1 + x_2}{2}\)`], ['zbiór wartości', r`\(a > 0\): \(\langle q,\ +\infty)\)<br>\(a < 0\): \((-\infty,\ q\rangle\)`], ['wartości w przedziale domkniętym', r`porównaj wartości na końcach przedziału i w wierzchołku (jeśli \(p\) należy do przedziału)`]],
    W: [['funkcja wykładnicza', r`\(f(x) = a^x,\ a > 0,\ a \neq 1\)<br>zbiór wartości: \((0,\ +\infty)\)<br>\(a > 1\): rosnąca, \(0 < a < 1\): malejąca`], ['proporcjonalność odwrotna', r`\(f(x) = \dfrac{a}{x},\ x \neq 0\); iloczyn \(x\cdot y = a\) jest stały`], ['przesunięcie wykresu', r`\(g(x) = f(x - p) + q\): o \(p\) w prawo i \(q\) w górę<br>\(f(x + p)\): w lewo, \(f(x) - q\): w dół`], ['wzrost wykładniczy', r`po \(n\) okresach: \(N = N_0\cdot q^n\)<br>podwajanie: \(q = 2\), połowiczny zanik: \(q = \tfrac12\)`]]
  }
});
})();
