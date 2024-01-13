import { pretty, current, lastWeek, trendClassifier, trendArrow, weekTrend, reproNumber, confidence } from '../utils';

export function init(config) {
  const { caseTarget, reproTarget, deathTarget, cases, newCases } = config;

  const reproData = reproNumber(cases, 4, 'mittlere7TageInfektionen');
  const confidenceInterval = confidence(reproData, '95');
  const reproValue = reproData[reproData.length - 2].value;
  const lowerReproValue = reproValue - (confidenceInterval / 2);
  const upperReproValue = reproValue + (confidenceInterval / 2);

  const caseText = `Bislang wurden nach Informationen des Robert Koch-Instituts ${pretty(current(cases, 'summeFall'))} <a href="#fallzahlen">Corona-Fälle</a> in Bayern gemeldet. Das sind ${pretty(current(newCases, 'anzahlFallNeu'))} Fälle mehr als noch am Vortag.

  Durch die <a href="#aktualitaet">Meldeverzögerung</a> bei den Behörden, vor allem am Wochenende und an Feiertagen, kann dieser Wert von Tag zu Tag unterschiedlich hoch ausfallen.

  Im Vergleich zur Vorwoche ist die Zahl der Neuinfektionen jedoch ${trendClassifier(weekTrend(cases, 10, 'anzahlFall'))} (<span class="${trendArrow(weekTrend(cases, 10, 'anzahlFall'))}"></span>${pretty((weekTrend(cases, 10, 'anzahlFall') || 0), true)} %).

  Damit kommt Bayern auf einen <a href="#inzidenz">Inzidenzwert</a> von ${pretty(current(cases, 'inzidenz'))} gemeldeten Fällen pro 100.000 Einwohner in den vergangenen sieben Tagen. In der Woche zuvor lag die 7-Tage-Inzidenz noch bei ${pretty(lastWeek(cases, 'inzidenz'))} Fällen pro 100.000 Einwohner.`;

  const reproText = `Die <a href="#reproduktionszahl">Reproduktionszahl</a> für Bayern liegt nach Berechnungen von BR Data bei ungefähr ${pretty(reproValue, false, 'round', 100)}. Das bedeutet, dass jede infizierte Person durchschnittlich ${oneManyPersons(reproValue)} ansteckt. Diese Berechnung ist jedoch nur eine Schätzung, die bestimmten Abweichungen unterliegt. Deshalb ist es sinnvoll, das sogenannte Konfidenzintervall zu betrachten: Mit sehr hoher Wahrscheinlichkeit (95 %) liegt die Reproduktionszahl in einem Bereich von ${pretty(lowerReproValue, false, 'floor', 100)} bis ${pretty(upperReproValue, false, 'ceil', 100)}.`;

  // `Nach Berechnungen des RKI sind mittlerweile wieder mindestens ${pretty(current(cases, 'summeGenesen'))} Menschen in Bayern <a href="#genesungen">genesen</a>.`

  const deathText = `Insgesamt wurden ${pretty(current(cases, 'summeTodesfall'))} <a href="#todesfaelle">Todesfälle</a> im Freistaat gemeldet.

  ${(current(newCases, 'anzahlTodesfallNeu') > 0) ? 'Das ' + deathCasesPlural(current(newCases, 'anzahlTodesfallNeu')) + ' mehr als noch am Vortag.' : 'Im Vergleich zum Vortag gab es keine neuen Todesfälle.'} Langfristig gibt es ${positiveNegative(weekTrend(cases, 10, 'anzahlTodesfall'))} Trend, denn die Zahl der neuen Todesfälle ist im Vergleich zur vergangenen Woche ${trendClassifier(weekTrend(cases, 10, 'anzahlTodesfall'))} (<span class="${trendArrow(weekTrend(cases, 10, 'anzahlTodesfall'))}"></span>${pretty((weekTrend(cases, 10, 'anzahlTodesfall') || 0), true)} %).`;

  // `Die Zahl der gemeldeten Fälle verdoppelt sich zur Zeit alle ${doublingTime(caseData)} Tage.`
  
  const caseElement = document.querySelector(caseTarget);
  caseElement.innerHTML = caseText;

  const reproElement = document.querySelector(reproTarget);
  reproElement.innerHTML = reproText;

  const deathElement = document.querySelector(deathTarget);
  deathElement.innerHTML = deathText;
}

function positiveNegative(value) {
  if (value < 0) {
    return 'einen positiven';
  } else if (value === 0) {
    return 'keinen eindeutigen';
  } else if (value > 0) {
    return 'negativen';
  } else {
    return 'keinen eindeutigen';
  }
}

function oneManyPersons(value) {
  if (value === 0) {
    return 'keine weitere Personen';
  } else if (value === 1) {
    return 'eine weitere Person';
  } else {
    return `${pretty(value)} weitere Personen`;
  }
}

function deathCasesPlural(value) {
  if (value === 0) {
    return 'kein Todesfall';
  } else if (value === 1) {
    return 'ist ein Todesfall';
  } else if (value > 1) {
    return `sind ${pretty(value)} Todesfälle`;
  }
}
