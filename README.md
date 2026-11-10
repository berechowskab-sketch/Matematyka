# Matematyka na maturę

Aplikacje do nauki matematyki na poziomie matury podstawowej (Formuła 2023). Zadania są wzorowane na typach zadań z arkuszy CKE i losowane z nowymi liczbami. Każde zadanie ma poziom trudności, dwie podpowiedzi i rozwiązanie krok po kroku.

Strona: https://berechowskab-sketch.github.io/Matematyka/

## Działy

| Dział | Plik | Stan |
|---|---|---|
| Liczby rzeczywiste | `liczby.html` + `js/liczby.js` | gotowe |
| Równania i nierówności | `rownania.html` + `js/rownania.js` | gotowe |
| Funkcje | `funkcje.html` + `js/funkcje.js` | gotowe |
| Ciągi | `ciagi.html` | gotowe |
| Planimetria | `planimetria.html` | gotowe |
| Wyrażenia algebraiczne, trygonometria, geometria analityczna, stereometria, kombinatoryka i prawdopodobieństwo, statystyka, optymalizacja | – | w przygotowaniu |

## Budowa

- `js/silnik.js` – wspólny silnik: losowanie zadań, sprawdzanie odpowiedzi, wykresy, interfejs.
- `js/<dział>.js` – generatory zadań i ściąga jednego działu.
- `css/matura.css` – wspólny wygląd.

Nowy dział to jeden plik `js/<dział>.js`, strona `<dział>.html` (kopia np. `liczby.html`) i karta w `index.html`.

## Test

```
node test/test.js 2000
```

Test losuje każde zadanie wiele razy i sprawdza m.in., czy wynik przechodzi niezależne przeliczenie (`check`), czy są dokładnie dwie podpowiedzi, czy odpowiedzi ABCD się nie powtarzają i czy wzorcowa odpowiedź jest przyjmowana przez sprawdzarkę.
