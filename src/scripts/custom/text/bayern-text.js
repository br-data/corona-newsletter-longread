import { pretty, currentCount, currentIncrease, currentIncreasePerc, casesPerThousand, doublingTime } from '../utils';

export function init(config) {
  const { selector, caseData, deathData, metaData } = config;

  const text = `Bislang wurden nach Informationen des Robert Koch-Instituts ${pretty(currentCount(caseData))} Corona-Fälle in Bayern gemeldet. Das sind ${pretty(currentIncrease(caseData))} Fälle (+${pretty(currentIncreasePerc(caseData))} %) mehr als noch am Vortag.

  Damit kommt Bayern auf ${pretty(casesPerThousand(currentCount(caseData), metaData.pop))} gemeldete Fälle pro tausend Einwohner.

  Die Zahl der gemeldeten Fälle verdoppelt sich zur Zeit alle ${doublingTime(caseData)} Tage.

  Insgesamt wurden ${pretty(currentCount(deathData))} Todesfälle in Bayern gemeldet. ${(currentIncrease(deathData) > 0) ? 'Das ' + deathCasesPlural(currentIncrease(deathData)) + ' (+' + pretty(currentIncreasePerc(deathData)) + ' %) mehr als noch am Vortag.' : '.' } Damit ist Bayern weiterhin das Bundesland mit den meisten gemeldeten Corona-Todesfällen. `;

  const textElement = document.querySelector(selector);
  textElement.textContent = text;
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
