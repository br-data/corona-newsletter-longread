import { pretty, trendClassifier, weekTrend, trendArrow } from '../utils';

export function init(config) {
  const { target, patientData, metaData } = config;
  const currentPatients = patientData[patientData.length - 1].faelleCovidAktuell;
  const currentPatientsPer100k = (currentPatients * 100000) / metaData.pop;
  const currentIncrease = patientData[patientData.length - 1].faelleCovidAktuell - patientData[patientData.length - 2].faelleCovidAktuell;
  const currentWeekTrend = weekTrend(patientData, 10, 'faelleCovidAktuell');
  
  const text = `Ein weiterer wichtiger Indikator zur Einschätzung der Pandemie ist die Zahl der gemeldeten Corona-Patienten in intensivmedizinischer Behandlung. Nach Angaben des DIVI-Intensivregisters werden derzeit ${pretty(currentPatients)} Menschen in Bayern intensivmedizinsch wegen einer Corona-Erkrankung behandelt. Das sind ${pretty(currentIncrease)} Intensivpatienten mehr als noch am Vortag.
  
  Im Vergleich zur Vorwoche ist die Zahl der Intensivpatienten ${trendClassifier(currentWeekTrend)} (<span class="${trendArrow(currentWeekTrend)}"></span>${pretty((currentWeekTrend || 0), true)} %).
  
  Bayern kommt damit auf ungefähr ${pretty(currentPatientsPer100k)} Intensivpatienten pro 100.000 Einwohner.`;
  
  const textElement = document.querySelector(target);
  textElement.innerHTML = text;
}
