import { pretty, currentCount, currentIncrease, currentIncreasePerc, casesPerThousand, trendClassifier, trendArrow, weekTrend } from '../utils';

// Die Zahl der gemeldeten Fälle verdoppelt sich zur Zeit alle ${doublingTime(caseData)} Tage.
// (+${pretty(currentIncreasePerc(caseData))} %)
// '(+' + pretty(currentIncreasePerc(deathData)) + ' %)'

export function init(config) {
  const { caseTarget, deathTarget, caseData, deathData, metaData } = config;

  const caseText = `In ganz Deutschland wurden bislang ${pretty(currentCount(caseData))} Corona-Fälle gemeldet. Das sind ${pretty(currentIncrease(caseData))} Fälle mehr als noch am Vortag.

  Im Vergleich zur Vorwoche ist die Zahl der Neuinfektionen ${trendClassifier(weekTrend(caseData))} (<span class="${trendArrow(weekTrend(caseData))}"></span>${pretty(weekTrend(caseData))} %).

  Bundesweit entspricht das ${pretty(casesPerThousand(currentCount(caseData), metaData.pop))} Fällen pro tausend Einwohner.`;

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

function deathCasesPlural(value) {
  if (value === 1) {
    return 'ist ein Todesfall';
  } else if (value > 0) {
    return `sind ${pretty(value)} Todesfälle`;
  } else {
    return `sind ${pretty(value)} Todesfälle`;
  }
}