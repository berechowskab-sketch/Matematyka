/* Dział XII: Statystyka — średnia arytmetyczna i ważona, mediana, dominanta */
(function () {
const sum = a => a.reduce((x, y) => x + y, 0);
const srt = a => a.slice().sort((x, y) => x - y);
const med = a => { const s = srt(a), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const modes = a => { const c = {}; a.forEach(x => { c[x] = (c[x] || 0) + 1; }); const mx = Math.max(...Object.values(c)); return Object.keys(c).filter(k => c[k] === mx).map(Number); };
const lst = a => a.join(',\\ ');
const table = (h1, vals, h2, cnts) => `<div class="tablewrap"><table class="dt"><tr><th>${h1}</th>${vals.map(v => `<td>${v}</td>`).join('')}</tr><tr><th>${h2}</th>${cnts.map(v => `<td>${v}</td>`).join('')}</tr></table></div>`;
const expand = (vals, cnts) => [].concat(...vals.map((v, i) => Array(cnts[i]).fill(v)));
/* niezależne sprawdzenia własności */
const isMean = (a, m) => near(sum(a.map(x => x - m)), 0);
const isMedian = (a, m) => a.filter(x => x < m).length <= a.length / 2 && a.filter(x => x > m).length <= a.length / 2;
const isMode = (a, m) => { const f = v => a.filter(x => x === v).length; return a.every(v => v === m || f(v) < f(m)); };
function grades(n) { for (;;) { const c = [0, 0, 0, 0, 0, 0]; for (let i = 0; i < n; i++) c[pick([0, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5])]++; if (c.filter(x => x > 0).length >= 4) return c; } }
const CTX = ['Wzrost (w cm) pięciu zawodników', 'Liczby punktów zdobytych w kolejnych meczach', 'Czasy dojazdu do szkoły (w minutach)', 'Liczby książek przeczytanych przez uczniów', 'Wyniki kolejnych rzutów kostką'];

const GS = {
1: [
  function meanList() {
    const n = pick([4, 5, 5, 10]), base = ri(2, 30), a = Array.from({ length: n }, () => base + ri(0, 12)), m = sum(a) / n;
    return mk({ skill: 'średnia arytmetyczna',
      text: t`Oblicz średnią arytmetyczną zestawu liczb: ${M(lst(a))}.`,
      fields: [F('Średnia:', m)],
      hints: [t`Średnia arytmetyczna to suma wszystkich liczb podzielona przez ich liczbę.`, t`Liczb jest ${M(n)}, a ich suma to ${M(sum(a))}.`],
      steps: [M(t`${a.join(' + ')} = ${sum(a)}`), M(t`\bar{x} = \frac{${sum(a)}}{${n}} = ${T(m)}`)],
      answer: M(T(m)), check: () => isMean(a, m) });
  },
  function meanTable() {
    const n = pick([10, 20, 25]), c = grades(n), vals = [1, 2, 3, 4, 5, 6], tot = sum(vals.map((v, i) => v * c[i])), m = tot / n;
    return mk({ skill: 'średnia z tabeli liczebności', pts: 2,
      text: t`W tabeli przedstawiono oceny ze sprawdzianu w pewnej klasie.` + table('Ocena', vals, 'Liczba uczniów', c) + t`Oblicz średnią arytmetyczną ocen z tego sprawdzianu.`,
      fields: [F('Średnia ocen:', m)],
      hints: [t`Każdą ocenę pomnóż przez liczbę uczniów, którzy ją dostali, i dodaj wyniki – to suma wszystkich ocen.`, t`Sumę podziel przez liczbę wszystkich uczniów, czyli ${M(n)} (a nie przez ${M(6)}!).`],
      steps: [M(t`${vals.map((v, i) => `${v}\\cdot ${c[i]}`).join(' + ')} = ${tot}`), t`Liczba uczniów: ${M(`${c.join(' + ')} = ${n}`)}.`, M(t`\bar{x} = \frac{${tot}}{${n}} = ${T(m)}`)],
      answer: M(T(m)), check: () => isMean(expand(vals, c), m) && sum(c) === n });
  }
],
2: [
  function missing() {
    const n = pick([4, 5, 6]), m = ri(4, 20), a = Array.from({ length: n - 1 }, () => m + ri(-4, 5)), x = m * n - sum(a); need(x > 0 && x !== m);
    const pos = ri(0, n - 1), shown = a.slice(0, pos).concat(['x'], a.slice(pos));
    return mk({ skill: 'brakująca liczba przy danej średniej', pts: 2,
      text: t`Średnia arytmetyczna zestawu liczb ${M(lst(shown))} jest równa ${M(m)}. Wyznacz ${M('x')}.`,
      fields: [F(M('x ='), x)],
      hints: [t`Skoro średnia ${M(n)} liczb jest równa ${M(m)}, to ich suma musi być równa ${M(t`${n}\cdot ${m} = ${n * m}`)}.`, t`Suma znanych liczb to ${M(sum(a))}. Resztę do ${M(n * m)} stanowi ${M('x')}.`],
      steps: [M(t`\frac{${shown.join(' + ')}}{${n}} = ${m}`), M(t`${sum(a)} + x = ${n * m}`), M(`x = ${x}`)],
      answer: M(`x = ${x}`), check: () => isMean(a.concat([x]), m) });
  },
  function weighted() {
    const items = [['sprawdzian', pick([3, 4, 5])], ['kartkówka', 2], ['odpowiedź ustna', pick([1, 2])], ['praca domowa', 1]].slice(0, pick([3, 4])), g = items.map(() => ri(2, 6)), w = items.map(x => x[1]), num = sum(g.map((v, i) => v * w[i])), den = sum(w), m = num / den; need(isInt(m * 100) && new Set(g).size > 1 && new Set(w).size > 1);
    return mk({ skill: 'średnia ważona', pts: 2,
      text: t`Ocena końcowa z matematyki jest średnią ważoną ocen cząstkowych. Uczeń otrzymał oceny:` + table('Forma', items.map(x => x[0]), 'Ocena', g) + table('Forma', items.map(x => x[0]), 'Waga', w) + t`Oblicz średnią ważoną ocen tego ucznia.`,
      fields: [F('Średnia ważona:', m)],
      hints: [t`W średniej ważonej każdą ocenę mnożymy przez jej wagę, a sumę tych iloczynów dzielimy przez <b>sumę wag</b>.`, t`Suma wag: ${M(`${w.join(' + ')} = ${den}`)}.`],
      steps: [M(t`\bar{x}_w = \frac{${g.map((v, i) => `${v}\\cdot ${w[i]}`).join(' + ')}}{${w.join(' + ')}}`), M(t`= \frac{${num}}{${den}} = ${T(m)}`)],
      answer: M(T(m)), check: () => isMean(expand(g, w), m) });
  }
],
3: [
  function addElement() {
    const n = pick([4, 5, 6, 8, 9]), m = ri(5, 20), m2 = m + pick([-2, -1, 1, 2, 3]), x = m2 * (n + 1) - m * n; need(x > 0);
    return mk({ skill: 'średnia po dopisaniu liczby', pts: 2,
      text: t`Średnia arytmetyczna ${M(n)} liczb jest równa ${M(m)}. Do tego zestawu dopisano jedną liczbę ${M('x')} i średnia arytmetyczna wszystkich ${M(n + 1)} liczb jest równa ${M(m2)}. Wyznacz ${M('x')}.`,
      fields: [F(M('x ='), x)],
      hints: [t`Nie znasz liczb, ale znasz ich sumę: ${M(t`${n}\cdot ${m} = ${n * m}`)}.`, t`Po dopisaniu ${M('x')} suma ${M(n + 1)} liczb jest równa ${M(t`${n + 1}\cdot ${m2} = ${(n + 1) * m2}`)}. Różnica tych sum to ${M('x')}.`],
      steps: [t`Suma początkowych liczb: ${M(t`${n}\cdot ${m} = ${n * m}`)}.`, t`Suma po dopisaniu: ${M(t`${n + 1}\cdot ${m2} = ${(n + 1) * m2}`)}.`, M(`x = ${(n + 1) * m2} - ${n * m} = ${x}`)],
      answer: M(`x = ${x}`), check: () => isMean(Array(n).fill(m).concat([x]), m2) });
  },
  function twoGroups() {
    const n1 = pick([10, 12, 15, 20]), n2 = pick([10, 15, 20, 25, 30]), m1 = pick([3, 3.5, 4, 4.5, 60, 65, 70]), m2 = m1 + (m1 < 10 ? pick([-1, -0.5, 0.5, 1]) : pick([-10, -5, 5, 10])), m = (n1 * m1 + n2 * m2) / (n1 + n2); need(n1 !== n2 && isInt(m * 100));
    const what = m1 < 10 ? 'średnia ocen' : 'średni wynik (w punktach)';
    return mk({ skill: 'średnia dwóch grup', pts: 2,
      text: t`W klasie A jest ${M(n1)} uczniów i ${what} ze sprawdzianu wynosi ${M(T(m1))}. W klasie B jest ${M(n2)} uczniów i ${what} wynosi ${M(T(m2))}. Oblicz ${m1 < 10 ? 'średnią ocen' : 'średni wynik'} wszystkich uczniów obu klas razem.`,
      fields: [F('Średnia łączna:', m)],
      hints: [t`Nie wolno po prostu uśrednić dwóch średnich – klasy mają różną liczbę uczniów.`, t`Policz sumę wyników w każdej klasie (${M(t`${n1}\cdot ${T(m1)}`)} oraz ${M(t`${n2}\cdot ${T(m2)}`)}), dodaj i podziel przez ${M(n1 + n2)}.`],
      steps: [t`Suma w klasie A: ${M(t`${n1}\cdot ${T(m1)} = ${T(n1 * m1)}`)}, w klasie B: ${M(t`${n2}\cdot ${T(m2)} = ${T(n2 * m2)}`)}.`, M(t`\bar{x} = \frac{${T(n1 * m1)} + ${T(n2 * m2)}}{${n1} + ${n2}} = \frac{${T(n1 * m1 + n2 * m2)}}{${n1 + n2}} = ${T(m)}`)],
      answer: M(T(m)), check: () => isMean(Array(n1).fill(m1).concat(Array(n2).fill(m2)), m) });
  }
]
};

const GM = {
1: [
  function medianOdd() {
    const n = pick([5, 7, 9]), a = Array.from({ length: n }, () => ri(1, 20)), m = med(a); need(a.join() !== srt(a).join());
    return mk({ skill: 'mediana nieparzystej liczby danych',
      text: t`Wyznacz medianę zestawu liczb: ${M(lst(a))}.`,
      fields: [F('Mediana:', m)],
      hints: [t`Najpierw uporządkuj liczby od najmniejszej do największej. Bez tego wynik będzie błędny.`, t`Liczb jest ${M(n)} (nieparzyście wiele), więc mediana to liczba stojąca dokładnie pośrodku – na miejscu ${M((n + 1) / 2)}.`],
      steps: [t`Po uporządkowaniu: ${M(lst(srt(a)))}.`, t`Środkowa, czyli ${M((n + 1) / 2)}. liczba to ${M(m)}.`],
      answer: M(`${m}`), check: () => isMedian(a, m) && a.includes(m) });
  },
  function mode() {
    const n = pick([7, 8, 9, 10]), a = Array.from({ length: n }, () => ri(1, 8)), mo = modes(a); need(mo.length === 1 && a.filter(x => x === mo[0]).length >= 3);
    return mk({ skill: 'dominanta',
      text: t`Wyznacz dominantę zestawu liczb: ${M(lst(a))}.`,
      fields: [F('Dominanta:', mo[0])],
      hints: [t`Dominanta (moda) to wartość, która występuje w zestawie najczęściej.`, t`Policz, ile razy występuje każda liczba. Odpowiedzią jest sama liczba, a nie to, ile razy wystąpiła.`],
      steps: [t`Po uporządkowaniu: ${M(lst(srt(a)))}.`, t`Najczęściej, bo ${M(a.filter(x => x === mo[0]).length)} razy, występuje liczba ${M(mo[0])}.`],
      answer: M(`${mo[0]}`), check: () => isMode(a, mo[0]) });
  }
],
2: [
  function medianEven() {
    const n = pick([6, 8, 10]), a = Array.from({ length: n }, () => ri(1, 20)), s = srt(a), m = med(a); need(a.join() !== s.join() && s[n / 2 - 1] !== s[n / 2]);
    return mk({ skill: 'mediana parzystej liczby danych', pts: 1,
      text: t`Wyznacz medianę zestawu liczb: ${M(lst(a))}.`,
      fields: [F('Mediana:', m)],
      hints: [t`Uporządkuj liczby rosnąco. Jest ich ${M(n)}, czyli parzyście wiele – nie ma jednej liczby środkowej.`, t`Mediana to średnia arytmetyczna dwóch środkowych liczb: ${M(n / 2)}. i ${M(n / 2 + 1)}.`],
      steps: [t`Po uporządkowaniu: ${M(lst(s))}.`, t`Dwie środkowe liczby: ${M(s[n / 2 - 1])} i ${M(s[n / 2])}.`, M(t`\frac{${s[n / 2 - 1]} + ${s[n / 2]}}{2} = ${T(m)}`)],
      answer: M(T(m)), check: () => isMedian(a, m) });
  },
  function tableMedMode() {
    const n = pick([15, 20, 21, 25]), c = grades(n), vals = [1, 2, 3, 4, 5, 6], data = expand(vals, c), mo = modes(data), m = med(data); need(mo.length === 1);
    const cum = c.map((x, i) => sum(c.slice(0, i + 1)));
    return mk({ skill: 'mediana i dominanta z tabeli', pts: 2,
      text: t`W tabeli przedstawiono oceny ze sprawdzianu w pewnej klasie.` + table('Ocena', vals, 'Liczba uczniów', c) + t`Wyznacz medianę i dominantę ocen.`,
      fields: [F('Mediana:', m), F('Dominanta:', mo[0])],
      hints: [t`Dominanta to ocena, którą dostało najwięcej uczniów – szukaj największej liczby w dolnym wierszu tabeli.`, n % 2 ? t`Uczniów jest ${M(n)}, więc mediana to ocena ${M((n + 1) / 2)}. ucznia w kolejności od najsłabszej do najlepszej. Dodawaj liczebności, aż przekroczysz ten numer.` : t`Uczniów jest ${M(n)}, więc mediana to średnia ocen ${M(n / 2)}. i ${M(n / 2 + 1)}. ucznia w kolejności od najsłabszej do najlepszej. Dodawaj liczebności, aż dojdziesz do tych numerów.`],
      steps: [t`Dominanta: najwięcej uczniów (${M(Math.max(...c))}) otrzymało ocenę ${M(mo[0])}.`, t`Liczebności narastająco: ${M(lst(cum))}.`, n % 2 ? t`Środkowy jest ${M((n + 1) / 2)}. uczeń – ma ocenę ${M(m)}.` : t`Uczniowie ${M(n / 2)}. i ${M(n / 2 + 1)}. mają oceny ${M(data[n / 2 - 1])} i ${M(data[n / 2])}, więc mediana to ${M(T(m))}.`],
      answer: M(t`\text{mediana: } ${T(m)},\quad \text{dominanta: } ${mo[0]}`), check: () => isMedian(data, m) && isMode(data, mo[0]) && data.length === n });
  }
],
3: [
  function medianUnknown() {
    const b = ri(2, 12), a = b - ri(0, 3), x = b + ri(0, 4), c = x + ri(1, 5), d = c + ri(0, 4), e = d + ri(1, 5), m = (x + c) / 2; need(a >= 1);
    return mk({ skill: 'mediana z niewiadomą', pts: 2,
      text: t`Zestaw sześciu liczb ${M(t`${a},\ ${b},\ x,\ ${c},\ ${d},\ ${e}`)} jest uporządkowany niemalejąco, a jego mediana jest równa ${M(T(m))}. Wyznacz ${M('x')}.`,
      fields: [F(M('x ='), x)],
      hints: [t`Liczb jest sześć, więc mediana to średnia arytmetyczna trzeciej i czwartej liczby.`, t`Trzecia liczba to ${M('x')}, czwarta to ${M(c)}: ${M(t`\dfrac{x + ${c}}{2} = ${T(m)}`)}.`],
      steps: [M(t`\frac{x + ${c}}{2} = ${T(m)} \iff x + ${c} = ${T(2 * m)}`), M(`x = ${x}`), t`Sprawdzenie porządku: ${M(t`${b} \leq ${x} \leq ${c}`)} – zgadza się.`],
      answer: M(`x = ${x}`), check: () => isMedian([a, b, x, c, d, e], m) && b <= x && x <= c });
  },
  function statPF() {
    const n = pick([5, 7]), a = Array.from({ length: n }, () => ri(1, 9)), mo = modes(a), m = med(a), mean = sum(a) / n, tr = () => Math.random() < 0.5; need(mo.length === 1 && !near(mean, m));
    const makers = [
      () => { const v = tr(), k = v ? m : pick([a[(n - 1) / 2], m + 1, m - 1].filter(z => z !== m)); return { s: t`Mediana tego zestawu jest równa ${M(k)}.`, v: k === m, why: t`Po uporządkowaniu (${M(lst(srt(a)))}) środkową liczbą jest ${M(m)}.`, chk: () => isMedian(a, k) === (k === m) }; },
      () => { const v = tr(), k = v ? mo[0] : pick(a.filter(z => z !== mo[0]).concat([Math.max(...a) === mo[0] ? mo[0] + 1 : Math.max(...a)]).filter(z => z !== mo[0])); return { s: t`Dominanta tego zestawu jest równa ${M(k)}.`, v: k === mo[0], why: t`Najczęściej występuje liczba ${M(mo[0])}.`, chk: () => isMode(a, k) === (k === mo[0]) }; },
      () => { const gt = tr(); return { s: t`Średnia arytmetyczna tego zestawu jest ${gt ? 'większa' : 'mniejsza'} od mediany.`, v: gt ? mean > m : mean < m, why: t`Średnia: ${M(t`\frac{${sum(a)}}{${n}} \approx ${T(+mean.toFixed(2))}`)}, mediana: ${M(m)}.`, chk: () => (gt ? sum(a) > m * n : sum(a) < m * n) === (gt ? mean > m : mean < m) }; }
    ];
    const st = shuffle(makers).slice(0, 2).map(f => f());
    return mk({ skill: 'średnia, mediana i dominanta',
      text: PF + t`Dany jest zestaw liczb: ${M(lst(a))}.`,
      tf: st.map(x => ({ s: x.s, v: x.v })),
      hints: [t`Zacznij od uporządkowania liczb rosnąco – przyda się i do mediany, i do dominanty.`, t`Mediana to liczba środkowa, dominanta – najczęstsza, średnia – suma podzielona przez liczbę danych.`],
      steps: st.map((x, i) => t`Zdanie ${i + 1}: ${x.why} Zdanie jest ${x.v ? 'prawdziwe (P)' : 'fałszywe (F)'}.`),
      answer: st.map(x => (x.v ? 'P' : 'F')).join(', '), check: () => st.every(x => x.chk()) });
  }
]
};

const r = String.raw;
MATURA.dzial({
  id: 'statystyka', store: 'statystyka-matura-v1', title: 'Statystyka', seq: 'x̄ · mediana · dominanta',
  lead: 'Średnia arytmetyczna i ważona, mediana i dominanta – także dla danych podanych w tabeli.',
  topics: { S: 'Średnia arytmetyczna i ważona', M: 'Mediana i dominanta' },
  short: { S: 'Średnia', M: 'Mediana i dominanta' },
  bank: { S: GS, M: GM },
  formulas: {
    S: [['średnia arytmetyczna', r`\(\bar{x} = \dfrac{x_1 + x_2 + \ldots + x_n}{n}\)`], ['suma z średniej', r`suma liczb \(= n\cdot\bar{x}\)<br>przydaje się, gdy brakuje jednej liczby`], ['średnia ważona', r`\(\bar{x}_w = \dfrac{w_1x_1 + w_2x_2 + \ldots + w_nx_n}{w_1 + w_2 + \ldots + w_n}\)`], ['dane w tabeli', r`liczebność działa jak waga: wartość \(\cdot\) liczebność, a dzielimy przez liczbę wszystkich danych`]],
    M: [['mediana', r`liczba środkowa w zestawie <b>uporządkowanym</b><br>nieparzysta liczba danych: wyraz środkowy<br>parzysta: średnia dwóch środkowych`], ['dominanta', r`wartość występująca najczęściej`], ['dane w tabeli', r`dodawaj liczebności po kolei, aż dojdziesz do środkowego numeru`]]
  }
});
})();
