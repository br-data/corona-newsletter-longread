import { pretty, currentCount, currentIncrease, casesPer100Tsd7Days, trendClassifier, trendArrow, weekTrend, reproNumber, confidence, sma } from '../utils';

// Die Zahl der gemeldeten Fälle verdoppelt sich zur Zeit alle ${doublingTime(caseData)} Tage.
// (+${pretty(currentIncreasePerc(caseData))} %)
// '(+' + pretty(currentIncreasePerc(deathData)) + ' %)'

export function init(config) {
  const { caseTarget, deathTarget, caseData, recoveredData, deathData, metaData } = config;
  const reproData = reproNumber(sma(caseData));
  const confidenceInterval = confidence(reproData, '95');
  const reproValue = reproData[reproData.length - 2].value;
  const lowerReproValue = reproValue - (confidenceInterval / 2);
  const upperReproValue = reproValue + (confidenceInterval / 2);

  const caseText = `Bislang wurden nach Informationen des Robert Koch-Instituts ${pretty(currentCount(caseData))} Corona-Fälle in Bayern gemeldet. Das sind ${pretty(currentIncrease(caseData))} Fälle mehr als noch am Vortag.

  Durch die Meldeverzögerung bei den Behörden, vor allem am Wochenende und an Feiertagen, kann dieser Wert von Tag zu Tag unterschiedlich hoch ausfallen.

  Im Vergleich zur Vorwoche ist die Zahl der Neuinfektionen jedoch ${trendClassifier(weekTrend(caseData))} (<span class="${trendArrow(weekTrend(caseData))}"></span>${pretty(weekTrend(caseData))} %).

  Damit kommt Bayern auf ${pretty(casesPer100Tsd7Days(caseData, metaData.pop))} gemeldete Fälle pro 100.000 Einwohner in den letzten sieben Tagen. In der Woche zuvor waren es noch ${pretty(casesPer100Tsd7Days(caseData.slice(0, caseData.length-7), metaData.pop))} Fälle pro 100.000 Einwohner.<br><br>

  Die Reproduktionszahl für Bayern liegt nach Berechnungen von BR Data bei ungefähr ${pretty(reproValue, 'round', 100)}. Das bedeutet, dass jede infizierte Person durchschnittlich ${oneManyPersons(reproValue)} ansteckt. Diese Berechnung ist jedoch nur eine Schätzung, welche bestimmten Abweichungen unterliegt. Mit sehr hoher Wahrscheinlichkeit (95 %) liegt die Reproduktionszahl jedoch in einem Bereich von ${pretty(lowerReproValue, 'floor', 100)} bis ${pretty(upperReproValue, 'ceil', 100)}.<br><br>

  Nach Berechnungen des RKI sind mittlerweile wieder mindestens ${pretty(currentCount(recoveredData))} Menschen in Bayern genesen.`;

  const deathText = `Insgesamt wurden ${pretty(currentCount(deathData))} Todesfälle im Freistaat gemeldet.

  ${(currentIncrease(deathData) > 0) ? 'Das ' + deathCasesPlural(currentIncrease(deathData)) + ' mehr als noch am Vortag.' : '.' }

  Langfristig gibt es aber einen ${positiveNegative(weekTrend(deathData))} Trend, denn die Zahl der neuen Todesfälle ist im Vergleich zur letzten Woche ${trendClassifier(weekTrend(deathData))} (<span class="${trendArrow(weekTrend(deathData))}"></span>${pretty(weekTrend(deathData))} %).

  Trotzdem ist Bayern weiterhin das Bundesland mit den meisten gemeldeten Corona-Todesfällen.`;

  const caseElement = document.querySelector(caseTarget);
  caseElement.innerHTML = caseText;

  const deathElement = document.querySelector(deathTarget);
  deathElement.innerHTML = deathText;
}

function positiveNegative(value) {
  if (value < 0) {
    return 'positiven';
  } else if (value === 0) {
    return 'neutralen';
  } else if (value > 0) {
    return 'negativen';
  }
}

function oneManyPersons(value) {
  if (value === 0) {
    return 'keine weitere Personen';
  } else if (value === 1) {
    return 'ein weitere Person';
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
