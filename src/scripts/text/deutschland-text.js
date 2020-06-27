import { pretty, currentCount, currentIncrease, casesPer100Tsd7Days, trendClassifier, trendArrow, weekTrend, reproNumber, confidence, sma } from '../utils';

// Die Zahl der gemeldeten Fälle verdoppelt sich zur Zeit alle ${doublingTime(caseData)} Tage.
// (${pretty(currentIncreasePerc(caseData), true)} %)
// '(+' + pretty(currentIncreasePerc(deathData)) + ' %)'

export function init(config) {
  const { caseTarget, deathTarget, caseData, recoveredData, deathData, metaData } = config;

  const reproData = reproNumber(sma(caseData));
  const confidenceInterval = confidence(reproData, '95');
  const reproValue = reproData[reproData.length - 2].value;
  const lowerReproValue = reproValue - (confidenceInterval / 2);
  const upperReproValue = reproValue + (confidenceInterval / 2);

  const caseText = `In Deutschland wurden bislang ${pretty(currentCount(caseData))} <a href="#fallzahlen">Corona-Fälle</a> gemeldet. Das sind ${pretty(currentIncrease(caseData))} Fälle mehr als noch am Vortag.

  Durch die <a href="#aktualitaet">Meldeverzögerung</a> bei den Behörden, vor allem am Wochenende und an Feiertagen, kann dieser Wert von Tag zu Tag unterschiedlich hoch ausfallen.

  Im Vergleich zur Vorwoche ist die Zahl der Neuinfektionen ${trendClassifier(weekTrend(caseData))} (<span class="${trendArrow(weekTrend(caseData))}"></span>${pretty((weekTrend(caseData) || 0), true)} %).

  Bundesweit entspricht das ${pretty(casesPer100Tsd7Days(caseData, metaData.pop))} gemeldeten Fällen pro 100.000 Einwohnern in den letzten sieben Tagen. In der Woche zuvor waren es noch ${pretty(casesPer100Tsd7Days(caseData.slice(0, caseData.length-7), metaData.pop))} Fälle pro 100.000 Einwohner.<br><br>

  Die <a href="#reproduktionszahl">Reproduktionszahl</a> für Deutschland liegt nach Berechnungen von BR Data bei ungefähr ${pretty(reproValue, false, 'round', 100)}. Das bedeutet, dass jede infizierte Person durchschnittlich ${oneManyPersons(reproValue)} ansteckt. Diese Berechnung ist jedoch nur eine Schätzung, die bestimmten Abweichungen unterliegt. Mit sehr hoher Wahrscheinlichkeit (95 % Konfidenzintervall) liegt die Reproduktionszahl in einem Bereich von ${pretty(lowerReproValue, false, 'floor', 100)} bis ${pretty(upperReproValue, false, 'ceil', 100)}.<br><br>

  Das Robert Koch-Institut schätzt, dass mittlerweile mindestens ${pretty(currentCount(recoveredData))} Menschen wieder <a href="#genesungen">gesund</a> sind.`;

  const deathText = `Bisher wurden insgesamt ${pretty(currentCount(deathData))} <a href="#todesfaelle">Todesfälle</a> in Deutschland gemeldet.

  ${(currentIncrease(deathData) > 0) ? 'Das ' + deathCasesPlural(currentIncrease(deathData)) + ' mehr als noch am Vortag.' : 'Im Vergleich zum Vortag gab es keine neuen Todesfälle.' }

  Langfristig gibt es aber einen ${positiveNegative(weekTrend(deathData))} Trend, denn die Zahl der neuen Todesfälle ist im Vergleich zur letzten Woche ${trendClassifier(weekTrend(deathData))} (<span class="${trendArrow(weekTrend(deathData))}"></span>${pretty((weekTrend(deathData) || 0), true)} %).`;

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
  } else if (value === undefined) {
    return 'positiven';
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
