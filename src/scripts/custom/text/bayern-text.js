import { pretty, currentCount, currentIncrease, currentIncreasePerc, casesPerThousand, weekTrend, doublingTime } from '../utils';

export function init(config) {
  const { selector, caseData, deathData, metaData } = config;

  const text = `Bislang wurden nach Informationen des Robert Koch-Instituts ${pretty(currentCount(caseData))} Corona-Fälle in Bayern gemeldet.

  Das sind ${pretty(currentIncrease(caseData))} Fälle (+${pretty(currentIncreasePerc(caseData))} %) mehr als noch am Vortag.

  Im Vergleich zur Vorwoche ist die Zahl der Neuinfektionen jedoch ${classifyTrend(weekTrend(caseData))} (${pretty(weekTrend(caseData))} %).

  Damit kommt Bayern auf ${pretty(casesPerThousand(currentCount(caseData), metaData.pop))} gemeldete Fälle pro tausend Einwohner.

  Die Zahl der gemeldeten Fälle verdoppelt sich zur Zeit alle ${doublingTime(caseData)} Tage.

  Insgesamt wurden ${pretty(currentCount(deathData))} Todesfälle in Bayern gemeldet.

  ${(currentIncrease(deathData) > 0) ? 'Das ' + deathCasesPlural(currentIncrease(deathData)) + ' (+' + pretty(currentIncreasePerc(deathData)) + ' %) mehr als noch am Vortag.' : '.' }

  Langfristig gibt es einen ${positiveNegative(weekTrend(deathData))} Trend, denn die Zahl der Todesfälle ist im Vergleich zur Vorwoche ${classifyTrend(weekTrend(deathData))} (${pretty(weekTrend(deathData))} %).

  Damit ist Bayern weiterhin das Bundesland mit den meisten gemeldeten Corona-Todesfällen.`;

  const textElement = document.querySelector(selector);
  textElement.textContent = text;
}

function classifyTrend(value) {
  if (value <= -50) {
    return 'stark zurückgegangen';
  } else if (value <= -25) {
    return 'zurückgegangen';
  } else if (value < 0) {
    return 'leicht zurückgegangen';
  } else if (value === 0) {
    return 'gleich geblieben';
  } else if (value > 0 && value < 25) {
    return 'leicht angestiegen';
  } else if (value >= 25 && value < 50) {
    return 'angestiegen';
  } else if (value >= 50) {
    return 'stark angestiegen';
  }
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
