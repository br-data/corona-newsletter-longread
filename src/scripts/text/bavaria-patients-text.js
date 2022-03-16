import { pretty, trendClassifier, weekTrend, trendArrow } from '../utils';

export function init(config) {
  const { target, patientData, metaData } = config;
  const currentPatients = patientData[patientData.length - 1].anzahlIntensivpatienten;
  const currentPatientsPer100k = (currentPatients * 100000) / metaData.pop;
  const currentIncrease = patientData[patientData.length - 1].anzahlIntensivpatienten - patientData[patientData.length - 2].anzahlIntensivpatienten;
  const currentWeekTrend = weekTrend(patientData, 10, 'anzahlIntensivpatienten');
  
  const text = `Ein weiterer wichtiger Indikator zur Einschätzung der Pandemie ist die Zahl der <a href="#intensivpatienten">Corona-Patienten</a>, die wegen der Schwere ihrer Erkrankung auf einer Intensivstation behandelt werden müssen. Nach Angaben des DIVI-Intensivregisters befinden sich derzeit ${pretty(currentPatients)} Menschen wegen Corona in intensivmedizinischer Behandlung. Das sind ${pretty(Math.abs(currentIncrease))} Intensivpatienten ${moreLess(currentIncrease)} als noch am Vortag.
  
  Im Vergleich zur Vorwoche ist die Zahl der Intensivpatienten ${trendClassifier(currentWeekTrend)} (<span class="${trendArrow(currentWeekTrend)}"></span>${pretty((currentWeekTrend || 0), true)} %).
  
  Bayern kommt damit auf ungefähr ${pretty(currentPatientsPer100k)} Intensivpatienten pro 100.000 Einwohner.`;
  
  const textElement = document.querySelector(target);
  textElement.innerHTML = text;
}

function moreLess(value) {
  if (value < 0) {
    return 'weniger';
  } else if (value === 0) {
    return 'mehr';
  } else if (value > 0) {
    return 'mehr';
  }
}
