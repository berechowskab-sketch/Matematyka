/* Dział I: Liczby rzeczywiste — potęgi i pierwiastki, logarytmy, procenty, wartość bezwzględna */
(function () {
const lg = (a, x) => Math.log(x) / Math.log(a);
const ex = (b, e) => `${b}^{${e}}`;
/* a + b√n w LaTeX-u */
const surd = (a, b, n) => (a ? T(a) : '') + (b ? (a ? (b < 0 ? ' - ' : ' + ') : (b < 0 ? '-' : '')) + (Math.abs(b) === 1 ? '' : T(Math.abs(b))) + t`\sqrt{${n}}` : '');
/* wykładnik-ułamek */
const fr = (p, q) => (q === 1 ? `${p}` : (p < 0 ? '-' : '') + t`\frac{${Math.abs(p)}}{${q}}`);

const GP = {
1: [
  function powRule() {
    const a = pick([2, 3, 5, 7]), m = ri(2, 9), n = -ri(2, 6), k = pick([-4, -3, -2, 2, 3, 4, 5, 6]), e = m + n - k;
    const o = opts(ex(a, e), [ex(a, m * n - k), ex(a, m + n + k), ex(a, m - n - k), ex(a, -e), ex(a, e + 1)]);
    return mk(Object.assign({ skill: 'działania na potęgach',
      text: DOK + t`Liczba ${M(t`${ex(a, m)}\cdot ${ex(a, n)} : ${ex(a, k)}`)} jest równa`,
      hints: [t`Przy mnożeniu potęg o tej samej podstawie wykładniki dodajemy, przy dzieleniu – odejmujemy.`, t`Policz wykładnik: ${M(`${m} + (${n}) - ${P(k)}`)}.`],
      steps: [M(t`${ex(a, m)}\cdot ${ex(a, n)} = ${a}^{${m} + (${n})} = ${ex(a, m + n)}`), M(t`${ex(a, m + n)} : ${ex(a, k)} = ${a}^{${m + n} - ${P(k)}} = ${ex(a, e)}`)],
      answer: M(ex(a, e)), check: () => near(lg(a, Math.pow(a, m) * Math.pow(a, n) / Math.pow(a, k)), e) }, o));
  },
  function sqrtAdd() {
    const n = pick([2, 3, 5, 6, 7]), p = ri(2, 6), q = ri(2, 6); need(p !== q);
    const A = p * p * n, B = q * q * n, v = (p + q) * Math.sqrt(n);
    const o = opts([rt(R(p + q, n)), v], [[t`\sqrt{${A + B}}`, Math.sqrt(A + B)], [rt(R(p * q, n)), p * q * Math.sqrt(n)], [rt(R(p + q, 2 * n)), (p + q) * Math.sqrt(2 * n)], [rt(R(p * p + q * q, n)), (p * p + q * q) * Math.sqrt(n)]]);
    return mk(Object.assign({ skill: 'wyłączanie czynnika przed pierwiastek',
      text: DOK + t`Liczba ${M(t`\sqrt{${A}} + \sqrt{${B}}`)} jest równa`,
      hints: [t`Pierwiastków nie dodaje się „pod kreską”: ${M(t`\sqrt{a} + \sqrt{b} \neq \sqrt{a + b}`)}. Najpierw wyłącz czynnik przed znak pierwiastka.`, t`${M(t`${A} = ${p * p}\cdot ${n}`)} oraz ${M(t`${B} = ${q * q}\cdot ${n}`)}.`],
      steps: [M(t`\sqrt{${A}} = \sqrt{${p * p}\cdot ${n}} = ${p}\sqrt{${n}}`), M(t`\sqrt{${B}} = \sqrt{${q * q}\cdot ${n}} = ${q}\sqrt{${n}}`), M(t`${p}\sqrt{${n}} + ${q}\sqrt{${n}} = ${p + q}\sqrt{${n}}`)],
      answer: M(rt(R(p + q, n))), check: () => near(Math.sqrt(A) + Math.sqrt(B), v) }, o));
  },
  function fracExp() {
    const c = pick([2, 3, 4, 5]), den = pick([2, 3]), num = den === 2 ? pick([1, 3]) : pick([1, 2]), b = Math.pow(c, den), val = Math.pow(c, num);
    const root = den === 2 ? t`\sqrt{${b}}` : t`\sqrt[3]{${b}}`;
    return mk({ skill: 'potęga o wykładniku wymiernym',
      text: t`Oblicz ${M(t`${b}^{${fr(num, den)}}`)}.`,
      fields: [F(M(t`${b}^{${fr(num, den)}} =`), val)],
      hints: [t`Mianownik wykładnika to stopień pierwiastka: ${M(t`a^{\frac{m}{n}} = \left(\sqrt[n]{a}\right)^m`)}.`, t`${M(t`${root} = ${c}`)}.`],
      steps: [M(t`${b}^{${fr(num, den)}} = \left(${root}\right)^{${num}} = ${c}^{${num}} = ${val}`)],
      answer: M(`${val}`), check: () => near(Math.pow(b, num / den), val) });
  }
],
2: [
  function mixedBases() {
    const [p, p2, p3] = pick([[2, 4, 8], [3, 9, 27]]), a = pick([-5, -4, -3, 3, 4, 5, 6, 7, 8, 9]), b = ri(2, 6), c = ri(1, 4), x = a + 2 * b - 3 * c;
    return mk({ skill: 'sprowadzanie do wspólnej podstawy',
      text: t`Liczba ${M(t`\dfrac{${ex(p, a)}\cdot ${ex(p2, b)}}{${ex(p3, c)}}`)} jest równa ${M(`${p}^{x}`)}. Wyznacz ${M('x')}.`,
      fields: [F(M('x ='), x)],
      hints: [t`Zapisz wszystkie potęgi przy podstawie ${M(p)}: ${M(`${p2} = ${p}^2`)}, ${M(`${p3} = ${p}^3`)}.`, t`Potęga potęgi: ${M(t`(a^m)^n = a^{m\cdot n}`)}, więc ${M(t`${ex(p2, b)} = ${ex(p, 2 * b)}`)} i ${M(t`${ex(p3, c)} = ${ex(p, 3 * c)}`)}.`],
      steps: [M(t`${ex(p2, b)} = (${p}^2)^{${b}} = ${ex(p, 2 * b)},\qquad ${ex(p3, c)} = (${p}^3)^{${c}} = ${ex(p, 3 * c)}`), M(t`\dfrac{${ex(p, a)}\cdot ${ex(p, 2 * b)}}{${ex(p, 3 * c)}} = ${p}^{${a} + ${2 * b} - ${3 * c}} = ${ex(p, x)}`)],
      answer: M(`x = ${x}`), check: () => near(lg(p, Math.pow(p, a) * Math.pow(p2, b) / Math.pow(p3, c)), x) });
  },
  function binomSq() {
    const n = pick([2, 3, 5, 7]), p = ri(1, 5), q = pick([1, 2, 3]), s = pick([1, -1]), A = p * p + q * q * n, B = 2 * p * q * s, v = Math.pow(p + s * q * Math.sqrt(n), 2);
    const val = (a, b) => a + b * Math.sqrt(n);
    const o = opts([surd(A, B, n), v], [[`${A}`, A], [surd(A, B / 2, n), val(A, B / 2)], [surd(p * p + q * q * n * s, 0, n) || '0', p * p + q * q * n * s], [surd(p * p, q * q * s, n), val(p * p, q * q * s)], [surd(A, -B, n), val(A, -B)]]);
    const inner = surd(p, s * q, n);
    return mk(Object.assign({ skill: 'wzór skróconego mnożenia z pierwiastkiem',
      text: DOK + t`Liczba ${M(t`\left(${inner}\right)^2`)} jest równa`,
      hints: [t`Użyj wzoru ${M(t`(a ${s > 0 ? '+' : '-'} b)^2 = a^2 ${s > 0 ? '+' : '-'} 2ab + b^2`)}. Nie zgub wyrazu środkowego ${M('2ab')}.`, t`${M(t`\left(${surd(0, q, n)}\right)^2 = ${q * q}\cdot ${n} = ${q * q * n}`)}.`],
      steps: [M(t`\left(${inner}\right)^2 = ${p}^2 ${s > 0 ? '+' : '-'} 2\cdot ${p}\cdot ${surd(0, q, n)} + \left(${surd(0, q, n)}\right)^2`), M(t`= ${p * p} ${s > 0 ? '+' : '-'} ${surd(0, 2 * p * q, n)} + ${q * q * n} = ${surd(A, B, n)}`)],
      answer: M(surd(A, B, n)), check: () => near(val(A, B), v) }, o));
  },
  function negExp() {
    let base, bv, e, ev, val, steps;
    if (Math.random() < 0.5) {
      const [c, d] = pick([[2, 3], [3, 2], [1, 2], [1, 3], [3, 4], [2, 5], [1, 4], [5, 2]]), k = pick([2, 3]);
      base = t`\left(\frac{${c}}{${d}}\right)`; bv = c / d; e = `-${k}`; ev = -k; val = Math.pow(d, k) / Math.pow(c, k);
      steps = [t`Ujemny wykładnik odwraca ułamek: ${M(t`\left(\frac{${c}}{${d}}\right)^{-${k}} = \left(\frac{${d}}{${c}}\right)^{${k}}`)}.`, M(t`\left(\frac{${d}}{${c}}\right)^{${k}} = \frac{${Math.pow(d, k)}}{${Math.pow(c, k)}} = ${TF(val)}`)];
    } else {
      const c = pick([2, 3, 4, 5]), den = pick([2, 3]), num = pick([1, 2, 3]); need(num !== den && Math.pow(c, num) <= 125);
      const b = Math.pow(c, den); base = `${b}`; bv = b; e = '-' + fr(num, den); ev = -num / den; val = 1 / Math.pow(c, num);
      steps = [M(t`${b}^{-${fr(num, den)}} = \frac{1}{${b}^{${fr(num, den)}}}`), M(t`${b}^{${fr(num, den)}} = \left(${den === 2 ? t`\sqrt{${b}}` : t`\sqrt[3]{${b}}`}\right)^{${num}} = ${c}^{${num}} = ${Math.pow(c, num)}`), M(t`${b}^{-${fr(num, den)}} = ${TF(val)}`)];
    }
    return mk({ skill: 'potęga o wykładniku ujemnym',
      text: t`Oblicz ${M(`${base}^{${e}}`)}. Wynik podaj jako liczbę całkowitą albo ułamek zwykły.`,
      fields: [F(M(`${base}^{${e}} =`), val)],
      hints: [t`Wykładnik ujemny oznacza odwrotność: ${M(t`a^{-n} = \frac{1}{a^n}`)}, a dla ułamka ${M(t`\left(\frac{a}{b}\right)^{-n} = \left(\frac{b}{a}\right)^{n}`)}.`, t`Wykładnik ułamkowy to pierwiastek: ${M(t`a^{\frac{m}{n}} = \left(\sqrt[n]{a}\right)^m`)}.`],
      steps, answer: M(TF(val)), check: () => near(Math.pow(bv, ev), val) });
  },
  function rationalize() {
    const n = pick([2, 3, 5, 6, 7]), m = ri(2, 6), a = m * n, v = m * Math.sqrt(n);
    const o = opts([rt(R(m, n)), v], [[rt(R(a, n)), a * Math.sqrt(n)], [t`\frac{\sqrt{${n}}}{${m}}`, Math.sqrt(n) / m], [`${m}`, m], [rt(R(m, a)), m * Math.sqrt(a)]]);
    return mk(Object.assign({ skill: 'usuwanie niewymierności z mianownika',
      text: DOK + t`Liczba ${M(t`\dfrac{${a}}{\sqrt{${n}}}`)} jest równa`,
      hints: [t`Pomnóż licznik i mianownik przez ${M(t`\sqrt{${n}}`)}.`, t`${M(t`\sqrt{${n}}\cdot\sqrt{${n}} = ${n}`)}, a potem skróć ułamek.`],
      steps: [M(t`\frac{${a}}{\sqrt{${n}}} = \frac{${a}\cdot\sqrt{${n}}}{\sqrt{${n}}\cdot\sqrt{${n}}} = \frac{${a}\sqrt{${n}}}{${n}}`), M(t`\frac{${a}\sqrt{${n}}}{${n}} = ${rt(R(m, n))}`)],
      answer: M(rt(R(m, n))), check: () => near(a / Math.sqrt(n), v) }, o));
  }
],
3: [
  function sqExpand() {
    const n = pick([2, 3, 5, 6, 7, 10, 11]), k = ri(2, 6), s = pick([1, -1]), val = n + k * k, sq2 = t`\sqrt{${n}}`;
    const expr = t`\left(${sq2} ${s > 0 ? '+' : '-'} ${k}\right)^2 ${s > 0 ? '-' : '+'} ${2 * k}${sq2}`;
    return mk({ skill: 'wyrażenia z pierwiastkami', pts: 2,
      text: t`Oblicz wartość wyrażenia ${M(expr)}.`,
      fields: [F('Wartość wyrażenia:', val)],
      hints: [t`Rozwiń kwadrat ze wzoru ${M(t`(a ${s > 0 ? '+' : '-'} b)^2 = a^2 ${s > 0 ? '+' : '-'} 2ab + b^2`)}.`, t`Wyrazy z ${M(sq2)} mają przeciwne znaki i się zredukują.`],
      steps: [M(t`\left(${sq2} ${s > 0 ? '+' : '-'} ${k}\right)^2 = ${n} ${s > 0 ? '+' : '-'} ${2 * k}${sq2} + ${k * k}`), M(t`${n} ${s > 0 ? '+' : '-'} ${2 * k}${sq2} + ${k * k} ${s > 0 ? '-' : '+'} ${2 * k}${sq2} = ${n} + ${k * k} = ${val}`)],
      answer: M(`${val}`), check: () => near(Math.pow(Math.sqrt(n) + s * k, 2) - s * 2 * k * Math.sqrt(n), val) });
  },
  function sumPow() {
    const a = pick([2, 3, 5]), n = ri(10, 40), diff = Math.random() < 0.4;
    const c = diff ? a * a - 1 : a + 1, hi = diff ? n + 2 : n + 1, op = diff ? '-' : '+';
    const o = opts(t`${c}\cdot ${ex(a, n)}`, [ex(a, 2 * n + (diff ? 2 : 1)), t`${c}\cdot ${ex(a, hi)}`, diff ? ex(a, 2) : t`2\cdot ${ex(a, hi)}`, ex(a * a, n), t`${a}\cdot ${ex(a, n)}`]);
    const big = (b, e) => BigInt(b) ** BigInt(e);
    return mk(Object.assign({ skill: 'wyłączanie potęgi przed nawias',
      text: DOK + t`Liczba ${M(diff ? `${ex(a, hi)} - ${ex(a, n)}` : `${ex(a, n)} + ${ex(a, hi)}`)} jest równa`,
      hints: [t`Potęg o tej samej podstawie nie wolno ${diff ? 'odejmować' : 'dodawać'} „po wykładnikach”. Wyłącz przed nawias niższą potęgę.`, t`${M(t`${ex(a, hi)} = ${ex(a, n)}\cdot ${ex(a, hi - n)}`)}.`],
      steps: [M(diff ? t`${ex(a, hi)} - ${ex(a, n)} = ${ex(a, n)}\cdot\left(${a}^2 - 1\right)` : t`${ex(a, n)} + ${ex(a, hi)} = ${ex(a, n)}\cdot\left(1 + ${a}\right)`), M(t`= ${c}\cdot ${ex(a, n)}`)],
      answer: M(t`${c}\cdot ${ex(a, n)}`), check: () => (diff ? big(a, hi) - big(a, n) : big(a, n) + big(a, hi)) === BigInt(c) * big(a, n) }, o));
  },
  function rootMix() {
    const [p, p2, p3] = pick([[2, 4, 8], [3, 9, 27]]), a = ri(2, 6), c = ri(1, 3), x = 2 * a + 0.5 - 3 * c;
    return mk({ skill: 'potęgi i pierwiastki przy wspólnej podstawie', pts: 2,
      text: t`Liczba ${M(t`${ex(p2, a)}\cdot\sqrt{${p}} : ${ex(p3, c)}`)} jest równa ${M(`${p}^{x}`)}. Wyznacz ${M('x')}.`,
      fields: [F(M('x ='), x)],
      hints: [t`Pierwiastek to potęga o wykładniku ${M(t`\tfrac12`)}: ${M(t`\sqrt{${p}} = ${p}^{\frac12}`)}.`, t`${M(t`${ex(p2, a)} = ${ex(p, 2 * a)}`)} oraz ${M(t`${ex(p3, c)} = ${ex(p, 3 * c)}`)}. Teraz dodaj i odejmij wykładniki.`],
      steps: [M(t`${ex(p2, a)} = ${ex(p, 2 * a)},\qquad \sqrt{${p}} = ${p}^{\frac12},\qquad ${ex(p3, c)} = ${ex(p, 3 * c)}`), M(t`x = ${2 * a} + \tfrac12 - ${3 * c} = ${TF(x)}`)],
      answer: M(`x = ${TF(x)}`), check: () => near(lg(p, Math.pow(p2, a) * Math.sqrt(p) / Math.pow(p3, c)), x) });
  }
]
};

const GL = {
1: [
  function logVal() {
    const a = pick([2, 3, 4, 5, 10]), k = pick([2, 3, 4, -1, -2, 0.5, 0]); need(Math.pow(a, Math.abs(k)) <= 1000 && !(k === 0.5 && a === 4));
    const arg = k === 0 ? '1' : k === 0.5 ? t`\sqrt{${a}}` : k > 0 ? `${Math.pow(a, k)}` : t`\frac{1}{${Math.pow(a, -k)}}`;
    const asPow = k === 0 ? `${a}^0` : k === 0.5 ? t`${a}^{\frac12}` : ex(a, k);
    return mk({ skill: 'definicja logarytmu',
      text: t`Oblicz ${M(t`\log_{${a}} ${arg}`)}.`,
      fields: [F(M(t`\log_{${a}} ${arg} =`), k)],
      hints: [t`${M(t`\log_a b = c`)} oznacza, że ${M(`a^c = b`)}. Szukasz wykładnika.`, t`Do jakiej potęgi trzeba podnieść ${M(a)}, żeby otrzymać ${M(arg)}?`],
      steps: [M(t`${arg} = ${asPow}`), t`Zatem ${M(t`\log_{${a}} ${arg} = ${TF(k)}`)}.`],
      answer: M(TF(k)), check: () => near(lg(a, Math.pow(a, k)), k) });
  },
  function logSum() {
    const [c, x, y, k] = pick([[6, 4, 9, 2], [6, 2, 3, 1], [6, 12, 3, 2], [10, 4, 25, 2], [10, 2, 5, 1], [10, 8, 125, 3], [12, 3, 4, 1], [12, 9, 16, 2], [15, 3, 5, 1], [4, 2, 8, 2], [8, 4, 16, 2], [9, 3, 27, 2], [6, 8, 27, 3], [14, 2, 7, 1]]);
    const lg0 = c === 10 ? t`\log` : t`\log_{${c}}`;
    return mk({ skill: 'suma logarytmów',
      text: t`Oblicz ${M(t`${lg0} ${x} + ${lg0} ${y}`)}.`,
      fields: [F('Wynik:', k)],
      hints: [t`Suma logarytmów o tej samej podstawie to logarytm iloczynu: ${M(t`\log_a x + \log_a y = \log_a (x\cdot y)`)}.`, t`${M(t`${x}\cdot ${y} = ${x * y}`)}. Jaką potęgą liczby ${M(c)} jest ${M(x * y)}?`],
      steps: [M(t`${lg0} ${x} + ${lg0} ${y} = ${lg0}(${x}\cdot ${y}) = ${lg0} ${x * y}`), M(t`${x * y} = ${ex(c, k)},\ \text{więc}\ ${lg0} ${x * y} = ${k}`)],
      answer: M(`${k}`), check: () => near(lg(c, x) + lg(c, y), k) });
  }
],
2: [
  function logDiff() {
    const c = pick([2, 3, 5]), k = pick([1, 2, 3]);
    if (Math.random() < 0.5) {
      const Y = pick([2, 3, 5, 7].filter(v => v !== c)), X = Y * Math.pow(c, k);
      return mk({ skill: 'różnica logarytmów',
        text: t`Oblicz ${M(t`\log_{${c}} ${X} - \log_{${c}} ${Y}`)}.`,
        fields: [F('Wynik:', k)],
        hints: [t`Różnica logarytmów o tej samej podstawie to logarytm ilorazu: ${M(t`\log_a x - \log_a y = \log_a \frac{x}{y}`)}.`, t`${M(t`${X} : ${Y} = ${X / Y}`)}.`],
        steps: [M(t`\log_{${c}} ${X} - \log_{${c}} ${Y} = \log_{${c}} \frac{${X}}{${Y}} = \log_{${c}} ${X / Y}`), M(t`${X / Y} = ${ex(c, k)},\ \text{więc wynik to}\ ${k}`)],
        answer: M(`${k}`), check: () => near(lg(c, X) - lg(c, Y), k) });
    }
    const m = pick([2, 3, 4, 6].filter(v => v % c !== 0 && c % v !== 0)), X = c * m, Y = m * m;
    return mk({ skill: 'logarytm potęgi', pts: 2,
      text: t`Oblicz ${M(t`2\log_{${c}} ${X} - \log_{${c}} ${Y}`)}.`,
      fields: [F('Wynik:', 2)],
      hints: [t`Liczbę stojącą przed logarytmem wnieś do wykładnika: ${M(t`n\cdot\log_a x = \log_a x^n`)}.`, t`${M(t`2\log_{${c}} ${X} = \log_{${c}} ${X * X}`)}. Teraz różnica logarytmów to logarytm ilorazu.`],
      steps: [M(t`2\log_{${c}} ${X} = \log_{${c}} ${X}^2 = \log_{${c}} ${X * X}`), M(t`\log_{${c}} ${X * X} - \log_{${c}} ${Y} = \log_{${c}} \frac{${X * X}}{${Y}} = \log_{${c}} ${c * c} = 2`)],
      answer: M('2'), check: () => near(2 * lg(c, X) - lg(c, Y), 2) });
  },
  function logEq() {
    if (Math.random() < 0.55) {
      const [a, k] = pick([[2, 3], [2, 4], [2, 5], [3, 2], [3, 3], [5, 2], [4, 2], [2, -1], [2, -2], [3, -2], [5, -1], [4, 0.5], [9, 0.5], [16, 0.5], [25, 0.5], [10, 3], [10, -2]]), x = Math.pow(a, k);
      return mk({ skill: 'równanie z logarytmem',
        text: t`Wyznacz liczbę ${M('x')}, dla której ${M(t`\log_{${a}} x = ${TF(k)}`)}.`,
        fields: [F(M('x ='), +x.toFixed(10))],
        hints: [t`Skorzystaj z definicji: ${M(t`\log_a x = c`)} oznacza ${M('x = a^c')}.`, t`Policz ${M(`${a}^{${TF(k)}}`)}.`],
        steps: [M(t`\log_{${a}} x = ${TF(k)} \iff x = ${a}^{${TF(k)}}`), M(`x = ${TF(x)}`)],
        answer: M(`x = ${TF(x)}`), check: () => near(lg(a, x), k) });
    }
    const x = pick([2, 3, 4, 5, 6]), k = pick([2, 3]), b = Math.pow(x, k);
    return mk({ skill: 'szukanie podstawy logarytmu',
      text: t`Wyznacz dodatnią liczbę ${M('x')}, dla której ${M(t`\log_{x} ${b} = ${k}`)}.`,
      fields: [F(M('x ='), x)],
      hints: [t`Z definicji logarytmu: ${M(t`\log_x ${b} = ${k}`)} oznacza ${M(`x^{${k}} = ${b}`)}.`, t`Szukasz dodatniej liczby, której ${k === 2 ? 'kwadrat' : 'sześcian'} jest równy ${M(b)}.`],
      steps: [M(t`\log_{x} ${b} = ${k} \iff x^{${k}} = ${b}`), M(t`x = ${k === 2 ? t`\sqrt{${b}}` : t`\sqrt[3]{${b}}`} = ${x}`)],
      answer: M(`x = ${x}`), check: () => near(lg(x, b), k) });
  }
],
3: [
  function logParam() {
    const c = pick([2, 3, 5]), p = pick([2, 3, 5, 7].filter(v => v !== c)), k = pick([1, 2, 3]), m = pick([1, 2, 3]); need(k !== m);
    const N0 = Math.pow(c, k) * Math.pow(p, m); need(N0 <= 2000);
    const ma = q => (q === 1 ? 'a' : `${q}a`), a = lg(c, p);
    const o = opts([`${k} + ${ma(m)}`, k + m * a], [[ma(k * m === 1 ? 2 : k * m), (k * m === 1 ? 2 : k * m) * a], [`${m} + ${ma(k)}`, m + k * a], [`${Math.pow(c, k)} + ${ma(m)}`, Math.pow(c, k) + m * a], [`${k + m} + a`, k + m + a], [`${k} + a^{${m + 1}}`, k + Math.pow(a, m + 1)]]);
    return mk(Object.assign({ skill: 'logarytm iloczynu i potęgi',
      text: DOK + t`Niech ${M(t`a = \log_{${c}} ${p}`)}. Wtedy liczba ${M(t`\log_{${c}} ${N0}`)} jest równa`,
      hints: [t`Rozłóż ${M(N0)} na czynniki: ${M(t`${N0} = ${ex(c, k)}\cdot ${m === 1 ? p : ex(p, m)}`)}.`, t`Logarytm iloczynu to suma logarytmów, a ${M(t`\log_a x^n = n\log_a x`)}.`],
      steps: [M(t`${N0} = ${ex(c, k)}\cdot ${m === 1 ? p : ex(p, m)}`), M(t`\log_{${c}} ${N0} = \log_{${c}} ${ex(c, k)} + \log_{${c}} ${m === 1 ? p : ex(p, m)} = ${k} + ${m === 1 ? '' : m}\log_{${c}} ${p}`), M(`= ${k} + ${ma(m)}`)],
      answer: M(`${k} + ${ma(m)}`), check: () => near(lg(c, N0), k + m * a) }, o));
  },
  function logBase() {
    const c = pick([2, 3, 5]), m = pick([2, 3]), n = ri(1, 5); need(n !== m && n % m !== 0 && Math.pow(c, n) <= 243 && Math.pow(c, m) <= 27);
    const B = Math.pow(c, m), A = Math.pow(c, n);
    return mk({ skill: 'logarytm – różne potęgi tej samej liczby', pts: 2,
      text: t`Oblicz ${M(t`\log_{${B}} ${A}`)}. Wynik podaj jako ułamek zwykły.`,
      fields: [F(M(t`\log_{${B}} ${A} =`), n / m)],
      hints: [t`Zapisz podstawę i liczbę logarytmowaną jako potęgi liczby ${M(c)}: ${M(`${B} = ${ex(c, m)}`)}, ${M(`${A} = ${ex(c, n)}`)}.`, t`Szukasz ${M('x')}, dla którego ${M(t`\left(${ex(c, m)}\right)^x = ${ex(c, n)}`)}, czyli ${M(`${m}x = ${n}`)}.`],
      steps: [M(t`\log_{${B}} ${A} = x \iff ${B}^x = ${A}`), M(t`\left(${ex(c, m)}\right)^x = ${ex(c, n)} \iff ${c}^{${m}x} = ${ex(c, n)} \iff ${m}x = ${n}`), M(`x = ${TF(n / m)}`)],
      answer: M(TF(n / m)), check: () => near(lg(B, A), n / m) });
  }
]
};

const GC = {
1: [
  function pctPrice() {
    const p = pick([5, 10, 15, 20, 25, 30, 40]), x = 20 * ri(2, 30), up = Math.random() < 0.5, val = x * (1 + (up ? 1 : -1) * p / 100);
    const what = pick(['kurtki', 'plecaka', 'biletu miesięcznego', 'słuchawek', 'gry planszowej']);
    return mk({ skill: up ? 'podwyżka o procent' : 'obniżka o procent',
      text: t`Cena ${what} wynosiła ${M(x)} zł. Cenę ${up ? 'podwyższono' : 'obniżono'} o ${M(t`${p}\%`)}. Oblicz cenę po ${up ? 'podwyżce' : 'obniżce'}.`,
      fields: [F('Nowa cena:', val, { unit: 'zł' })],
      hints: [t`Po ${up ? 'podwyżce' : 'obniżce'} o ${M(t`${p}\%`)} cena stanowi ${M(t`${100 + (up ? p : -p)}\%`)} ceny początkowej.`, t`Pomnóż: ${M(t`${T((100 + (up ? p : -p)) / 100)}\cdot ${x}`)}.`],
      steps: [M(t`100\% ${up ? '+' : '-'} ${p}\% = ${100 + (up ? p : -p)}\% = ${T((100 + (up ? p : -p)) / 100)}`), M(t`${T((100 + (up ? p : -p)) / 100)}\cdot ${x} = ${zl(val)}\ \text{zł}`)],
      answer: M(t`${zl(val)}\ \text{zł}`), check: () => near(x + (up ? 1 : -1) * x * p / 100, val) });
  },
  function whatPct() {
    const b = pick([20, 25, 40, 50, 80, 200, 250]), p = pick([4, 8, 12, 16, 20, 24, 28, 36, 44, 60, 72]), a = b * p / 100; need(isInt(a));
    const [ctx, q] = pick([[t`W szkole jest ${M(b)} maturzystów, a ${M(a)} z nich wybrało matematykę rozszerzoną.`, 'Jaki procent maturzystów wybrał matematykę rozszerzoną?'], [t`Na parkingu jest ${M(b)} miejsc, z czego ${M(a)} jest zajętych.`, 'Jaki procent miejsc jest zajętych?'], [t`W teście było ${M(b)} pytań. Ola odpowiedziała poprawnie na ${M(a)} z nich.`, 'Na jaki procent pytań Ola odpowiedziała poprawnie?']]);
    return mk({ skill: 'jakim procentem jednej liczby jest druga',
      text: `${ctx} ${q}`,
      fields: [F('Odpowiedź:', p, { unit: '%' })],
      hints: [t`Podziel część przez całość: ${M(t`\frac{${a}}{${b}}`)}.`, t`Wynik pomnóż przez ${M(t`100\%`)}.`],
      steps: [M(t`\frac{${a}}{${b}}\cdot 100\% = ${T(a / b)}\cdot 100\% = ${p}\%`)],
      answer: M(t`${p}\%`), check: () => near(a / b * 100, p) });
  }
],
2: [
  function reversePct() {
    const orig = 10 * ri(5, 40), p = pick([10, 15, 20, 25, 30, 40]), y = orig * (1 - p / 100);
    return mk({ skill: 'cena przed obniżką', pts: 2,
      text: t`Po obniżce o ${M(t`${p}\%`)} buty kosztują ${M(zl(y))} zł. Oblicz cenę butów przed obniżką.`,
      fields: [F('Cena przed obniżką:', orig, { unit: 'zł' })],
      hints: [t`Cena po obniżce to ${M(t`${100 - p}\%`)} ceny początkowej ${M('x')}, a nie ${M(t`100\%`)}.`, t`Ułóż równanie ${M(t`${T((100 - p) / 100)}\cdot x = ${zl(y)}`)}.`],
      steps: [t`${M('x')} – cena przed obniżką. Po obniżce zostaje ${M(t`${100 - p}\%`)} ceny: ${M(t`${T((100 - p) / 100)}x = ${zl(y)}`)}.`, M(t`x = ${zl(y)} : ${T((100 - p) / 100)} = ${orig}`)],
      answer: M(t`${orig}\ \text{zł}`), check: () => near(orig - orig * p / 100, y) });
  },
  function twoChanges() {
    const p = pick([10, 20, 25, 30, 50]), q = pick([10, 20, 25, 30, 50]), up1 = Math.random() < 0.6, f1 = 1 + (up1 ? p : -p) / 100, f2 = 1 + (up1 ? -q : q) / 100, val = +(100 * f1 * f2).toFixed(6); need(val !== 100);
    return mk({ skill: 'dwie kolejne zmiany ceny', pts: 2,
      text: t`Cenę towaru najpierw ${up1 ? 'podwyższono' : 'obniżono'} o ${M(t`${p}\%`)}, a następnie nową cenę ${up1 ? 'obniżono' : 'podwyższono'} o ${M(t`${q}\%`)}. Jaki procent ceny początkowej stanowi cena końcowa?`,
      fields: [F('Cena końcowa to', val, { unit: '% ceny początkowej' })],
      hints: [t`Procentów nie dodaje się ani nie odejmuje wprost – druga zmiana liczy się już od nowej ceny.`, t`Oznacz cenę początkową ${M('x')} i pomnóż ją kolejno przez ${M(T(f1))} i przez ${M(T(f2))}.`],
      steps: [t`Po pierwszej zmianie: ${M(t`${T(f1)}x`)}.`, t`Po drugiej zmianie: ${M(t`${T(f2)}\cdot ${T(f1)}x = ${T(f1 * f2)}x`)}.`, t`${M(t`${T(f1 * f2)} = ${T(val)}\%`)} ceny początkowej${val < 100 ? t`, czyli w sumie cena spadła o ${M(t`${T(100 - val)}\%`)}` : val > 100 ? t`, czyli w sumie cena wzrosła o ${M(t`${T(val - 100)}\%`)}` : ', czyli cena wróciła do początkowej'}.`],
      answer: M(t`${T(val)}\%`), check: () => { let c = 80; c += (up1 ? 1 : -1) * c * p / 100; c += (up1 ? -1 : 1) * c * q / 100; return near(c / 80 * 100, val); } });
  },
  function deposit() {
    const K = pick([1000, 2000, 5000, 10000]), r = pick([2, 3, 4, 5, 6, 8, 10]), val = +(K * Math.pow(1 + r / 100, 2)).toFixed(2);
    return mk({ skill: 'procent składany', pts: 2,
      text: t`Pani Ewa wpłaciła ${M(N(K))} zł na lokatę dwuletnią z oprocentowaniem ${M(t`${r}\%`)} w skali roku i roczną kapitalizacją odsetek. Oblicz kwotę na lokacie po dwóch latach (bez uwzględniania podatku).`,
      fields: [F('Kwota po 2 latach:', val, { unit: 'zł' })],
      hints: [t`Po każdym roku kwota rośnie ${M(T(1 + r / 100))} raza – odsetki z pierwszego roku też zarabiają w drugim.`, t`Wzór: ${M(t`K_n = K\cdot\left(1 + \frac{p}{100}\right)^n`)} dla ${M('n = 2')}.`],
      steps: [M(t`K_2 = ${N(K)}\cdot\left(1 + \frac{${r}}{100}\right)^2 = ${N(K)}\cdot ${T(1 + r / 100)}^2`), M(t`= ${N(K)}\cdot ${T(+Math.pow(1 + r / 100, 2).toFixed(4))} = ${zl(val)}\ \text{zł}`)],
      answer: M(t`${zl(val)}\ \text{zł}`), check: () => { let c = K; c += c * r / 100; c += c * r / 100; return near(c, val); } });
  }
],
3: [
  function moreLess() {
    const PAIRS = [[25, 20], [100, 50], [60, 37.5], [150, 60], [300, 75], [400, 80]], [p, q] = pick(PAIRS);
    const pc = v => [t`${T(v)}\%`, v];
    const o = opts(pc(q), [pc(p)].concat(PAIRS.map(x => pc(x[1])), [pc(p / 2), pc(100 - q)]));
    return mk(Object.assign({ skill: 'o ile procent większa, o ile mniejsza',
      text: DOK + t`Liczba ${M('a')} jest o ${M(t`${p}\%`)} większa od dodatniej liczby ${M('b')}. Liczba ${M('b')} jest mniejsza od liczby ${M('a')} o`,
      hints: [t`Zapisz ${M(t`a = ${T(1 + p / 100)}\,b`)}. Teraz punktem odniesienia (${M(t`100\%`)}) jest ${M('a')}, a nie ${M('b')}.`, t`Policz, jaką częścią liczby ${M('a')} jest różnica ${M('a - b')}.`],
      steps: [M(t`a = b + ${T(p / 100)}\,b = ${T(1 + p / 100)}\,b`), M(t`\frac{a - b}{a} = \frac{${T(p / 100)}\,b}{${T(1 + p / 100)}\,b} = ${TF(p / (100 + p))} = ${T(q)}\%`)],
      answer: M(t`${T(q)}\%`), check: () => near((1 + p / 100 - 1) / (1 + p / 100) * 100, q) }, o));
  },
  function depositFormula() {
    const K = pick([1000, 2000, 5000]), m = pick([2, 4]), r = pick([4, 8, 12]), n = pick([2, 3]);
    const per = m === 2 ? 'co pół roku' : 'co kwartał', e = (q, w) => [t`${N(K)}\cdot\left(${T(q)}\right)^{${w}}`, K * Math.pow(q, w)];
    const o = opts(e(1 + r / 100 / m, m * n), [e(1 + r / 100, n), e(1 + r / 100, m * n), e(1 + r / 100 / m, n), e(1 + r / 100 / m, m)]);
    return mk(Object.assign({ skill: 'kapitalizacja częstsza niż raz w roku',
      text: DOK + t`Klient wpłacił ${M(N(K))} zł na lokatę z oprocentowaniem ${M(t`${r}\%`)} w skali roku. Odsetki są kapitalizowane ${per}. Kwota na lokacie po ${n} latach (bez podatku) jest równa`,
      hints: [t`Przy kapitalizacji ${per} w jednym okresie dopisuje się ${M(t`${r}\% : ${m} = ${T(r / m)}\%`)} odsetek.`, t`Policz liczbę okresów kapitalizacji w ciągu ${n} lat: ${M(t`${n}\cdot ${m}`)}.`],
      steps: [t`Oprocentowanie w jednym okresie: ${M(t`${r}\% : ${m} = ${T(r / m)}\%`)}, więc kwota mnoży się każdorazowo przez ${M(T(1 + r / 100 / m))}.`, t`Liczba okresów: ${M(t`${n}\cdot ${m} = ${n * m}`)}.`, M(t`K = ${N(K)}\cdot\left(${T(1 + r / 100 / m)}\right)^{${m * n}}`)],
      answer: M(e(1 + r / 100 / m, m * n)[0]), check: () => { let c = K; for (let i = 0; i < m * n; i++) c += c * (r / m) / 100; return near(c, K * Math.pow(1 + r / 100 / m, m * n)); } }, o));
  },
  function mixture() {
    const x = pick([1, 2, 3, 4, 6]), y = pick([1, 2, 3, 4, 6]), p = pick([2, 4, 5, 6, 8, 10, 12, 15, 20]), q = pick([2, 4, 5, 6, 8, 10, 12, 15, 20]); need(p !== q);
    const c = (x * p + y * q) / (x + y); need(isInt(10 * c));
    return mk({ skill: 'stężenie procentowe', pts: 2,
      text: t`Zmieszano ${M(x)} kg roztworu soli o stężeniu ${M(t`${p}\%`)} z ${M(y)} kg roztworu soli o stężeniu ${M(t`${q}\%`)}. Oblicz stężenie procentowe otrzymanego roztworu.`,
      fields: [F('Stężenie:', c, { unit: '%' })],
      hints: [t`Policz, ile kilogramów soli jest w każdym z roztworów: ${M(t`${T(p / 100)}\cdot ${x}`)} oraz ${M(t`${T(q / 100)}\cdot ${y}`)}.`, t`Stężenie to masa soli podzielona przez masę całego roztworu (${M(`${x} + ${y}`)} kg), razy ${M(t`100\%`)}.`],
      steps: [t`Sól: ${M(t`${T(p / 100)}\cdot ${x} + ${T(q / 100)}\cdot ${y} = ${T(x * p / 100)} + ${T(y * q / 100)} = ${T((x * p + y * q) / 100)}`)} kg.`, t`Masa roztworu: ${M(`${x} + ${y} = ${x + y}`)} kg.`, M(t`\frac{${T((x * p + y * q) / 100)}}{${x + y}}\cdot 100\% = ${T(c)}\%`)],
      answer: M(t`${T(c)}\%`), check: () => near((x * p / 100 + y * q / 100) / (x + y) * 100, c) });
  }
]
};

const GW = {
1: [
  function absCalc() {
    const a = -ri(2, 9), b = ri(1, 8), c = ri(2, 12), s = pick([1, -1]); need(b !== c);
    const val = Math.abs(a) + s * Math.abs(b - c);
    return mk({ skill: 'obliczanie wartości bezwzględnej',
      text: t`Oblicz ${M(t`|${a}| ${s > 0 ? '+' : '-'} |${b} - ${c}|`)}.`,
      fields: [F('Wynik:', val)],
      hints: [t`Wartość bezwzględna to odległość liczby od zera – nigdy nie jest ujemna.`, t`Najpierw policz to, co jest między kreskami: ${M(`${b} - ${c} = ${b - c}`)}.`],
      steps: [M(t`|${a}| = ${-a}`), M(t`|${b} - ${c}| = |${b - c}| = ${Math.abs(b - c)}`), M(t`${-a} ${s > 0 ? '+' : '-'} ${Math.abs(b - c)} = ${val}`)],
      answer: M(`${val}`), check: () => near((a < 0 ? -a : a) + s * (b - c < 0 ? c - b : b - c), val) });
  },
  function absEq() {
    const a = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), b = ri(1, 7);
    return mk({ skill: 'równanie z wartością bezwzględną', pts: 2,
      text: t`Rozwiąż równanie ${M(t`|x${pm(-a)}| = ${b}`)}.`,
      fields: [F('Mniejsze rozwiązanie:', a - b), F('Większe rozwiązanie:', a + b)],
      hints: [t`${M(t`|x${pm(-a)}|`)} to odległość liczby ${M('x')} od liczby ${M(a)} na osi liczbowej.`, t`Szukasz liczb oddalonych od ${M(a)} o ${M(b)}: idź o ${M(b)} w lewo i o ${M(b)} w prawo.`],
      steps: [t`${M(t`|x${pm(-a)}| = ${b}`)} oznacza ${M(t`x${pm(-a)} = ${b}`)} lub ${M(t`x${pm(-a)} = ${-b}`)}.`, M(t`x = ${a + b}\quad\text{lub}\quad x = ${a - b}`)],
      answer: M(t`x = ${a - b}\ \text{lub}\ x = ${a + b}`), check: () => [a - b, a + b].every(x => near(Math.abs(x - a), b)) });
  }
],
2: [
  function absEq2() {
    const k = pick([2, 3, 4]), a = pick([-7, -5, -3, -1, 1, 2, 3, 5, 7]), b = ri(1, 9), x1 = (-a - b) / k, x2 = (-a + b) / k;
    return mk({ skill: 'równanie |kx + a| = b', pts: 2,
      text: t`Rozwiąż równanie ${M(t`|${k}x${pm(a)}| = ${b}`)}.`,
      fields: [F('Mniejsze rozwiązanie:', x1), F('Większe rozwiązanie:', x2)],
      hints: [t`Wyrażenie między kreskami jest równe ${M(b)} albo ${M(-b)} – rozpisz dwa osobne równania.`, t`${M(t`${k}x${pm(a)} = ${b}`)} lub ${M(t`${k}x${pm(a)} = ${-b}`)}.`],
      steps: [M(t`${k}x${pm(a)} = ${b} \iff ${k}x = ${b - a} \iff x = ${TF(x2)}`), M(t`${k}x${pm(a)} = ${-b} \iff ${k}x = ${-b - a} \iff x = ${TF(x1)}`)],
      answer: M(t`x = ${TF(x1)}\ \text{lub}\ x = ${TF(x2)}`), check: () => x1 < x2 && [x1, x2].every(x => near(Math.abs(k * x + a), b)) });
  },
  function absGeom() {
    const a = pick([-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7]), b = ri(1, 9); need(Math.abs(a) !== b);
    const e = (c, r0) => t`|x${pm(-c)}| = ${r0}`;
    const o = opts(e(a, b), [e(-a, b), e(b, Math.abs(a)), e(-b, Math.abs(a))]);
    return mk(Object.assign({ skill: 'interpretacja geometryczna wartości bezwzględnej',
      text: DOK + t`Na osi liczbowej zaznaczono wszystkie liczby, których odległość od liczby ${M(a)} jest równa ${M(b)}. Liczby te są wszystkimi rozwiązaniami równania`,
      hints: [t`${M('|x - a|')} to odległość liczby ${M('x')} od liczby ${M('a')} na osi liczbowej.`, t`Odległość od liczby ${M(a)} zapisujemy jako ${M(t`|x - ${P(a)}|`)}. Uprość znak w środku.`],
      steps: [t`Odległość liczby ${M('x')} od liczby ${M(a)}: ${M(t`|x - ${P(a)}| = |x${pm(-a)}|`)}.`, t`Ta odległość ma być równa ${M(b)}: ${M(e(a, b))}.`, t`Sprawdzenie: rozwiązaniami są ${M(a - b)} i ${M(a + b)} – obie liczby leżą w odległości ${M(b)} od ${M(a)}.`],
      answer: M(e(a, b)), check: () => [a - b, a + b].every(x => near(Math.abs(x - a), b)) }, o));
  }
],
3: [
  function absSqrt() {
    const n = pick([2, 3, 5, 6, 7, 10, 11, 13, 15, 17, 19]), fl = Math.floor(Math.sqrt(n)), a = fl - ri(0, 1), b = fl + ri(1, 3), sq2 = t`\sqrt{${n}}`; need(a >= 1);
    const first = Math.random() < 0.5 ? t`|${sq2} - ${a}|` : t`|${a} - ${sq2}|`, second = Math.random() < 0.5 ? t`|${sq2} - ${b}|` : t`|${b} - ${sq2}|`;
    return mk({ skill: 'opuszczanie wartości bezwzględnej', pts: 2,
      text: t`Oblicz wartość wyrażenia ${M(`${first} + ${second}`)}.`,
      fields: [F('Wartość wyrażenia:', b - a)],
      hints: [t`Oszacuj pierwiastek: ${M(t`${fl} < ${sq2} < ${fl + 1}`)}, bo ${M(t`${fl * fl} < ${n} < ${(fl + 1) * (fl + 1)}`)}.`, t`Jeśli liczba między kreskami jest ujemna, opuszczając wartość bezwzględną zmień jej znak: ${M(t`|x| = -x`)} dla ${M('x < 0')}.`],
      steps: [t`${M(t`${sq2} > ${a}`)}, więc pierwszy składnik to ${M(t`${sq2} - ${a}`)}.`, t`${M(t`${sq2} < ${b}`)}, więc drugi składnik to ${M(t`${b} - ${sq2}`)}.`, M(t`${sq2} - ${a} + ${b} - ${sq2} = ${b - a}`)],
      answer: M(`${b - a}`), check: () => near(Math.abs(Math.sqrt(n) - a) + Math.abs(Math.sqrt(n) - b), b - a) });
  },
  function absScaled() {
    const k = pick([2, 3, 4, 5]), a = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), b = ri(1, 6), c = pick([-9, -7, -5, -3, -2, 2, 3, 4, 6, 8]), d = k * b + c;
    return mk({ skill: 'równanie z wartością bezwzględną – porządkowanie', pts: 2,
      text: t`Rozwiąż równanie ${M(t`${k}|x${pm(-a)}|${pm(c)} = ${d}`)}.`,
      fields: [F('Mniejsze rozwiązanie:', a - b), F('Większe rozwiązanie:', a + b)],
      hints: [t`Najpierw zostaw samą wartość bezwzględną po lewej stronie: przenieś ${M(c)} na prawą stronę i podziel przez ${M(k)}.`, t`Otrzymasz ${M(t`|x${pm(-a)}| = ${b}`)}, czyli liczby odległe od ${M(a)} o ${M(b)}.`],
      steps: [M(t`${k}|x${pm(-a)}| = ${d} ${c < 0 ? '+' : '-'} ${Math.abs(c)} = ${d - c}`), M(t`|x${pm(-a)}| = ${b}`), M(t`x${pm(-a)} = ${b}\quad\text{lub}\quad x${pm(-a)} = ${-b}`), M(t`x = ${a + b}\quad\text{lub}\quad x = ${a - b}`)],
      answer: M(t`x = ${a - b}\ \text{lub}\ x = ${a + b}`), check: () => [a - b, a + b].every(x => near(k * Math.abs(x - a) + c, d)) });
  },
  function absCountSol() {
    const kind = ri(0, 2), LAB = ['nie ma rozwiązań.', 'ma dokładnie jedno rozwiązanie.', 'ma dokładnie dwa rozwiązania.'];
    const a = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), c = pick([-8, -6, -5, -3, -2, 2, 3, 5, 7, 9]), r0 = kind === 0 ? -ri(1, 6) : kind === 1 ? 0 : ri(1, 6), d = r0 + c;
    const o = opts(LAB[kind], LAB.filter((x, i) => i !== kind), { n: 3, raw: true, keep: LAB });
    return mk(Object.assign({ skill: 'liczba rozwiązań równania z wartością bezwzględną',
      text: DOK + t`Równanie ${M(t`|x${pm(-a)}|${pm(c)} = ${d}`)}`,
      hints: [t`Zostaw samą wartość bezwzględną po lewej stronie: ${M(t`|x${pm(-a)}| = ${d} ${c < 0 ? '+' : '-'} ${Math.abs(c)}`)}.`, t`Wartość bezwzględna nigdy nie jest ujemna. Równanie ${M('|x - a| = r')} ma dwa rozwiązania dla ${M('r > 0')}, jedno dla ${M('r = 0')} i żadnego dla ${M('r < 0')}.`],
      steps: [M(t`|x${pm(-a)}| = ${d} ${c < 0 ? '+' : '-'} ${Math.abs(c)} = ${r0}`), r0 < 0 ? t`Wartość bezwzględna nie może być liczbą ujemną, więc równanie nie ma rozwiązań.` : r0 === 0 ? t`Odległość równa zero oznacza ${M(`x = ${a}`)} – jedno rozwiązanie.` : t`Odległość od ${M(a)} równa ${M(r0)}: ${M(`x = ${a - r0}`)} lub ${M(`x = ${a + r0}`)} – dwa rozwiązania.`],
      answer: 'Równanie ' + LAB[kind],
      check: () => { let n = 0; for (let x = -40; x <= 40; x += 0.5) if (near(Math.abs(x - a) + c, d)) n++; return n === kind; } }, o));
  }
]
};

const r = String.raw;
MATURA.dzial({
  id: 'liczby', store: 'liczby-matura-v1', title: 'Liczby rzeczywiste', seq: 'aⁿ · √ · log · %',
  lead: 'Potęgi, pierwiastki, logarytmy, procenty i wartość bezwzględna. To pierwsze zadania każdego arkusza – pewne punkty na rozgrzewkę.',
  topics: { P: 'Potęgi i pierwiastki', L: 'Logarytmy', C: 'Procenty', W: 'Wartość bezwzględna' },
  short: { W: 'Wartość bezwzgl.' },
  bank: { P: GP, L: GL, C: GC, W: GW },
  formulas: {
    P: [['działania na potęgach', r`\(a^m\cdot a^n = a^{m+n},\quad a^m : a^n = a^{m-n}\)<br>\((a^m)^n = a^{m\cdot n},\quad (ab)^n = a^n b^n\)`], ['wykładnik ujemny i zerowy', r`\(a^{-n} = \dfrac{1}{a^n},\quad a^0 = 1\)`], ['wykładnik wymierny', r`\(a^{\frac{1}{n}} = \sqrt[n]{a},\quad a^{\frac{m}{n}} = \sqrt[n]{a^m}\)`], ['pierwiastki', r`\(\sqrt{a\cdot b} = \sqrt a\cdot\sqrt b,\quad \sqrt{\dfrac ab} = \dfrac{\sqrt a}{\sqrt b}\)<br>uwaga: \(\sqrt{a + b} \neq \sqrt a + \sqrt b\)`], ['wzory skróconego mnożenia', r`\((a \pm b)^2 = a^2 \pm 2ab + b^2\)<br>\((a - b)(a + b) = a^2 - b^2\)`]],
    L: [['definicja', r`\(\log_a b = c \iff a^c = b\)<br>dla \(a > 0,\ a \neq 1,\ b > 0\)`], ['iloczyn i iloraz', r`\(\log_a (xy) = \log_a x + \log_a y\)<br>\(\log_a \dfrac xy = \log_a x - \log_a y\)`], ['potęga', r`\(\log_a x^n = n\cdot\log_a x\)`], ['warto pamiętać', r`\(\log_a 1 = 0,\quad \log_a a = 1\)<br>\(\log x\) oznacza \(\log_{10} x\)`]],
    C: [['procent liczby', r`\(p\%\) liczby \(x\) to \(\dfrac{p}{100}\cdot x\)`], ['podwyżka i obniżka', r`o \(p\%\) w górę: \(\left(1 + \tfrac{p}{100}\right)x\)<br>o \(p\%\) w dół: \(\left(1 - \tfrac{p}{100}\right)x\)`], ['procent składany', r`\(K_n = K\cdot\left(1 + \dfrac{p}{100}\right)^n\)<br>\(n\) – liczba okresów kapitalizacji, \(p\%\) – oprocentowanie w jednym okresie`], ['stężenie', r`\(\dfrac{\text{masa substancji}}{\text{masa roztworu}}\cdot 100\%\)`]],
    W: [['definicja', r`\(|x| = x\) dla \(x \geq 0\)<br>\(|x| = -x\) dla \(x < 0\)`], ['odległość na osi', r`\(|x - a|\) to odległość liczby \(x\) od liczby \(a\)`], ['równanie', r`\(|x - a| = r\) dla \(r > 0\): \(x = a - r\) lub \(x = a + r\)<br>dla \(r = 0\): jedno rozwiązanie \(x = a\)<br>dla \(r < 0\): brak rozwiązań`]]
  }
});
})();
