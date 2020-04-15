import { pretty, currentCount, currentIncrease, currentIncreasePerc, doublingTime } from './utils';

export function init(config) {
  const { selector, data } = config;

  const text = `Bislang wurden ${pretty(currentCount(data))} Corona-Fälle in Bayern  gemeldet. Das sind ${pretty(currentIncrease(data))} Fälle (+${pretty(currentIncreasePerc(data))} %) mehr als noch am Vortag. Die Zahl der gemeldeten Fälle in Bayern verdoppelt sich damit ungefähr alle ${doublingTime(data)} Tage.`;

  const textElement = document.querySelector(selector);
  textElement.textContent = text;
}
