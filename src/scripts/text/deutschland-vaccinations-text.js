import { pretty, currentCount, trendClassifier } from '../utils';

export function init(config) {
  const { target, data } = config;

  const firstShotCount = currentCount(data, 'personen_erst_kumulativ');
  const secondShotCount = currentCount(data, 'personen_voll_kumulativ');
  const firstShotPerc = currentCount(data, 'impf_quote_erst');
  const secondShotPerc = currentCount(data, 'impf_quote_voll');
  const totalShots = currentCount(data, 'dosen_kumulativ');
  const currentIncrease = data[data.length - 1].dosen_kumulativ - data[data.length - 2].dosen_kumulativ;
  const currentWeekSum = data[data.length - 1].dosen_kumulativ - data[data.length - 6].dosen_kumulativ;
  const previousWeekSum = data[data.length - 7].dosen_kumulativ - data[data.length - 12].dosen_kumulativ;
  const currentWeekTrend = ((currentWeekSum - previousWeekSum) / previousWeekSum) * 100;
  
  const text = `Seit Beginn der Impfkampagne haben ${pretty(firstShotCount)} Menschen (insgesamt ${pretty(firstShotPerc)} %) in Deutschland mindestens eine erste <a href="#impfungen">Impfdosis</a> erhalten. Davon sind ${pretty(secondShotCount)} Personen (insgesamt ${pretty(secondShotPerc)} %) inzwischen vollständig geimpft.
  
  Insgesamt wurden bisher ${pretty(totalShots)} Impfdosen verabreicht. Das sind ${pretty(currentIncrease)} Impfdosen mehr als noch am Vortag.
  
  Im Vergleich zur Vorwoche ist die Zahl der wöchentlich verabreichten Impfdosen ${trendClassifier(currentWeekTrend)} (${pretty((currentWeekTrend || 0), true)} %).`;
  
  const textElement = document.querySelector(target);
  textElement.innerHTML = text;
}