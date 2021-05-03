import { pretty, currentCount, trendClassifier } from '../utils';

export function init(config) {
  const { target, data } = config;

  const minOneShotCount = currentCount(data, 'personen_erst_kumulativ')+currentCount(data, 'dosen_voll_janssen_kumulativ');
  const fullVaccCount = currentCount(data, 'personen_voll_kumulativ');
  const minOneShotPerc = minOneShotCount/131247.37;
  const fullVaccPerc = fullVaccCount/131247.37;
  const totalShots = currentCount(data, 'dosen_kumulativ');
  const currentIncrease = data[data.length - 1].dosen_kumulativ - data[data.length - 2].dosen_kumulativ;
  const currentWeekSum = data[data.length - 1].dosen_kumulativ - data[data.length - 6].dosen_kumulativ;
  const previousWeekSum = data[data.length - 7].dosen_kumulativ - data[data.length - 12].dosen_kumulativ;
  const currentWeekTrend = ((currentWeekSum - previousWeekSum) / previousWeekSum) * 100;
  
  const text = `Seit Beginn der Impfkampagne haben ${pretty(minOneShotCount)} Menschen (insgesamt ${pretty(minOneShotPerc)} %) in Bayern mindestens eine <a href="#impfungen">Impfdosis</a> erhalten. Davon sind ${pretty(fullVaccCount)} Personen (insgesamt ${pretty(fullVaccPerc)} %) inzwischen vollständig geimpft.
  
  Insgesamt wurden bisher ${pretty(totalShots)} Impfdosen verabreicht. Das sind ${pretty(currentIncrease)} Impfdosen mehr als noch am Vortag.
  
  Im Vergleich zur Vorwoche ist die Zahl der wöchentlich verabreichten Impfdosen ${trendClassifier(currentWeekTrend)} (${pretty((currentWeekTrend || 0), true)} %).`;
  
  const textElement = document.querySelector(target);
  textElement.innerHTML = text;
}