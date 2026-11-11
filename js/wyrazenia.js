/* Dział II: Wyrażenia algebraiczne — wzory skróconego mnożenia, wielomiany, wyrażenia wymierne */
(function () {
const nz = (a, b) => { let v; do { v = ri(a, b); } while (v === 0); return v; };
const X0 = 1.37, Y0 = 0.71;
const ev = cs => cs.reduce((acc, c) => acc * X0 + c, 0);
const pv = cs => [poly(cs), ev(cs)];
/* jednomiany dwóch zmiennych: a·x² + b·xy + c·y² */
function xy(a, b, c) {
  let s = '';
  [[a, 'x^2'], [b, 'xy'], [c, 'y^2']].forEach(([k, v]) => { if (!k) return; s += (s ? (k < 0 ? ' - ' : ' + ') : (k < 0 ? '-' : '')) + (Math.abs(k) === 1 ? '' : Math.abs(k)) + v; });
  return [s, a * X0 * X0 + b * X0 * Y0 + c * Y0 * Y0];
}

const GS = {
1: [
  function expandSq() {
    const a = pick([1, 1, 2, 3, 4, 5]), b = ri(1, 7), s = pick([1, -1]), cs = [a * a, 2 * a * b * s, b * b];
    const o = opts(pv(cs), [pv([a * a, 0, b * b]), pv([a * a, a * b * s, b * b]), pv([a * a, 2 * a * b * s, -b * b]), pv([a * a, -2 * a * b * s, b * b]), pv([a * a, 0, s * b * b])]);
    const inner = poly([a, s * b]);
    return mk(Object.assign({ skill: 'kwadrat sumy i kwadrat różnicy',
      text: DOK + t`Dla każdej liczby rzeczywistej ${M('x')} wyrażenie ${M(`(${inner})^2`)} jest równe`,
      hints: [t`Wzór: ${M(t`(a ${s > 0 ? '+' : '-'} b)^2 = a^2 ${s > 0 ? '+' : '-'} 2ab + b^2`)}. Tutaj ${M(`a = ${poly([a, 0])}`)}, ${M(`b = ${b}`)}.`, t`Najczęstszy błąd to pominięcie wyrazu środkowego ${M(t`2ab = 2\cdot ${poly([a, 0])}\cdot ${b}`)}.`],
      steps: [M(t`(${inner})^2 = ${a === 1 ? 'x^2' : `(${poly([a, 0])})^2`} ${s > 0 ? '+' : '-'} 2\cdot ${poly([a, 0])}\cdot ${b} + ${b}^2`), M(`= ${poly(cs)}`)],
      answer: M(poly(cs)), check: () => near(Math.pow(a * X0 + s * b, 2), ev(cs)) }, o));
  },
  function diffSq() {
    const a = pick([1, 2, 3, 4, 5]), b = ri(2, 9), cs = [a * a, 0, -b * b];
    const o = opts(pv(cs), [pv([a * a, 0, b * b]), pv([a * a, -2 * a * b, b * b]), pv([a * a, -2 * a * b, -b * b]), pv([a * a, 0, -b]), pv([a, 0, -b * b])]);
    return mk(Object.assign({ skill: 'różnica kwadratów',
      text: DOK + t`Dla każdej liczby rzeczywistej ${M('x')} wyrażenie ${M(`(${poly([a, -b])})(${poly([a, b])})`)} jest równe`,
      hints: [t`To iloczyn różnicy i sumy tych samych wyrażeń: ${M('(a - b)(a + b) = a^2 - b^2')}.`, t`${M(`a = ${poly([a, 0])}`)}, więc ${M(`a^2 = ${poly([a * a, 0, 0])}`)}; ${M(`b^2 = ${b * b}`)}.`],
      steps: [M(t`(${poly([a, -b])})(${poly([a, b])}) = (${poly([a, 0])})^2 - ${b}^2`), M(`= ${poly(cs)}`)],
      answer: M(poly(cs)), check: () => near((a * X0 - b) * (a * X0 + b), ev(cs)) }, o));
  }
],
2: [
  function sqDifference() {
    const a = ri(1, 7), cs = [4 * a, 0];
    const o = opts(pv(cs), [['0', 0], [`${2 * a * a}`, 2 * a * a], pv([-4 * a, 0]), pv([2, 0, 2 * a * a]), pv([2 * a, 0])]);
    return mk(Object.assign({ skill: 'redukcja po zastosowaniu wzorów',
      text: DOK + t`Dla każdej liczby rzeczywistej ${M('x')} wyrażenie ${M(t`(x + ${a})^2 - (x - ${a})^2`)} jest równe`,
      hints: [t`Rozwiń oba kwadraty osobno. Drugi wynik weź w nawias, bo stoi przed nim minus.`, t`${M(t`(x + ${a})^2 = ${poly([1, 2 * a, a * a])}`)}, ${M(t`(x - ${a})^2 = ${poly([1, -2 * a, a * a])}`)}.`],
      steps: [M(t`(x + ${a})^2 - (x - ${a})^2 = ${poly([1, 2 * a, a * a])} - \left(${poly([1, -2 * a, a * a])}\right)`), M(t`= ${poly([1, 2 * a, a * a])} - x^2 + ${poly([2 * a, 0])} - ${a * a} = ${poly(cs)}`)],
      answer: M(poly(cs)), check: () => near(Math.pow(X0 + a, 2) - Math.pow(X0 - a, 2), ev(cs)) }, o));
  },
  function factorDiff() {
    const a = pick([1, 2, 3, 4, 5]), b = ri(2, 9); need(gcd(a, b) === 1 || a === 1);
    const f = (p, q, r0, s0) => [`(${poly([p, q])})(${poly([r0, s0])})`, (p * X0 + q) * (r0 * X0 + s0)], sqf = sg => [`(${poly([a, sg * b])})^2`, Math.pow(a * X0 + sg * b, 2)];
    const o = opts(f(a, -b, a, b), [sqf(-1), sqf(1), f(a * a, -b * b, 1, 1), f(a, -b * b, a, 1), f(a, -b, a, -1)]);
    return mk(Object.assign({ skill: 'zamiana różnicy kwadratów na iloczyn',
      text: DOK + t`Dla każdej liczby rzeczywistej ${M('x')} wyrażenie ${M(poly([a * a, 0, -b * b]))} jest równe`,
      hints: [t`Oba składniki są kwadratami: ${M(t`${poly([a * a, 0, 0])} = (${poly([a, 0])})^2`)}, ${M(`${b * b} = ${b}^2`)}.`, t`Użyj wzoru „od prawej do lewej”: ${M('a^2 - b^2 = (a - b)(a + b)')}.`],
      steps: [M(t`${poly([a * a, 0, -b * b])} = (${poly([a, 0])})^2 - ${b}^2`), M(`= (${poly([a, -b])})(${poly([a, b])})`)],
      answer: M(`(${poly([a, -b])})(${poly([a, b])})`), check: () => near((a * X0 - b) * (a * X0 + b), a * a * X0 * X0 - b * b) }, o));
  },
  function simplifyLin() {
    const a = nz(-6, 6), b = nz(-9, 9), p = 2 * a - b, q = a * a; need(p !== 0);
    return mk({ skill: 'upraszczanie wyrażenia', pts: 2,
      text: t`Dla każdej liczby rzeczywistej ${M('x')} wyrażenie ${M(t`(x${pm(a)})^2 - x(x${pm(b)})`)} można zapisać w postaci ${M('px + q')}. Wyznacz ${M('p')} i ${M('q')}.`,
      fields: [F(M('p ='), p), F(M('q ='), q)],
      hints: [t`Rozwiń kwadrat: ${M(t`(x${pm(a)})^2 = ${poly([1, 2 * a, a * a])}`)}.`, t`Wymnóż ${M(t`x(x${pm(b)}) = ${poly([1, b, 0])}`)} i odejmij – pamiętaj o zmianie znaków w nawiasie.`],
      steps: [M(t`(x${pm(a)})^2 - x(x${pm(b)}) = ${poly([1, 2 * a, a * a])} - \left(${poly([1, b, 0])}\right)`), M(t`= ${poly([1, 2 * a, a * a])} - x^2${sp([-b, 0])} = ${poly([p, q])}`)],
      answer: M(t`p = ${p},\quad q = ${q}`), check: () => [X0, -2.2, 5].every(x => near(Math.pow(x + a, 2) - x * (x + b), p * x + q)) });
  }
],
3: [
  function sumSquares() {
    const a = ri(-6, 9), b = ri(-6, 9), S = a + b, Pr = a * b, val = a * a + b * b; need(S !== 0 && Pr !== 0);
    return mk({ skill: 'suma kwadratów z sumy i iloczynu', pts: 2,
      text: t`Liczby rzeczywiste ${M('a')} i ${M('b')} spełniają warunki ${M(`a + b = ${S}`)} oraz ${M(t`a\cdot b = ${Pr}`)}. Oblicz ${M('a^2 + b^2')}.`,
      fields: [F(M('a^2 + b^2 ='), val)],
      hints: [t`Nie musisz szukać liczb ${M('a')} i ${M('b')}. Zacznij od wzoru ${M('(a + b)^2 = a^2 + 2ab + b^2')}.`, t`Stąd ${M('a^2 + b^2 = (a + b)^2 - 2ab')}.`],
      steps: [M('a^2 + b^2 = (a + b)^2 - 2ab'), M(t`= ${P(S)}^2 - 2\cdot ${P(Pr)} = ${S * S}${pm(-2 * Pr)} = ${val}`)],
      answer: M(`${val}`), check: () => S * S - 2 * Pr === val });
  },
  function mixedReduce() {
    const a = pick([1, 2, 3, 4]), b = ri(1, 6), cs = [-2 * a * b, 2 * b * b];
    const o = opts(pv(cs), [[`${2 * b * b}`, 2 * b * b], pv([-2 * a * b, 0]), pv([2 * a * b, 2 * b * b]), pv([-2 * a * b, -2 * b * b]), pv([-2 * a * b, b * b]), ['0', 0]]);
    return mk(Object.assign({ skill: 'dwa wzory w jednym wyrażeniu',
      text: DOK + t`Dla każdej liczby rzeczywistej ${M('x')} wyrażenie ${M(t`(${poly([a, -b])})^2 - (${poly([a, b])})(${poly([a, -b])})`)} jest równe`,
      hints: [t`Pierwszy składnik to kwadrat różnicy, drugi – różnica kwadratów.`, t`${M(t`(${poly([a, -b])})^2 = ${poly([a * a, -2 * a * b, b * b])}`)} oraz ${M(t`(${poly([a, b])})(${poly([a, -b])}) = ${poly([a * a, 0, -b * b])}`)}. Odejmując, zmień znaki w drugim nawiasie.`],
      steps: [M(t`${poly([a * a, -2 * a * b, b * b])} - \left(${poly([a * a, 0, -b * b])}\right)`), M(t`= ${poly([a * a, -2 * a * b, b * b])} - ${poly([a * a, 0, 0])} + ${b * b} = ${poly(cs)}`)],
      answer: M(poly(cs)), check: () => near(Math.pow(a * X0 - b, 2) - (a * X0 + b) * (a * X0 - b), ev(cs)) }, o));
  },
  function perfectSquare() {
    const a = ri(2, 12), k = 2 * a, minus = Math.random() < 0.5;
    return mk({ skill: 'rozpoznawanie pełnego kwadratu',
      text: t`Dla każdej liczby rzeczywistej ${M('x')} zachodzi równość ${M(t`x^2 ${minus ? '-' : '+'} kx + ${a * a} = (x ${minus ? '-' : '+'} a)^2`)}, gdzie ${M('a')} i ${M('k')} są liczbami dodatnimi. Wyznacz ${M('k')}.`,
      fields: [F(M('k ='), k)],
      hints: [t`Rozwiń prawą stronę: ${M(t`(x ${minus ? '-' : '+'} a)^2 = x^2 ${minus ? '-' : '+'} 2ax + a^2`)} i porównaj z lewą.`, t`Wyrazy wolne muszą być równe: ${M(`a^2 = ${a * a}`)}, więc ${M(`a = ${a}`)}. Wtedy ${M('k = 2a')}.`],
      steps: [M(t`a^2 = ${a * a}\ \text{i}\ a > 0,\ \text{więc}\ a = ${a}`), M(t`k = 2a = ${k}`)],
      answer: M(`k = ${k}`), check: () => [X0, -3, 7].every(x => near(x * x + (minus ? -1 : 1) * k * x + a * a, Math.pow(x + (minus ? -a : a), 2))) });
  }
]
};

const GW = {
1: [
  function subPoly() {
    const W = [nz(-4, 5), nz(-7, 7), nz(-9, 9)], Q = [nz(-4, 5), nz(-7, 7), nz(-9, 9)], D0 = W.map((c, i) => c - Q[i]); need(D0.filter(c => c !== 0).length >= 2 && W[0] !== Q[0]);
    const o = opts(pv(D0), [pv(W.map((c, i) => c + Q[i])), pv([W[0] - Q[0], W[1] + Q[1], W[2] + Q[2]]), pv(D0.map(c => -c)), pv([W[0] - Q[0], W[1] - Q[1], W[2] + Q[2]])].filter(x => x[0] !== '0'));
    return mk(Object.assign({ skill: 'odejmowanie wielomianów',
      text: DOK + t`Dane są wielomiany ${M(`W(x) = ${poly(W)}`)} oraz ${M(`P(x) = ${poly(Q)}`)}. Wielomian ${M('W(x) - P(x)')} jest równy`,
      hints: [t`Zapisz odejmowany wielomian w nawiasie: ${M(t`W(x) - P(x) = ${poly(W)} - \left(${poly(Q)}\right)`)}.`, t`Minus przed nawiasem zmienia znak <b>każdego</b> wyrazu w nawiasie. Potem dodaj wyrazy podobne.`],
      steps: [M(t`${poly(W)} - \left(${poly(Q)}\right) = ${poly(W)}${Q.map((c, i) => (c > 0 ? ' - ' : ' + ') + poly([Math.abs(c)].concat(Array(2 - i).fill(0)))).join('')}`), M(`= ${poly(D0)}`)],
      answer: M(poly(D0)), check: () => near(ev(W) - ev(Q), ev(D0)) }, o));
  },
  function factorOut() {
    const g = pick([2, 3, 4, 5, 6]), k = pick([1, 2]), a = ri(1, 5), b = nz(-7, 7); need(gcd(a, Math.abs(b)) === 1);
    const cs = [g * a, g * b].concat(Array(k).fill(0)), mono = poly([g].concat(Array(k).fill(0)));
    const f = (m, p, q) => [`${poly(m)}(${poly([p, q])})`, ev(m) * (p * X0 + q)];
    const mk0 = [g].concat(Array(k).fill(0));
    const o = opts(f(mk0, a, b), [f(mk0, a, -b), f(mk0, g * a, b), f([g].concat(Array(k - 1).fill(0)), a, b), f(mk0, a, g * b), f([g].concat(Array(k + 1).fill(0)), a, b)]);
    return mk(Object.assign({ skill: 'wyłączanie jednomianu przed nawias',
      text: DOK + t`Dla każdej liczby rzeczywistej ${M('x')} wyrażenie ${M(poly(cs))} jest równe`,
      hints: [t`Poszukaj największego wspólnego czynnika obu wyrazów: wspólnej liczby i wspólnej potęgi ${M('x')}.`, t`Wspólny czynnik to ${M(mono)}. Każdy wyraz podziel przez niego, żeby dostać to, co zostaje w nawiasie.`],
      steps: [M(t`${poly(cs)} = ${mono}\cdot ${poly([a, 0])} ${b < 0 ? '-' : '+'} ${mono}\cdot ${Math.abs(b)}`), M(`= ${mono}(${poly([a, b])})`)],
      answer: M(`${mono}(${poly([a, b])})`), check: () => near(ev(mk0) * (a * X0 + b), ev(cs)) }, o));
  }
],
2: [
  function mulPoly() {
    const a = nz(-5, 5), b = nz(-5, 5), c = nz(-7, 7), p = a + b, q = a * b + c; need(p !== 0 && q !== 0);
    return mk({ skill: 'mnożenie wielomianów', pts: 2,
      text: t`Wielomian ${M(t`W(x) = (x${pm(a)})(${poly([1, b, c])})`)} zapisano w postaci ${M('x^3 + px^2 + qx + r')}. Wyznacz współczynniki ${M('p')} i ${M('q')}.`,
      fields: [F(M('p ='), p), F(M('q ='), q)],
      hints: [t`Pomnóż każdy wyraz pierwszego nawiasu przez każdy wyraz drugiego: najpierw ${M('x')} razy cały drugi nawias, potem ${M(a)} razy cały drugi nawias.`, t`${M(t`x\cdot(${poly([1, b, c])}) = ${poly([1, b, c, 0])}`)}, ${M(t`${a}\cdot(${poly([1, b, c])}) = ${poly([a, a * b, a * c])}`)}. Dodaj wyrazy podobne.`],
      steps: [M(t`(x${pm(a)})(${poly([1, b, c])}) = ${poly([1, b, c, 0])}${sp([a, a * b, a * c])}`), M(`= ${poly([1, p, q, a * c])}`), M(t`p = ${p},\qquad q = ${q}`)],
      answer: M(t`p = ${p},\quad q = ${q}`), check: () => [X0, -2, 3].every(x => near((x + a) * (x * x + b * x + c), x * x * x + p * x * x + q * x + a * c)) });
  },
  function polyValue() {
    const cs = [pick([-2, -1, 1, 2, 3]), nz(-5, 5), nz(-6, 6), ri(-9, 9)], k = pick([-3, -2, -1, 2, 3]), val = cs.reduce((acc, c) => acc * k + c, 0);
    return mk({ skill: 'wartość wielomianu',
      text: t`Dany jest wielomian ${M(`W(x) = ${poly(cs)}`)}. Oblicz ${M(`W(${k})`)}.`,
      fields: [F(M(`W(${k}) =`), val)],
      hints: [t`Wstaw ${M(k)} w miejsce każdego ${M('x')}${k < 0 ? ', zawsze w nawiasie' : ''}.`, t`${M(`${P(k)}^3 = ${k * k * k}`)}, ${M(`${P(k)}^2 = ${k * k}`)}.`],
      steps: [M(t`W(${k}) = ${T(cs[0])}\cdot ${P(k * k * k)}${pm(cs[1])}\cdot ${k * k}${pm(cs[2])}\cdot ${P(k)}${cs[3] ? pm(cs[3]) : ''}`), M(t`= ${cs[0] * k * k * k}${pm(cs[1] * k * k)}${pm(cs[2] * k)}${cs[3] ? pm(cs[3]) : ''} = ${val}`)],
      answer: M(`${val}`), check: () => cs[0] * Math.pow(k, 3) + cs[1] * Math.pow(k, 2) + cs[2] * k + cs[3] === val });
  }
],
3: [
  function mulTwoVar() {
    const a = pick([1, 2, 3]), b = nz(-4, 4), c = pick([1, 2, 3]), d = nz(-4, 4), mid = a * d + b * c; need(mid !== 0);
    const t1 = (p, q) => `${p === 1 ? '' : p}x ${q < 0 ? '-' : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}y`;
    const o = opts(xy(a * c, mid, b * d), [xy(a * c, 0, b * d), xy(a * c, -mid, b * d), xy(a * c, mid, -b * d), xy(a * c, a * d * b * c === mid ? mid + 1 : a * d * b * c, b * d), xy(a + c, mid, b + d)].filter(x => x[0]));
    return mk(Object.assign({ skill: 'mnożenie sum algebraicznych dwóch zmiennych',
      text: DOK + t`Dla wszystkich liczb rzeczywistych ${M('x')} i ${M('y')} wyrażenie ${M(`(${t1(a, b)})(${t1(c, d)})`)} jest równe`,
      hints: [t`Każdy wyraz pierwszego nawiasu pomnóż przez każdy wyraz drugiego – powstaną cztery iloczyny.`, t`Dwa z nich zawierają ${M('xy')}: ${M(t`${a * d === 1 ? '' : a * d === -1 ? '-' : a * d}xy`)} oraz ${M(t`${b * c === 1 ? '' : b * c === -1 ? '-' : b * c}xy`)}. Dodaj je do siebie.`],
      steps: [M(t`${xy(a * c, 0, 0)[0]} ${a * d < 0 ? '-' : '+'} ${Math.abs(a * d) === 1 ? '' : Math.abs(a * d)}xy ${b * c < 0 ? '-' : '+'} ${Math.abs(b * c) === 1 ? '' : Math.abs(b * c)}xy ${b * d < 0 ? '-' : '+'} ${Math.abs(b * d) === 1 ? '' : Math.abs(b * d)}y^2`), M(`= ${xy(a * c, mid, b * d)[0]}`)],
      answer: M(xy(a * c, mid, b * d)[0]), check: () => near((a * X0 + b * Y0) * (c * X0 + d * Y0), xy(a * c, mid, b * d)[1]) }, o));
  },
  function coefMatch() {
    const a = nz(-6, 6), m = nz(-7, 7), p = a + m, q = a * m; need(p !== 0);
    return mk({ skill: 'równość wielomianów', pts: 2,
      text: t`Wielomiany ${M(t`W(x) = (x${pm(a)})(x + m)`)} oraz ${M(`P(x) = ${poly([1, p, q])}`)} są równe. Wyznacz liczbę ${M('m')}.`,
      fields: [F(M('m ='), m)],
      hints: [t`Dwa wielomiany są równe, gdy mają takie same współczynniki przy odpowiednich potęgach. Wymnóż nawiasy w ${M('W(x)')}.`, t`${M(t`W(x) = x^2 + (m${pm(a)})x${sp([a, 0], 'm')}`)}. Porównaj wyrazy wolne: ${M(t`${poly([a, 0], 'm')} = ${q}`)}.`],
      steps: [M(t`(x${pm(a)})(x + m) = x^2 + (m${pm(a)})x${sp([a, 0], 'm')}`), t`Wyrazy wolne: ${M(t`${poly([a, 0], 'm')} = ${q}`)}, stąd ${M(`m = ${m}`)}.`, t`Sprawdzenie współczynnika przy ${M('x')}: ${M(t`m${pm(a)} = ${m}${pm(a)} = ${p}`)} – zgadza się.`],
      answer: M(`m = ${m}`), check: () => [X0, -2, 4].every(x => near((x + a) * (x + m), x * x + p * x + q)) });
  }
]
};

const fr2 = (n, d) => t`\dfrac{${n}}{${d}}`;
const GR = {
1: [
  function domain() {
    const a = nz(-7, 7), b = nz(-7, 7), c = nz(-5, 5); need(a !== b && a !== -b && c !== -a && c !== -b && -c !== a);
    const set = (...v) => t`\{${[...new Set(v)].sort((u, w) => u - w).join(',\\ ')}\}`;
    const o = opts(set(a, b), [set(-a, -b), set(a, b, -c), set(-c), set(a), set(-a, -b, c)]);
    return mk(Object.assign({ skill: 'dziedzina wyrażenia wymiernego',
      text: DOK + t`Wyrażenie ${M(fr2(`x${pm(c)}`, `${xm(a)}${xm(b)}`))} ma sens liczbowy dla wszystkich liczb rzeczywistych ${M('x')} z wyjątkiem liczb ze zbioru`,
      hints: [t`Nie wolno dzielić przez zero, więc sprawdzamy tylko mianownik. Licznik może być zerem.`, t`Mianownik jest zerem, gdy ${M(t`x${pm(-a)} = 0`)} lub ${M(t`x${pm(-b)} = 0`)}.`],
      steps: [M(t`${xm(a)}${xm(b)} = 0 \iff x = ${a}\ \text{lub}\ x = ${b}`), t`Te liczby trzeba wykluczyć. Liczba ${M(-c)} zeruje tylko licznik, więc jest dozwolona.`],
      answer: M(set(a, b)), check: () => (a - a) * (a - b) === 0 && (b - a) * (b - b) === 0 && (-c - a) * (-c - b) !== 0 }, o));
  },
  function valueRational() {
    const a = nz(-6, 6), b = nz(-5, 5), k = pick([-4, -3, -2, -1, 2, 3, 4, 5]), num = k * k + a; need(k !== b && num !== 0);
    const val = num / (k - b);
    return mk({ skill: 'wartość wyrażenia wymiernego',
      text: t`Oblicz wartość wyrażenia ${M(fr2(poly([1, 0, a]), `x${pm(-b)}`))} dla ${M(`x = ${k}`)}. Wynik podaj jako liczbę całkowitą albo ułamek nieskracalny.`,
      fields: [F('Wartość wyrażenia:', val)],
      hints: [t`Policz osobno licznik i mianownik dla ${M(`x = ${k}`)}.`, t`Licznik: ${M(`${P(k)}^2${pm(a)} = ${num}`)}, mianownik: ${M(`${k}${pm(-b)} = ${k - b}`)}.`],
      steps: [M(t`\frac{${P(k)}^2${pm(a)}}{${k}${pm(-b)}} = \frac{${num}}{${k - b}} = ${TF(val)}`)],
      answer: M(TF(val)), check: () => near(val * (k - b), k * k + a) });
  }
],
2: [
  function reduce1() {
    const k = ri(2, 9), minus = Math.random() < 0.5, s = minus ? -k : k;
    const o = opts([`x${pm(-s)}`, X0 - s], [[`x${pm(s)}`, X0 + s], [`x - ${k * k}`, X0 - k * k], [`x^2${pm(-s)}`, X0 * X0 - s], [`${-s}`, -s]]);
    return mk(Object.assign({ skill: 'skracanie wyrażenia wymiernego',
      text: DOK + t`Dla każdej liczby rzeczywistej ${M(t`x \neq ${-s}`)} wyrażenie ${M(fr2(`x^2 - ${k * k}`, `x${pm(s)}`))} jest równe`,
      hints: [t`Skracać wolno tylko czynniki, nie składniki. Najpierw rozłóż licznik na czynniki.`, t`${M(t`x^2 - ${k * k} = (x - ${k})(x + ${k})`)}.`],
      steps: [M(t`\frac{x^2 - ${k * k}}{x${pm(s)}} = \frac{(x - ${k})(x + ${k})}{x${pm(s)}}`), M(`= x${pm(-s)}`)],
      answer: M(`x${pm(-s)}`), check: () => near((X0 * X0 - k * k) / (X0 + s), X0 - s) }, o));
  },
  function reduce2() {
    const k = ri(2, 9), f = (n, d, v) => [fr2(n, d).replace('dfrac', 'frac'), v];
    const o = opts(f(`x - ${k}`, 'x', (X0 - k) / X0), [f(`x + ${k}`, 'x', (X0 + k) / X0), f(`x - ${k}`, `x + ${k}`, (X0 - k) / (X0 + k)), [t`-\frac{${k}}{x}`, -k / X0], [`${1 - k}`, 1 - k], [`-${k}`, -k]]);
    return mk(Object.assign({ skill: 'skracanie wyrażenia wymiernego',
      text: DOK + t`Dla każdej liczby rzeczywistej ${M('x')} różnej od ${M(0)} i od ${M(-k)} wyrażenie ${M(fr2(`x^2 - ${k * k}`, poly([1, k, 0])))} jest równe`,
      hints: [t`Rozłóż na czynniki licznik (różnica kwadratów) i mianownik (wyłącz ${M('x')} przed nawias).`, t`Licznik: ${M(t`(x - ${k})(x + ${k})`)}, mianownik: ${M(t`x(x + ${k})`)}. Skróć wspólny czynnik.`],
      steps: [M(t`\frac{x^2 - ${k * k}}{${poly([1, k, 0])}} = \frac{(x - ${k})(x + ${k})}{x(x + ${k})}`), M(t`= \frac{x - ${k}}{x}`)],
      answer: M(t`\frac{x - ${k}}{x}`), check: () => near((X0 * X0 - k * k) / (X0 * X0 + k * X0), (X0 - k) / X0) }, o));
  }
],
3: [
  function mulDiv() {
    const a = ri(1, 8), b = nz(-8, 8), c = nz(-8, 8); need(b !== c && Math.abs(b) !== a && Math.abs(c) !== a && b !== -c);
    if (Math.random() < 0.5) {
      const o = opts([`x + ${a}`, X0 + a], [[`x - ${a}`, X0 - a], [t`\frac{x + ${a}}{x${pm(b)}}`, (X0 + a) / (X0 + b)], [`(x + ${a})(x${pm(b)})`, (X0 + a) * (X0 + b)], ['1', 1]]);
      return mk(Object.assign({ skill: 'mnożenie wyrażeń wymiernych',
        text: DOK + t`Dla każdej liczby rzeczywistej ${M('x')} różnej od ${M(a)} i od ${M(-b)} wyrażenie ${M(t`${fr2(`x^2 - ${a * a}`, `x${pm(b)}`)}\cdot ${fr2(`x${pm(b)}`, `x - ${a}`)}`)} jest równe`,
        hints: [t`Ułamki mnożymy „licznik razy licznik, mianownik razy mianownik” – ale najpierw warto skrócić.`, t`${M(t`x^2 - ${a * a} = (x - ${a})(x + ${a})`)}. Skróć ${M(`(x${pm(b)})`)} oraz ${M(`(x - ${a})`)}.`],
        steps: [M(t`\frac{(x - ${a})(x + ${a})}{x${pm(b)}}\cdot\frac{x${pm(b)}}{x - ${a}}`), M(`= x + ${a}`)],
        answer: M(`x + ${a}`), check: () => near((X0 * X0 - a * a) / (X0 + b) * (X0 + b) / (X0 - a), X0 + a) }, o));
    }
    const f = (n, d, v) => [t`\frac{${n}}{${d}}`, v];
    const o = opts(f(`x${pm(c)}`, `x${pm(b)}`, (X0 + c) / (X0 + b)), [f(`x${pm(b)}`, `x${pm(c)}`, (X0 + b) / (X0 + c)), f(`(x - ${a})^2`, `(x${pm(b)})(x${pm(c)})`, Math.pow(X0 - a, 2) / (X0 + b) / (X0 + c)), ['1', 1], f(`x - ${a}`, `x${pm(b)}`, (X0 - a) / (X0 + b))]);
    return mk(Object.assign({ skill: 'dzielenie wyrażeń wymiernych',
      text: DOK + t`Dla każdej liczby rzeczywistej ${M('x')} różnej od ${M(a)}, ${M(-b)} i ${M(-c)} wyrażenie ${M(t`${fr2(`x - ${a}`, `x${pm(b)}`)} : ${fr2(`x - ${a}`, `x${pm(c)}`)}`)} jest równe`,
      hints: [t`Dzielenie przez ułamek to mnożenie przez jego odwrotność.`, t`${M(t`\frac{x - ${a}}{x${pm(b)}}\cdot\frac{x${pm(c)}}{x - ${a}}`)} – teraz skróć wspólny czynnik.`],
      steps: [M(t`\frac{x - ${a}}{x${pm(b)}} : \frac{x - ${a}}{x${pm(c)}} = \frac{x - ${a}}{x${pm(b)}}\cdot\frac{x${pm(c)}}{x - ${a}}`), M(t`= \frac{x${pm(c)}}{x${pm(b)}}`)],
      answer: M(t`\frac{x${pm(c)}}{x${pm(b)}}`), check: () => near(((X0 - a) / (X0 + b)) / ((X0 - a) / (X0 + c)), (X0 + c) / (X0 + b)) }, o));
  },
  function evalAfter() {
    const k = ri(2, 9), big = pick([100, 200, 500, 1000]), s = pick([1, -1]), x0 = big + s * k * 0 + (s > 0 ? k : -k), val = x0 - s * k;
    return mk({ skill: 'uprość, zanim policzysz', pts: 2,
      text: t`Oblicz wartość wyrażenia ${M(fr2(poly([1, -2 * s * k, k * k]), `x${pm(-s * k)}`))} dla ${M(`x = ${x0}`)}.`,
      fields: [F('Wartość wyrażenia:', val)],
      hints: [t`Nie wstawiaj od razu dużej liczby. Licznik jest pełnym kwadratem.`, t`${M(t`${poly([1, -2 * s * k, k * k])} = (x${pm(-s * k)})^2`)}. Skróć z mianownikiem.`],
      steps: [M(t`\frac{${poly([1, -2 * s * k, k * k])}}{x${pm(-s * k)}} = \frac{(x${pm(-s * k)})^2}{x${pm(-s * k)}} = x${pm(-s * k)}`), M(`${x0}${pm(-s * k)} = ${val}`)],
      answer: M(`${val}`), check: () => near((x0 * x0 - 2 * s * k * x0 + k * k) / (x0 - s * k), val) });
  }
]
};

const r = String.raw;
MATURA.dzial({
  id: 'wyrazenia', store: 'wyrazenia-matura-v1', title: 'Wyrażenia algebraiczne', seq: '(a + b)² = a² + 2ab + b²',
  lead: 'Wzory skróconego mnożenia, działania na wielomianach, wyłączanie przed nawias oraz skracanie, mnożenie i dzielenie wyrażeń wymiernych.',
  topics: { S: 'Wzory skróconego mnożenia', W: 'Wielomiany', R: 'Wyrażenia wymierne' },
  short: { S: 'Wzory skr. mnożenia', R: 'Wymierne' },
  bank: { S: GS, W: GW, R: GR },
  formulas: {
    S: [['kwadrat sumy', r`\((a + b)^2 = a^2 + 2ab + b^2\)`], ['kwadrat różnicy', r`\((a - b)^2 = a^2 - 2ab + b^2\)`], ['różnica kwadratów', r`\(a^2 - b^2 = (a - b)(a + b)\)`], ['przydatne', r`\(a^2 + b^2 = (a + b)^2 - 2ab\)<br>uwaga: \((a + b)^2 \neq a^2 + b^2\)`]],
    W: [['dodawanie i odejmowanie', r`dodajemy wyrazy podobne (z tą samą potęgą \(x\)); minus przed nawiasem zmienia wszystkie znaki`], ['mnożenie', r`każdy wyraz pierwszego nawiasu razy każdy wyraz drugiego`], ['wyłączanie przed nawias', r`\(ab + ac = a(b + c)\)<br>np. \(6x^3 - 9x^2 = 3x^2(2x - 3)\)`], ['równość wielomianów', r`takie same współczynniki przy tych samych potęgach`]],
    R: [['dziedzina', r`mianownik musi być różny od zera`], ['skracanie', r`skracamy tylko <b>czynniki</b>: najpierw rozłóż licznik i mianownik na czynniki`], ['mnożenie i dzielenie', r`\(\dfrac{A}{B}\cdot\dfrac{C}{D} = \dfrac{A\cdot C}{B\cdot D}\)<br>\(\dfrac{A}{B} : \dfrac{C}{D} = \dfrac{A}{B}\cdot\dfrac{D}{C}\)`]]
  }
});
})();
