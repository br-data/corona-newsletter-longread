import metaBayern from '../data/meta/bayern-meta.json';

import { pretty, currentCount, currentIncrease, currentIncreasePerc, casesPerThousand, doublingTime } from './utils';

export function init(config) {
  const { selector, caseData, deathData } = config;

  const text = `Bislang wurden ${pretty(currentCount(caseData))} Corona-Fälle in Bayern gemeldet. Das sind ${pretty(currentIncrease(caseData))} Fälle (+${pretty(currentIncreasePerc(caseData))} %) mehr als noch am Vortag.

  Damit kommt Bayern auf ${pretty(casesPerThousand(currentCount(caseData), metaBayern.pop))} gemeldete Fälle pro 1.000 Einwohner.

  Die Zahl der gemeldeten Fälle verdoppelt sich zur Zeit alle ${doublingTime(caseData)} Tage.

  Die Zahl der gemeldeten Todesfälle in Bayern ${increaseClassifier(currentIncrease(deathData))} ${pretty(currentCount(deathData))}. ${(currentIncrease(deathData) > 0) ? 'Das ' + deathCasesPlural(currentIncrease(deathData)) + ' (+' + pretty(currentIncreasePerc(deathData)) + ' %) mehr als noch am Vortag.' : '' }`;

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

function increaseClassifier(value) {
  if (value < 0) {
    return 'sinkt auf';
  } else if (value === 0) {
    return 'bleibt unverändert bei';
  } else if (value > 0) {
    return 'steigt auf';
  } else {
    return 'ist';
  }
}
