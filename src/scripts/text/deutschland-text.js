import { pretty, currentCount, currentIncrease, casesPerThousand, trendClassifier, trendArrow, weekTrend, reproNumber, confidence, sma } from '../utils';

// Die Zahl der gemeldeten Fälle verdoppelt sich zur Zeit alle ${doublingTime(caseData)} Tage.
// (+${pretty(currentIncreasePerc(caseData))} %)
// '(+' + pretty(currentIncreasePerc(deathData)) + ' %)'

export function init(config) {
  const { caseTarget, deathTarget, caseData, recoveredData, deathData, metaData } = config;

  const reproData = reproNumber(sma(caseData));
  const confidenceInterval = confidence(reproData, '95');
  const reproValue = reproData[reproData.length - 3].value;
  const lowerReproValue = reproValue - confidenceInterval;
  const upperReproValue = reproValue + confidenceInterval;

  const caseText = `In ganz Deutschland wurden bislang ${pretty(currentCount(caseData))} Corona-Fälle gemeldet. Das sind ${pretty(currentIncrease(caseData))} Fälle mehr als noch am Vortag.

  Durch die Meldeverzögerung bei den Behörden, vor allem am Wochenende und an Feiertagen, kann dieser Wert von Tag zu Tag unterschiedlich hoch ausfallen.

  Im Vergleich zur Vorwoche ist die Zahl der Neuinfektionen ${trendClassifier(weekTrend(caseData))} (<span class="${trendArrow(weekTrend(caseData))}"></span>${pretty(weekTrend(caseData))} %).

  Bundesweit entspricht das ${pretty(casesPerThousand(currentCount(caseData), metaData.pop))} Fällen pro tausend Einwohner.

  Die Reproduktionszahl für Deutschland liegt nach Berechnungen von BR Data bei ungefähr ${pretty(reproValue)}. Das bedeutet, dass jede infizierte Person durchschnittlich ${oneManyPersons(reproValue)} ansteckt. Diese Berechnung ist jedoch nur eine Schätzung, welche bestimmten Abweichungen unterliegt. Mit sehr hoher Wahrscheinlichkeit (95 %) liegt die Reproduktionszahl jedoch in einem Bereich von ${pretty(lowerReproValue)} bis ${pretty(upperReproValue)}.

  Das Robert Koch-Institut berechnet, dass mittlerweile ${pretty(currentCount(recoveredData))} Menschen wieder gesund sind.`;

  const deathText = `Bisher wurden insgesamt ${pretty(currentCount(deathData))} Todesfälle in Deutschland gemeldet.

  ${(currentIncrease(deathData) > 0) ? 'Das ' + deathCasesPlural(currentIncrease(deathData)) + ' mehr als noch am Vortag.' : '.' }

  Langfristig gibt es aber einen ${positiveNegative(weekTrend(deathData))} Trend, denn die Zahl der neuen Todesfälle ist im Vergleich zur letzten Woche ${trendClassifier(weekTrend(deathData))} (<span class="${trendArrow(weekTrend(deathData))}"></span>${pretty(weekTrend(deathData))} %).`;

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
