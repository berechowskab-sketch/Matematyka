/* Dział XIII: Optymalizacja — zadania, które opisuje funkcja kwadratowa */
(function () {
/* niezależne sprawdzenie: skrajna wartość funkcji f na [lo, hi] wypada w x0 i wynosi v */
function ext(f, lo, hi, x0, v, max) {
  if (!near(f(x0), v)) return false;
  for (let k = 0; k <= 4000; k++) { const y = f(lo + (hi - lo) * k / 4000); if (max ? y > v + 1e-7 : y < v - 1e-7) return false; }
  return true;
}
const vx = (a, b) => M(t`p = \frac{-b}{2a} = \frac{${T(-b)}}{${T(2 * a)}} = ${T(-b / (2 * a))}`);

const GL = {
1: [
  function maxProduct() {
    const S = 2 * ri(3, 20), x = S / 2;
    return mk({ skill: 'największy iloczyn przy stałej sumie', pts: 2,
      text: t`Suma dwóch liczb rzeczywistych jest równa ${M(S)}. Wyznacz największą możliwą wartość iloczynu tych liczb oraz liczbę ${M('x')}, dla której jest ona osiągana (druga liczba to ${M(`${S} - x`)}).`,
      fields: [F(M('x ='), x), F('Największy iloczyn:', x * x)],
      hints: [t`Oznacz jedną liczbę ${M('x')}, drugą ${M(`${S} - x`)}. Iloczyn to funkcja ${M(t`f(x) = x(${S} - x) = -x^2 + ${S}x`)}.`, t`Wykresem jest parabola z ramionami w dół, więc największa wartość jest w wierzchołku: ${M(t`p = \dfrac{-b}{2a}`)}.`],
      steps: [M(t`f(x) = x(${S} - x) = -x^2 + ${S}x`), vx(-1, S), M(t`f(${x}) = ${x}\cdot(${S} - ${x}) = ${x * x}`)],
      answer: t`${M(`x = ${x}`)}, największy iloczyn: ${M(x * x)}`, check: () => ext(u => u * (S - u), -50, S + 50, x, x * x, true) });
  },
  function vertexExt() {
    const a = pick([-2, -1, -1, 1, 2]), p = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), q = ri(-9, 12), b = -2 * a * p, c = a * p * p + q, max = a < 0; need(c !== 0);
    return mk({ skill: 'największa lub najmniejsza wartość funkcji kwadratowej', pts: 2,
      text: t`Funkcja ${M(`f(x) = ${poly([a, b, c])}`)} jest określona dla wszystkich liczb rzeczywistych. Wyznacz argument, dla którego funkcja przyjmuje wartość ${max ? 'największą' : 'najmniejszą'}, oraz tę wartość.`,
      fields: [F(M('x ='), p), F(max ? 'Największa wartość:' : 'Najmniejsza wartość:', q)],
      hints: [t`${M(`a = ${a}`)} jest ${max ? 'ujemne – ramiona paraboli w dół, więc w wierzchołku jest wartość największa' : 'dodatnie – ramiona paraboli w górę, więc w wierzchołku jest wartość najmniejsza'}.`, t`Pierwsza współrzędna wierzchołka: ${M(t`p = \dfrac{-b}{2a}`)}. Szukana wartość to ${M('f(p)')}.`],
      steps: [vx(a, b), M(t`f(${p}) = ${a === 1 ? '' : a === -1 ? '-' : `${a}\\cdot `}${P(p)}^2${pm(b)}\cdot ${P(p)}${pm(c)} = ${a * p * p}${pm(b * p)}${pm(c)} = ${q}`)],
      answer: t`${M(`x = ${p}`)}, wartość ${max ? 'największa' : 'najmniejsza'}: ${M(q)}`, check: () => ext(u => a * u * u + b * u + c, p - 40, p + 40, p, q, max) });
  }
],
2: [
  function minSumSquares() {
    const S = 2 * ri(2, 12), x = S / 2, v = 2 * x * x;
    return mk({ skill: 'najmniejsza suma kwadratów', pts: 3,
      text: t`Suma dwóch liczb rzeczywistych ${M('x')} i ${M('y')} jest równa ${M(S)}. Wyznacz ${M('x')}, dla którego suma kwadratów ${M('x^2 + y^2')} jest najmniejsza, oraz tę najmniejszą wartość.`,
      fields: [F(M('x ='), x), F('Najmniejsza suma kwadratów:', v)],
      hints: [t`Z warunku ${M(`x + y = ${S}`)} wyznacz ${M(`y = ${S} - x`)} i wstaw do wyrażenia: ${M(t`f(x) = x^2 + (${S} - x)^2`)}.`, t`Po rozwinięciu: ${M(`f(x) = ${poly([2, -2 * S, S * S])}`)}. Ramiona w górę – najmniejsza wartość w wierzchołku.`],
      steps: [M(t`f(x) = x^2 + (${S} - x)^2 = x^2 + ${S * S} - ${2 * S}x + x^2 = ${poly([2, -2 * S, S * S])}`), vx(2, -2 * S), M(t`f(${x}) = ${x}^2 + ${S - x}^2 = ${v}`)],
      answer: t`${M(`x = ${x}`)} (wtedy ${M(`y = ${S - x}`)}), najmniejsza suma kwadratów: ${M(v)}`, check: () => ext(u => u * u + (S - u) * (S - u), -60, 60, x, v, false) });
  },
  function weightedSum() {
    const k = pick([2, 3, 4]), x = ri(1, 6), S = 2 * k * x, y = S / 2;
    return mk({ skill: 'największy iloczyn przy warunku liniowym', pts: 3,
      text: t`Liczby dodatnie ${M('x')} i ${M('y')} spełniają warunek ${M(`${k}x + y = ${S}`)}. Wyznacz ${M('x')} i ${M('y')}, dla których iloczyn ${M(t`x\cdot y`)} jest największy.`,
      fields: [F(M('x ='), x), F(M('y ='), y)],
      hints: [t`Wyznacz ${M(`y = ${S} - ${k}x`)} i zapisz iloczyn jako funkcję jednej zmiennej: ${M(t`f(x) = x(${S} - ${k}x)`)}.`, t`${M(`f(x) = ${poly([-k, S, 0])}`)}. Największa wartość jest w wierzchołku paraboli. Na koniec policz ${M('y')}.`],
      steps: [M(t`f(x) = x(${S} - ${k}x) = ${poly([-k, S, 0])}`), vx(-k, S), M(t`y = ${S} - ${k}\cdot ${x} = ${y}`), t`Obie liczby są dodatnie, więc warunki zadania są spełnione.`],
      answer: M(t`x = ${x},\quad y = ${y}`), check: () => ext(u => u * (S - k * u), 0, S / k, x, x * y, true) && k * x + y === S });
  }
],
3: [
  function diffProduct() {
    const d = 2 * ri(1, 9), x = d / 2, v = -x * x;
    return mk({ skill: 'najmniejszy iloczyn przy stałej różnicy', pts: 3,
      text: t`Różnica dwóch liczb rzeczywistych ${M('x')} i ${M('y')} jest równa ${M(d)}, to znaczy ${M(`x - y = ${d}`)}. Wyznacz ${M('x')}, dla którego iloczyn ${M(t`x\cdot y`)} jest najmniejszy, oraz ten najmniejszy iloczyn.`,
      fields: [F(M('x ='), x), F('Najmniejszy iloczyn:', v)],
      hints: [t`Z warunku wyznacz ${M(`y = x - ${d}`)}. Iloczyn: ${M(t`f(x) = x(x - ${d}) = ${poly([1, -d, 0])}`)}.`, t`Ramiona paraboli w górę, więc najmniejsza wartość jest w wierzchołku. Wynik będzie ujemny – to nie błąd.`],
      steps: [M(t`f(x) = x(x - ${d}) = ${poly([1, -d, 0])}`), vx(1, -d), M(t`y = ${x} - ${d} = ${x - d},\qquad f(${x}) = ${x}\cdot(${x - d}) = ${v}`)],
      answer: t`${M(`x = ${x}`)}, najmniejszy iloczyn: ${M(v)}`, check: () => ext(u => u * (u - d), -60, 60, x, v, false) });
  },
  function sumSq2() {
    const x = ri(1, 5), S = 5 * x, y = 2 * x, v = x * x + y * y;
    return mk({ skill: 'optymalizacja z warunkiem liniowym', pts: 4,
      text: t`Liczby rzeczywiste ${M('x')} i ${M('y')} spełniają warunek ${M(`x + 2y = ${S}`)}. Wyznacz ${M('x')} i ${M('y')}, dla których wyrażenie ${M('x^2 + y^2')} przyjmuje najmniejszą wartość.`,
      fields: [F(M('x ='), x), F(M('y ='), y)],
      hints: [t`Wyznacz ${M(`x = ${S} - 2y`)} i wstaw do wyrażenia – dostaniesz funkcję kwadratową zmiennej ${M('y')}.`, t`${M(t`f(y) = (${S} - 2y)^2 + y^2 = ${poly([5, -4 * S, S * S], 'y')}`)}. Najmniejsza wartość jest w wierzchołku.`],
      steps: [M(t`f(y) = (${S} - 2y)^2 + y^2 = ${S * S} - ${4 * S}y + 4y^2 + y^2 = ${poly([5, -4 * S, S * S], 'y')}`), M(t`y = \frac{-b}{2a} = \frac{${4 * S}}{10} = ${y}`), M(t`x = ${S} - 2\cdot ${y} = ${x}`), t`Najmniejsza wartość wyrażenia: ${M(`${x}^2 + ${y}^2 = ${v}`)}.`],
      answer: M(t`x = ${x},\quad y = ${y}`), check: () => ext(u => (S - 2 * u) * (S - 2 * u) + u * u, -60, 60, y, v, false) && x + 2 * y === S });
  }
]
};

const GG = {
1: [
  function fence4() {
    const L = 4 * ri(3, 25), a = L / 4;
    return mk({ skill: 'prostokąt o danym obwodzie', pts: 2,
      text: t`Z siatki długości ${M(L)} m trzeba ogrodzić prostokątny wybieg. Jeden bok wybiegu ma długość ${M('x')}. Wyznacz ${M('x')}, dla którego pole wybiegu jest największe, oraz to największe pole.`,
      fields: [F(M('x ='), a, { unit: 'm' }), F('Największe pole:', a * a, { unit: 'm²' })],
      hints: [t`Obwód: ${M(`2x + 2y = ${L}`)}, więc drugi bok to ${M(`y = ${L / 2} - x`)}. Pole: ${M(t`P(x) = x(${L / 2} - x)`)}.`, t`${M(`P(x) = -x^2 + ${L / 2}x`)} – parabola z ramionami w dół, największa wartość w wierzchołku.`],
      steps: [M(t`P(x) = x(${L / 2} - x) = -x^2 + ${L / 2}x,\qquad 0 < x < ${L / 2}`), vx(-1, L / 2), t`Drugi bok: ${M(`${L / 2} - ${T(a)} = ${T(a)}`)} – największe pole ma kwadrat.`, M(t`P(${T(a)}) = ${T(a)}\cdot ${T(a)} = ${T(a * a)}`)],
      answer: t`${M(`x = ${T(a)}`)} m, pole ${M(T(a * a))} m²`, check: () => ext(u => u * (L / 2 - u), 0, L / 2, a, a * a, true) });
  },
  function profit() {
    const p = 5 * ri(2, 12), c = 50 * ri(1, 8), b = 2 * p, v = p * p - c; need(v > 0);
    return mk({ skill: 'największy zysk', pts: 2,
      text: t`Dzienny zysk firmy (w złotych) ze sprzedaży ${M('x')} sztuk towaru opisuje funkcja ${M(`z(x) = ${poly([-1, b, -c])}`)}, gdzie ${M(t`0 \leq x \leq ${b}`)}. Przy sprzedaży ilu sztuk dzienny zysk jest największy i ile wtedy wynosi?`,
      fields: [F('Liczba sztuk:', p), F('Największy zysk:', v, { unit: 'zł' })],
      hints: [t`Wykresem funkcji ${M('z')} jest parabola z ramionami w dół. Największa wartość jest w wierzchołku.`, t`${M(t`p = \dfrac{-b}{2a} = \dfrac{-${b}}{-2}`)}. Sprawdź, czy wynik mieści się w przedziale ${M(t`\langle 0,\ ${b}\rangle`)}, a potem policz ${M('z(p)')}.`],
      steps: [vx(-1, b), t`Liczba ${M(p)} należy do przedziału ${M(t`\langle 0,\ ${b}\rangle`)}.`, M(t`z(${p}) = -${p}^2 + ${b}\cdot ${p} - ${c} = ${-p * p} + ${b * p} - ${c} = ${v}`)],
      answer: t`${M(p)} sztuk, zysk ${M(N(v))} zł`, check: () => ext(u => -u * u + b * u - c, 0, b, p, v, true) });
  }
],
2: [
  function fenceWall() {
    const L = 4 * ri(4, 30), x = L / 4, y = L / 2;
    return mk({ skill: 'ogrodzenie przy murze', pts: 3,
      text: t`Prostokątny ogródek przylega jednym bokiem do muru. Pozostałe trzy boki trzeba ogrodzić siatką o łącznej długości ${M(L)} m. Dwa boki prostopadłe do muru mają długość ${M('x')} każdy. Wyznacz ${M('x')}, dla którego pole ogródka jest największe, oraz to największe pole.`,
      fields: [F(M('x ='), x, { unit: 'm' }), F('Największe pole:', x * y, { unit: 'm²' })],
      hints: [t`Siatka idzie na dwa boki długości ${M('x')} i jeden bok równoległy do muru: ${M(`2x + y = ${L}`)}, więc ${M(`y = ${L} - 2x`)}.`, t`Pole: ${M(t`P(x) = x(${L} - 2x) = ${poly([-2, L, 0])}`)}. Największa wartość w wierzchołku paraboli.`],
      steps: [M(t`P(x) = x(${L} - 2x) = ${poly([-2, L, 0])},\qquad 0 < x < ${L / 2}`), vx(-2, L), t`Bok równoległy do muru: ${M(t`${L} - 2\cdot ${x} = ${y}`)} m.`, M(t`P(${x}) = ${x}\cdot ${y} = ${x * y}`)],
      answer: t`${M(`x = ${x}`)} m, pole ${M(N(x * y))} m²`, check: () => ext(u => u * (L - 2 * u), 0, L / 2, x, x * y, true) });
  },
  function tickets() {
    const k = pick([2, 5, 10]), xs = ri(1, 6), p = pick([20, 24, 30, 36, 40]), n = k * (p - 2 * xs), price = p - xs, rev = price * (n + k * xs); need(n > 0);
    return mk({ skill: 'największy przychód', pts: 4,
      text: t`Przy cenie biletu ${M(p)} zł kino sprzedaje dziennie ${M(n)} biletów. Każda obniżka ceny o ${M(1)} zł zwiększa liczbę sprzedanych biletów o ${M(k)}. Wyznacz cenę biletu, przy której dzienny przychód ze sprzedaży jest największy, oraz ten największy przychód.`,
      fields: [F('Cena biletu:', price, { unit: 'zł' }), F('Największy przychód:', rev, { unit: 'zł' })],
      hints: [t`Oznacz przez ${M('x')} liczbę złotych, o którą obniżono cenę. Wtedy cena to ${M(`${p} - x`)}, a liczba biletów ${M(`${n} + ${k}x`)}.`, t`Przychód = cena razy liczba biletów: ${M(t`f(x) = (${p} - x)(${n} + ${k}x) = ${poly([-k, p * k - n, p * n])}`)}. Szukasz wierzchołka.`],
      steps: [M(t`f(x) = (${p} - x)(${n} + ${k}x) = ${poly([-k, p * k - n, p * n])}`), vx(-k, p * k - n), t`Cena: ${M(`${p} - ${xs} = ${price}`)} zł, liczba biletów: ${M(t`${n} + ${k}\cdot ${xs} = ${n + k * xs}`)}.`, M(t`${price}\cdot ${n + k * xs} = ${rev}`)],
      answer: t`cena ${M(price)} zł, przychód ${M(N(rev))} zł`, check: () => ext(u => (p - u) * (n + k * u), 0, p, xs, rev, true) });
  }
],
3: [
  function twoPens() {
    const L = 12 * ri(2, 15), x = L / 6, y = L / 4;
    return mk({ skill: 'dwa wybiegi z jednej siatki', pts: 4,
      text: t`Z siatki długości ${M(L)} m trzeba ogrodzić prostokątny teren i podzielić go jednym płotem na dwa prostokątne wybiegi. Płot dzielący jest równoległy do boków długości ${M('x')}, więc siatka tworzy trzy odcinki długości ${M('x')} i dwa odcinki długości ${M('y')}. Wyznacz ${M('x')} i ${M('y')}, dla których łączne pole wybiegów jest największe.`,
      fields: [F(M('x ='), x, { unit: 'm' }), F(M('y ='), y, { unit: 'm' })],
      hints: [t`Długość siatki: ${M(`3x + 2y = ${L}`)}, stąd ${M(t`y = \dfrac{${L} - 3x}{2}`)}. Pole całego terenu to ${M(t`x\cdot y`)}.`, t`${M(t`P(x) = x\cdot\dfrac{${L} - 3x}{2} = ${poly([-1.5, L / 2, 0])}`)}. Znajdź wierzchołek, potem policz ${M('y')}.`],
      steps: [M(t`P(x) = x\cdot\frac{${L} - 3x}{2} = ${poly([-1.5, L / 2, 0])},\qquad 0 < x < ${L / 3}`), vx(-1.5, L / 2), M(t`y = \frac{${L} - 3\cdot ${x}}{2} = ${y}`), t`Największe łączne pole: ${M(t`${x}\cdot ${y} = ${x * y}`)} m².`],
      answer: M(t`x = ${x}\ \text{m},\quad y = ${y}\ \text{m}`), check: () => ext(u => u * (L - 3 * u) / 2, 0, L / 3, x, x * y, true) && 3 * x + 2 * y === L });
  },
  function throwUp() {
    const v0 = 10 * ri(1, 5), h0 = ri(0, 12), tm = v0 / 10, hm = v0 * v0 / 20 + h0;
    return mk({ skill: 'ruch opisany funkcją kwadratową', pts: 2,
      text: t`Wysokość (w metrach), na jakiej znajduje się piłka po ${M('t')} sekundach od wyrzucenia, opisuje funkcja ${M(`h(t) = ${poly([-5, v0, h0], 't')}`)}. Po ilu sekundach piłka osiągnie największą wysokość i ile ta wysokość wynosi?`,
      fields: [F('Czas:', tm, { unit: 's' }), F('Największa wysokość:', hm, { unit: 'm' })],
      hints: [t`Wykres ${M('h(t)')} to parabola z ramionami w dół. Najwyższy punkt lotu to jej wierzchołek.`, t`${M(t`t = \dfrac{-b}{2a} = \dfrac{-${v0}}{-10}`)}. Największa wysokość to wartość funkcji dla tego ${M('t')}.`],
      steps: [M(t`t = \frac{-b}{2a} = \frac{${-v0}}{${-10}} = ${tm}`), M(t`h(${tm}) = -5\cdot ${tm}^2 + ${v0}\cdot ${tm}${h0 ? pm(h0) : ''} = ${-5 * tm * tm} + ${v0 * tm}${h0 ? pm(h0) : ''} = ${hm}`)],
      answer: t`po ${M(tm)} s, wysokość ${M(hm)} m`, check: () => ext(u => -5 * u * u + v0 * u + h0, 0, 12, tm, hm, true) });
  }
]
};

const r = String.raw;
MATURA.dzial({
  id: 'optymalizacja', store: 'optymalizacja-matura-v1', title: 'Optymalizacja', seq: 'max · min',
  lead: 'Zadania „największe pole, największy zysk, najmniejsza suma”, które sprowadzają się do wierzchołka paraboli. Na maturze to zwykle zadanie otwarte za 4 punkty.',
  topics: { L: 'Liczby i wyrażenia', G: 'Geometria i zadania praktyczne' },
  short: { L: 'Liczby', G: 'Geometria i praktyka' },
  bank: { L: GL, G: GG },
  formulas: {
    L: [['plan rozwiązania', r`1. oznacz niewiadomą \(x\)<br>2. zapisz szukaną wielkość jako funkcję \(f(x)\)<br>3. ustal dziedzinę<br>4. znajdź wierzchołek paraboli<br>5. odpowiedz na pytanie z zadania`], ['wierzchołek', r`\(p = \dfrac{-b}{2a},\quad q = f(p)\)`], ['co jest w wierzchołku', r`\(a < 0\): wartość największa<br>\(a > 0\): wartość najmniejsza`]],
    G: [['plan rozwiązania', r`1. rysunek i oznaczenia<br>2. warunek z treści (np. długość siatki) – wyznacz jedną zmienną<br>3. funkcja kwadratowa jednej zmiennej i jej dziedzina<br>4. wierzchołek<br>5. odpowiedź z jednostkami`], ['wierzchołek', r`\(p = \dfrac{-b}{2a},\quad q = f(p)\)`], ['przychód', r`przychód = cena \(\cdot\) liczba sprzedanych sztuk`], ['uwaga', r`sprawdź, czy \(p\) należy do dziedziny (długości i liczby sztuk nie mogą być ujemne)`]]
  }
});
})();
