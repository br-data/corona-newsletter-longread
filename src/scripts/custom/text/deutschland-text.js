import { pretty, currentCount, currentIncrease, currentIncreasePerc, casesPerThousand, trendClassifier, weekTrend, doublingTime } from '../utils';

export function init(config) {
  const { selector, caseData, deathData, metaData } = config;

  const text = `In ganz Deutschland wurden bislang ${pretty(currentCount(caseData))} Corona-Fälle gemeldet. Das sind ${pretty(currentIncrease(caseData))} Fälle (+${pretty(currentIncreasePerc(caseData))} %) mehr als noch am Vortag.

  Bundesweit entspricht das ${pretty(casesPerThousand(currentCount(caseData), metaData.pop))} Fällen pro tausend Einwohner.

  Im Vergleich zur Vorwoche ist die Zahl der Neuinfektionen jedoch ${trendClassifier(weekTrend(caseData))} (${pretty(weekTrend(caseData))} %).

  Die Zahl der gemeldeten Fälle verdoppelt sich zur Zeit alle ${doublingTime(caseData)} Tage.

  Bisher wurden insgesamt ${pretty(currentCount(deathData))} Todesfälle in Deutschland gemeldet.

  ${(currentIncrease(deathData) > 0) ? 'Das ' + deathCasesPlural(currentIncrease(deathData)) + ' (+' + pretty(currentIncreasePerc(deathData)) + ' %) mehr als noch am Vortag.' : '.' }

  Langfristig gibt es aber einen ${positiveNegative(weekTrend(deathData))} Trend, denn die Zahl der neuen Todesfälle ist im Vergleich zur letzten Woche ${trendClassifier(weekTrend(deathData))} (${pretty(weekTrend(deathData))} %).`;

  const textElement = document.querySelector(selector);
  textElement.textContent = text;
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

function deathCasesPlural(value) {
  if (value === 1) {
    return 'ist ein Todesfall';
  } else if (value > 0) {
    return `sind ${pretty(value)} Todesfälle`;
  } else {
    return `sind ${pretty(value)} Todesfälle`;
  }
}
