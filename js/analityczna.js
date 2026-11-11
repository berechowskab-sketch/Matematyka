/* Dział IX: Geometria analityczna — proste, punkty i odcinki, okrąg i symetrie */
(function () {
const nz = (a, b) => { let v; do { v = ri(a, b); } while (v === 0); return v; };
const pt = (n, x, y) => `${n} = (${T(x)},\\ ${T(y)})`;
/* jak poly(), ale współczynniki niecałkowite jako ułamki zwykłe */
function fpoly(cs, v = 'x') {
  let s = ''; const n = cs.length - 1;
  cs.forEach((c, i) => { if (Math.abs(c) < 1e-12) return; const d = n - i, abs = Math.abs(c), vp = d === 0 ? '' : d === 1 ? v : `${v}^{${d}}`, co = d > 0 && near(abs, 1) ? '' : TF(abs); s += (s ? (c < 0 ? ' - ' : ' + ') : (c < 0 ? '-' : '')) + co + vp; });
  return s || '0';
}
const ln = (a, b) => `y = ${fpoly([a, b])}`;
const TR = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [4, 3, 5], [12, 5, 13], [8, 6, 10]];
const sgn = () => pick([1, -1]);
const sq = v => (v === 0 ? '' : `(${v})`);
const ceq = (a, b, r2) => `${a === 0 ? 'x^2' : `(x${pm(-a)})^2`} + ${b === 0 ? 'y^2' : `(y${pm(-b)})^2`} = ${r2}`;
const simp = m => { let s = 1; for (let k = 2; k * k <= m; k++) while (m % (k * k) === 0) { s *= k; m /= k * k; } return [s, m]; };

const GP = {
1: [
  function paramParallel() {
    const k = pick([1, 2, 3, -1, -2]), m = ri(-5, 6), c = nz(-6, 6), a = k * m + c, b1 = nz(-7, 7), b2 = nz(-7, 7); need(b1 !== b2 && a !== 0);
    return mk({ skill: 'proste równoległe',
      text: t`Proste o równaniach ${M(`y = (${fpoly([k, c], 'm')})x${pm(b1)}`)} oraz ${M(ln(a, b2))} są równoległe. Wyznacz ${M('m')}.`,
      fields: [F(M('m ='), m)],
      hints: [t`Proste ${M('y = a_1x + b_1')} i ${M('y = a_2x + b_2')} są równoległe, gdy mają równe współczynniki kierunkowe: ${M('a_1 = a_2')}.`, t`Rozwiąż równanie ${M(`${fpoly([k, c], 'm')} = ${a}`)}.`],
      steps: [M(`${fpoly([k, c], 'm')} = ${a}`), M(`${fpoly([k, 0], 'm')} = ${a - c}`), M(`m = ${m}`)],
      answer: M(`m = ${m}`), check: () => k * m + c === a });
  },
  function pointLine() {
    const a = nz(-5, 5), b = nz(-8, 8), x0 = pick([-4, -3, -2, -1, 2, 3, 4, 5]), y0 = a * x0 + b;
    return mk({ skill: 'punkt na prostej',
      text: t`Punkt ${M(`P = (${x0},\\ p)`)} leży na prostej o równaniu ${M(ln(a, b))}. Wyznacz ${M('p')}.`,
      fields: [F(M('p ='), y0)],
      hints: [t`Punkt leży na prostej, gdy jego współrzędne spełniają jej równanie.`, t`Wstaw ${M(`x = ${x0}`)} do równania prostej – otrzymane ${M('y')} to szukane ${M('p')}.`],
      steps: [M(t`p = ${a === 1 ? '' : a === -1 ? '-' : `${a}\\cdot `}${P(x0)}${pm(b)} = ${a * x0}${pm(b)} = ${y0}`)],
      answer: M(`p = ${y0}`), check: () => a * x0 + b === y0 });
  },
  function parallelThrough() {
    const a = nz(-4, 4), b = nz(-7, 7), x0 = nz(-5, 5), y0 = ri(-6, 6), c = y0 - a * x0; need(c !== b);
    return mk({ skill: 'prosta równoległa przez dany punkt', pts: 2,
      text: t`Prosta ${M('k')} jest równoległa do prostej ${M(ln(a, b))} i przechodzi przez punkt ${M(pt('P', x0, y0))}. Prosta ${M('k')} ma równanie ${M('y = ax + b')}. Wyznacz ${M('a')} i ${M('b')}.`,
      fields: [F(M('a ='), a), F(M('b ='), c)],
      hints: [t`Proste równoległe mają ten sam współczynnik kierunkowy, więc ${M(`a = ${a}`)}.`, t`Wstaw współrzędne punktu ${M('P')} do równania ${M(`y = ${fpoly([a, 0])} + b`)} i wylicz ${M('b')}.`],
      steps: [t`Równoległość: ${M(`a = ${a}`)}.`, M(t`${y0} = ${a === 1 ? '' : a === -1 ? '-' : `${a}\\cdot `}${P(x0)} + b \iff ${y0} = ${a * x0} + b`), M(`b = ${c}`)],
      answer: M(ln(a, c)), check: () => a * x0 + c === y0 });
  }
],
2: [
  function perpSlope() {
    const [p, q] = pick([[2, 1], [3, 1], [4, 1], [-2, 1], [-3, 1], [1, 2], [-1, 2], [2, 3], [-3, 2], [3, 4], [-1, 3], [5, 1], [-4, 3]]), a = p / q, m = -q / p, b = nz(-6, 6), c = nz(-6, 6);
    return mk({ skill: 'proste prostopadłe',
      text: t`Proste o równaniach ${M(ln(a, b))} oraz ${M(`y = mx${pm(c)}`)} są prostopadłe. Wyznacz ${M('m')}.`,
      fields: [F(M('m ='), m)],
      hints: [t`Proste są prostopadłe, gdy iloczyn ich współczynników kierunkowych jest równy ${M(-1)}: ${M(t`a_1\cdot a_2 = -1`)}.`, t`${M(t`${TF(a)}\cdot m = -1`)}. Wynik to liczba odwrotna do ${M(TF(a))} wzięta z przeciwnym znakiem.`],
      steps: [M(t`${a < 0 ? `\\left(${TF(a)}\\right)` : TF(a)}\cdot m = -1`), M(`m = ${TF(m)}`)],
      answer: M(`m = ${TF(m)}`), check: () => near(a * m, -1) });
  },
  function intersection() {
    const x0 = ri(-5, 5), y0 = ri(-6, 6), a1 = nz(-4, 4), a2 = nz(-4, 4), b1 = y0 - a1 * x0, b2 = y0 - a2 * x0; need(a1 !== a2 && b1 !== 0 && b2 !== 0);
    return mk({ skill: 'punkt przecięcia prostych', pts: 2,
      text: t`Proste o równaniach ${M(ln(a1, b1))} oraz ${M(ln(a2, b2))} przecinają się w punkcie ${M('P = (x,\\ y)')}. Wyznacz współrzędne punktu ${M('P')}.`,
      fields: [F(M('x ='), x0), F(M('y ='), y0)],
      hints: [t`W punkcie przecięcia obie proste mają to samo ${M('y')}, więc przyrównaj prawe strony równań.`, t`${M(`${fpoly([a1, b1])} = ${fpoly([a2, b2])}`)}. Po wyznaczeniu ${M('x')} wstaw go do dowolnego z równań.`],
      steps: [M(`${fpoly([a1, b1])} = ${fpoly([a2, b2])}`), M(`${fpoly([a1 - a2, 0])} = ${b2 - b1}`), M(`x = ${x0}`), M(t`y = ${a1 === 1 ? '' : a1 === -1 ? '-' : `${a1}\\cdot `}${P(x0)}${pm(b1)} = ${y0}`)],
      answer: M(`P = (${x0},\\ ${y0})`), check: () => a1 * x0 + b1 === y0 && a2 * x0 + b2 === y0 });
  },
  function generalForm() {
    const A = nz(-6, 6), B = pick([-4, -3, -2, -1, 1, 2, 3, 4]), C = nz(-9, 9), a = -A / B, b = -C / B;
    const eq = `${fpoly([A, 0])} ${B < 0 ? '-' : '+'} ${fpoly([Math.abs(B), 0], 'y')}${pm(C)} = 0`;
    return mk({ skill: 'od równania ogólnego do kierunkowego', pts: 2,
      text: t`Prosta ma równanie ogólne ${M(eq)}. Zapisz je w postaci kierunkowej ${M('y = ax + b')} i podaj ${M('a')} oraz ${M('b')}.`,
      fields: [F(M('a ='), a), F(M('b ='), b)],
      hints: [t`Wyznacz ${M('y')}: zostaw wyraz z ${M('y')} po lewej stronie, resztę przenieś na prawą (ze zmianą znaków).`, t`${M(`${fpoly([B, 0], 'y')} = ${fpoly([-A, -C])}`)}. Teraz podziel obie strony przez ${M(B)}.`],
      steps: [M(`${fpoly([B, 0], 'y')} = ${fpoly([-A, -C])}`), M(`y = ${fpoly([a, b])}`), M(t`a = ${TF(a)},\qquad b = ${TF(b)}`)],
      answer: M(`y = ${fpoly([a, b])}`), check: () => [0, 1, -2.5].every(x => near(A * x + B * (a * x + b) + C, 0)) });
  }
],
3: [
  function perpThrough() {
    const [p, q] = pick([[2, 1], [3, 1], [-2, 1], [1, 2], [-1, 2], [2, 3], [-3, 2], [-1, 3], [4, 1], [3, 2]]), a = p / q, m = -q / p, b = nz(-6, 6), x0 = p * nz(-3, 3), y0 = ri(-6, 6), c = y0 - m * x0;
    return mk({ skill: 'prosta prostopadła przez dany punkt', pts: 2,
      text: t`Prosta ${M('k')} jest prostopadła do prostej ${M(ln(a, b))} i przechodzi przez punkt ${M(pt('P', x0, y0))}. Prosta ${M('k')} ma równanie ${M('y = ax + b')}. Wyznacz ${M('a')} i ${M('b')}.`,
      fields: [F(M('a ='), m), F(M('b ='), c)],
      hints: [t`Współczynnik kierunkowy prostej prostopadłej: ${M(t`a = -\dfrac{1}{${a < 0 ? `(${TF(a)})` : TF(a)}} = ${TF(m)}`)}.`, t`Wstaw współrzędne punktu ${M('P')} do równania ${M(`y = ${fpoly([m, 0])} + b`)}.`],
      steps: [M(t`${a < 0 ? `\\left(${TF(a)}\\right)` : TF(a)}\cdot a = -1 \iff a = ${TF(m)}`), M(t`${y0} = ${m < 0 ? `\\left(${TF(m)}\\right)` : TF(m)}\cdot ${P(x0)} + b \iff ${y0} = ${T(m * x0)} + b`), M(`b = ${T(c)}`)],
      answer: M(ln(m, c)), check: () => near(a * m, -1) && near(m * x0 + c, y0) });
  },
  function bisector() {
    const Mx = ri(-4, 4), My = ri(-4, 4), dy = pick([1, 2]), k = pick([-3, -2, -1, 1, 2, 3]), dx = dy * k, A = [Mx - dx, My - dy], B = [Mx + dx, My + dy], a = -k, b = My + k * Mx;
    return mk({ skill: 'symetralna odcinka', pts: 3,
      text: t`Dane są punkty ${M(pt('A', A[0], A[1]))} i ${M(pt('B', B[0], B[1]))}. Symetralna odcinka ${M('AB')} ma równanie ${M('y = ax + b')}. Wyznacz ${M('a')} i ${M('b')}.`,
      fields: [F(M('a ='), a), F(M('b ='), b)],
      hints: [t`Symetralna przechodzi przez środek odcinka i jest do niego prostopadła. Zacznij od środka ${M('S')} i współczynnika kierunkowego prostej ${M('AB')}.`, t`${M(`S = (${Mx},\\ ${My})`)}, ${M(t`a_{AB} = ${TF(1 / k)}`)}. Współczynnik symetralnej: ${M(`a = ${a}`)}. Wstaw ${M('S')} do ${M(`y = ${fpoly([a, 0])} + b`)}.`],
      steps: [M(t`S = \left(\frac{${A[0]} + ${P(B[0])}}{2},\ \frac{${A[1]} + ${P(B[1])}}{2}\right) = (${Mx},\ ${My})`), M(t`a_{AB} = \frac{${B[1]} - ${P(A[1])}}{${B[0]} - ${P(A[0])}} = \frac{${2 * dy}}{${2 * dx}} = ${TF(1 / k)}`), t`Prostopadłość: ${M(`a = ${a}`)}.`, M(t`${My} = ${a === 1 ? '' : a === -1 ? '-' : `${a}\\cdot `}${P(Mx)} + b \iff b = ${b}`)],
      answer: M(ln(a, b)), check: () => { const f = x => a * x + b; return near(f(Mx), My) && near(Math.hypot(Mx + 1 - A[0], f(Mx + 1) - A[1]), Math.hypot(Mx + 1 - B[0], f(Mx + 1) - B[1])); } });
  }
]
};

const GO = {
1: [
  function midpoint() {
    const A = [ri(-8, 8), ri(-8, 8)], B = [ri(-8, 8), ri(-8, 8)], S = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]; need(A[0] !== B[0] && A[1] !== B[1]);
    return mk({ skill: 'środek odcinka',
      text: t`Dane są punkty ${M(pt('A', A[0], A[1]))} i ${M(pt('B', B[0], B[1]))}. Wyznacz współrzędne środka ${M('S = (x,\\ y)')} odcinka ${M('AB')}.`,
      fields: [F(M('x ='), S[0]), F(M('y ='), S[1])],
      hints: [t`Współrzędne środka to średnie arytmetyczne współrzędnych końców.`, t`${M(t`x = \dfrac{x_A + x_B}{2}`)}, ${M(t`y = \dfrac{y_A + y_B}{2}`)}.`],
      steps: [M(t`x = \frac{${A[0]} + ${P(B[0])}}{2} = ${T(S[0])}`), M(t`y = \frac{${A[1]} + ${P(B[1])}}{2} = ${T(S[1])}`)],
      answer: M(`S = (${T(S[0])},\\ ${T(S[1])})`), check: () => near(2 * S[0] - A[0], B[0]) && near(2 * S[1] - A[1], B[1]) });
  },
  function distance() {
    const [dx0, dy0, d] = pick(TR), dx = dx0 * sgn(), dy = dy0 * sgn(), A = [ri(-6, 6), ri(-6, 6)], B = [A[0] + dx, A[1] + dy];
    return mk({ skill: 'długość odcinka',
      text: t`Oblicz długość odcinka o końcach ${M(pt('A', A[0], A[1]))} i ${M(pt('B', B[0], B[1]))}.`,
      fields: [F(M('|AB| ='), d)],
      hints: [t`Wzór: ${M(t`|AB| = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}`)} – to twierdzenie Pitagorasa w układzie współrzędnych.`, t`Różnice współrzędnych: ${M(`${B[0]} - ${P(A[0])} = ${dx}`)} oraz ${M(`${B[1]} - ${P(A[1])} = ${dy}`)}.`],
      steps: [M(t`|AB| = \sqrt{${P(dx)}^2 + ${P(dy)}^2} = \sqrt{${dx * dx} + ${dy * dy}} = \sqrt{${d * d}} = ${d}`)],
      answer: M(`${d}`), check: () => near(Math.hypot(B[0] - A[0], B[1] - A[1]), d) });
  }
],
2: [
  function distanceSqrt() {
    const [dx0, dy0] = pick([[2, 4], [1, 1], [2, 2], [3, 3], [4, 4], [3, 6], [2, 6], [1, 3], [1, 2], [4, 8], [5, 5], [1, 5], [3, 9], [4, 6]]), dx = dx0 * sgn(), dy = dy0 * sgn(), A = [ri(-6, 6), ri(-6, 6)], B = [A[0] + dx, A[1] + dy], m = dx * dx + dy * dy, [s, n] = simp(m);
    return mk({ skill: 'długość odcinka – wynik z pierwiastkiem', pts: 2,
      text: t`Oblicz długość odcinka o końcach ${M(pt('A', A[0], A[1]))} i ${M(pt('B', B[0], B[1]))}. Wynik podaj w najprostszej postaci.`,
      fields: [F(M('|AB| ='), R(s, n))],
      hints: [t`${M(t`|AB| = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}`)}. Różnice współrzędnych: ${M(dx)} i ${M(dy)}.`, t`${M(t`|AB| = \sqrt{${m}}`)}.${s > 1 ? t` Wyłącz czynnik przed pierwiastek: ${M(t`${m} = ${s * s}\cdot ${n}`)}.` : ' Tego pierwiastka nie da się uprościć.'}`],
      steps: [M(t`|AB| = \sqrt{${P(dx)}^2 + ${P(dy)}^2} = \sqrt{${dx * dx} + ${dy * dy}} = \sqrt{${m}}`)].concat(s > 1 ? [M(t`\sqrt{${m}} = \sqrt{${s * s}\cdot ${n}} = ${rt(R(s, n))}`)] : []),
      answer: M(rt(R(s, n))), check: () => near(Math.hypot(B[0] - A[0], B[1] - A[1]), s * Math.sqrt(n)) });
  },
  function endFromMid() {
    const A = [ri(-8, 8), ri(-8, 8)], S = [ri(-6, 6), ri(-6, 6)], B = [2 * S[0] - A[0], 2 * S[1] - A[1]]; need(A[0] !== S[0] && A[1] !== S[1]);
    return mk({ skill: 'koniec odcinka przy danym środku', pts: 2,
      text: t`Punkt ${M(pt('S', S[0], S[1]))} jest środkiem odcinka ${M('AB')}, gdzie ${M(pt('A', A[0], A[1]))}. Wyznacz współrzędne punktu ${M('B = (x,\\ y)')}.`,
      fields: [F(M('x ='), B[0]), F(M('y ='), B[1])],
      hints: [t`Ze wzoru na środek: ${M(t`\dfrac{x_A + x_B}{2} = x_S`)}. Niewiadomą jest teraz ${M('x_B')}.`, t`${M(t`\dfrac{${A[0]} + x}{2} = ${S[0]}`)}, czyli ${M(`${A[0]} + x = ${2 * S[0]}`)}. Tak samo dla drugiej współrzędnej.`],
      steps: [M(t`\frac{${A[0]} + x}{2} = ${S[0]} \iff x = ${2 * S[0]} - ${P(A[0])} = ${B[0]}`), M(t`\frac{${A[1]} + y}{2} = ${S[1]} \iff y = ${2 * S[1]} - ${P(A[1])} = ${B[1]}`)],
      answer: M(`B = (${B[0]},\\ ${B[1]})`), check: () => near((A[0] + B[0]) / 2, S[0]) && near((A[1] + B[1]) / 2, S[1]) });
  }
],
3: [
  function triangleArea() {
    const hor = Math.random() < 0.5, u1 = ri(-7, 3), u2 = u1 + ri(2, 9), w0 = ri(-5, 5), u3 = ri(-7, 7), w3 = w0 + nz(-7, 7), base = u2 - u1, h = Math.abs(w3 - w0), area = base * h / 2;
    const A = hor ? [u1, w0] : [w0, u1], B = hor ? [u2, w0] : [w0, u2], C = hor ? [u3, w3] : [w3, u3];
    return mk({ skill: 'pole trójkąta w układzie współrzędnych', pts: 2,
      text: t`Wierzchołkami trójkąta ${M('ABC')} są punkty ${M(pt('A', A[0], A[1]))}, ${M(pt('B', B[0], B[1]))} i ${M(pt('C', C[0], C[1]))}. Oblicz pole tego trójkąta.`,
      fields: [F(M('P ='), area)],
      hints: [t`Punkty ${M('A')} i ${M('B')} mają tę samą ${hor ? 'drugą' : 'pierwszą'} współrzędną, więc bok ${M('AB')} jest ${hor ? 'poziomy' : 'pionowy'}. Weź go za podstawę.`, t`Podstawa: ${M(`|AB| = ${base}`)}. Wysokość to odległość punktu ${M('C')} od prostej ${M('AB')}, czyli różnica ${hor ? 'drugich' : 'pierwszych'} współrzędnych: ${M(`|${hor ? C[1] : C[0]} - ${P(w0)}| = ${h}`)}.`],
      steps: [M(`|AB| = ${u2} - ${P(u1)} = ${base}`), M(`h = |${hor ? C[1] : C[0]} - ${P(w0)}| = ${h}`), M(t`P = \tfrac12\cdot ${base}\cdot ${h} = ${T(area)}`)],
      answer: M(T(area)), check: () => near(Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2, area) });
  },
  function squareDiag() {
    const A = [ri(-6, 6), ri(-6, 6)], dx = nz(-8, 8), dy = nz(-8, 8), C = [A[0] + dx, A[1] + dy], d2 = dx * dx + dy * dy, area = d2 / 2;
    return mk({ skill: 'kwadrat w układzie współrzędnych', pts: 2,
      text: t`Punkty ${M(pt('A', A[0], A[1]))} i ${M(pt('C', C[0], C[1]))} są przeciwległymi wierzchołkami kwadratu ${M('ABCD')}. Oblicz pole tego kwadratu.`,
      fields: [F(M('P ='), area)],
      hints: [t`Odcinek ${M('AC')} jest przekątną kwadratu. Policz ${M('|AC|^2')} – pierwiastek nie będzie potrzebny.`, t`Pole kwadratu o przekątnej ${M('d')}: ${M(t`P = \dfrac{d^2}{2}`)} (bo ${M(t`d = a\sqrt2`)}).`],
      steps: [M(t`|AC|^2 = ${P(dx)}^2 + ${P(dy)}^2 = ${dx * dx} + ${dy * dy} = ${d2}`), M(t`P = \frac{|AC|^2}{2} = \frac{${d2}}{2} = ${T(area)}`)],
      answer: M(T(area)), check: () => { const a = Math.hypot(dx, dy) / Math.SQRT2; return near(a * a, area); } });
  }
]
};

const GK = {
1: [
  function circleRead() {
    const a = nz(-7, 7), b = nz(-7, 7), r0 = ri(2, 9);
    return mk({ skill: 'środek i promień z równania okręgu', pts: 2,
      text: t`Okrąg ma równanie ${M(ceq(a, b, r0 * r0))}. Wyznacz współrzędne środka ${M('S = (a,\\ b)')} i promień ${M('r')} tego okręgu.`,
      fields: [F(M('a ='), a), F(M('b ='), b), F(M('r ='), r0)],
      hints: [t`Równanie okręgu: ${M('(x - a)^2 + (y - b)^2 = r^2')}. W nawiasach są <b>minusy</b>, więc ${M(`(x${pm(-a)})`)} oznacza ${M(`a = ${a}`)}.`, t`Po prawej stronie stoi ${M('r^2')}, a nie ${M('r')}: ${M(`r^2 = ${r0 * r0}`)}.`],
      steps: [M(t`${ceq(a, b, r0 * r0)} \iff (x - ${P(a)})^2 + (y - ${P(b)})^2 = ${r0}^2`), M(t`S = (${a},\ ${b}),\qquad r = ${r0}`)],
      answer: M(t`S = (${a},\ ${b}),\quad r = ${r0}`), check: () => near(Math.pow(a + r0 - a, 2) + Math.pow(b - b, 2), r0 * r0) });
  },
  function symPoint() {
    const x = nz(-9, 9), y = nz(-9, 9), kind = pick(['Ox', 'Oy', 'O']), img = kind === 'Ox' ? [x, -y] : kind === 'Oy' ? [-x, y] : [-x, -y];
    const name = kind === 'O' ? t`początku układu współrzędnych` : t`osi ${M(kind)}`;
    return mk({ skill: 'symetria punktu', pts: 1,
      text: t`Punkt ${M("P' = (x,\\ y)")} jest obrazem punktu ${M(pt('P', x, y))} w symetrii względem ${name}. Wyznacz współrzędne punktu ${M("P'")}.`,
      fields: [F(M('x ='), img[0]), F(M('y ='), img[1])],
      hints: [kind === 'Ox' ? t`W symetrii względem osi ${M('Ox')} punkt „przeskakuje” na drugą stronę osi poziomej: pierwsza współrzędna zostaje.` : kind === 'Oy' ? t`W symetrii względem osi ${M('Oy')} punkt „przeskakuje” na drugą stronę osi pionowej: druga współrzędna zostaje.` : t`W symetrii względem początku układu obie współrzędne zmieniają znak.`, t`${kind === 'Ox' ? t`${M("(x,\\ y) \\to (x,\\ -y)")}` : kind === 'Oy' ? t`${M("(x,\\ y) \\to (-x,\\ y)")}` : t`${M("(x,\\ y) \\to (-x,\\ -y)")}`}.`],
      steps: [M(t`P' = (${img[0]},\ ${img[1]})`)],
      answer: M(t`P' = (${img[0]},\ ${img[1]})`), check: () => (kind === 'Ox' ? img[0] === x && img[1] + y === 0 : kind === 'Oy' ? img[0] + x === 0 && img[1] === y : img[0] + x === 0 && img[1] + y === 0) });
  }
],
2: [
  function circleEq() {
    const a = nz(-6, 6), b = nz(-6, 6), [dx0, dy0, r0] = pick(TR), dx = dx0 * sgn(), dy = dy0 * sgn(), Pp = [a + dx, b + dy];
    const o = opts(ceq(a, b, r0 * r0), [ceq(-a, -b, r0 * r0), ceq(a, b, r0), ceq(-a, -b, r0)]);
    return mk(Object.assign({ skill: 'równanie okręgu o danym środku',
      text: DOK + t`Okrąg o środku ${M(pt('S', a, b))} przechodzi przez punkt ${M(pt('P', Pp[0], Pp[1]))}. Równanie tego okręgu ma postać`,
      hints: [t`Promień to odległość środka od punktu na okręgu: ${M('r = |SP|')}.`, t`${M(t`r^2 = ${P(dx)}^2 + ${P(dy)}^2 = ${r0 * r0}`)}. W równaniu ${M('(x - a)^2 + (y - b)^2 = r^2')} po prawej stronie jest kwadrat promienia.`],
      steps: [M(t`r^2 = |SP|^2 = (${Pp[0]} - ${P(a)})^2 + (${Pp[1]} - ${P(b)})^2 = ${dx * dx} + ${dy * dy} = ${r0 * r0}`), M(ceq(a, b, r0 * r0))],
      answer: M(ceq(a, b, r0 * r0)), check: () => near(Math.pow(Pp[0] - a, 2) + Math.pow(Pp[1] - b, 2), r0 * r0) }, o));
  },
  function pointCircle() {
    const a = nz(-5, 5), b = nz(-5, 5), kind = ri(0, 2), LAB = ['leży wewnątrz okręgu.', 'leży na okręgu.', 'leży na zewnątrz okręgu.'];
    let r0, dx, dy;
    if (kind === 1) { const tr = pick(TR); dx = tr[0] * sgn(); dy = tr[1] * sgn(); r0 = tr[2]; } else { r0 = ri(3, 7); dx = nz(-8, 8); dy = nz(-8, 8); need(kind === 0 ? dx * dx + dy * dy < r0 * r0 : dx * dx + dy * dy > r0 * r0); }
    const Pp = [a + dx, b + dy], d2 = dx * dx + dy * dy, o = opts(LAB[kind], LAB.filter((x, i) => i !== kind), { n: 3, raw: true, keep: LAB });
    return mk(Object.assign({ skill: 'położenie punktu względem okręgu',
      text: DOK + t`Dany jest okrąg o równaniu ${M(ceq(a, b, r0 * r0))} oraz punkt ${M(pt('P', Pp[0], Pp[1]))}. Punkt ${M('P')}`,
      hints: [t`Wstaw współrzędne punktu ${M('P')} do lewej strony równania okręgu – dostaniesz kwadrat odległości punktu od środka.`, t`Porównaj wynik z ${M(`r^2 = ${r0 * r0}`)}: mniejszy – punkt w środku, równy – na okręgu, większy – na zewnątrz.`],
      steps: [M(t`(${Pp[0]}${pm(-a)})^2 + (${Pp[1]}${pm(-b)})^2 = ${P(dx)}^2 + ${P(dy)}^2 = ${d2}`), t`${M(t`${d2} ${d2 < r0 * r0 ? '<' : d2 === r0 * r0 ? '=' : '>'} ${r0 * r0}`)}, więc punkt ${M('P')} ${LAB[kind]}`],
      answer: 'Punkt P ' + LAB[kind], check: () => { const d = Math.hypot(Pp[0] - a, Pp[1] - b); return kind === 0 ? d < r0 : kind === 1 ? near(d, r0) : d > r0; } }, o));
  },
  function tangentAxis() {
    const a = nz(-8, 8), b = nz(-8, 8), ax = pick(['Ox', 'Oy']), r0 = ax === 'Ox' ? Math.abs(b) : Math.abs(a); need(Math.abs(a) !== Math.abs(b));
    return mk({ skill: 'okrąg styczny do osi układu',
      text: t`Okrąg o środku ${M(pt('S', a, b))} jest styczny do osi ${M(ax)}. Wyznacz promień tego okręgu.`,
      fields: [F(M('r ='), r0)],
      hints: [t`Okrąg styczny do prostej ma promień równy odległości środka od tej prostej.`, ax === 'Ox' ? t`Odległość punktu od osi ${M('Ox')} to wartość bezwzględna jego <b>drugiej</b> współrzędnej.` : t`Odległość punktu od osi ${M('Oy')} to wartość bezwzględna jego <b>pierwszej</b> współrzędnej.`],
      steps: [M(t`r = |${ax === 'Ox' ? b : a}| = ${r0}`)],
      answer: M(`r = ${r0}`), check: () => { let hits = 0; for (let k = -2000; k <= 2000; k++) { const u = k / 100, d = ax === 'Ox' ? Math.hypot(u - a, 0 - b) : Math.hypot(0 - a, u - b); if (d < r0 - 1e-9) return false; if (near(d, r0)) hits++; } return hits === 1; } });
  }
],
3: [
  function diamCircle() {
    const S = [ri(-5, 5), ri(-5, 5)], [dx0, dy0, r0] = pick(TR), dx = dx0 * sgn(), dy = dy0 * sgn(), A = [S[0] - dx, S[1] - dy], B = [S[0] + dx, S[1] + dy];
    return mk({ skill: 'okrąg o danej średnicy', pts: 3,
      text: t`Odcinek ${M('AB')} o końcach ${M(pt('A', A[0], A[1]))} i ${M(pt('B', B[0], B[1]))} jest średnicą okręgu. Wyznacz współrzędne środka ${M('S = (a,\\ b)')} i promień ${M('r')} tego okręgu.`,
      fields: [F(M('a ='), S[0]), F(M('b ='), S[1]), F(M('r ='), r0)],
      hints: [t`Środek okręgu to środek średnicy ${M('AB')}.`, t`Promień to połowa długości średnicy: ${M(t`r = \tfrac12|AB|`)} (albo odległość ${M('|SA|')}).`],
      steps: [M(t`S = \left(\frac{${A[0]} + ${P(B[0])}}{2},\ \frac{${A[1]} + ${P(B[1])}}{2}\right) = (${S[0]},\ ${S[1]})`), M(t`|AB| = \sqrt{${P(2 * dx)}^2 + ${P(2 * dy)}^2} = \sqrt{${4 * dx * dx + 4 * dy * dy}} = ${2 * r0}`), M(t`r = \tfrac12\cdot ${2 * r0} = ${r0}`)],
      answer: M(t`S = (${S[0]},\ ${S[1]}),\quad r = ${r0}`), check: () => near(Math.hypot(A[0] - S[0], A[1] - S[1]), r0) && near(Math.hypot(B[0] - S[0], B[1] - S[1]), r0) && near(Math.hypot(B[0] - A[0], B[1] - A[1]), 2 * r0) });
  },
  function circleSym() {
    const a = nz(-7, 7), b = nz(-7, 7), r2 = pick([4, 9, 16, 25, 5, 10, 13]), kind = pick(['Ox', 'Oy', 'O']), img = kind === 'Ox' ? [a, -b] : kind === 'Oy' ? [-a, b] : [-a, -b];
    const o = opts(ceq(img[0], img[1], r2), [ceq(a, b, r2), ceq(-a, b, r2), ceq(a, -b, r2), ceq(-a, -b, r2)]);
    return mk(Object.assign({ skill: 'obraz okręgu w symetrii',
      text: DOK + t`Okrąg ${M("o'")} jest obrazem okręgu o równaniu ${M(ceq(a, b, r2))} w symetrii względem ${kind === 'O' ? 'początku układu współrzędnych' : t`osi ${M(kind)}`}. Okrąg ${M("o'")} ma równanie`,
      hints: [t`Symetria nie zmienia promienia. Wystarczy znaleźć obraz środka ${M(`S = (${a},\\ ${b})`)}.`, kind === 'Ox' ? t`Symetria względem ${M('Ox')} zmienia znak drugiej współrzędnej.` : kind === 'Oy' ? t`Symetria względem ${M('Oy')} zmienia znak pierwszej współrzędnej.` : t`Symetria względem początku układu zmienia znaki obu współrzędnych.`],
      steps: [t`Środek danego okręgu: ${M(`S = (${a},\\ ${b})`)}.`, t`Obraz środka: ${M(`S' = (${img[0]},\\ ${img[1]})`)}; promień bez zmian.`, M(ceq(img[0], img[1], r2))],
      answer: M(ceq(img[0], img[1], r2)), check: () => (kind === 'Ox' ? img[0] === a && img[1] === -b : kind === 'Oy' ? img[0] === -a && img[1] === b : img[0] === -a && img[1] === -b) }, o));
  }
]
};

const r = String.raw;
MATURA.dzial({
  id: 'analityczna', store: 'analityczna-matura-v1', title: 'Geometria analityczna', seq: 'y = ax + b',
  lead: 'Proste równoległe i prostopadłe, punkt przecięcia, środek i długość odcinka, równanie okręgu oraz symetrie w układzie współrzędnych.',
  topics: { P: 'Proste', O: 'Punkty i odcinki', K: 'Okrąg i symetrie' },
  short: { O: 'Odcinki', K: 'Okrąg' },
  bank: { P: GP, O: GO, K: GK },
  formulas: {
    P: [['równanie kierunkowe', r`\(y = ax + b\)<br>\(a = \dfrac{y_B - y_A}{x_B - x_A}\)`], ['równanie ogólne', r`\(Ax + By + C = 0\)`], ['proste równoległe', r`\(a_1 = a_2\)`], ['proste prostopadłe', r`\(a_1\cdot a_2 = -1\)`], ['punkt przecięcia', r`rozwiąż układ równań obu prostych`]],
    O: [['długość odcinka', r`\(|AB| = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}\)`], ['środek odcinka', r`\(S = \left(\dfrac{x_A + x_B}{2},\ \dfrac{y_A + y_B}{2}\right)\)`], ['kwadrat', r`przekątna \(d = a\sqrt2\), pole \(P = \dfrac{d^2}{2}\)`]],
    K: [['równanie okręgu', r`\((x - a)^2 + (y - b)^2 = r^2\)<br>środek \(S = (a,\ b)\), promień \(r\)`], ['symetrie', r`względem \(Ox\): \((x,\ y) \to (x,\ -y)\)<br>względem \(Oy\): \((x,\ y) \to (-x,\ y)\)<br>względem \((0,\ 0)\): \((x,\ y) \to (-x,\ -y)\)`], ['styczność do osi', r`do \(Ox\): \(r = |b|\)<br>do \(Oy\): \(r = |a|\)`]]
  }
});
})();
