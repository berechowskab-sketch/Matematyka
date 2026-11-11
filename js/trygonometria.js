/* Dział VII: Trygonometria — trójkąt prostokątny, tożsamości, kąty rozwarte i zastosowania */
(function () {
const nz = (a, b) => { let v; do { v = ri(a, b); } while (v === 0); return v; };
const dg = a => t`${a}^\circ`;
const TG = t`\operatorname{tg}`;
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25], [9, 12, 15], [20, 21, 29]];
const rad = a => a * Math.PI / 180;
/* √m = s√n */
const simp = m => { let s = 1; for (let k = 2; k * k <= m; k++) while (m % (k * k) === 0) { s *= k; m /= k * k; } return [s, m]; };
/* trójkąt prostokątny: kąt prosty w C (lewy dół), kąt ostry przy B (prawy dół) */
function rtFig(o) {
  const lab = (x, y, s, anc) => (s === undefined || s === '' ? '' : `<text class="pl" x="${x}" y="${y}" text-anchor="${anc || 'middle'}">${s}</text>`);
  return `<p class="cap">Rysunek pomocniczy (bez zachowania skali)</p><svg class="plot" viewBox="0 0 320 200" style="max-width:340px" role="img" aria-label="Trójkąt prostokątny ABC z kątem prostym przy wierzchołku C"><polygon class="cv" points="50,165 270,165 50,45"/><path class="ds" d="M50 149h16v16" style="stroke-dasharray:none;fill:none"/>` +
    (o.ang ? `<path class="ds" d="M234 165a36 36 0 0 1 4.4 -17.3" style="stroke-dasharray:none;fill:none"/>` : '') +
    lab(40, 180, 'C', 'end') + lab(280, 180, 'B', 'start') + lab(40, 42, 'A', 'end') + lab(38, 110, o.v, 'end') + lab(160, 187, o.h) + lab(172, 96, o.c, 'start') + lab(214, 158, o.ang, 'end') + '</svg>';
}
const WHO = { sin: ['przyprostokątna naprzeciw kąta', 'przeciwprostokątna'], cos: ['przyprostokątna przy kącie', 'przeciwprostokątna'], tg: ['przyprostokątna naprzeciw kąta', 'przyprostokątna przy kącie'] };
const FN = { sin: t`\sin`, cos: t`\cos`, tg: TG };

const GP = {
1: [
  function defRatio() {
    let [a, b, c] = pick(TRIPLES); if (Math.random() < 0.5) [a, b] = [b, a];
    const fn = pick(['sin', 'cos', 'tg']), [n, d] = fn === 'sin' ? [a, c] : fn === 'cos' ? [b, c] : [a, b], val = n / d;
    return mk({ skill: 'definicje funkcji trygonometrycznych', fig: rtFig({ v: a, h: b, c, ang: 'α' }),
      text: t`W trójkącie prostokątnym ${M('ABC')} kąt przy wierzchołku ${M('C')} jest prosty, ${M(`|AC| = ${a}`)}, ${M(`|BC| = ${b}`)}, ${M(`|AB| = ${c}`)}. Kąt ${M(t`\alpha`)} leży przy wierzchołku ${M('B')}. Oblicz ${M(t`${FN[fn]}\alpha`)}. Wynik podaj jako ułamek nieskracalny.`,
      fields: [F(M(t`${FN[fn]}\alpha =`), val)],
      hints: [t`${fn === 'sin' ? 'Sinus' : fn === 'cos' ? 'Cosinus' : 'Tangens'} kąta ostrego to iloraz: ${WHO[fn][0]} przez ${fn === 'tg' ? 'przyprostokątną przy kącie' : 'przeciwprostokątną'}.`, t`Naprzeciw kąta ${M(t`\alpha`)} leży bok ${M('AC')}, przy kącie – bok ${M('BC')}, a przeciwprostokątna to ${M('AB')}.`],
      steps: [M(t`${FN[fn]}\alpha = \frac{${fn === 'cos' ? '|BC|' : '|AC|'}}{${fn === 'tg' ? '|BC|' : '|AB|'}} = \frac{${n}}{${d}}${gcd(n, d) > 1 ? ` = ${TF(val)}` : ''}`)],
      answer: M(TF(val)), check: () => { const al = Math.atan2(a, b); return near(Math[fn === 'tg' ? 'tan' : fn](al), val) && a * a + b * b === c * c; } });
  },
  function specialSide() {
    const ang = pick([30, 45, 60]), c = 2 * ri(2, 9), ans = ang === 30 ? c / 2 : R(c / 2, ang === 45 ? 2 : 3), sv = ang === 30 ? t`\frac12` : ang === 45 ? t`\frac{\sqrt2}{2}` : t`\frac{\sqrt3}{2}`;
    return mk({ skill: 'trójkąt prostokątny o kątach 30°, 45°, 60°', fig: rtFig({ v: 'x', c, ang: ang + '°' }),
      text: t`W trójkącie prostokątnym ${M('ABC')} kąt przy wierzchołku ${M('C')} jest prosty, kąt przy wierzchołku ${M('B')} ma miarę ${M(dg(ang))}, a przeciwprostokątna ${M('AB')} ma długość ${M(c)}. Oblicz długość boku ${M('AC')}.`,
      fields: [F(M('|AC| ='), ans)],
      hints: [t`Bok ${M('AC')} leży naprzeciw kąta ${M(dg(ang))}, a znasz przeciwprostokątną – to pasuje do sinusa.`, t`${M(t`\sin ${dg(ang)} = ${sv}`)}, więc ${M(t`\frac{|AC|}{${c}} = ${sv}`)}.`],
      steps: [M(t`\sin ${dg(ang)} = \frac{|AC|}{|AB|} = \frac{|AC|}{${c}}`), M(t`|AC| = ${c}\cdot ${sv} = ${rt(ans)}`)],
      answer: M(rt(ans)), check: () => near(c * Math.sin(rad(ang)), rv(ans)) });
  }
],
2: [
  function shadow() {
    const ang = pick([30, 45, 60]), d = ang === 30 ? 3 * ri(2, 9) : ri(4, 20), ans = ang === 45 ? d : ang === 60 ? R(d, 3) : R(d / 3, 3), tv = ang === 45 ? '1' : ang === 60 ? t`\sqrt3` : t`\frac{\sqrt3}{3}`;
    return mk({ skill: 'tangens w zadaniu praktycznym', fig: rtFig({ v: 'h', h: d + ' m', ang: ang + '°' }),
      text: t`Pionowy maszt rzuca na poziomy plac cień długości ${M(d)} m. Promienie słoneczne padają pod kątem ${M(dg(ang))} do powierzchni placu. Oblicz wysokość ${M('h')} masztu (w metrach).`,
      fields: [F(M('h ='), ans, { unit: 'm' })],
      hints: [t`Maszt i cień to przyprostokątne trójkąta prostokątnego. Funkcja, która łączy dwie przyprostokątne, to tangens.`, t`${M(t`${TG}${dg(ang)} = \frac{h}{${d}}`)}, a ${M(t`${TG}${dg(ang)} = ${tv}`)}.`],
      steps: [M(t`${TG}${dg(ang)} = \frac{h}{${d}}`), M(t`h = ${d}\cdot ${tv} = ${rt(ans)}`)],
      answer: M(rt(ans)) + ' m', check: () => near(d * Math.tan(rad(ang)), rv(ans)) });
  },
  function hypFromLeg() {
    const ang = pick([30, 45, 60]), a = ang === 60 ? 3 * ri(1, 6) : ri(2, 12), ans = ang === 30 ? 2 * a : ang === 45 ? R(a, 2) : R(2 * a / 3, 3), sv = ang === 30 ? t`\frac12` : ang === 45 ? t`\frac{\sqrt2}{2}` : t`\frac{\sqrt3}{2}`;
    return mk({ skill: 'przeciwprostokątna z sinusa', fig: rtFig({ v: a, c: 'c', ang: ang + '°' }),
      text: t`W trójkącie prostokątnym ${M('ABC')} kąt przy wierzchołku ${M('C')} jest prosty, kąt przy wierzchołku ${M('B')} ma miarę ${M(dg(ang))}, a bok ${M('AC')} ma długość ${M(a)}. Oblicz długość ${M('c')} przeciwprostokątnej ${M('AB')}.`,
      fields: [F(M('c ='), ans)],
      hints: [t`Znasz bok naprzeciw kąta ${M(dg(ang))} i szukasz przeciwprostokątnej: ${M(t`\sin ${dg(ang)} = \frac{${a}}{c}`)}.`, t`${M(t`\sin ${dg(ang)} = ${sv}`)}. Wylicz ${M('c')}${ang !== 30 ? ' i usuń niewymierność z mianownika' : ''}.`],
      steps: [M(t`\frac{${a}}{c} = ${sv}`), M(ang === 30 ? `c = 2\\cdot ${a} = ${2 * a}` : ang === 45 ? t`c = \frac{2\cdot ${a}}{\sqrt2} = \frac{${2 * a}\sqrt2}{2} = ${rt(ans)}` : t`c = \frac{2\cdot ${a}}{\sqrt3} = \frac{${2 * a}\sqrt3}{3} = ${rt(ans)}`)],
      answer: M(rt(ans)), check: () => near(a / Math.sin(rad(ang)), rv(ans)) });
  }
],
3: [
  function areaFromAngle() {
    const is30 = Math.random() < 0.6, c = 4 * ri(1, 5), ans = is30 ? R(c * c / 8, 3) : c * c / 4;
    return mk({ skill: 'pole trójkąta prostokątnego z kąta', pts: 2, fig: rtFig({ c, ang: is30 ? '30°' : '45°' }),
      text: t`W trójkącie prostokątnym ${M('ABC')} kąt przy wierzchołku ${M('C')} jest prosty, kąt przy wierzchołku ${M('B')} ma miarę ${M(dg(is30 ? 30 : 45))}, a przeciwprostokątna ma długość ${M(c)}. Oblicz pole tego trójkąta.`,
      fields: [F(M('P ='), ans)],
      hints: [t`Pole trójkąta prostokątnego to połowa iloczynu przyprostokątnych. Wyznacz je z sinusa i cosinusa kąta ${M(dg(is30 ? 30 : 45))}.`, is30 ? t`${M(t`|AC| = ${c}\cdot\sin 30^\circ = ${c / 2}`)}, ${M(t`|BC| = ${c}\cdot\cos 30^\circ = ${rt(R(c / 2, 3))}`)}.` : t`Obie przyprostokątne są równe ${M(t`${c}\cdot\frac{\sqrt2}{2} = ${rt(R(c / 2, 2))}`)}.`],
      steps: is30 ? [M(t`|AC| = ${c}\cdot\tfrac12 = ${c / 2},\qquad |BC| = ${c}\cdot\tfrac{\sqrt3}{2} = ${rt(R(c / 2, 3))}`), M(t`P = \tfrac12\cdot ${c / 2}\cdot ${rt(R(c / 2, 3))} = ${rt(ans)}`)] : [M(t`|AC| = |BC| = ${c}\cdot\tfrac{\sqrt2}{2} = ${rt(R(c / 2, 2))}`), M(t`P = \tfrac12\cdot ${rt(R(c / 2, 2))}\cdot ${rt(R(c / 2, 2))} = \tfrac12\cdot ${c * c / 2} = ${c * c / 4}`)],
      answer: M(rt(ans)), check: () => { const al = rad(is30 ? 30 : 45); return near(0.5 * c * Math.sin(al) * c * Math.cos(al), rv(ans)); } });
  },
  function ladder() {
    const l = 2 * ri(2, 6), ang = pick([60, 30]), hi = ang === 60 ? R(l / 2, 3) : l / 2, di = ang === 60 ? l / 2 : R(l / 2, 3);
    return mk({ skill: 'sinus i cosinus w zadaniu praktycznym', pts: 2, fig: rtFig({ v: 'h', h: 'd', c: l + ' m', ang: ang + '°' }),
      text: t`Drabina długości ${M(l)} m jest oparta o pionową ścianę i tworzy z poziomym podłożem kąt ${M(dg(ang))}. Oblicz, na jaką wysokość ${M('h')} sięga drabina oraz w jakiej odległości ${M('d')} od ściany stoi jej dolny koniec.`,
      fields: [F(M('h ='), hi, { unit: 'm' }), F(M('d ='), di, { unit: 'm' })],
      hints: [t`Drabina to przeciwprostokątna. Wysokość leży naprzeciw kąta ${M(dg(ang))} (sinus), odległość od ściany – przy tym kącie (cosinus).`, t`${M(t`h = ${l}\cdot\sin ${dg(ang)}`)}, ${M(t`d = ${l}\cdot\cos ${dg(ang)}`)}.`],
      steps: [M(t`h = ${l}\cdot\sin ${dg(ang)} = ${l}\cdot ${ang === 60 ? t`\tfrac{\sqrt3}{2}` : t`\tfrac12`} = ${rt(hi)}`), M(t`d = ${l}\cdot\cos ${dg(ang)} = ${l}\cdot ${ang === 60 ? t`\tfrac12` : t`\tfrac{\sqrt3}{2}`} = ${rt(di)}`)],
      answer: M(t`h = ${rt(hi)}\ \text{m},\quad d = ${rt(di)}\ \text{m}`), check: () => near(l * Math.sin(rad(ang)), rv(hi)) && near(l * Math.cos(rad(ang)), rv(di)) });
  }
]
};

const ATOMS = [[t`\sin 30^\circ`, 0.5, t`\sin 30^\circ = \tfrac12`], [t`\cos 60^\circ`, 0.5, t`\cos 60^\circ = \tfrac12`], [t`${TG}45^\circ`, 1, t`${TG}45^\circ = 1`], [t`\sin^2 60^\circ`, 0.75, t`\sin^2 60^\circ = \left(\tfrac{\sqrt3}{2}\right)^2 = \tfrac34`], [t`\cos^2 30^\circ`, 0.75, t`\cos^2 30^\circ = \left(\tfrac{\sqrt3}{2}\right)^2 = \tfrac34`], [t`\sin^2 45^\circ`, 0.5, t`\sin^2 45^\circ = \left(\tfrac{\sqrt2}{2}\right)^2 = \tfrac12`], [t`${TG}^2 60^\circ`, 3, t`${TG}^2 60^\circ = \left(\sqrt3\right)^2 = 3`], [t`${TG}^2 30^\circ`, 1 / 3, t`${TG}^2 30^\circ = \left(\tfrac{\sqrt3}{3}\right)^2 = \tfrac13`], [t`\cos^2 45^\circ`, 0.5, t`\cos^2 45^\circ = \left(\tfrac{\sqrt2}{2}\right)^2 = \tfrac12`]];
const IDS = [
  [t`(\sin\alpha + \cos\alpha)^2 - 2\sin\alpha\cos\alpha`, a => Math.pow(Math.sin(a) + Math.cos(a), 2) - 2 * Math.sin(a) * Math.cos(a), '1', [t`(\sin\alpha + \cos\alpha)^2 = \sin^2\alpha + 2\sin\alpha\cos\alpha + \cos^2\alpha`, t`\sin^2\alpha + \cos^2\alpha + 2\sin\alpha\cos\alpha - 2\sin\alpha\cos\alpha = 1`]],
  [t`(1 - \cos\alpha)(1 + \cos\alpha)`, a => (1 - Math.cos(a)) * (1 + Math.cos(a)), t`\sin^2\alpha`, [t`(1 - \cos\alpha)(1 + \cos\alpha) = 1 - \cos^2\alpha`, t`1 - \cos^2\alpha = \sin^2\alpha`]],
  [t`(1 - \sin\alpha)(1 + \sin\alpha)`, a => (1 - Math.sin(a)) * (1 + Math.sin(a)), t`\cos^2\alpha`, [t`(1 - \sin\alpha)(1 + \sin\alpha) = 1 - \sin^2\alpha`, t`1 - \sin^2\alpha = \cos^2\alpha`]],
  [t`${TG}\alpha\cdot\cos\alpha`, a => Math.tan(a) * Math.cos(a), t`\sin\alpha`, [t`${TG}\alpha\cdot\cos\alpha = \frac{\sin\alpha}{\cos\alpha}\cdot\cos\alpha`, t`= \sin\alpha`]],
  [t`\sin\alpha\cdot\cos\alpha\cdot${TG}\alpha`, a => Math.sin(a) * Math.cos(a) * Math.tan(a), t`\sin^2\alpha`, [t`\sin\alpha\cdot\cos\alpha\cdot\frac{\sin\alpha}{\cos\alpha}`, t`= \sin^2\alpha`]],
  [t`(\sin\alpha - \cos\alpha)^2 + 2\sin\alpha\cos\alpha`, a => Math.pow(Math.sin(a) - Math.cos(a), 2) + 2 * Math.sin(a) * Math.cos(a), '1', [t`(\sin\alpha - \cos\alpha)^2 = \sin^2\alpha - 2\sin\alpha\cos\alpha + \cos^2\alpha`, t`\sin^2\alpha + \cos^2\alpha - 2\sin\alpha\cos\alpha + 2\sin\alpha\cos\alpha = 1`]],
  [t`\cos^2\alpha\cdot${TG}^2\alpha + \cos^2\alpha`, a => Math.pow(Math.cos(a) * Math.tan(a), 2) + Math.pow(Math.cos(a), 2), '1', [t`\cos^2\alpha\cdot\frac{\sin^2\alpha}{\cos^2\alpha} + \cos^2\alpha = \sin^2\alpha + \cos^2\alpha`, t`= 1`]]
];
const A0 = 0.7;
const IDOPT = [['1', 1], [t`\sin^2\alpha`, Math.pow(Math.sin(A0), 2)], [t`\cos^2\alpha`, Math.pow(Math.cos(A0), 2)], [t`\sin\alpha`, Math.sin(A0)], [t`\cos\alpha`, Math.cos(A0)], ['0', 0], ['2', 2], [t`${TG}\alpha`, Math.tan(A0)]];

const GT = {
1: [
  function specialValues() {
    const [X, Y] = shuffle(ATOMS), k1 = pick([1, 2, 4]), k2 = pick([1, 2, 4]), s = pick([1, -1]), val = k1 * X[1] + s * k2 * Y[1]; need(X[1] !== Y[1] || X[0].slice(0, 5) !== Y[0].slice(0, 5));
    const c = k => (k === 1 ? '' : k);
    return mk({ skill: 'wartości funkcji dla kątów 30°, 45°, 60°',
      text: t`Oblicz wartość wyrażenia ${M(t`${c(k1)}${X[0]} ${s > 0 ? '+' : '-'} ${c(k2)}${Y[0]}`)}.`,
      fields: [F('Wartość wyrażenia:', +val.toFixed(12))],
      hints: [t`Wartości dla kątów ${M(dg(30))}, ${M(dg(45))}, ${M(dg(60))} są w tablicach maturalnych – i w ściądze obok.`, t`${M(t`\sin^2\alpha`)} oznacza ${M(t`(\sin\alpha)^2`)}: najpierw wartość funkcji, potem kwadrat.`],
      steps: [M(X[2]), M(Y[2]), M(t`${k1 === 1 ? '' : `${k1}\\cdot `}${TF(X[1])} ${s > 0 ? '+' : '-'} ${k2 === 1 ? '' : `${k2}\\cdot `}${TF(Y[1])} = ${TF(val)}`)],
      answer: M(TF(val)), check: () => Number.isFinite(val) && near(k1 * X[1] + s * k2 * Y[1], val) && ATOMS.every(a => { const m = /(\d+)\^/.exec(a[0]), al = rad(+m[1]), f = a[0].includes('sin') ? Math.sin(al) : a[0].includes('cos') ? Math.cos(al) : Math.tan(al); return near(a[0].includes('^2') ? f * f : f, a[1]); }) });
  },
  function cosFromSin() {
    let [a, b, c] = pick(TRIPLES); if (Math.random() < 0.5) [a, b] = [b, a]; const g = gcd(a, c), g2 = gcd(b, c), givenSin = Math.random() < 0.5;
    const given = givenSin ? 'sin' : 'cos', want = givenSin ? 'cos' : 'sin';
    return mk({ skill: 'jedynka trygonometryczna', pts: 2,
      text: t`Kąt ${M(t`\alpha`)} jest ostry i ${M(t`${FN[given]}\alpha = ${TF(a / c)}`)}. Oblicz ${M(t`${FN[want]}\alpha`)}.`,
      fields: [F(M(t`${FN[want]}\alpha =`), b / c)],
      hints: [t`Skorzystaj z jedynki trygonometrycznej: ${M(t`\sin^2\alpha + \cos^2\alpha = 1`)}.`, t`${M(t`${FN[want]}^2\alpha = 1 - \left(${TF(a / c)}\right)^2`)}. Kąt jest ostry, więc wybierz wartość dodatnią.`],
      steps: [M(t`${FN[want]}^2\alpha = 1 - ${FN[given]}^2\alpha = 1 - ${TF(a * a / (c * c))} = ${TF(b * b / (c * c))}`), t`Kąt ${M(t`\alpha`)} jest ostry, więc ${M(t`${FN[want]}\alpha > 0`)}: ${M(t`${FN[want]}\alpha = ${TF(b / c)}`)}.`],
      answer: M(TF(b / c)), check: () => near(Math.pow(a / c, 2) + Math.pow(b / c, 2), 1) && g >= 1 && g2 >= 1 });
  }
],
2: [
  function tgFromSin() {
    let [a, b, c] = pick(TRIPLES); if (Math.random() < 0.5) [a, b] = [b, a]; const givenSin = Math.random() < 0.5, val = givenSin ? a / b : b / a;
    return mk({ skill: 'tangens z sinusa lub cosinusa', pts: 2,
      text: t`Kąt ${M(t`\alpha`)} jest ostry i ${M(t`${givenSin ? t`\sin` : t`\cos`}\alpha = ${TF(a / c)}`)}. Oblicz ${M(t`${TG}\alpha`)}. Wynik podaj jako ułamek nieskracalny.`,
      fields: [F(M(t`${TG}\alpha =`), val)],
      hints: [t`Najpierw z jedynki trygonometrycznej wyznacz ${M(t`${givenSin ? t`\cos` : t`\sin`}\alpha`)}.`, t`${M(t`${givenSin ? t`\cos` : t`\sin`}\alpha = ${TF(b / c)}`)}. Potem ${M(t`${TG}\alpha = \dfrac{\sin\alpha}{\cos\alpha}`)}.`],
      steps: [M(t`${givenSin ? t`\cos` : t`\sin`}^2\alpha = 1 - ${TF(a * a / (c * c))} = ${TF(b * b / (c * c))},\ \text{więc}\ ${givenSin ? t`\cos` : t`\sin`}\alpha = ${TF(b / c)}`), M(t`${TG}\alpha = \frac{\sin\alpha}{\cos\alpha} = ${TF((givenSin ? a : b) / c)} : ${TF((givenSin ? b : a) / c)} = ${TF(val)}`)],
      answer: M(TF(val)), check: () => { const al = givenSin ? Math.asin(a / c) : Math.acos(a / c); return near(Math.tan(al), val); } });
  },
  function exprIdentity() {
    const [ex, f, ans, st] = pick(IDS), cor = IDOPT.find(x => x[0] === ans), o = opts(cor, IDOPT);
    return mk(Object.assign({ skill: 'tożsamości trygonometryczne',
      text: DOK + t`Dla każdego kąta ostrego ${M(t`\alpha`)} wyrażenie ${M(ex)} jest równe`,
      hints: [t`Do dyspozycji masz dwie zależności: ${M(t`\sin^2\alpha + \cos^2\alpha = 1`)} oraz ${M(t`${TG}\alpha = \dfrac{\sin\alpha}{\cos\alpha}`)}.`, t`Rozwiń nawiasy (wzory skróconego mnożenia) albo zamień tangens na iloraz i skróć.`],
      steps: st.map(x => M(x)),
      answer: M(ans), check: () => [0.3, 0.7, 1.1].every(a => near(f(a), ans === '1' ? 1 : ans.includes('sin^2') ? Math.pow(Math.sin(a), 2) : ans.includes('cos^2') ? Math.pow(Math.cos(a), 2) : Math.sin(a))) }, o));
  }
],
3: [
  function sinNonTriple() {
    const [p, q] = pick([[1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [1, 5], [1, 6], [5, 6], [2, 7], [3, 7]]), m = q * q - p * p, [s, n] = simp(m), givenSin = Math.random() < 0.5;
    const cor = [t`\frac{${rt(R(s, n))}}{${q}}`, Math.sqrt(m) / q];
    const o = opts(cor, [[t`\frac{${q - p}}{${q}}`, (q - p) / q], [t`\frac{${m}}{${q * q}}`, m / (q * q)], [t`\frac{\sqrt{${q * q + p * p}}}{${q}}`, Math.sqrt(q * q + p * p) / q], [t`\frac{${rt(R(s, n))}}{${q * q}}`, Math.sqrt(m) / (q * q)]]);
    const g = givenSin ? t`\sin` : t`\cos`, w = givenSin ? t`\cos` : t`\sin`;
    return mk(Object.assign({ skill: 'jedynka trygonometryczna – wynik z pierwiastkiem',
      text: DOK + t`Kąt ${M(t`\alpha`)} jest ostry i ${M(t`${g}\alpha = \frac{${p}}{${q}}`)}. Wtedy ${M(t`${w}\alpha`)} jest równy`,
      hints: [t`${M(t`${w}^2\alpha = 1 - ${g}^2\alpha`)}. Uwaga: ${M(t`${w}\alpha`)} to <b>nie</b> jest ${M(t`1 - ${g}\alpha`)}.`, t`${M(t`${w}^2\alpha = 1 - \frac{${p * p}}{${q * q}} = \frac{${m}}{${q * q}}`)}. Teraz pierwiastek z licznika i z mianownika.`],
      steps: [M(t`${w}^2\alpha = 1 - \left(\frac{${p}}{${q}}\right)^2 = \frac{${m}}{${q * q}}`), t`Kąt jest ostry, więc ${M(t`${w}\alpha = \frac{\sqrt{${m}}}{${q}}${s > 1 ? ` = ${cor[0]}` : ''}`)}.`],
      answer: M(cor[0]), check: () => near(Math.pow(p / q, 2) + Math.pow(cor[1], 2), 1) && near(s * Math.sqrt(n), Math.sqrt(m)) }, o));
  },
  function valueExpr() {
    const k = pick([2, 3, 4, 5, 0.5, 1 / 3]), a = pick([1, 2, 3]), b = nz(-3, 4), c = pick([1, 2, 3]), d = nz(-4, 4), num = a * k + b, den = c * k + d; need(Math.abs(den) > 1e-9 && Math.abs(num) > 1e-9 && a * d !== b * c);
    const val = num / den, lin = (u, v) => t`${u === 1 ? '' : u}\sin\alpha ${v < 0 ? '-' : '+'} ${Math.abs(v) === 1 ? '' : Math.abs(v)}\cos\alpha`, lk = (u, v) => t`${u === 1 ? '' : u}${TG}\alpha${pm(v)}`;
    return mk({ skill: 'wyrażenie z sinusem i cosinusem przy danym tangensie', pts: 2,
      text: t`Kąt ${M(t`\alpha`)} jest ostry i ${M(t`${TG}\alpha = ${TF(k)}`)}. Oblicz wartość wyrażenia ${M(t`\dfrac{${lin(a, b)}}{${lin(c, d)}}`)}. Wynik podaj jako liczbę całkowitą albo ułamek nieskracalny.`,
      fields: [F('Wartość wyrażenia:', +val.toFixed(12))],
      hints: [t`Nie musisz wyznaczać sinusa i cosinusa. Podziel licznik i mianownik przez ${M(t`\cos\alpha`)}.`, t`Po podzieleniu każdy ${M(t`\dfrac{\sin\alpha}{\cos\alpha}`)} zamienia się w ${M(t`${TG}\alpha`)}, a ${M(t`\dfrac{\cos\alpha}{\cos\alpha}`)} w ${M(1)}.`],
      steps: [M(t`\frac{${lin(a, b)}}{${lin(c, d)}} = \frac{${lk(a, b)}}{${lk(c, d)}}`), M(t`= \frac{${a === 1 ? '' : `${a}\\cdot `}${TF(k)}${pm(b)}}{${c === 1 ? '' : `${c}\\cdot `}${TF(k)}${pm(d)}} = \frac{${TF(num)}}{${TF(den)}} = ${TF(val)}`)],
      answer: M(TF(val)), check: () => { const al = Math.atan(k); return near((a * Math.sin(al) + b * Math.cos(al)) / (c * Math.sin(al) + d * Math.cos(al)), val); } });
  }
]
};

const VALS = [[t`\frac12`, 0.5], [t`\frac{\sqrt2}{2}`, Math.SQRT1_2], [t`\frac{\sqrt3}{2}`, Math.sqrt(3) / 2], ['1', 1], [t`\sqrt3`, Math.sqrt(3)], [t`\frac{\sqrt3}{3}`, Math.sqrt(3) / 3]];
const ALLV = VALS.concat(VALS.map(v => ['-' + v[0], -v[1]]));
const C60 = [[3, 8, 7], [5, 8, 7], [7, 15, 13], [8, 15, 13], [5, 21, 19], [16, 21, 19], [6, 16, 14], [10, 16, 14]], C120 = [[3, 5, 7], [7, 8, 13], [5, 16, 19], [6, 10, 14], [9, 15, 21], [7, 33, 37], [11, 24, 31]];
const GZ = {
1: [
  function obtuseVal() {
    const ang = pick([120, 135, 150]), fn = pick(['sin', 'cos', 'tg']), v = Math[fn === 'tg' ? 'tan' : fn](rad(ang)), cor = ALLV.find(x => near(x[1], v)), neg = ALLV.find(x => near(x[1], -v));
    const o = opts(cor, [neg].concat(shuffle(ALLV).slice(0, 6)));
    const red = fn === 'sin' ? t`\sin(180^\circ - \alpha) = \sin\alpha` : fn === 'cos' ? t`\cos(180^\circ - \alpha) = -\cos\alpha` : t`${TG}(180^\circ - \alpha) = -${TG}\alpha`;
    return mk(Object.assign({ skill: 'funkcje trygonometryczne kąta rozwartego',
      text: DOK + t`Liczba ${M(t`${FN[fn]}${dg(ang)}`)} jest równa`,
      hints: [t`Zapisz kąt jako ${M(t`${dg(ang)} = 180^\circ - ${dg(180 - ang)}`)} i użyj wzoru ${M(red)}.`, t`Dla kąta rozwartego sinus jest dodatni, a cosinus i tangens są ujemne.`],
      steps: [M(t`${FN[fn]}${dg(ang)} = ${FN[fn]}(180^\circ - ${dg(180 - ang)}) = ${fn === 'sin' ? '' : '-'}${FN[fn]}${dg(180 - ang)}`), M(`= ${cor[0]}`)],
      answer: M(cor[0]), check: () => near(cor[1], v) && near(Math.abs(v), Math.abs(Math[fn === 'tg' ? 'tan' : fn](rad(180 - ang)))) }, o));
  },
  function areaSin() {
    const a = 2 * ri(2, 8), b = 2 * ri(2, 8), ang = pick([30, 150]), val = a * b / 4;
    return mk({ skill: 'pole trójkąta ze wzoru z sinusem',
      text: t`W trójkącie dwa boki mają długości ${M(a)} i ${M(b)}, a kąt między nimi ma miarę ${M(dg(ang))}. Oblicz pole tego trójkąta.`,
      fields: [F(M('P ='), val)],
      hints: [t`Gdy znasz dwa boki i kąt między nimi: ${M(t`P = \tfrac12\cdot a\cdot b\cdot\sin\gamma`)}.`, ang === 150 ? t`${M(t`\sin 150^\circ = \sin(180^\circ - 30^\circ) = \sin 30^\circ = \tfrac12`)}.` : t`${M(t`\sin 30^\circ = \tfrac12`)}.`],
      steps: [M(t`P = \tfrac12\cdot ${a}\cdot ${b}\cdot\sin ${dg(ang)} = \tfrac12\cdot ${a}\cdot ${b}\cdot\tfrac12`), M(`P = ${val}`)],
      answer: M(`${val}`), check: () => near(0.5 * a * b * Math.sin(rad(ang)), val) });
  }
],
2: [
  function areaSin2() {
    const a = 2 * ri(2, 8), b = 2 * ri(2, 8), ang = pick([45, 60, 120, 135]), n = ang === 45 || ang === 135 ? 2 : 3, ans = R(a * b / 4, n);
    return mk({ skill: 'pole trójkąta ze wzoru z sinusem', pts: 2,
      text: t`W trójkącie dwa boki mają długości ${M(a)} i ${M(b)}, a kąt między nimi ma miarę ${M(dg(ang))}. Oblicz pole tego trójkąta.`,
      fields: [F(M('P ='), ans)],
      hints: [t`${M(t`P = \tfrac12\cdot a\cdot b\cdot\sin\gamma`)}, gdzie ${M(t`\gamma`)} to kąt między bokami ${M('a')} i ${M('b')}.`, ang > 90 ? t`${M(t`\sin ${dg(ang)} = \sin ${dg(180 - ang)} = \tfrac{\sqrt{${n}}}{2}`)}.` : t`${M(t`\sin ${dg(ang)} = \tfrac{\sqrt{${n}}}{2}`)}.`],
      steps: [M(t`P = \tfrac12\cdot ${a}\cdot ${b}\cdot\sin ${dg(ang)} = \tfrac12\cdot ${a}\cdot ${b}\cdot\tfrac{\sqrt{${n}}}{2}`), M(`P = ${rt(ans)}`)],
      answer: M(rt(ans)), check: () => near(0.5 * a * b * Math.sin(rad(ang)), rv(ans)) });
  },
  function cosObtuse() {
    let [a, b, c] = pick(TRIPLES); if (Math.random() < 0.5) [a, b] = [b, a]; const wantTg = Math.random() < 0.4, val = wantTg ? -a / b : -b / c;
    return mk({ skill: 'kąt rozwarty – znak cosinusa i tangensa', pts: 2,
      text: t`Kąt ${M(t`\alpha`)} jest rozwarty i ${M(t`\sin\alpha = ${TF(a / c)}`)}. Oblicz ${M(t`${wantTg ? TG : t`\cos`}\alpha`)}. Wynik podaj jako ułamek nieskracalny.`,
      fields: [F(M(t`${wantTg ? TG : t`\cos`}\alpha =`), val)],
      hints: [t`Z jedynki trygonometrycznej: ${M(t`\cos^2\alpha = 1 - \sin^2\alpha = ${TF(b * b / (c * c))}`)}.`, t`Kąt jest rozwarty, więc cosinus jest <b>ujemny</b>: ${M(t`\cos\alpha = ${TF(-b / c)}`)}.${wantTg ? t` Potem ${M(t`${TG}\alpha = \dfrac{\sin\alpha}{\cos\alpha}`)}.` : ''}`],
      steps: [M(t`\cos^2\alpha = 1 - ${TF(a * a / (c * c))} = ${TF(b * b / (c * c))}`), t`Dla kąta rozwartego ${M(t`\cos\alpha < 0`)}, więc ${M(t`\cos\alpha = ${TF(-b / c)}`)}.`].concat(wantTg ? [M(t`${TG}\alpha = ${TF(a / c)} : \left(${TF(-b / c)}\right) = ${TF(val)}`)] : []),
      answer: M(TF(val)), check: () => { const al = Math.PI - Math.asin(a / c); return near(wantTg ? Math.tan(al) : Math.cos(al), val); } });
  }
],
3: [
  function cosLaw() {
    const is60 = Math.random() < 0.5, [a, b, c] = pick(is60 ? C60 : C120), ang = is60 ? 60 : 120;
    return mk({ skill: 'twierdzenie cosinusów – trzeci bok', pts: 2,
      text: t`W trójkącie ${M('ABC')} dane są ${M(`|AC| = ${a}`)}, ${M(`|BC| = ${b}`)} oraz miara kąta ${M(t`|\sphericalangle ACB| = ${dg(ang)}`)}. Oblicz długość boku ${M('AB')}.`,
      fields: [F(M('|AB| ='), c)],
      hints: [t`Znasz dwa boki i kąt między nimi – to sytuacja dla twierdzenia cosinusów: ${M(t`c^2 = a^2 + b^2 - 2ab\cos\gamma`)}.`, t`${M(t`\cos ${dg(ang)} = ${is60 ? t`\tfrac12` : t`-\tfrac12`}`)}${is60 ? '' : ' (kąt rozwarty, cosinus ujemny – minus razy minus da plus)'}.`],
      steps: [M(t`|AB|^2 = ${a}^2 + ${b}^2 - 2\cdot ${a}\cdot ${b}\cdot\cos ${dg(ang)}`), M(t`= ${a * a} + ${b * b} - 2\cdot ${a}\cdot ${b}\cdot ${is60 ? t`\tfrac12` : t`\left(-\tfrac12\right)`} = ${a * a + b * b} ${is60 ? '-' : '+'} ${a * b} = ${c * c}`), M(t`|AB| = \sqrt{${c * c}} = ${c}`)],
      answer: M(`${c}`), check: () => near(Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(ang))), c) });
  },
  function cosLawAngle() {
    const a = ri(3, 9), b = ri(3, 9), c = ri(3, 13); need(c < a + b && c > Math.abs(a - b) && a * a + b * b !== c * c);
    const val = (a * a + b * b - c * c) / (2 * a * b);
    return mk({ skill: 'twierdzenie cosinusów – cosinus kąta', pts: 2,
      text: t`Boki trójkąta ${M('ABC')} mają długości ${M(`|BC| = ${a}`)}, ${M(`|AC| = ${b}`)}, ${M(`|AB| = ${c}`)}. Oblicz cosinus kąta ${M('ACB')}. Wynik podaj jako ułamek nieskracalny.`,
      fields: [F(M(t`\cos\gamma =`), val)],
      hints: [t`Kąt ${M('ACB')} leży naprzeciw boku ${M('AB')}. Z twierdzenia cosinusów: ${M(t`|AB|^2 = |BC|^2 + |AC|^2 - 2\cdot|BC|\cdot|AC|\cdot\cos\gamma`)}.`, t`Po przekształceniu: ${M(t`\cos\gamma = \dfrac{${a}^2 + ${b}^2 - ${c}^2}{2\cdot ${a}\cdot ${b}}`)}.`],
      steps: [M(t`${c}^2 = ${a}^2 + ${b}^2 - 2\cdot ${a}\cdot ${b}\cdot\cos\gamma`), M(t`${c * c} = ${a * a + b * b} - ${2 * a * b}\cos\gamma \iff ${2 * a * b}\cos\gamma = ${a * a + b * b - c * c}`), M(t`\cos\gamma = ${TF(val)}`)].concat(val < 0 ? [t`Cosinus jest ujemny, więc kąt ${M('ACB')} jest rozwarty.`] : []),
      answer: M(TF(val)), check: () => near(a * a + b * b - 2 * a * b * val, c * c) && Math.abs(val) < 1 });
  }
]
};

const r = String.raw;
MATURA.dzial({
  id: 'trygonometria', store: 'trygonometria-matura-v1', title: 'Trygonometria', seq: 'sin²α + cos²α = 1',
  lead: 'Sinus, cosinus i tangens w trójkącie prostokątnym, jedynka trygonometryczna, kąty rozwarte, pole trójkąta z sinusem i twierdzenie cosinusów.',
  topics: { P: 'Trójkąt prostokątny', T: 'Tożsamości i wartości', Z: 'Kąty rozwarte i zastosowania' },
  short: { T: 'Tożsamości', Z: 'Kąty rozwarte' },
  bank: { P: GP, T: GT, Z: GZ },
  formulas: {
    P: [['definicje', r`\(\sin\alpha = \dfrac{a}{c},\quad \cos\alpha = \dfrac{b}{c},\quad \operatorname{tg}\alpha = \dfrac{a}{b}\)<br>\(a\) – przyprostokątna naprzeciw kąta, \(b\) – przy kącie, \(c\) – przeciwprostokątna`], ['wartości', r`\(\begin{array}{c|ccc} & 30^\circ & 45^\circ & 60^\circ \\ \hline \sin & \tfrac12 & \tfrac{\sqrt2}{2} & \tfrac{\sqrt3}{2} \\ \cos & \tfrac{\sqrt3}{2} & \tfrac{\sqrt2}{2} & \tfrac12 \\ \operatorname{tg} & \tfrac{\sqrt3}{3} & 1 & \sqrt3 \end{array}\)`], ['którą funkcję wybrać', r`naprzeciw i przeciwprostokątna: sinus<br>przy kącie i przeciwprostokątna: cosinus<br>dwie przyprostokątne: tangens`]],
    T: [['jedynka trygonometryczna', r`\(\sin^2\alpha + \cos^2\alpha = 1\)`], ['tangens', r`\(\operatorname{tg}\alpha = \dfrac{\sin\alpha}{\cos\alpha}\)`], ['wartości', r`\(\begin{array}{c|ccc} & 30^\circ & 45^\circ & 60^\circ \\ \hline \sin & \tfrac12 & \tfrac{\sqrt2}{2} & \tfrac{\sqrt3}{2} \\ \cos & \tfrac{\sqrt3}{2} & \tfrac{\sqrt2}{2} & \tfrac12 \\ \operatorname{tg} & \tfrac{\sqrt3}{3} & 1 & \sqrt3 \end{array}\)`], ['kąt ostry', r`wszystkie trzy funkcje są dodatnie`]],
    Z: [['kąt rozwarty', r`\(\sin(180^\circ - \alpha) = \sin\alpha\)<br>\(\cos(180^\circ - \alpha) = -\cos\alpha\)<br>\(\operatorname{tg}(180^\circ - \alpha) = -\operatorname{tg}\alpha\)`], ['pole trójkąta', r`\(P = \tfrac12\, a\, b\, \sin\gamma\)<br>\(\gamma\) – kąt między bokami \(a\) i \(b\)`], ['twierdzenie cosinusów', r`\(c^2 = a^2 + b^2 - 2ab\cos\gamma\)`]]
  }
});
})();
