import { pretty } from '../utils';

export function init(config) {
  const { summaryTarget, detailTarget, cases, metaDataDistricts } = config;
  const uniqueCounties = [...new Set(cases.map(d => d.landkreisId))];

  const worstCounties = uniqueCounties.map(countyId => {
    const currentCountyCases = cases.filter(c => c.landkreisId === countyId);
    const metaInfoDistrict = metaDataDistricts.find(m => parseInt(m.ags) === parseInt(countyId.toString().slice(0,2)));

    return Object.assign(
      { district: metaInfoDistrict.name },
      currentCountyCases[currentCountyCases.length - 1]
    );
  }).sort((a, b) => b.inzidenz - a.inzidenz);

  const over1000Counties = worstCounties.filter(d => d.inzidenz >= 1000);
  const over500Counties = worstCounties.filter(d => d.inzidenz >= 500);
  const over200Counties = worstCounties.filter(d => d.inzidenz >= 200);
  // const over50Counties = worstCounties.filter(d => d.inzidenz >= 50);
  // const over35Counties = worstCounties.filter(d => d.inzidenz >= 35);

  const summaryText = `In Bayern gibt es momentan ${numeral1(over200Counties.length)} ${plural1(over200Counties.length)}, ${plural2(over200Counties.length)} auf mehr als 200 gemeldete Fälle pro 100.000 Einwohner in den letzten sieben Tagen ${plural3(over200Counties.length)}.${ over500Counties.length ? ' Davon wiederum ' + plural3(over500Counties.length) + ' ' + numeral2(over500Counties.length) + ' ' + plural1(over500Counties.length) + ' auf mehr als 500 Fälle pro 100.000 Einwohner.' : ''} ${ over500Counties.length ? ' ' + capitalize(numeral2(over1000Counties.length)) + ' ' + plural1(over1000Counties.length)  + ' ' + plural4(over1000Counties.length) + ' aktuell den Grenzwert von 1.000 Fällen in der 7-Tage-Inzidenz.' : '' }`;

  const detailText = `Die drei am stärksten betroffenen Kreise sind zur Zeit ${preposition1(worstCounties[0].landkreisTyp)} ${worstCounties[0].landkreisTyp} ${worstCounties[0].landkreis}, ${preposition1(worstCounties[1].landkreisTyp)} ${worstCounties[1].landkreisTyp} ${worstCounties[1].landkreis} und ${preposition1(worstCounties[2].landkreisTyp)} ${worstCounties[2].landkreisTyp} ${worstCounties[2].landkreis}.

  ${preposition2(worstCounties[0].landkreisTyp)} ${worstCounties[0].landkreisTyp} ${worstCounties[0].landkreis} (${worstCounties[0].district}) wurden bislang ${pretty(worstCounties[0].inzidenz)} Fälle pro 100.000 Einwohner in den letzten sieben Tagen gemeldet.

  ${preposition2(worstCounties[1].landkreisTyp)} ${worstCounties[1].landkreisTyp} ${worstCounties[1].landkreis} (${worstCounties[1].district}) waren es ${pretty(worstCounties[1].inzidenz)} Fälle.

  Aus ${preposition3(worstCounties[2].landkreisTyp)} ${worstCounties[2].landkreisTyp} ${worstCounties[2].landkreis} (${worstCounties[2].district}) wurden ${pretty(worstCounties[2].inzidenz)} Fälle gemeldet.`;

  const summaryElement = document.querySelector(summaryTarget);
  summaryElement.textContent = summaryText;

  const detailElement = document.querySelector(detailTarget);
  detailElement.textContent = detailText;
}

function capitalize(str) {
  if (typeof str === 'string') {
    return str.charAt(0).toUpperCase() + str.slice(1);
  } else {
    return str;
  }
}

function preposition1(type) {
  switch (type) {
    case 'Stadt': return 'die';
    case 'Landkreis': return  'der';
    default: return 'der';
  }
}

function preposition2(type) {
  switch (type) {
    case 'Stadt': return 'In der';
    case 'Landkreis': return  'Im';
    default: return 'Im';
  }
}

function preposition3(type) {
  switch (type) {
    case 'Stadt': return 'der';
    case 'Landkreis': return  'dem';
    default: return 'dem';
  }
}

function plural1(number) {
  switch (number) {
    case 0: return 'Kreis';
    case 1: return  'Kreis';
    default: return 'Kreise';
  }
}

function plural2(number) {
  switch (number) {
    case 0: return 'der';
    case 1: return  'der';
    default: return 'die';
  }
}

function plural3(number) {
  switch (number) {
    case 0: return 'kommt';
    case 1: return  'kommt';
    default: return 'kommen';
  }
}

function plural4(number) {
  switch (number) {
    case 0: return 'überschreitet';
    case 1: return  'überschreitet';
    default: return 'überschreiten';
  }
}

function numeral1(number) {
  const names = [
    'keinen', 'einen', 'zwei', 'drei', 'vier', 'fünf',
    'sechs', 'sieben', 'acht', 'neun', 'zehn',
    'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn',
    'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'
  ];

  return names[number] || number;
}

function numeral2(number) {
  const names = [
    'kein', 'ein', 'zwei', 'drei', 'vier', 'fünf',
    'sechs', 'sieben', 'acht', 'neun', 'zehn',
    'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn',
    'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'
  ];

  return names[number] || number;
}
