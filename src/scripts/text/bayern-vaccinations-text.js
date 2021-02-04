import { pretty, currentCount } from '../utils';

export function init(config) {
  const { target, vaccinationData } = config;

  const firstShotCount = currentCount(vaccinationData, 'personen_erst_kumulativ');
  const secondShotCount = currentCount(vaccinationData, 'personen_voll_kumulativ');
  const firstShotPerc = currentCount(vaccinationData, 'impf_quote_erst');
  const secondShotPerc = currentCount(vaccinationData, 'impf_quote_voll');

  const text = `Seit Beginn der Impfkampagne haben ${pretty(firstShotCount)} Menschen (${pretty(firstShotPerc)} %) in Bayern eine erste Impfdosis erhalten. Davon wiederum haben ${pretty(secondShotCount)} Personen (${pretty(secondShotPerc)} %) eine zweite Impfdosis erhalten und gelten damit als vollständig geimpft.`;
  
  const textElement = document.querySelector(target);
  textElement.innerHTML = text;
}