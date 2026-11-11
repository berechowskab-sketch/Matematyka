# Matematyka na maturę

Aplikacje do nauki matematyki na poziomie matury podstawowej (Formuła 2023). Zadania są wzorowane na typach zadań z arkuszy CKE i losowane z nowymi liczbami. Każde zadanie ma poziom trudności, dwie podpowiedzi i rozwiązanie krok po kroku.

Strona: https://berechowskab-sketch.github.io/Matematyka/

## Działy

| Dział | Pliki |
|---|---|
| Liczby rzeczywiste | `liczby.html` + `js/liczby.js` |
| Wyrażenia algebraiczne | `wyrazenia.html` + `js/wyrazenia.js` |
| Równania i nierówności | `rownania.html` + `js/rownania.js` |
| Funkcje | `funkcje.html` + `js/funkcje.js` |
| Trygonometria | `trygonometria.html` + `js/trygonometria.js` |
| Geometria analityczna | `analityczna.html` + `js/analityczna.js` |
| Stereometria | `stereometria.html` + `js/stereometria.js` |
| Kombinatoryka i prawdopodobieństwo | `kombinatoryka.html` + `js/kombinatoryka.js` |
| Statystyka | `statystyka.html` + `js/statystyka.js` |
| Optymalizacja | `optymalizacja.html` + `js/optymalizacja.js` |
| Ciągi | `ciagi.html` + `js/ciagi.js` |
| Planimetria | `planimetria.html` + `js/planimetria.js` |

Zakres zadań jest zgodny z wymaganiami egzaminacyjnymi obowiązującymi od 2025 r. (np. bez nierówności z wartością bezwzględną, bez twierdzenia sinusów, bez odchylenia standardowego).

## Budowa

- `js/silnik.js` – wspólny silnik: losowanie zadań, sprawdzanie odpowiedzi, wykresy, interfejs.
- `js/<dział>.js` – generatory zadań i ściąga jednego działu.
- `css/matura.css` – wspólny wygląd.

Ciągi i planimetria pochodzą z pierwszej wersji aplikacji: ich zadania są w starszym formacie, a na końcu plików jest krótki adapter do wspólnego silnika. Każde zadanie ma własne przeliczenie wyniku (`verify`), w planimetrii najczęściej na współrzędnych punktów z rysunku.

Nowy dział to jeden plik `js/<dział>.js`, strona `<dział>.html` (kopia np. `liczby.html`) i karta w `index.html`.

## Test

```
node test/test.js 2000
```

Test losuje każde zadanie wiele razy i sprawdza m.in., czy wynik przechodzi niezależne przeliczenie (`check`), czy są dokładnie dwie podpowiedzi, czy odpowiedzi ABCD się nie powtarzają i czy wzorcowa odpowiedź jest przyjmowana przez sprawdzarkę.
