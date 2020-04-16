import { pretty, currentCount, currentIncrease, currentIncreasePerc, doublingTime } from './utils';

export function init(config) {
  const { selector, caseData } = config;

  const text = `Bislang wurden ${pretty(currentCount(caseData))} Corona-Fälle in Bayern  gemeldet. Das sind ${pretty(currentIncrease(caseData))} Fälle (+${pretty(currentIncreasePerc(caseData))} %) mehr als noch am Vortag. Die Zahl der gemeldeten Fälle in Bayern verdoppelt sich damit ungefähr alle ${doublingTime(caseData)} Tage.`;

  const textElement = document.querySelector(selector);
  textElement.textContent = text;
}
