/* Test wszystkich generatorów zadań: node test/test.js [liczba powtórzeń]
   Każde zadanie musi mieć: treść, dokładnie 2 podpowiedzi, kroki, odpowiedź i przejść własne, niezależne sprawdzenie wyniku (check). */
const path = require('path');
const S = require(path.join(__dirname, '..', 'js', 'silnik.js'));
Object.assign(globalThis, S);
const IDS = process.env.DZIALY ? process.env.DZIALY.split(',') : require('fs').readdirSync(path.join(__dirname, '..', 'js')).filter(f => f.endsWith('.js') && f !== 'silnik.js').map(f => f.slice(0, -3)).sort();
const RUNS = +process.argv[2] || 400;
let total = 0, gens = 0; const errs = [];
for (const id of IDS) {
  require(path.join(__dirname, '..', 'js', id + '.js'));
  const cfg = MATURA.cfgs[id];
  if (!cfg) { errs.push(id + ': brak konfiguracji'); continue; }
  for (const tp of Object.keys(cfg.topics)) {
    if (!cfg.formulas[tp] || !cfg.formulas[tp].length) errs.push(`${id}/${tp}: brak ściągi`);
    for (const lv of [1, 2, 3]) {
      const list = (cfg.bank[tp] || {})[lv] || [];
      if (list.length < 2) errs.push(`${id}/${tp}${lv}: za mało typów zadań (${list.length})`);
      list.forEach((gen, gi) => {
        gens++; let nb = 0; const name = `${id}/${tp}${lv}/${gen.name || gi}`; let made = 0, retries = 0; const seen = new Set();
        const bad = m => { if (++nb <= 3) errs.push(`${name}: ${m}`); };
        for (let i = 0; i < RUNS; i++) {
          let tk;
          try { tk = gen(); } catch (e) { if (e === RETRY) { retries++; continue; } bad('wyjątek: ' + e.message); break; }
          made++; total++; seen.add(tk.text + (tk.fig || '') + (tk.tf ? tk.tf.map(r => r.s).join('|') : ''));
          const all = JSON.stringify([tk.text, tk.hints, tk.steps, tk.answer, tk.choices, tk.tf, tk.fields]);
          if (/undefined|NaN|Infinity|\[object/.test(all.replace(/"(fig|check|unit)":null/g, ''))) bad('śmieci w tekście: ' + (all.match(/.{0,40}(undefined|NaN|Infinity|\[object).{0,40}/) || [all.slice(0, 80)])[0]);
          if ((all.match(/\\\\\(/g) || []).length !== (all.match(/\\\\\)/g) || []).length) bad('niesparowane \\( \\)');
          if (/(\+\s*-|-\s*-\d|\+\s*\+|(?<![\d},.])\b1[xyma]\b)/.test(String(tk.text) + tk.steps.join(' ') + tk.answer)) bad('brzydki zapis: ' + (String(tk.text) + tk.steps.join(' ') + tk.answer).match(/.{0,30}(\+\s*-|-\s*-\d|\+\s*\+|\b1[xyma]\b).{0,30}/)[0]);
          if (!tk.text || !tk.skill || !tk.answer) bad('brak treści/umiejętności/odpowiedzi');
          if (tk.hints.length !== 2) bad('liczba podpowiedzi: ' + tk.hints.length);
          if (!tk.steps.length) bad('brak kroków rozwiązania');
          if (typeof tk.check !== 'function') bad('brak check()'); else { let ok = false; try { ok = tk.check() === true; } catch (e) { bad('check rzucił: ' + e.message); } if (!ok) bad('check() = false | ' + tk.text.replace(/<[^>]+>/g, '').slice(0, 140) + ' → ' + tk.answer); }
          const kinds = (tk.choices ? 1 : 0) + (tk.tf ? 1 : 0) + (tk.fields.length ? 1 : 0);
          if (kinds !== 1) bad('zadanie musi mieć dokładnie jeden sposób odpowiedzi');
          if (tk.choices) {
            if (tk.choices.length < 3 || tk.choices.length > 4) bad('liczba odpowiedzi: ' + tk.choices.length);
            if (new Set(tk.choices).size !== tk.choices.length) bad('powtórzone odpowiedzi');
            if (!(tk.ans >= 0 && tk.ans < tk.choices.length)) bad('zły indeks odpowiedzi');
            if (tk.pts !== 1) bad('zadanie zamknięte powinno mieć 1 pkt');
            const num = v => parseFloat(v.replace('{,}', '.'));
            tk.choices.forEach(c => { const re = /(?:\\langle |\()(-?\d+(?:\{,\}\d+)?),\\ (-?\d+(?:\{,\}\d+)?)(?:\\rangle|\))/g; let m; while ((m = re.exec(c))) if (!(num(m[1]) < num(m[2]))) bad('zdegenerowany przedział w odpowiedzi: ' + c); });
          }
          if (tk.tf) { if (tk.tf.length < 2 || tk.tf.some(r => typeof r.v !== 'boolean' || !r.s)) bad('złe zdania P/F'); }
          tk.fields.forEach(f => {
            if (!Number.isFinite(f.ans)) bad('pole: odpowiedź nie jest liczbą');
            if (checkField(f, f.show) !== 'ok') bad(`pole: wzorcowa odpowiedź „${f.show}” nie przechodzi sprawdzania (${checkField(f, f.show)})`);
            if (checkField(f, String(f.ans + 1)) === 'ok') bad('pole: przyjmuje błędną odpowiedź');
          });
        }
        if (made < RUNS * 0.15) bad(`za dużo odrzuceń (${retries}/${RUNS})`);
        if (seen.size < 4) bad(`za mało wariantów (${seen.size})`);
      });
    }
  }
}
console.log(`${gens} typów zadań, ${total} wylosowanych zadań, błędów: ${errs.length}`);
errs.forEach(e => console.log(' ✗ ' + e));
process.exit(errs.length ? 1 : 0);
