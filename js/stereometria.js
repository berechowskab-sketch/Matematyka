/* Dział X: Stereometria — graniastosłupy, ostrosłupy, bryły obrotowe */
(function () {
const dg = a => t`${a}^\circ`;
const TG = t`\operatorname{tg}`;
const rad = a => a * Math.PI / 180;
const PI_HELP = 'Wynik zapisz jako wielokrotność π: wpisz samą liczbę stojącą przed π (może być ułamkiem, np. 32/3).';
/* schematyczne rysunki brył; L – podpisy */
function bryla(kind, L) {
  L = L || {};
  const tx = (x, y, s, anc) => (s === undefined ? '' : `<text class="pl" x="${x}" y="${y}" text-anchor="${anc || 'middle'}">${s}</text>`);
  const ln = (a, b, c, d, dash) => `<line class="${dash ? 'ds' : 'cv'}" x1="${a}" y1="${b}" x2="${c}" y2="${d}"/>`;
  let s = '', alt = '';
  if (kind === 'cuboid') {
    alt = 'Prostopadłościan';
    s = `<rect class="cv" x="60" y="80" width="140" height="95"/>` + ln(60, 80, 110, 45) + ln(200, 80, 250, 45) + ln(110, 45, 250, 45) + ln(250, 45, 250, 140) + ln(200, 175, 250, 140) +
      ln(60, 175, 110, 140, 1) + ln(110, 140, 250, 140, 1) + ln(110, 140, 110, 45, 1) + (L.d ? ln(60, 175, 250, 45, 1) + ln(60, 175, 250, 140, 1) : '') +
      tx(130, 193, L.a) + tx(236, 168, L.b, 'start') + tx(258, 96, L.c, 'start') + (L.d ? tx(150, 100, L.d, 'end') : '') + (L.ang ? tx(104, 160, L.ang, 'start') : '');
  } else if (kind === 'pyramid') {
    alt = 'Ostrosłup prawidłowy czworokątny';
    s = ln(50, 175, 200, 175) + ln(200, 175, 255, 135) + ln(255, 135, 105, 135, 1) + ln(105, 135, 50, 175, 1) + ln(152, 30, 50, 175) + ln(152, 30, 200, 175) + ln(152, 30, 255, 135) + ln(152, 30, 105, 135, 1) +
      ln(152, 30, 152, 155, 1) + (L.h ? ln(152, 30, 227, 155, 1) + ln(152, 155, 227, 155, 1) : '') + (L.e ? ln(152, 155, 255, 135, 1) : '') +
      tx(125, 193, L.a) + tx(146, 105, L.H, 'end') + (L.h ? tx(200, 95, L.h, 'start') : '') + (L.ang ? tx(L.e ? 222 : 205, L.e ? 136 : 150, L.ang, 'end') : '') + tx(152, 22, 'S');
  } else if (kind === 'cylinder') {
    alt = 'Walec';
    s = `<ellipse class="cv" cx="150" cy="50" rx="72" ry="18"/><path class="cv" d="M78 165a72 18 0 0 0 144 0"/><path class="ds" d="M78 165a72 18 0 0 1 144 0"/>` + ln(78, 50, 78, 165) + ln(222, 50, 222, 165) + ln(150, 165, 222, 165, 1) +
      tx(186, 160, L.r) + tx(232, 112, L.H, 'start');
  } else if (kind === 'cone') {
    alt = 'Stożek';
    s = `<path class="cv" d="M78 165a72 18 0 0 0 144 0"/><path class="ds" d="M78 165a72 18 0 0 1 144 0"/>` + ln(150, 35, 78, 165) + ln(150, 35, 222, 165) + ln(150, 35, 150, 165, 1) + ln(150, 165, 222, 165, 1) +
      tx(186, 160, L.r) + tx(144, 110, L.H, 'end') + tx(196, 95, L.l, 'start') + (L.ang ? tx(202, 160, L.ang, 'end') : '');
  } else if (kind === 'sphere') {
    alt = 'Kula';
    s = `<circle class="cv" cx="150" cy="105" r="72"/><path class="cv" d="M78 105a72 20 0 0 0 144 0" style="stroke-width:1.6"/><path class="ds" d="M78 105a72 20 0 0 1 144 0"/>` + ln(150, 105, 222, 105, 1) + `<circle class="pt" cx="150" cy="105" r="2.5"/>` + tx(186, 99, L.r);
  } else {
    alt = 'Graniastosłup prawidłowy trójkątny';
    s = ln(60, 175, 200, 175) + ln(60, 65, 200, 65) + ln(60, 65, 150, 35) + ln(200, 65, 150, 35) + ln(60, 175, 60, 65) + ln(200, 175, 200, 65) + ln(60, 175, 150, 145, 1) + ln(200, 175, 150, 145, 1) + ln(150, 145, 150, 35, 1) +
      tx(130, 193, L.a) + tx(210, 125, L.H, 'start');
  }
  return `<p class="cap">Rysunek pomocniczy (bez zachowania skali)</p><svg class="plot" viewBox="0 0 310 205" style="max-width:330px" role="img" aria-label="${alt}">${s}</svg>`;
}
const QUAD = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 10, 11, 15], [2, 4, 4, 6], [4, 6, 12, 14]];
const TR = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10], [8, 15, 17], [9, 12, 15]];

const GG = {
1: [
  function cuboidVol() {
    const a = ri(2, 9), b = ri(2, 9), c = ri(2, 12), V = a * b * c, Pc = 2 * (a * b + a * c + b * c);
    return mk({ skill: 'objętość i pole powierzchni prostopadłościanu', pts: 2, fig: bryla('cuboid', { a, b, c }),
      text: t`Prostopadłościan ma krawędzie długości ${M(a)}, ${M(b)} i ${M(c)}. Oblicz jego objętość ${M('V')} i pole powierzchni całkowitej ${M('P_c')}.`,
      fields: [F(M('V ='), V), F(M('P_c ='), Pc)],
      hints: [t`Objętość to iloczyn trzech krawędzi wychodzących z jednego wierzchołka.`, t`Prostopadłościan ma trzy pary jednakowych ścian: ${M(t`P_c = 2(ab + ac + bc)`)}.`],
      steps: [M(t`V = ${a}\cdot ${b}\cdot ${c} = ${V}`), M(t`P_c = 2\cdot(${a}\cdot ${b} + ${a}\cdot ${c} + ${b}\cdot ${c}) = 2\cdot(${a * b} + ${a * c} + ${b * c}) = ${Pc}`)],
      answer: M(t`V = ${V},\quad P_c = ${Pc}`), check: () => V === a * b * c && Pc === a * b * 2 + a * c * 2 + b * c * 2 });
  },
  function cubeFromSurface() {
    const a = ri(2, 9), Pc = 6 * a * a;
    return mk({ skill: 'sześcian – od pola do objętości', pts: 2,
      text: t`Pole powierzchni całkowitej sześcianu jest równe ${M(Pc)}. Oblicz długość krawędzi ${M('a')} i objętość ${M('V')} tego sześcianu.`,
      fields: [F(M('a ='), a), F(M('V ='), a * a * a)],
      hints: [t`Sześcian ma ${M(6)} jednakowych ścian – kwadratów o boku ${M('a')}: ${M('P_c = 6a^2')}.`, t`${M(`6a^2 = ${Pc}`)}, więc ${M(`a^2 = ${a * a}`)}. Potem ${M('V = a^3')}.`],
      steps: [M(t`6a^2 = ${Pc} \iff a^2 = ${a * a} \iff a = ${a}`), M(`V = ${a}^3 = ${a * a * a}`)],
      answer: M(t`a = ${a},\quad V = ${a * a * a}`), check: () => near(Math.cbrt(a * a * a), a) && 6 * a * a === Pc });
  }
],
2: [
  function cuboidDiag() {
    const [a, b, c, d] = pick(QUAD);
    return mk({ skill: 'przekątna prostopadłościanu', fig: bryla('cuboid', { a, b, c, d: 'd' }),
      text: t`Prostopadłościan ma krawędzie długości ${M(a)}, ${M(b)} i ${M(c)}. Oblicz długość ${M('d')} przekątnej tego prostopadłościanu.`,
      fields: [F(M('d ='), d)],
      hints: [t`Przekątna prostopadłościanu, przekątna podstawy i krawędź boczna tworzą trójkąt prostokątny.`, t`Dwukrotnie twierdzenie Pitagorasa daje ${M('d^2 = a^2 + b^2 + c^2')}.`],
      steps: [M(t`d^2 = ${a}^2 + ${b}^2 + ${c}^2 = ${a * a} + ${b * b} + ${c * c} = ${d * d}`), M(t`d = \sqrt{${d * d}} = ${d}`)],
      answer: M(`d = ${d}`), check: () => near(Math.hypot(Math.hypot(a, b), c), d) });
  },
  function triPrismVol() {
    const a = 2 * ri(1, 5), H = ri(2, 10), k = a * a / 4 * H;
    return mk({ skill: 'graniastosłup prawidłowy trójkątny', pts: 2, fig: bryla('prism3', { a, H }),
      text: t`Krawędź podstawy graniastosłupa prawidłowego trójkątnego ma długość ${M(a)}, a jego wysokość jest równa ${M(H)}. Oblicz objętość tego graniastosłupa.`,
      fields: [F(M('V ='), R(k, 3))],
      hints: [t`Podstawą jest trójkąt równoboczny o boku ${M(a)}: ${M(t`P_p = \dfrac{a^2\sqrt3}{4}`)}.`, t`${M(t`P_p = ${rt(R(a * a / 4, 3))}`)}. Objętość graniastosłupa: ${M(t`V = P_p\cdot H`)}.`],
      steps: [M(t`P_p = \frac{${a}^2\sqrt3}{4} = ${rt(R(a * a / 4, 3))}`), M(t`V = ${rt(R(a * a / 4, 3))}\cdot ${H} = ${rt(R(k, 3))}`)],
      answer: M(rt(R(k, 3))), check: () => near(0.5 * a * a * Math.sin(rad(60)) * H, k * Math.sqrt(3)) });
  }
],
3: [
  function diagAngle() {
    const ang = pick([30, 45, 60]), a = ang === 30 ? 3 * ri(1, 5) : ri(2, 9), ans = ang === 45 ? R(a, 2) : ang === 60 ? R(a, 6) : R(a / 3, 6), tv = ang === 45 ? '1' : ang === 60 ? t`\sqrt3` : t`\frac{\sqrt3}{3}`;
    return mk({ skill: 'kąt przekątnej graniastosłupa z podstawą', pts: 2, fig: bryla('cuboid', { a, b: a, c: 'H', d: 'd', ang: 'α' }),
      text: t`Podstawą graniastosłupa prawidłowego czworokątnego jest kwadrat o boku ${M(a)}. Przekątna tego graniastosłupa tworzy z płaszczyzną podstawy kąt ${M(dg(ang))}. Oblicz wysokość ${M('H')} graniastosłupa.`,
      fields: [F(M('H ='), ans)],
      hints: [t`Kąt między przekątną bryły a podstawą to kąt między tą przekątną a przekątną podstawy. Trójkąt: przekątna podstawy, wysokość ${M('H')}, przekątna bryły – jest prostokątny.`, t`Przekątna podstawy: ${M(t`${a}\sqrt2`)}. Zatem ${M(t`${TG}${dg(ang)} = \dfrac{H}{${a}\sqrt2}`)}.`],
      steps: [t`Przekątna podstawy (kwadratu): ${M(t`${a}\sqrt2`)}.`, M(t`${TG}${dg(ang)} = \frac{H}{${a}\sqrt2} \iff H = ${a}\sqrt2\cdot ${tv}`), M(`H = ${rt(ans)}`)],
      answer: M(rt(ans)), check: () => near(Math.atan2(rv(ans), a * Math.SQRT2), rad(ang)) });
  },
  function fromVolume() {
    const a = ri(2, 8), H = ri(2, 12), V = a * a * H, Pc = 2 * a * a + 4 * a * H; need(a !== H);
    return mk({ skill: 'graniastosłup – od objętości do pola', pts: 2, fig: bryla('cuboid', { a: 'a', b: 'a', c: H }),
      text: t`Objętość graniastosłupa prawidłowego czworokątnego jest równa ${M(V)}, a jego wysokość ma długość ${M(H)}. Oblicz długość ${M('a')} krawędzi podstawy oraz pole powierzchni całkowitej ${M('P_c')} tego graniastosłupa.`,
      fields: [F(M('a ='), a), F(M('P_c ='), Pc)],
      hints: [t`Podstawą jest kwadrat, więc ${M(t`V = a^2\cdot H`)}. Wylicz ${M('a^2')}.`, t`${M(`a = ${a}`)}. Pole całkowite: dwie podstawy i cztery jednakowe ściany boczne, ${M('P_c = 2a^2 + 4aH')}.`],
      steps: [M(t`a^2\cdot ${H} = ${V} \iff a^2 = ${a * a} \iff a = ${a}`), M(t`P_c = 2\cdot ${a}^2 + 4\cdot ${a}\cdot ${H} = ${2 * a * a} + ${4 * a * H} = ${Pc}`)],
      answer: M(t`a = ${a},\quad P_c = ${Pc}`), check: () => a * a * H === V && Pc === a * a + a * a + a * H * 4 });
  }
]
};

const GO = {
1: [
  function pyrVol() {
    const a = ri(2, 9), H = ri(2, 12); need((a * a * H) % 3 === 0);
    return mk({ skill: 'objętość ostrosłupa', fig: bryla('pyramid', { a, H }),
      text: t`Podstawą ostrosłupa prawidłowego czworokątnego jest kwadrat o boku ${M(a)}, a wysokość ostrosłupa jest równa ${M(H)}. Oblicz objętość tego ostrosłupa.`,
      fields: [F(M('V ='), a * a * H / 3)],
      hints: [t`Objętość ostrosłupa to jedna trzecia objętości graniastosłupa o tej samej podstawie i wysokości: ${M(t`V = \tfrac13 P_p\cdot H`)}.`, t`Pole podstawy: ${M(`${a}^2 = ${a * a}`)}. Nie zapomnij o ${M(t`\tfrac13`)}.`],
      steps: [M(`P_p = ${a}^2 = ${a * a}`), M(t`V = \tfrac13\cdot ${a * a}\cdot ${H} = ${a * a * H / 3}`)],
      answer: M(`${a * a * H / 3}`), check: () => near(a * a * H / 3 * 3, a * a * H) });
  },
  function pyrFromV() {
    const a = ri(2, 9), H = ri(2, 12), V = a * a * H / 3; need(isInt(V));
    return mk({ skill: 'wysokość ostrosłupa z objętości', fig: bryla('pyramid', { a, H: 'H' }),
      text: t`Objętość ostrosłupa prawidłowego czworokątnego jest równa ${M(V)}, a krawędź jego podstawy ma długość ${M(a)}. Oblicz wysokość ${M('H')} tego ostrosłupa.`,
      fields: [F(M('H ='), H)],
      hints: [t`Wstaw dane do wzoru ${M(t`V = \tfrac13 P_p\cdot H`)}, gdzie ${M(`P_p = ${a * a}`)}.`, t`${M(t`${V} = \tfrac13\cdot ${a * a}\cdot H`)}. Pomnóż obie strony przez ${M(3)}.`],
      steps: [M(t`${V} = \tfrac13\cdot ${a * a}\cdot H \iff ${3 * V} = ${a * a}\cdot H`), M(`H = ${H}`)],
      answer: M(`H = ${H}`), check: () => near(a * a * H / 3, V) });
  }
],
2: [
  function pyrSlant() {
    const [x, H, h] = pick(TR), a = 2 * x, Pb = 2 * a * h;
    return mk({ skill: 'wysokość ściany bocznej i pole boczne', pts: 2, fig: bryla('pyramid', { a, H, h: 'h' }),
      text: t`W ostrosłupie prawidłowym czworokątnym krawędź podstawy ma długość ${M(a)}, a wysokość ostrosłupa jest równa ${M(H)}. Oblicz wysokość ${M('h')} ściany bocznej oraz pole powierzchni bocznej ${M('P_b')} tego ostrosłupa.`,
      fields: [F(M('h ='), h), F(M('P_b ='), Pb)],
      hints: [t`Wysokość ostrosłupa, wysokość ściany bocznej i odcinek łączący środek podstawy ze środkiem krawędzi tworzą trójkąt prostokątny. Ten odcinek ma długość ${M(t`\tfrac{a}{2} = ${x}`)}.`, t`${M(`h^2 = ${H}^2 + ${x}^2`)}. Pole boczne to cztery trójkąty o podstawie ${M(a)} i wysokości ${M('h')}.`],
      steps: [M(t`h^2 = ${H}^2 + ${x}^2 = ${H * H} + ${x * x} = ${h * h} \iff h = ${h}`), M(t`P_b = 4\cdot\tfrac12\cdot ${a}\cdot ${h} = ${Pb}`)],
      answer: M(t`h = ${h},\quad P_b = ${Pb}`), check: () => near(Math.hypot(H, a / 2), h) && near(4 * 0.5 * a * h, Pb) });
  },
  function tetra() {
    const a = ri(2, 9);
    return mk({ skill: 'czworościan foremny',
      text: t`Krawędź czworościanu foremnego ma długość ${M(a)}. Oblicz pole powierzchni całkowitej tego czworościanu.`,
      fields: [F(M('P_c ='), R(a * a, 3))],
      hints: [t`Czworościan foremny ma cztery ściany – jednakowe trójkąty równoboczne.`, t`Pole jednej ściany: ${M(t`\dfrac{a^2\sqrt3}{4}`)}. Cztery ściany razem dają ${M(t`a^2\sqrt3`)}.`],
      steps: [M(t`P_c = 4\cdot\frac{${a}^2\sqrt3}{4} = ${a}^2\sqrt3 = ${rt(R(a * a, 3))}`)],
      answer: M(rt(R(a * a, 3))), check: () => near(4 * 0.5 * a * a * Math.sin(rad(60)), a * a * Math.sqrt(3)) });
  }
],
3: [
  function faceAngle() {
    const ang = pick([45, 60]), a = 6 * ri(1, 3), Hh = ang === 45 ? a / 2 : R(a / 2, 3), Vv = ang === 45 ? a * a * a / 6 : R(a * a * a / 6, 3);
    return mk({ skill: 'kąt nachylenia ściany bocznej do podstawy', pts: 3, fig: bryla('pyramid', { a, H: 'H', h: 'h', ang: 'α' }),
      text: t`W ostrosłupie prawidłowym czworokątnym krawędź podstawy ma długość ${M(a)}, a ściana boczna jest nachylona do płaszczyzny podstawy pod kątem ${M(dg(ang))}. Oblicz wysokość ${M('H')} i objętość ${M('V')} tego ostrosłupa.`,
      fields: [F(M('H ='), Hh), F(M('V ='), Vv)],
      hints: [t`Kąt nachylenia ściany bocznej do podstawy leży w trójkącie prostokątnym: wysokość ostrosłupa ${M('H')}, odcinek ${M(t`\tfrac{a}{2} = ${a / 2}`)} i wysokość ściany bocznej.`, t`${M(t`${TG}${dg(ang)} = \dfrac{H}{${a / 2}}`)}. Potem ${M(t`V = \tfrac13\cdot ${a}^2\cdot H`)}.`],
      steps: [M(t`${TG}${dg(ang)} = \frac{H}{${a / 2}} \iff H = ${a / 2}\cdot ${ang === 45 ? '1' : t`\sqrt3`} = ${rt(Hh)}`), M(t`V = \tfrac13\cdot ${a * a}\cdot ${rt(Hh)} = ${rt(Vv)}`)],
      answer: M(t`H = ${rt(Hh)},\quad V = ${rt(Vv)}`), check: () => near(Math.atan2(rv(Hh), a / 2), rad(ang)) && near(a * a * rv(Hh) / 3, rv(Vv)) });
  },
  function edgeAngle() {
    const ang = pick([45, 60]), a = 2 * ri(1, 6), Hh = R(a / 2, ang === 45 ? 2 : 6);
    return mk({ skill: 'kąt nachylenia krawędzi bocznej do podstawy', pts: 2, fig: bryla('pyramid', { a, H: 'H', e: 1, ang: 'α' }),
      text: t`W ostrosłupie prawidłowym czworokątnym krawędź podstawy ma długość ${M(a)}, a krawędź boczna jest nachylona do płaszczyzny podstawy pod kątem ${M(dg(ang))}. Oblicz wysokość ${M('H')} tego ostrosłupa.`,
      fields: [F(M('H ='), Hh)],
      hints: [t`Kąt nachylenia krawędzi bocznej do podstawy leży w trójkącie: wysokość ${M('H')}, połowa przekątnej podstawy, krawędź boczna.`, t`Połowa przekątnej kwadratu o boku ${M(a)}: ${M(t`\dfrac{${a}\sqrt2}{2} = ${rt(R(a / 2, 2))}`)}. Zatem ${M(t`${TG}${dg(ang)} = \dfrac{H}{${rt(R(a / 2, 2))}}`)}.`],
      steps: [t`Połowa przekątnej podstawy: ${M(t`\frac{${a}\sqrt2}{2} = ${rt(R(a / 2, 2))}`)}.`, M(t`H = ${rt(R(a / 2, 2))}\cdot${TG}${dg(ang)} = ${rt(R(a / 2, 2))}\cdot ${ang === 45 ? '1' : t`\sqrt3`} = ${rt(Hh)}`)],
      answer: M(rt(Hh)), check: () => near(Math.atan2(rv(Hh), a * Math.SQRT2 / 2), rad(ang)) });
  }
]
};

const GB = {
1: [
  function cylVol() {
    const r0 = ri(2, 8), H = ri(2, 12);
    return mk({ skill: 'objętość walca', fig: bryla('cylinder', { r: r0, H }), help: PI_HELP,
      text: t`Promień podstawy walca jest równy ${M(r0)}, a wysokość walca ${M(H)}. Oblicz objętość tego walca.`,
      fields: [F(M('V ='), r0 * r0 * H, { unit: 'π' })],
      hints: [t`Walec to „graniastosłup o podstawie koła”: ${M(t`V = P_p\cdot H = \pi r^2 H`)}.`, t`Pole podstawy: ${M(t`\pi\cdot ${r0}^2 = ${r0 * r0}\pi`)}.`],
      steps: [M(t`V = \pi\cdot ${r0}^2\cdot ${H} = ${r0 * r0}\pi\cdot ${H} = ${r0 * r0 * H}\pi`)],
      answer: M(t`${r0 * r0 * H}\pi`), check: () => near(Math.PI * r0 * r0 * H / Math.PI, r0 * r0 * H) });
  },
  function coneVol() {
    const r0 = ri(2, 9), H = ri(2, 12); need((r0 * r0 * H) % 3 === 0);
    return mk({ skill: 'objętość stożka', fig: bryla('cone', { r: r0, H }), help: PI_HELP,
      text: t`Promień podstawy stożka jest równy ${M(r0)}, a wysokość stożka ${M(H)}. Oblicz objętość tego stożka.`,
      fields: [F(M('V ='), r0 * r0 * H / 3, { unit: 'π' })],
      hints: [t`Stożek ma objętość trzy razy mniejszą niż walec o tej samej podstawie i wysokości: ${M(t`V = \tfrac13\pi r^2 H`)}.`, t`${M(t`\pi r^2 = ${r0 * r0}\pi`)}. Pomnóż przez ${M(H)} i weź jedną trzecią.`],
      steps: [M(t`V = \tfrac13\cdot\pi\cdot ${r0}^2\cdot ${H} = \tfrac13\cdot ${r0 * r0 * H}\pi = ${r0 * r0 * H / 3}\pi`)],
      answer: M(t`${r0 * r0 * H / 3}\pi`), check: () => near(r0 * r0 * H / 3 * 3, r0 * r0 * H) });
  },
  function sphere() {
    const r0 = ri(1, 6), V = 4 * r0 * r0 * r0 / 3, Pp = 4 * r0 * r0;
    return mk({ skill: 'objętość i pole powierzchni kuli', pts: 2, fig: bryla('sphere', { r: r0 }), help: PI_HELP,
      text: t`Promień kuli jest równy ${M(r0)}. Oblicz objętość ${M('V')} tej kuli oraz pole ${M('P')} jej powierzchni.`,
      fields: [F(M('V ='), V, { unit: 'π' }), F(M('P ='), Pp, { unit: 'π' })],
      hints: [t`Wzory (są w tablicach): ${M(t`V = \tfrac43\pi R^3`)}, ${M(t`P = 4\pi R^2`)}.`, t`${M(`${r0}^3 = ${r0 * r0 * r0}`)}, ${M(`${r0}^2 = ${r0 * r0}`)}.`],
      steps: [M(t`V = \tfrac43\pi\cdot ${r0}^3 = \tfrac43\cdot ${r0 * r0 * r0}\pi = ${TF(V)}\pi`), M(t`P = 4\pi\cdot ${r0}^2 = ${Pp}\pi`)],
      answer: M(t`V = ${TF(V)}\pi,\quad P = ${Pp}\pi`), check: () => near(4 / 3 * Math.PI * Math.pow(r0, 3), V * Math.PI) && near(4 * Math.PI * r0 * r0, Pp * Math.PI) });
  }
],
2: [
  function coneSlant() {
    const [r0, H, l] = pick(TR);
    return mk({ skill: 'tworząca i pole boczne stożka', pts: 2, fig: bryla('cone', { r: r0, H, l: 'l' }), help: 'Tworzącą wpisz jako liczbę. Pole zapisz jako wielokrotność π: wpisz samą liczbę stojącą przed π.',
      text: t`Promień podstawy stożka jest równy ${M(r0)}, a jego wysokość ${M(H)}. Oblicz długość tworzącej ${M('l')} oraz pole powierzchni bocznej ${M('P_b')} tego stożka.`,
      fields: [F(M('l ='), l), F(M('P_b ='), r0 * l, { unit: 'π' })],
      hints: [t`Promień, wysokość i tworząca stożka tworzą trójkąt prostokątny: ${M('l^2 = r^2 + H^2')}.`, t`Pole powierzchni bocznej stożka: ${M(t`P_b = \pi r l`)}.`],
      steps: [M(t`l^2 = ${r0}^2 + ${H}^2 = ${r0 * r0 + H * H} \iff l = ${l}`), M(t`P_b = \pi\cdot ${r0}\cdot ${l} = ${r0 * l}\pi`)],
      answer: M(t`l = ${l},\quad P_b = ${r0 * l}\pi`), check: () => near(Math.hypot(r0, H), l) });
  },
  function cylSurfaceH() {
    const r0 = ri(2, 7), H = ri(2, 12), Pc = 2 * r0 * (r0 + H);
    return mk({ skill: 'walec – od pola całkowitego do wysokości', pts: 2, fig: bryla('cylinder', { r: r0, H: 'H' }),
      text: t`Pole powierzchni całkowitej walca jest równe ${M(t`${Pc}\pi`)}, a promień jego podstawy ma długość ${M(r0)}. Oblicz wysokość ${M('H')} tego walca.`,
      fields: [F(M('H ='), H)],
      hints: [t`Pole całkowite walca to dwie podstawy i powierzchnia boczna: ${M(t`P_c = 2\pi r^2 + 2\pi r H`)}.`, t`Dwie podstawy: ${M(t`2\pi\cdot ${r0}^2 = ${2 * r0 * r0}\pi`)}. Reszta, czyli ${M(t`${Pc - 2 * r0 * r0}\pi`)}, to powierzchnia boczna ${M(t`2\pi\cdot ${r0}\cdot H`)}.`],
      steps: [M(t`${Pc}\pi = 2\pi\cdot ${r0}^2 + 2\pi\cdot ${r0}\cdot H = ${2 * r0 * r0}\pi + ${2 * r0}\pi H`), M(t`${2 * r0}\pi H = ${Pc - 2 * r0 * r0}\pi \iff H = ${H}`)],
      answer: M(`H = ${H}`), check: () => near(2 * Math.PI * r0 * r0 + 2 * Math.PI * r0 * H, Pc * Math.PI) });
  }
],
3: [
  function similar() {
    const k = pick([2, 3, 4, 5]), vol = Math.random() < 0.5, base = pick([2, 3, 4, 5, 6, 8, 10]), solid = pick(['stożek', 'walec', 'ostrosłup']), big = base * Math.pow(k, vol ? 3 : 2);
    const N1 = { 'stożek': 'Stożek', 'walec': 'Walec', 'ostrosłup': 'Ostrosłup' }[solid], gen = { 'stożek': 'stożka', 'walec': 'walca', 'ostrosłup': 'ostrosłupa' }[solid];
    return mk({ skill: 'bryły podobne', pts: 1,
      text: t`${N1} ${M('B_2')} jest podobny do ${gen} ${M('B_1')} w skali ${M(`k = ${k}`)}. ${vol ? 'Objętość' : 'Pole powierzchni całkowitej'} ${gen} ${M('B_1')} jest ${vol ? 'równa' : 'równe'} ${M(base)}. Oblicz ${vol ? 'objętość' : 'pole powierzchni całkowitej'} ${gen} ${M('B_2')}.`,
      fields: [F(vol ? M('V_2 =') : M('P_2 ='), big)],
      hints: [t`W skali ${M('k')} zmieniają się długości. Pola zmieniają się ${M('k^2')} razy, a objętości ${M('k^3')} razy.`, vol ? t`Stosunek objętości: ${M(`k^3 = ${k}^3 = ${k * k * k}`)}.` : t`Stosunek pól: ${M(`k^2 = ${k}^2 = ${k * k}`)}.`],
      steps: [M(vol ? t`\frac{V_2}{V_1} = k^3 = ${k * k * k}` : t`\frac{P_2}{P_1} = k^2 = ${k * k}`), M(t`${vol ? 'V_2' : 'P_2'} = ${k * (vol ? k * k : k)}\cdot ${base} = ${big}`)],
      answer: M(`${big}`), check: () => { const a = Math.cbrt(base), b = a * k; return vol ? near(b * b * b, big) : near(Math.pow(Math.sqrt(base) * k, 2), big); } });
  },
  function coneAngle() {
    const ang = pick([30, 45, 60]), r0 = ang === 45 ? ri(2, 9) : 3 * ri(1, 4), Hh = ang === 45 ? r0 : ang === 60 ? R(r0, 3) : R(r0 / 3, 3), ll = ang === 45 ? R(r0, 2) : ang === 60 ? 2 * r0 : R(2 * r0 / 3, 3);
    return mk({ skill: 'kąt nachylenia tworzącej stożka', pts: 2, fig: bryla('cone', { r: r0, H: 'H', l: 'l', ang: 'α' }),
      text: t`Promień podstawy stożka jest równy ${M(r0)}, a tworząca jest nachylona do płaszczyzny podstawy pod kątem ${M(dg(ang))}. Oblicz wysokość ${M('H')} i długość tworzącej ${M('l')} tego stożka.`,
      fields: [F(M('H ='), Hh), F(M('l ='), ll)],
      hints: [t`Przekrój osiowy: promień, wysokość i tworząca tworzą trójkąt prostokątny, a kąt ${M(dg(ang))} leży między promieniem a tworzącą.`, t`${M(t`${TG}${dg(ang)} = \dfrac{H}{${r0}}`)} oraz ${M(t`\cos ${dg(ang)} = \dfrac{${r0}}{l}`)}.`],
      steps: [M(t`H = ${r0}\cdot${TG}${dg(ang)} = ${r0}\cdot ${ang === 45 ? '1' : ang === 60 ? t`\sqrt3` : t`\tfrac{\sqrt3}{3}`} = ${rt(Hh)}`), M(t`l = \frac{${r0}}{\cos ${dg(ang)}} = ${r0} : ${ang === 45 ? t`\tfrac{\sqrt2}{2}` : ang === 60 ? t`\tfrac12` : t`\tfrac{\sqrt3}{2}`} = ${rt(ll)}`)],
      answer: M(t`H = ${rt(Hh)},\quad l = ${rt(ll)}`), check: () => near(r0 * Math.tan(rad(ang)), rv(Hh)) && near(Math.hypot(r0, rv(Hh)), rv(ll)) });
  }
]
};

const r = String.raw;
MATURA.dzial({
  id: 'stereometria', store: 'stereometria-matura-v1', title: 'Stereometria', seq: 'V = Pₚ · H',
  lead: 'Objętości i pola powierzchni graniastosłupów, ostrosłupów, walca, stożka i kuli, kąty w bryłach oraz bryły podobne.',
  topics: { G: 'Graniastosłupy', O: 'Ostrosłupy', B: 'Bryły obrotowe' },
  bank: { G: GG, O: GO, B: GB },
  formulas: {
    G: [['objętość', r`\(V = P_p\cdot H\)`], ['prostopadłościan', r`\(V = abc\)<br>\(P_c = 2(ab + ac + bc)\)<br>przekątna: \(d = \sqrt{a^2 + b^2 + c^2}\)`], ['sześcian', r`\(V = a^3,\quad P_c = 6a^2,\quad d = a\sqrt3\)`], ['przydatne w podstawach', r`przekątna kwadratu: \(a\sqrt2\)<br>trójkąt równoboczny: \(P = \dfrac{a^2\sqrt3}{4}\)`]],
    O: [['objętość', r`\(V = \tfrac13\, P_p\cdot H\)`], ['ostrosłup prawidłowy czworokątny', r`wysokość ściany bocznej: \(h^2 = H^2 + \left(\tfrac{a}{2}\right)^2\)<br>pole boczne: \(P_b = 4\cdot\tfrac12\, a\, h\)`], ['kąty z podstawą', r`ściana boczna: \(\operatorname{tg}\alpha = \dfrac{H}{a/2}\)<br>krawędź boczna: \(\operatorname{tg}\beta = \dfrac{H}{a\sqrt2/2}\)`], ['czworościan foremny', r`\(P_c = a^2\sqrt3\)`]],
    B: [['walec', r`\(V = \pi r^2 H\)<br>\(P_c = 2\pi r^2 + 2\pi r H\)`], ['stożek', r`\(V = \tfrac13\pi r^2 H\)<br>\(P_b = \pi r l,\quad l^2 = r^2 + H^2\)`], ['kula', r`\(V = \tfrac43\pi R^3,\quad P = 4\pi R^2\)`], ['bryły podobne w skali \(k\)', r`pola: \(k^2\) razy, objętości: \(k^3\) razy`]]
  }
});
})();
