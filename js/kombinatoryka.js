/* Działy XI–XII: Kombinatoryka i rachunek prawdopodobieństwa */
(function () {
const digs = n => String(n).split('').map(Number);
const range = (a, b) => { const o = []; for (let i = a; i <= b; i++) o.push(i); return o; };
const prod = a => a.reduce((x, y) => x * y, 1);
const setTex = a => t`\{${a.join(',\\ ')}\}`;
const frq = (a, b) => t`\frac{${a}}{${b}}`;
const prob = (cnt, tot) => M(t`P(A) = ${frq(cnt, tot)}${gcd(cnt, tot) > 1 ? ` = ${TF(cnt / tot)}` : ''}`);
const FRAC_HELP = 'Prawdopodobieństwo wpisz jako ułamek, np. 5/36.';

const GK = {
1: [
  function outfits() {
    const [x, y, z] = pick([['koszule', 'pary spodni', 'pary butów'], ['zupy', 'drugie dania', 'desery'], ['trasy z domu do szkoły', 'trasy ze szkoły na basen', 'trasy z basenu do domu'], ['rodzaje pieczywa', 'rodzaje sera', 'rodzaje warzyw']]);
    const a = ri(2, 6), b = ri(2, 6), c = ri(2, 5), ctx = x === 'koszule' ? t`Adam ma ${M(a)} koszule/koszul, ${M(b)} pary/par spodni i ${M(c)} pary/par butów. Na ile sposobów może wybrać zestaw: jedna koszula, jedne spodnie i jedna para butów?`.replace('koszule/koszul', a < 5 ? 'koszule' : 'koszul').replace('pary/par spodni', b < 5 ? 'pary spodni' : 'par spodni').replace('pary/par butów', c < 5 ? 'pary butów' : 'par butów')
      : x === 'zupy' ? t`W karcie baru liczba zup: ${M(a)}, drugich dań: ${M(b)}, deserów: ${M(c)}. Na ile sposobów można zamówić obiad złożony z jednej zupy, jednego drugiego dania i jednego deseru?`
      : x.startsWith('trasy') ? t`Liczba tras z domu do szkoły: ${M(a)}, ze szkoły na basen: ${M(b)}, z basenu do domu: ${M(c)}. Na ile sposobów można zaplanować drogę: dom – szkoła – basen – dom?`
      : t`Kanapkę składa się z jednego rodzaju pieczywa, jednego rodzaju sera i jednego warzywa. Liczba rodzajów pieczywa do wyboru: ${M(a)}, rodzajów sera: ${M(b)}, warzyw: ${M(c)}. Ile różnych kanapek można przygotować?`;
    return mk({ skill: 'reguła mnożenia',
      text: ctx, fields: [F('Liczba sposobów:', a * b * c)],
      hints: [t`Wybór składa się z trzech kolejnych, niezależnych decyzji.`, t`Reguła mnożenia: liczby możliwości na każdym etapie mnożymy przez siebie.`],
      steps: [M(t`${a}\cdot ${b}\cdot ${c} = ${a * b * c}`)],
      answer: M(`${a * b * c}`), check: () => { let n = 0; for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) for (let k = 0; k < c; k++) n++; return n === a * b * c; } });
  },
  function twoDigit() {
    const D0 = shuffle(range(0, 9)).slice(0, ri(4, 6)).sort((u, v) => u - v), distinct = Math.random() < 0.5, hasZero = D0.includes(0);
    let cnt = 0; for (let n = 10; n <= 99; n++) { const d = digs(n); if (d.every(x => D0.includes(x)) && (!distinct || d[0] !== d[1])) cnt++; }
    const tens = D0.length - (hasZero ? 1 : 0), units = distinct ? D0.length - 1 : D0.length;
    return mk({ skill: 'liczby o cyfrach z danego zbioru',
      text: t`Ile jest wszystkich liczb naturalnych dwucyfrowych${distinct ? ' o różnych cyfrach' : ''}, których obie cyfry należą do zbioru ${M(setTex(D0))}?${distinct ? '' : ' Cyfry mogą się powtarzać.'}`,
      fields: [F('Liczba takich liczb:', cnt)],
      hints: [t`Wybierz najpierw cyfrę dziesiątek, potem cyfrę jedności i zastosuj regułę mnożenia.${hasZero ? ' Uwaga: liczba dwucyfrowa nie może zaczynać się od zera.' : ''}`, t`Cyfra dziesiątek: ${M(tens)} możliwości. Cyfra jedności: ${M(units)} ${distinct ? '(każda cyfra ze zbioru oprócz tej już użytej)' : '(dowolna cyfra ze zbioru)'}.`],
      steps: [t`Cyfra dziesiątek: ${M(tens)} możliwości${hasZero ? ' (bez zera)' : ''}.`, t`Cyfra jedności: ${M(units)} możliwości${distinct ? ' (bez cyfry użytej na miejscu dziesiątek)' : ''}.`, M(t`${tens}\cdot ${units} = ${cnt}`)],
      answer: M(`${cnt}`), check: () => tens * units === cnt });
  }
],
2: [
  function parity3() {
    const [desc, test, last, why] = pick([['parzystych', n => n % 2 === 0, 5, 'cyfra jedności musi być jedną z: 0, 2, 4, 6, 8'], ['nieparzystych', n => n % 2 === 1, 5, 'cyfra jedności musi być jedną z: 1, 3, 5, 7, 9'], ['podzielnych przez 5', n => n % 5 === 0, 2, 'cyfra jedności musi być równa 0 albo 5'], ['podzielnych przez 10', n => n % 10 === 0, 1, 'cyfra jedności musi być równa 0']]);
    const len = pick([3, 4]), lo = Math.pow(10, len - 1), hi = Math.pow(10, len) - 1; let cnt = 0; for (let n = lo; n <= hi; n++) if (test(n)) cnt++;
    const fs = [9].concat(Array(len - 2).fill(10), [last]);
    return mk({ skill: 'zliczanie liczb o danej własności',
      text: t`Ile jest wszystkich liczb naturalnych ${len === 3 ? 'trzycyfrowych' : 'czterocyfrowych'} ${desc}?`,
      fields: [F('Liczba takich liczb:', cnt)],
      hints: [t`Wybieraj cyfry po kolei. Pierwsza cyfra nie może być zerem, więc ma ${M(9)} możliwości.`, t`O tym, czy liczba spełnia warunek, decyduje ostatnia cyfra: ${why}.`],
      steps: [t`Pierwsza cyfra: ${M(9)} możliwości (od 1 do 9).`, t`${len === 3 ? 'Cyfra dziesiątek' : 'Każda z dwóch środkowych cyfr'}: ${M(10)} możliwości.`, t`Cyfra jedności: ${M(last)} ${last === 1 ? 'możliwość' : last < 5 ? 'możliwości' : 'możliwości'} – ${why}.`, M(t`${fs.join('\\cdot ')} = ${cnt}`)],
      answer: M(`${cnt}`), check: () => prod(fs) === cnt });
  },
  function cond3() {
    const d = ri(0, 9), odd = x => x % 2 === 1;
    const [desc, test, fs, why] = pick([
      [t`w których zapisie nie występuje cyfra ${M(d)}`, a => !a.includes(d), d === 0 ? [9, 9, 9] : [8, 9, 9], d === 0 ? ['cyfry od 1 do 9', 'cyfry od 1 do 9', 'cyfry od 1 do 9'] : [t`bez zera i bez ${d}`, t`dowolna cyfra oprócz ${d}`, t`dowolna cyfra oprócz ${d}`]],
      ['których wszystkie cyfry są nieparzyste', a => a.every(odd), [5, 5, 5], ['1, 3, 5, 7 lub 9', '1, 3, 5, 7 lub 9', '1, 3, 5, 7 lub 9']],
      ['których wszystkie cyfry są parzyste', a => a.every(x => !odd(x)), [4, 5, 5], ['2, 4, 6 lub 8 – zero nie może być pierwsze', '0, 2, 4, 6 lub 8', '0, 2, 4, 6 lub 8']],
      ['w których cyfra setek jest parzysta, a cyfra jedności nieparzysta', a => !odd(a[0]) && odd(a[2]), [4, 10, 5], ['2, 4, 6 lub 8', 'dowolna cyfra', '1, 3, 5, 7 lub 9']],
      ['o różnych cyfrach', a => new Set(a).size === 3, [9, 9, 8], ['dowolna oprócz zera', 'dowolna oprócz cyfry setek (zero już wolno)', 'dowolna oprócz dwóch już użytych']]
    ]);
    let cnt = 0; for (let n = 100; n <= 999; n++) if (test(digs(n))) cnt++;
    return mk({ skill: 'reguła mnożenia – liczby trzycyfrowe', pts: 2,
      text: t`Ile jest wszystkich liczb naturalnych trzycyfrowych, ${desc}?`,
      fields: [F('Liczba takich liczb:', cnt)],
      hints: [t`Policz osobno, ile jest możliwości dla cyfry setek, dziesiątek i jedności, a potem pomnóż.`, t`Cyfra setek nigdy nie może być zerem. Dla cyfry setek masz ${M(fs[0])} możliwości (${why[0]}).`],
      steps: [t`Cyfra setek: ${M(fs[0])} możliwości (${why[0]}).`, t`Cyfra dziesiątek: ${M(fs[1])} możliwości (${why[1]}).`, t`Cyfra jedności: ${M(fs[2])} możliwości (${why[2]}).`, M(t`${fs.join('\\cdot ')} = ${cnt}`)],
      answer: M(`${cnt}`), check: () => prod(fs) === cnt });
  }
],
3: [
  function exactlyOne() {
    const len = pick([3, 4]), d = ri(0, 9), lo = Math.pow(10, len - 1), hi = Math.pow(10, len) - 1; let cnt = 0;
    for (let n = lo; n <= hi; n++) if (digs(n).filter(x => x === d).length === 1) cnt++;
    const first = d === 0 ? 0 : Math.pow(9, len - 1), other = (len - 1) * (d === 0 ? 9 : 8) * Math.pow(9, len - 2);
    return mk({ skill: 'reguła mnożenia i dodawania', pts: 2,
      text: t`Ile jest wszystkich liczb naturalnych ${len === 3 ? 'trzycyfrowych' : 'czterocyfrowych'}, w których zapisie dziesiętnym cyfra ${M(d)} występuje dokładnie jeden raz?`,
      fields: [F('Liczba takich liczb:', cnt)],
      hints: [d === 0 ? t`Zero nie może stać na pierwszym miejscu, więc stoi na jednym z ${M(len - 1)} pozostałych miejsc. Pozostałe cyfry muszą być różne od zera.` : t`Rozpatrz dwa rozłączne przypadki: cyfra ${M(d)} stoi na pierwszym miejscu albo na jednym z ${M(len - 1)} pozostałych miejsc. Wyniki dodaj.`, d === 0 ? t`Każda z pozostałych ${M(len - 1)} cyfr (także pierwsza) ma ${M(9)} możliwości: od 1 do 9.` : t`Gdy ${M(d)} nie stoi na początku, pierwsza cyfra ma tylko ${M(8)} możliwości (bez zera i bez ${M(d)}), a każda inna „wolna” cyfra – ${M(9)} możliwości.`],
      steps: d === 0 ? [t`Miejsce dla zera: ${M(len - 1)} możliwości (nie pierwsze).`, t`Pozostałe ${M(len - 1)} cyfry: każda od 1 do 9, czyli po ${M(9)} możliwości.`, M(t`${len - 1}\cdot ${Array(len - 1).fill(9).join('\\cdot ')} = ${cnt}`)]
        : [t`Przypadek 1: cyfra ${M(d)} na pierwszym miejscu. Pozostałe cyfry dowolne oprócz ${M(d)}: ${M(t`${Array(len - 1).fill(9).join('\\cdot ')} = ${first}`)}.`, t`Przypadek 2: cyfra ${M(d)} na jednym z ${M(len - 1)} dalszych miejsc. Pierwsza cyfra: ${M(8)} możliwości, ${len === 3 ? 'pozostała cyfra' : 'każda z dwóch pozostałych'}: ${M(9)}. Razem ${M(t`${len - 1}\cdot 8\cdot ${Array(len - 2).fill(9).join('\\cdot ')} = ${other}`)}.`, M(`${first} + ${other} = ${cnt}`)],
      answer: M(`${cnt}`), check: () => first + other === cnt });
  },
  function digitSum() {
    const len = pick([3, 4]), s = len === 3 ? ri(2, 5) : ri(2, 3), lo = Math.pow(10, len - 1), hi = Math.pow(10, len) - 1, list = [];
    for (let n = lo; n <= hi; n++) if (digs(n).reduce((x, y) => x + y, 0) === s) list.push(n);
    return mk({ skill: 'zliczanie przez wypisanie przypadków', pts: 2,
      text: t`Ile jest wszystkich liczb naturalnych ${len === 3 ? 'trzycyfrowych' : 'czterocyfrowych'}, których suma cyfr jest równa ${M(s)}?`,
      fields: [F('Liczba takich liczb:', list.length)],
      hints: [t`Takich liczb jest niewiele – wypisz je w uporządkowany sposób, np. według pierwszej cyfry.`, t`Pierwsza cyfra może być równa ${range(1, s).join(', ')}. Dla każdej z nich rozdziel resztę sumy między pozostałe cyfry.`],
      steps: range(1, s).reverse().map(f => { const sub = list.filter(n => digs(n)[0] === f); return t`Pierwsza cyfra ${M(f)}: ${M(sub.join(',\\ '))} – ${sub.length === 1 ? 'jedna liczba' : `${sub.length} liczby/liczb`.replace('liczby/liczb', sub.length < 5 ? 'liczby' : 'liczb')}.`; }).concat([t`Razem: ${M(list.length)}.`]),
      answer: M(`${list.length}`), check: () => { let n = 0; const rec = (pos, left) => { if (pos === len) { if (left === 0) n++; return; } for (let dgt = pos === 0 ? 1 : 0; dgt <= Math.min(9, left); dgt++) rec(pos + 1, left - dgt); }; rec(0, s); return n === list.length; } });
  }
]
};

const DIE = [['liczby oczek większej od 4', x => x > 4], ['parzystej liczby oczek', x => x % 2 === 0], ['liczby oczek podzielnej przez 3', x => x % 3 === 0], ['liczby oczek będącej liczbą pierwszą', x => [2, 3, 5].includes(x)], ['liczby oczek mniejszej od 3', x => x < 3], ['liczby oczek będącej dzielnikiem liczby 6', x => 6 % x === 0], ['liczby oczek różnej od 6', x => x !== 6], ['liczby oczek większej od 2', x => x > 2]];
const GP = {
1: [
  function die() {
    const [desc, test] = pick(DIE), fav = range(1, 6).filter(test);
    return mk({ skill: 'klasyczna definicja prawdopodobieństwa', help: FRAC_HELP,
      text: t`Rzucamy jeden raz symetryczną sześcienną kostką do gry. Oblicz prawdopodobieństwo zdarzenia ${M('A')} polegającego na wyrzuceniu ${desc}.`,
      fields: [F(M('P(A) ='), fav.length / 6)],
      hints: [t`${M(t`P(A) = \dfrac{|A|}{|\Omega|}`)}: liczba wyników sprzyjających podzielona przez liczbę wszystkich wyników.`, t`Wszystkich wyników jest ${M(6)}. Wypisz te, które spełniają warunek.`],
      steps: [M(t`|\Omega| = 6`), t`Wyniki sprzyjające: ${M(fav.join(',\\ '))}, czyli ${M(`|A| = ${fav.length}`)}.`, prob(fav.length, 6)],
      answer: M(TF(fav.length / 6)), check: () => { let n = 0; for (let x = 1; x <= 6; x++) if (test(x)) n++; return n === fav.length && n > 0; } });
  },
  function urn() {
    const cols = shuffle([['białe', 'biała'], ['czarne', 'czarna'], ['zielone', 'zielona'], ['niebieskie', 'niebieska']]).slice(0, 3), cnt = [ri(2, 9), ri(2, 9), ri(1, 8)], tot = cnt[0] + cnt[1] + cnt[2], i = ri(0, 2), neg = Math.random() < 0.35, fav = neg ? tot - cnt[i] : cnt[i];
    return mk({ skill: 'losowanie jednego elementu', help: FRAC_HELP,
      text: t`W pudełku są kule w trzech kolorach: ${cols[0][0]} – ${M(cnt[0])}, ${cols[1][0]} – ${M(cnt[1])}, ${cols[2][0]} – ${M(cnt[2])}. Losujemy jedną kulę. Oblicz prawdopodobieństwo zdarzenia ${M('A')}: wylosowana kula ${neg ? '<b>nie</b> jest' : 'jest'} ${cols[i][1]}.`,
      fields: [F(M('P(A) ='), fav / tot)],
      hints: [t`Policz, ile jest wszystkich kul – to liczba wszystkich możliwych wyników losowania.`, neg ? t`Sprzyjają wszystkie kule oprócz tych w kolorze „${cols[i][0]}”: ${M(`${tot} - ${cnt[i]}`)}.` : t`Sprzyjają kule w kolorze „${cols[i][0]}” – jest ich ${M(cnt[i])}.`],
      steps: [M(t`|\Omega| = ${cnt[0]} + ${cnt[1]} + ${cnt[2]} = ${tot}`), M(neg ? t`|A| = ${tot} - ${cnt[i]} = ${fav}` : `|A| = ${fav}`), prob(fav, tot)],
      answer: M(TF(fav / tot)), check: () => { const balls = [].concat(...cnt.map((c, j) => Array(c).fill(j))); return balls.filter(b => (neg ? b !== i : b === i)).length === fav && balls.length === tot; } });
  }
],
2: [
  function twoDice() {
    const s = ri(4, 10), g = ri(9, 11), pr = pick([4, 6, 12]);
    const [desc, test] = pick([[t`suma wyrzuconych oczek jest równa ${M(s)}`, (a, b) => a + b === s], [t`suma wyrzuconych oczek jest nie mniejsza niż ${M(g)}`, (a, b) => a + b >= g], [t`iloczyn wyrzuconych oczek jest równy ${M(pr)}`, (a, b) => a * b === pr], ['w obu rzutach wypadła ta sama liczba oczek', (a, b) => a === b], [t`suma wyrzuconych oczek jest mniejsza od ${M(5)}`, (a, b) => a + b < 5]]);
    const fav = []; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (test(a, b)) fav.push(`(${a},${b})`);
    return mk({ skill: 'dwukrotny rzut kostką', pts: 2, help: FRAC_HELP,
      text: t`Rzucamy dwa razy symetryczną sześcienną kostką do gry. Oblicz prawdopodobieństwo zdarzenia ${M('A')}: ${desc}.`,
      fields: [F(M('P(A) ='), fav.length / 36)],
      hints: [t`Wynikiem doświadczenia jest para (wynik pierwszego rzutu, wynik drugiego rzutu). Takich par jest ${M(t`6\cdot 6 = 36`)}.`, t`Wypisz wszystkie pary sprzyjające. Pamiętaj, że ${M('(2,3)')} i ${M('(3,2)')} to dwa różne wyniki.`],
      steps: [M(t`|\Omega| = 6\cdot 6 = 36`), t`Pary sprzyjające: ${M(fav.join(',\\ '))}.`, M(`|A| = ${fav.length}`), prob(fav.length, 36)],
      answer: M(TF(fav.length / 36)), check: () => { let n = 0; for (let k = 0; k < 36; k++) if (test(Math.floor(k / 6) + 1, k % 6 + 1)) n++; return n === fav.length && n > 0; } });
  },
  function numberSet() {
    const two = Math.random() < 0.4, n = pick([20, 30, 40, 50]), k = two ? pick([5, 9, 10, 15, 20, 25, 30]) : pick([3, 4, 6, 7, 8]), set = two ? range(10, 99) : range(1, n), fav = set.filter(x => x % k === 0);
    return mk({ skill: 'losowanie liczby ze zbioru', pts: 2, help: FRAC_HELP,
      text: two ? t`Ze zbioru wszystkich liczb naturalnych dwucyfrowych losujemy jedną liczbę. Oblicz prawdopodobieństwo zdarzenia ${M('A')}: wylosowana liczba jest podzielna przez ${M(k)}.` : t`Ze zbioru ${M(t`\{1,\ 2,\ 3,\ \ldots,\ ${n}\}`)} losujemy jedną liczbę. Oblicz prawdopodobieństwo zdarzenia ${M('A')}: wylosowana liczba jest podzielna przez ${M(k)}.`,
      fields: [F(M('P(A) ='), fav.length / set.length)],
      hints: [two ? t`Liczb dwucyfrowych jest ${M(`99 - 10 + 1 = 90`)} (a nie 89).` : t`Wszystkich liczb w zbiorze jest ${M(n)}.`, t`Wypisz wielokrotności liczby ${M(k)} należące do zbioru: pierwsza to ${M(fav[0])}, ostatnia ${M(fav[fav.length - 1])}.`],
      steps: [M(t`|\Omega| = ${set.length}`), t`Liczby sprzyjające: ${M(fav.length <= 8 ? fav.join(',\\ ') : t`${fav[0]},\ ${fav[1]},\ ${fav[2]},\ \ldots,\ ${fav[fav.length - 1]}`)} – jest ich ${M(fav.length)}.`, prob(fav.length, set.length)],
      answer: M(TF(fav.length / set.length)), check: () => { const first = Math.ceil(set[0] / k) * k, last = Math.floor(set[set.length - 1] / k) * k; return (last - first) / k + 1 === fav.length; } });
  },
  function coins() {
    const [desc, test] = pick([['wypadły dokładnie dwa orły', h => h === 2], ['wypadł co najmniej jeden orzeł', h => h >= 1], ['wypadł dokładnie jeden orzeł', h => h === 1], ['we wszystkich rzutach wypadło to samo', h => h === 0 || h === 3], ['wypadły co najmniej dwa orły', h => h >= 2], ['nie wypadł ani jeden orzeł', h => h === 0]]);
    const all = []; for (let k = 0; k < 8; k++) all.push([4, 2, 1].map(b => (k & b ? 'O' : 'R')).join('')); const fav = all.filter(w => test(w.split('O').length - 1));
    return mk({ skill: 'trzykrotny rzut monetą', pts: 2, help: FRAC_HELP,
      text: t`Rzucamy trzy razy symetryczną monetą. Oblicz prawdopodobieństwo zdarzenia ${M('A')}: ${desc}.`,
      fields: [F(M('P(A) ='), fav.length / 8)],
      hints: [t`W każdym rzucie są ${M(2)} możliwości (orzeł O albo reszka R), więc wszystkich wyników jest ${M(t`2\cdot 2\cdot 2 = 8`)}.`, t`Wypisz wszystkie osiem wyników, np. OOO, OOR, ORO, … i zaznacz sprzyjające.`],
      steps: [M(t`|\Omega| = 2^3 = 8`), t`Wszystkie wyniki: ${all.join(', ')}.`, t`Sprzyjające: ${fav.join(', ')}, czyli ${M(`|A| = ${fav.length}`)}.`, prob(fav.length, 8)],
      answer: M(TF(fav.length / 8)), check: () => { let n = 0; for (const a of 'OR') for (const b of 'OR') for (const c of 'OR') if (test([a, b, c].filter(x => x === 'O').length)) n++; return n === fav.length; } });
  }
],
3: [
  function twoDraws() {
    const n = ri(5, 9), repl = Math.random() < 0.5, o = Math.ceil(n / 2), e = Math.floor(n / 2), tot = repl ? n * n : n * (n - 1);
    const [desc, test, cnt, why] = pick([
      ['suma wylosowanych liczb jest parzysta', (a, b) => (a + b) % 2 === 0, repl ? o * o + e * e : o * (o - 1) + e * (e - 1), t`Suma jest parzysta, gdy obie liczby są nieparzyste albo obie parzyste. W zbiorze jest ${M(o)} liczb nieparzystych i ${M(e)} parzystych: ${M(repl ? t`${o}\cdot ${o} + ${e}\cdot ${e}` : t`${o}\cdot ${o - 1} + ${e}\cdot ${e - 1}`)}.`],
      ['iloczyn wylosowanych liczb jest nieparzysty', (a, b) => (a * b) % 2 === 1, repl ? o * o : o * (o - 1), t`Iloczyn jest nieparzysty tylko wtedy, gdy obie liczby są nieparzyste. Liczb nieparzystych jest ${M(o)}: ${M(repl ? t`${o}\cdot ${o}` : t`${o}\cdot ${o - 1}`)}.`],
      ['pierwsza wylosowana liczba jest większa od drugiej', (a, b) => a > b, n * (n - 1) / 2, t`Par różnych liczb jest ${M(t`${n}\cdot ${n - 1} = ${n * (n - 1)}`)} i dokładnie w połowie z nich pierwsza liczba jest większa: ${M(t`${n * (n - 1)} : 2`)}.`]
    ]);
    return mk({ skill: 'losowanie dwóch liczb', pts: 2, help: FRAC_HELP,
      text: t`Ze zbioru ${M(setTex(range(1, n)))} losujemy kolejno dwa razy po jednej liczbie ${repl ? '<b>ze zwracaniem</b>' : '<b>bez zwracania</b>'}. Oblicz prawdopodobieństwo zdarzenia ${M('A')}: ${desc}.`,
      fields: [F(M('P(A) ='), cnt / tot)],
      hints: [repl ? t`Losujemy ze zwracaniem, więc za drugim razem znów jest ${M(n)} możliwości: ${M(t`|\Omega| = ${n}\cdot ${n}`)}.` : t`Losujemy bez zwracania, więc za drugim razem jest o jedną liczbę mniej: ${M(t`|\Omega| = ${n}\cdot ${n - 1}`)}.`, t`Wynikiem jest para uporządkowana (pierwsza liczba, druga liczba). Zastanów się, jakie pary sprzyjają – nie musisz wypisywać wszystkich.`],
      steps: [M(repl ? t`|\Omega| = ${n}\cdot ${n} = ${tot}` : t`|\Omega| = ${n}\cdot ${n - 1} = ${tot}`), why, M(`|A| = ${cnt}`), prob(cnt, tot)],
      answer: M(TF(cnt / tot)), check: () => { let c = 0, all = 0; for (let a = 1; a <= n; a++) for (let b = 1; b <= n; b++) { if (!repl && a === b) continue; all++; if (test(a, b)) c++; } return c === cnt && all === tot; } });
  },
  function twoDiceHard() {
    const d = ri(1, 6);
    const [desc, test, compN, why] = pick([
      [t`co najmniej raz wypadło ${M(d)} ${d === 1 ? 'oczko' : d < 5 ? 'oczka' : 'oczek'}`, (a, b) => a === d || b === d, 25, t`Łatwiej policzyć zdarzenie przeciwne: ani razu nie wypadło ${M(d)}. Wtedy w każdym rzucie jest ${M(5)} możliwości: ${M(t`5\cdot 5 = 25`)}.`],
      ['iloczyn wyrzuconych oczek jest liczbą parzystą', (a, b) => (a * b) % 2 === 0, 9, t`Łatwiej policzyć zdarzenie przeciwne: iloczyn nieparzysty, czyli obie liczby nieparzyste (1, 3 lub 5): ${M(t`3\cdot 3 = 9`)}.`],
      ['w obu rzutach wypadły różne liczby oczek', (a, b) => a !== b, 6, t`Łatwiej policzyć zdarzenie przeciwne: w obu rzutach to samo – jest ${M(6)} takich par.`],
      ['suma wyrzuconych oczek jest podzielna przez 3', (a, b) => (a + b) % 3 === 0, null, t`Możliwe sumy podzielne przez 3 to 3, 6, 9 i 12. Dają je odpowiednio ${M(2)}, ${M(5)}, ${M(4)} i ${M(1)} par.`],
      ['iloczyn wyrzuconych oczek jest podzielny przez 6', (a, b) => (a * b) % 6 === 0, null, t`Gdy w którymś rzucie wypadnie 6, iloczyn dzieli się przez 6 – to ${M(11)} par. Bez szóstki potrzebna jest trójka i liczba parzysta: ${M('(3,2),(3,4),(2,3),(4,3)')} – kolejne ${M(4)} pary.`]
    ]);
    let cnt = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (test(a, b)) cnt++;
    return mk({ skill: 'dwukrotny rzut kostką – zdarzenie złożone', pts: 2, help: FRAC_HELP,
      text: t`Rzucamy dwa razy symetryczną sześcienną kostką do gry. Oblicz prawdopodobieństwo zdarzenia ${M('A')}: ${desc}.`,
      fields: [F(M('P(A) ='), cnt / 36)],
      hints: [t`Wszystkich wyników (par) jest ${M(36)}.`, compN ? t`Czasem prościej policzyć wyniki, które <b>nie</b> sprzyjają, i odjąć je od ${M(36)}.` : t`Podziel wyniki sprzyjające na kilka rozłącznych grup i policz każdą osobno.`],
      steps: [M(t`|\Omega| = 36`), why, M(compN ? `|A| = 36 - ${compN} = ${cnt}` : `|A| = ${cnt}`), prob(cnt, 36)],
      answer: M(TF(cnt / 36)), check: () => (compN ? 36 - compN === cnt : /podzielna przez 3/.test(desc) ? 2 + 5 + 4 + 1 === cnt : 11 + 4 === cnt) });
  }
]
};

const r = String.raw;
MATURA.dzial({
  id: 'kombinatoryka', store: 'kombinatoryka-matura-v1', title: 'Kombinatoryka i prawdopodobieństwo', seq: 'P(A) = |A| : |Ω|',
  lead: 'Zliczanie regułą mnożenia i dodawania oraz prawdopodobieństwo w modelu klasycznym: kostki, monety, losowanie liczb i kul.',
  topics: { K: 'Kombinatoryka', P: 'Prawdopodobieństwo' },
  bank: { K: GK, P: GP },
  formulas: {
    K: [['reguła mnożenia', r`gdy wybór składa się z kolejnych etapów: mnożymy liczby możliwości`], ['reguła dodawania', r`gdy są rozłączne przypadki („albo–albo”): dodajemy`], ['liczby', r`pierwsza cyfra: 9 możliwości (bez zera)<br>każda następna: 10 możliwości`], ['ile jest liczb', r`dwucyfrowych: \(90\)<br>trzycyfrowych: \(900\)<br>czterocyfrowych: \(9000\)`]],
    P: [['definicja klasyczna', r`\(P(A) = \dfrac{|A|}{|\Omega|}\)<br>\(|A|\) – liczba wyników sprzyjających<br>\(|\Omega|\) – liczba wszystkich wyników`], ['typowe doświadczenia', r`rzut kostką: \(|\Omega| = 6\)<br>dwa rzuty kostką: \(|\Omega| = 36\)<br>trzy rzuty monetą: \(|\Omega| = 8\)`], ['zdarzenie przeciwne', r`\(P(A) = 1 - P(A')\)<br>przydaje się przy „co najmniej raz”`], ['własności', r`\(0 \leq P(A) \leq 1\)`]]
  }
});
})();
