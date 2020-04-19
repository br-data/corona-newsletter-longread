import { pretty, currentCount, currentIncrease, currentIncreasePerc, casesPerThousand, trendClassifier, weekTrend, doublingTime } from '../utils';

export function init(config) {
  const { caseTarget, deathTarget, caseData, deathData, metaData } = config;

  const caseText = `Bislang wurden nach Informationen des Robert Koch-Instituts ${pretty(currentCount(caseData))} Corona-Fälle in Bayern gemeldet.

  Das sind ${pretty(currentIncrease(caseData))} Fälle (+${pretty(currentIncreasePerc(caseData))} %) mehr als noch am Vortag.

  Damit kommt Bayern auf ${pretty(casesPerThousand(currentCount(caseData), metaData.pop))} gemeldete Fälle pro tausend Einwohner.

  Im Vergleich zur Vorwoche ist die Zahl der Neuinfektionen jedoch ${trendClassifier(weekTrend(caseData))} (${pretty(weekTrend(caseData))} %).

  Die Zahl der gemeldeten Fälle verdoppelt sich zur Zeit alle ${doublingTime(caseData)} Tage.`;

  const deathText = `Insgesamt wurden ${pretty(currentCount(deathData))} Todesfälle in Bayern gemeldet.

  ${(currentIncrease(deathData) > 0) ? 'Das ' + deathCasesPlural(currentIncrease(deathData)) + ' (+' + pretty(currentIncreasePerc(deathData)) + ' %) mehr als noch am Vortag.' : '.' }

  Langfristig gibt es aber einen ${positiveNegative(weekTrend(deathData))} Trend, denn die Zahl der neuen Todesfälle ist im Vergleich zur letzten Woche ${trendClassifier(weekTrend(deathData))} (${pretty(weekTrend(deathData))} %).

  Trotzdem ist Bayern weiterhin das Bundesland mit den meisten gemeldeten Corona-Todesfällen.`;

  const caseElement = document.querySelector(caseTarget);
  caseElement.textContent = caseText;

  const deathElement = document.querySelector(deathTarget);
  deathElement.textContent = deathText;
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
