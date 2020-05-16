# Corona-Newsletter

- **Demo:** <https://ddj.br.de/corona-newsletter>

## Verwendung

1. Repository klonen `git clone https://...`
2. Erforderliche Module installieren `npm install`
3. Entwicklungsserver starten `npm start`
4. Projekt bauen mit `npm run build`

Um die Module installieren und die Entwicklerwerkzeuge nutzen zu können, muss vorher die JavaScript-Runtime [Node.js](https://nodejs.org/en/download/) installiert werden. Informationen für Entwickler finden sich weiter [unten](#user-content-entwickeln).

## Daten

## Spezielle Elemente

### Text (Custom)

### Tabellen (Custom)

### Diagramme (Custom)

## Standardelemente

### Bilder und Bildunterschriften

Bilder können ganz normal über das `<img>`-Element eingebunden werden. Wichtig ist eine aussagekräftige `alt=""`-Beschreibung (SEO und Accessibility). Bildbeschreibungen können mit einem Paragraphen und der Klasse `<p class="caption">Beschreibung</p>` hinzugefügt werden. Die relative Bildbreite ist abhängig vom Eltern-Container (siehe Raster):

```html
<main>
  <!-- seitenbreites Bild -->
  <img src="./assets/images/image.jpg" alt="Demo image">

  <section>
    <!-- inhaltsbreites Bild -->
    <img src="./assets/images/image.jpg" alt="Demo image">

    <div class="block">
      <!-- textbreites Bild mit Bildunterschrift -->
      <img src="./assets/images/image.jpg" alt="Demo image">
      <p class="caption">Beschreibung</p>
    </div>
  </section>
</main>
```

Für die Kompression der Bilder empfiehlt sich das JPEG-Format (40 % bis 60 % Kompression) und folgende Bildgrößen:

- Bild seitenbreit (Aufmacher): 1600 Pixel Breite
- Bild inhaltsbreit: 1120 Pixel Breite
- Bild textbreit: 785 Pixel Breite
- Vorschaubild: 520 Pixel Breite

Für Grafiken und Diagramme empfiehlt es sich fast immer, durch die geringe Dateigröße und das scharfe Rendering, das Vektorformat **SVG** zu verwenden.

### Infokasten

Der Infokasten bietet sich für kleinere Einschübe und Erklärtexte („Woher stammen die Daten?”) an.

```html
<div class="infobox">
  <h3>Infokasten</h3>

  <p>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum.</p>
</div>
```

### Tabellen

Eigentlich eine klassische HTML-Tabelle mit kleinen CSS-Tricks, um eine schicke mobile Darstellung zu erreichen. Das `data-label`-Attribut sorgt für die richtige Spalten- und Zeilenbeschriftung in der mobilen Ansicht. Ein Beispiel:

```html
<table>
  <thead>
    <tr>
      <th>Temperatur</th><th>A</th><th>B</th><th>C</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="Temperatur">Sommer</td><td data-label="A">2,1</td><td data-label="B">3,5</td><td data-label="C">7,4</td>
    </tr>
    <tr>
      <td data-label="Temperatur">Winter</td><td data-label="A">-2,8</td><td data-label="B">-2,4</td><td data-label="C">0,2</td>
    </tr>
  </tbody>
</table>
```

Daraus wird in der Desktop-Ansicht folgende Tabelle:  

```text
+------------+------+------+-----+
| Temperatur |  A   |  B   |  C  |
+------------+------+------+-----+
| Zeile 1    | 2,1  | 3,5  | 7,4 |
| Zeile 2    | -2,8 | -2,4 | 0,2 |
+------------+------+------+-----+
```

In der mobilen Ansicht wird aus jeder Zeile eine eigene kleine Tabelle mit den jeweiligen Werten:

```text
+------------+--------+
| Temperatur | Sommer |
+------------+--------+
| A          | 2,1    |
| B          | 3,5    |
| C          | 7,4    |
+------------+--------+

+------------+--------+
| Temperatur | Winter |
+------------+--------+
| A          | -2,8   |
| B          | -2,4   |
| C          | 0,2    |
+------------+--------+
```

Dabei werden die Daten transponiert. Das heißt, die X- und Y-Achse werden vertauscht. Bei manchen Datensätzen kann das zu Problemen führen, da nicht jeder Datensatz beliebig transponiertbar ist. In diesem Fall kann man die mobile Tabellenansicht im CSS auskommentieren. Mit etwas Nachdenken bekommt man jedoch fast jeden Datensatz in eine transponierbare Form.

### Navigation und Sharing

Mitlaufende Navigationsleiste. Der Hintergrund der Leiste und der Seitentitel sind zuerst unsichtbar. Erst beim Scrollen werden beide Elemente sichtbar. Das Verhalten der Navigationsleiste kann über zwei Parameter gesteuert werden:

```javascript
navigation.init({
  selector: '.navigation',
  debouce: 100,
  minY: 70
});
```

### Weitere Artikel (related)

Teaserfläche für verwandte Artikel. Sollte man auf jeden Fall am Ende des Artikels einzubauen, um wenigstens ein paar Leser auf dem Angebot des BR zu halten.

```html
<div class="related">
  <h2 class="uppercase">Mehr zum Thema</h2>

  <a href="https://br.de">
    <div class="image">
      <figure class="lazyload-wrapper ratio-3-2">
        <img class="lazyload" data-src="./assets/images/image-1.jpg" alt="Demo image">
        <noscript>
          <img src="./assets/images/image-1.jpg" alt="Demo image">
        </noscript>
      </figure>
    </div>
    <div class="description">
      <p class="timestamp">22.11.19, 17:37 Uhr</p>
      <h3>Lorem ipsum dolores sit amet</h3>
      <p class="content">Morbi in dui quis est pulvinar ullamcorper. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh.</p>
    </div>
  </a>

  <a href="#">
    <!-- weiterer Teaser -->
  </a>

  <a href="#">
    <!-- weiterer Teaser -->
  </a>
</div>
```

## Layout

Das Design richtet sich nach dem [BR24-Styleguide](https://share.ard-zdf-box.de/s/4dFDxWfbJsDd2gT#pdfviewer) und der gelebte Design-Praxis auf [BR24.de](https://br.de/nachrichten/).

### Typografie

Als Schriftart wird [Open Sans](https://www.google.com/fonts/specimen/Open+Sans) verwendet. Die bevorzugten Schriftschnitte sind:

- **Überschrift H1**: Bolder 700
- **Überschrift H2, H3, H4**: Bold 600
- **Fließtext**: Normal 400
- **Fließtext italic**: Normal 400 italic
- **Fließtext bold**: Bold 600

Die Basis-Schriftgrößen für die einzelnen Gerätegrößen sind:

- **Mobil**: 14px
- **Desktop**: 15px
- **Future**: 16px

### Raster (grid)

Das Longread-Template nutzt ein Gestaltungsraster. Dabei gibt es drei verschiedene Hierarchie-Ebenen:

- **main**: Seitenbreite Inhalte, zum Beispiel das Aufmacherbild
- **section**: Inhaltsbreite Inhalte, zum Beispiel Diagramme oder Kapitelaufmacher
- **block**: Textbreite Inhalte
- **marginals**: Randnotizen, fließen rechts, 20% der Inhaltsbreite
- **floats** (`.left`, `.right`): Zum Beispiel Zitate, fließen links oder recht, 45% der Inhaltsbreite

Die folgende Darstellung der Elemente ist nicht proportional:

```text
+-------------------------------------------------+
| main                                            |
|                                                 |
|  +-------------------------------------------+  |
|  | section                                   |  |
|  |                                           |  |
|  |   +---------------------------------------+  |
|  |   | .block                   | .marginals |  |
|  |   |                          |            |  |
|  +---------------------+  +------------------+  |
|  | .left               |  | .right           |  |
|  |   |                 |  |     |            |  |
|  |   |                 |  |     |            |  |
```

### Farben

Alle Farben sind im Sass-Modul `_color.scss` definiert. Hier finden sich auch die Farben für die Share-Buttons. Im Zweifelsfall sollte man immer eine der bestehenden Farben verwenden statt eine neue Farbe anzulegen. Farbskalen, für Choropleth-Karten oder Diagramme, kann man sich aus einer Basisfarbe mithilfe von Sass berechnen lassen. Eine Anleitung dazu findet sich [hier](http://alistapart.com/article/mixing-color-for-the-web-with-Sass).

### Enwicklungsserver

Zum lokalen Entwickeln ist ein kleiner [HTTP-Server](https://github.com/webpack/webpack-dev-server) integriert. Diesen kann man mit dem Befehl `npm start` starten. Der Server läuft unter <http://localhost:8080>. Beim Starten des Entwicklungsservers sollte automatisch ein neues Browserfenster aufgehen. Bei Änderungen am Quellcode wird die Seite automatisch neu geladen (Live Reloading).

### Stylesheets

Die Stylesheets unter `src/styles/` sind in [Sass](http://sass-lang.com/) geschrieben und modular angelegt:

- **base**: allgemeine, seitenübergreifenden Styles (Typo, Farben, Grid ...)
- **components**: komponentenspezifische Styles (Navigation, Footer, Zitate ...)
- **custom**: projektspezifische Stylesheets (Charts, ...)

Das CSS wird bei jeder Änderungen den Sass-Dateien neu erzeugt, sofern man den Webpack-Watch-Task gestartet hat. `npm start`. Als Compiler kommt [Dart Sass](https://github.com/sass/dart-sass) zum Einsatz, welcher deutlich schneller ist als der alte Ruby-Sass-Compiler.

*Hinweis*: Vendor-Prefixes wie `-webkit` oder `-moz` können weggelassen werden, das diese im Build durch den [Autoprefixer](https://github.com/postcss/autoprefixer) hinzugefügt werden.

### Javascript (ES6)

Das Javascript ist ebenfalls modular aufgebaut. Es gibt einen zentralen Einstiegspunkt `src/scripts/index.js`, wo im Idealfall alle notwendigen Komponenten importiert und initialisiert werden. Auch globale Event-Listener auf das `window` oder `document`-Objekt sollten hier registriert werden.

Hier ein einfach Beispiel für das Anlegen einen neuen Moduls unter `src/scripts/custom/module.js`:

```javascript
// Export default functions
export function init() {
  sayHello();
}

function sayHello() {
  console.log('Hello world')
}
```

In der `index.js` muss das Modul dann zuerst importiert und anschließend initialisiert werden:

```javascript
import * as module from './custom/module';

module.init();
```

Die meisten Module sind in Vanilla-Javascript (ohne andere Bibliotheken) geschrieben. Sollte man eine externe Bibliothek benötigen, kann man diese mit NPM installieren:

```shell
npm install d3 --save
```

Ein ausführliches Beispiel für einen D3.js-Diagramm findet sich unter `src/scripts/custom/chart.js`. Hier wird auch von der Möglichkeit der selektiven Imports Gebrauch gemacht. Es werden nur die Komponenten einer Bibliothek importiert, welche man in der eigenen Anwendung auch verwendet:

```javascript
import { select } from 'd3-selection';
import { max } from 'd3-array';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
```

[Sitepoint](https://www.sitepoint.com/understanding-es6-modules/) bietet einen gute Einführung in das Thema ES6-Module.

## Jenkinsfile

[Jenkins](https://jenkins.io/) ist eine Platform zur kontinuierlichen Integration (CI) von Anwendungen aller Art. Das Jenkinsfile ist eine Bauanleitung mithilfe derer das Projekt jedesmal neu gebaut und auf den Staging-Server kopiert wird, sobald Änderungen auf den master-Branch in Github gepusht werden. Dies passiert automatisch für alle öffentlichen und nicht-öffentlichen Repositories im [BR-Data-Github](https://github.com/br-data) deren Namen mit `-longread` endet. Ein Projekt mit Namen `demo-longread` wird so kontinuierlich auf `https://ddj.br.de/demo` ausgerollt.
