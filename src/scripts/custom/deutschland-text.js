import metaDeutschland from '../data/meta/deutschland-meta.json';

import { pretty, currentCount, currentIncrease, currentIncreasePerc, casesPerThousand, doublingTime } from './utils';

export function init(config) {
  const { selector, caseData, deathData } = config;

  const text = `In ganz Deutschland wurden bislang ${pretty(currentCount(caseData))} Corona-Fälle gemeldet. Das sind ${pretty(currentIncrease(caseData))} Fälle (+${pretty(currentIncreasePerc(caseData))} %) mehr als noch am Vortag.

  Bundesweit entspricht das ${pretty(casesPerThousand(currentCount(caseData), metaDeutschland.pop))} Fällen pro tausend Einwohner.

  Die Zahl der gemeldeten Fälle verdoppelt sich zur Zeit alle ${doublingTime(caseData)} Tage.

  Die Zahl der gemeldeten Todesfälle in Deutschland ${increaseClassifier(currentIncrease(deathData))} ${pretty(currentCount(deathData))}. ${(currentIncrease(deathData) > 0) ? 'Das ' + deathCasesPlural(currentIncrease(deathData)) + ' (+' + pretty(currentIncreasePerc(deathData)) + ' %) mehr als noch am Vortag.' : '' }`;

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
