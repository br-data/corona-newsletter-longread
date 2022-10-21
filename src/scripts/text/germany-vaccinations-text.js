import { pretty, trendClassifier } from '../utils';

export function init(config) {
  const { target, data } = config;

  const getTotalShotCount = (datum => (
    datum.summeErstimpfung +
    datum.summeZweitimpfung +
    datum.summeDrittimpfung +
    datum.summeViertimpfung
  ));
  
  const currentData = data[data.length - 1];
  const firstShotCount = currentData.summeErstimpfung;
  const secondShotCount = currentData.summeZweitimpfung;
  const thirdShotCount = currentData.summeDrittimpfung;
  const fourthShotCount = currentData.summeViertimpfung;
  const totalShotCount = getTotalShotCount(data[data.length - 1]);
  const firstShotPerc = currentData.quoteErstimpfung;
  const secondShotPerc = currentData.quoteZweitimpfung;
  const thirdShotPerc = currentData.quoteDrittimpfung;
  const fourthShotPerc = currentData.quoteViertimpfung;
  const currentIncrease = getTotalShotCount(data[data.length - 1]) - getTotalShotCount(data[data.length - 2]);
  const currentWeekSum = getTotalShotCount(data[data.length - 1]) - getTotalShotCount(data[data.length - 6]);
  const previousWeekSum = getTotalShotCount(data[data.length - 7]) - getTotalShotCount(data[data.length - 12]);
  const currentWeekTrend = ((currentWeekSum - previousWeekSum) / previousWeekSum) * 100;

  const text = `Seit Beginn der Impfkampagne haben mindestens ${pretty(firstShotCount)} Menschen in Deutschland eine <a href="#impfungen">Erstimpfung</a> erhalten. Das entspricht ${pretty(firstShotPerc)} % der Bundesbevölkerung. ${pretty(secondShotCount)} Menschen (${pretty(secondShotPerc)} %) haben eine Zweitimpfung erhalten und gelten laut RKI als grundimmunisiert. ${pretty(thirdShotCount)} Personen (${pretty(thirdShotPerc)} %) haben eine Drittimpfung, die sogenannten Auffrischimpfung oder Booster, bekommen. Die Möglichkeit einer vierte Impfung, haben bislang nur ${pretty(fourthShotCount)} Personen (${pretty(fourthShotPerc)} %) in Anspruch genommen.
  
  Insgesamt wurden bisher ${pretty(totalShotCount)} Impfdosen verabreicht. Das sind ${pretty(currentIncrease)} Impfdosen mehr als noch am Vortag.
  
  Im Vergleich zur Vorwoche ist die Zahl der wöchentlich verabreichten Impfdosen ${trendClassifier(currentWeekTrend)} (${pretty((currentWeekTrend || 0), true)} %).`;
  
  const textElement = document.querySelector(target);
  textElement.innerHTML = text;
}