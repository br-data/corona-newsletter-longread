# Webpack Longread Template

HTML-Template für preiswürdige Longread- und Storytelling-Projekte im Design von [BR24](https://www.br.de/nachrichten/).

- **Demo:** <https://web.br.de/interaktiv/longread-webpack/>

## Verwendung

1. Repository klonen `git clone https://...`
2. Erforderliche Module installieren `npm install`
3. Entwicklungsserver starten `npm start`
4. Projekt bauen mit `npm run build`

Um die Module installieren und die Entwicklerwerkzeuge nutzen zu können, muss vorher die JavaScript-Runtime [Node.js](https://nodejs.org/en/download/) installiert werden. Informationen für Entwickler finden sich weiter [unten](#user-content-entwickeln).

## Elemente

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

### Lazy Loading

Um die Ladegeschwindigkeit des Longreads zu verbessern, ist es sinnvoll Bilder, die erst später im Text vorkommen, dynamisch nachzuladen (Lazy Loading). Dazu wird die URL des Bildes in das Attribut `data-src` geschrieben. Scrollt der Benutzer nach unten, wird der vorher leere Wert des Attributs `src` mit dem Wert aus `data-src` überschrieben und das Bild geladen.

```html
<figure class="lazyload-wrapper ratio-3-2">
  <img class="lazyload" src="" data-src="./assets/images/image.jpg" alt="Demo image">
  <noscript>
    <img src="./assets/images/image.jpg" alt="Demo image">
  </noscript>
</figure>
```

Die Klasse `ratio-3-2` dient dazu dem Platzhalter eine Höhe zu geben, bevor das Bild geladen wird. So wird verhindert, dass Inhalte durch plötzliche Höhenveränderungen nach unten geschoben werden. Mehr Infos zum Thema feste Seitenverhältnisse für Inhalte gibt es im Kapitel [Embeds](#embeds).

Um ein Bild in Browsern anzuzeigen, welche kein JavaScript unterstützen oder deaktiviert haben, kann das `<noscript>`-Element verwendet werden. Das Lazy Loading funktioniert mit [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). Für ältere Browser steht ein Polyfill bereit, der diese Funktionalität nachbildet.

### Scrollytelling

Einfach erklärt: Ein Grafik bleibt stehen (`.sticky`) und der Nutzer scrollt durch einzelne Text-Kästen (`.step`), welche die Grafik schrittweise erklären. Hier ein einfaches Beispiel.

```html
<div class="scrolly">
  <!-- Bild oder Grafik -->
  <div class="sticky" style="height: 100vh;
  background: url('assets/images/image-1.jpg') center / cover no-repeat"></div>

  <section>
    <!-- 1. Textabschnitt -->
    <div class="block step">
      <div class="step-content">
        <p>Erster Text</p>
      </div>
    </div>

    <!-- 2. Textabschnitt -->
    <div class="block step">
      <div class="step-content">
        <p>Zweiter Text</p>
      </div>
    </div>

    <!-- 3. Textabschnitt -->
    <div class="block step">
      <div class="step-content">
        <p>Dritter Text</p>
      </div>
    </div>
  </section>
</div>
```

Interaktives Scollytelling, bei dem sich die Grafik mit jedem Erzählschritt verändert, lässt sich am besten mit eine Library wie [Scrollama](https://github.com/russellgoldenberg/scrollama) realisieren. Ein Beispiel dafür findet sich in der Geschichte [Winnti: Angriff auf das Herz der deutschen Industrie](https://web.br.de/interaktiv/winnti/).

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

### Embeds

Manchmal möchte man externe Inhalte von Youtube, Soundclound oder anderen Dienstleistern responsiv einbetten. Sollten der Embed-Code sich nicht automatisch responsiv verhalten, gibt es dafür einen responsiven Embed-Container:

```html
<div class="embed ratio-16-9">
  <iframe src="https://www.youtube.com/embed/XsI9F3n-Bog" frameborder="0" allowfullscreen></iframe>
</div>
```

*Hinweis*: Bei den meisten iFrame-Embed-Codes muss man noch die Attribute `width` und `height` entfernen.

Der Embed-Container unterstützt folgende Seitenverhältnisse: 16:9, 4:3, 3:2, 1:1. Andere Seitenverhältnisse lassen sich leicht in der Datei `_embed.scss` hinzufügen. Dafür steht ein Sass-Mixin bereit:

```sass
.ratio-5-4 {
  @include aspect-ratio(5, 4)
}
```

Das dahinterstehende Konzept *Intrinsic Ratios* und seine Anwendung wird bei [CSS Trick](https://css-tricks.com/aspect-ratio-boxes/) im Detail beschrieben.

### Zitate (quotes)

Zitate können entweder links oder rechts im Text fließen. Damit Zitate bis zum Rand gehen, sollten sie außerhalb des Block-Containers platziert werden:

```html
<div class="quote right">
  <p>Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit.</p>
  <p class="author">Maximilian Maximus</p>
</div>

<div class="block">
  <!-- Inhalt -->
</div>
```

### Randnotizen (marginals)

Responsive Randnotizen. Das JavaScript wird benötigt, um die Randnotizen korrekt umzubrechen. Dadurch steht in der mobilen Ansicht die Randnotiz hinter dem Paragraphen, auf den sie sich bezieht. Wann die Randnotizen umbrechen, lässt sich im JavaScript konfigurieren:

```javascript
marginals.init({
  selector: '.marginal',
  breakpoint: 940
});
```

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

Mittlerweile werden sind alle notwendigen Schriftschnitte im Repository selbst enthalten und werden auch mit dem Longread-Bundle auf dem Server deployed. Aus Datenschutzgründen ist ein direktes Einbinden aus dem Google Fonts CDN nicht erstrebenswert.

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

## Analytics

### Simple Analytics (BR Data)

Einfaches Webanalyse-Tool, um Benutzerverhalten und Interaktion besser messen und verstehen zu können. Der Client ist modular aufgebaut und kann für verschiedene Analysen konfiguriert werden:

- **client**: Informationen über das Endgerät des Benutzers, zum Beispiel Betriebssystem und Browser.
- **click**: Klick-Tracking für Links, Schaltflächen und interaktive Elemente. Wird mit dem Attribut `data-click="my-click-event"` aktiviert.
- **observer**: Wegpunkte, um herauszufinden welche Bereiche einer Webseite ein Benutzer gesehen, beziehungsweise gelesen hat (Scrolltiefe). Wir über das Attribut `data-observer="my-element-is-visible-event"` aktiviert.
- **timer**: Zeichnet auf, wie viel Zeit ein Benutzer auf der Seite verbringt. Der Timer wird bei *blur*-Ereignissen angehalten und bei *focus*-Events fortgesetzt.
- **custom**: Benutzerdefiniertes JavaScript, wie beispielsweise eigene Event-Listener.

Die Web-Analyse wird in der `scripts/index.js` konfiguriert und initalisiert:

```javascript
import * as analytics from './modules/analytics';

analytics.init({
  serviceUrl: 'https://ddj.br.de/analytics/track',
  projectId: 'test',
  tracker: {
    client: true,
    click: true,
    observer: true,
    timer: true,
    custom: true
  },
  respectDoNotTrack: false,
  debug: false
});
```

Beispiele für die Verwendung der HTML-Attribute finden sich der `src/index.html`. Das Analyse-Tool [simple-node-analytics](https://github.com/stekhn/simple-node-analytics).
 (Client und Sever) wird stetig weiterentwickelt.

### AT Internet

Web-Analytics für alle BR-Angebote. Die Anpassung des Pixels erfolgt in der `src/index.html`. Die einzelnen Parameter werden im Folgenden erklärt (Kommentare). Meistens müssen jedoch nur ID, Titel, Datum ind die URL angepasst werden.

```javascript
var tag = new ATInternet.Tracker.Tag({
  secure: true,
  cookieSecure: true,
  ignoreEmptyChapterValue: true
});
tag.page.set({
  name: 'longread-template', // Seiten-ID
  chapter1: null,
  chapter2: null,
  level2: 19
});
tag.customVars.set({
  site: {
    1: '[BR24]', // Bereich
    2: '[ohne Wellenbezug]', // Welle oder Angebot
    5: '[keine Sendereihe]', // Sendereihe
    6: '[Artikel]', // Inhaltstyp
    7: '[longread-template]',  // Seiten-ID
    8: '[Longread Template]', // Seitentitel
    10: 20190611, // Datum
    11: '[https://web.br.de/interaktiv/longread-webpack/]', // URL
    12: '[longread-template]', // Board-ID
    13: referrer ? ('[' + referrer + ']') : null, // Referrer
    14: '[Web]' // Plattform
  }
});
tag.dispatch();
```

### IVW

Reichweitenmessung für das Gesamtangebot. Die Konfiguration erfolgt ebenfalls in der `src/index.html`, sollte jedoch nicht verändert werden.

```javascript
iom.c({
  'st': 'bronline',
  'cp': 'br_online\/nachrichten\/'
}, 1);
```

## Entwickeln

Das Longread-Template ist eine Web-Anwendung basierend auf HTML, Sass und JavaScript (ES6). Als Paketmanager kommt [NPM](https://www.npmjs.com/) zum Einsatz. [Webpack](https://webpack.js.org/) dient dazu Abhängigkeiten und Module zusammenzufassen und einen optimierten Build zu erstellen. Um modernes JavaScript (ES6) in abwärtskompatibles JavaScript (ES5) zu transpilieren wird [Babel](https://babeljs.io/) verwendet.

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

## Verbesserungen

- Navigation und Footer dokumentieren
- Icon-Font aktualisieren und dokumentieren
- Metadaten aktualisieren und dokumentieren
- Deployment dokumentieren
- Lazy-load für CSS-Hintergrundbilder
- Link `rel="preconnect"` hinzufügen
- `SameSite`-Warnung für Cookies behandeln
- Analytics aus index.html entfernen als Modul einbauen
- Handling von fehlenden Paketen (`npm install` erzwingen)
