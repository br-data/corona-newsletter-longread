import { pretty, currentCount, trendClassifier } from '../utils';

export function init(config) {
  const { target, data, metaData } = config;

  const firstShotCount = currentCount(data, 'personen_min1_kumulativ');
  const secondShotCount = currentCount(data, 'personen_voll_kumulativ');
  const thirdShotCount = currentCount(data, 'personen_auffr_kumulativ');
  const totalShots = currentCount(data, 'dosen_kumulativ');
  const firstShotPerc = firstShotCount * 100 / metaData.pop;
  const secondShotPerc = secondShotCount * 100 / metaData.pop;
  const thirdShotPerc = thirdShotCount * 100 / metaData.pop;
  const currentIncrease = data[data.length - 1].dosen_kumulativ - data[data.length - 2].dosen_kumulativ;
  const currentWeekSum = data[data.length - 1].dosen_kumulativ - data[data.length - 6].dosen_kumulativ;
  const previousWeekSum = data[data.length - 7].dosen_kumulativ - data[data.length - 12].dosen_kumulativ;
  const currentWeekTrend = ((currentWeekSum - previousWeekSum) / previousWeekSum) * 100;
  
  const text = `Seit Beginn der Impfkampagne haben mindestens ${pretty(firstShotCount)} Menschen in Bayern eine <a href="#impfungen">Erstimpfung</a> erhalten. Das entspricht ${pretty(firstShotPerc)} % der bayerischen Bevölkerung. ${pretty(secondShotCount)} Menschen (${pretty(secondShotPerc)} %) haben eine Zweitimpfung erhalten und gelten laut RKI als grundimmunisiert. ${pretty(thirdShotCount)} Personen (${pretty(thirdShotPerc)} %) haben eine Drittimpfung, die sogenannten Auffrischimpfung oder Booster, bekommen.
  
  Insgesamt wurden bisher ${pretty(totalShots)} Impfdosen verabreicht. Das sind ${pretty(currentIncrease)} Impfdosen mehr als noch am Vortag.
  
  Im Vergleich zur Vorwoche ist die Zahl der wöchentlich verabreichten Impfdosen ${trendClassifier(currentWeekTrend)} (${pretty((currentWeekTrend || 0), true)} %).`;
  
  const textElement = document.querySelector(target);
  textElement.innerHTML = text;
}