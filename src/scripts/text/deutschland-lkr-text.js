import { pretty, incidence } from '../utils';

export function init(config) {
  const { summaryTarget, detailTarget, caseData, metaData, metaDataStates } = config;
  const uniqueCounties = [...new Set(caseData.map(d => d.Landkreis))];

  const worstCounties = uniqueCounties.map(name => {
    const caseDataCounty = caseData.filter(c => c.Landkreis === name);
    const metaInfoCounty = metaData.find(m => m.rkiName === name);
    const metaInfoState = metaDataStates.find(m => m.ags === metaInfoCounty.ags.slice(0,2));
    return Object.assign(
      metaInfoCounty,
      { state: metaInfoState.name },
      { incidence: incidence(caseDataCounty, metaInfoCounty.pop) }
    );
  }).sort((a, b) => b.incidence - a.incidence);

  const over200Counties = worstCounties.filter(d => d.incidence >= 200);
  const over50Counties = worstCounties.filter(d => d.incidence >= 50);
  const over35Counties = worstCounties.filter(d => d.incidence >= 35);

  const summaryText = `Zur Zeit gibt es deutschlandweit ${numeral1(over35Counties.length)} ${plural1(over35Counties.length)}, ${plural2(over35Counties.length)} auf mehr als 35 gemeldete Fälle pro 100.000 Einwohner in den letzten sieben Tagen ${plural3(over35Counties.length)}.${ over50Counties.length ? ' Davon wiederum ' + plural3(over50Counties.length) + ' ' + numeral2(over50Counties.length) + ' ' + plural1(over50Counties.length) + ' auf mehr als 50 Fälle pro 100.000 Einwohner.' : ''} ${ over50Counties.length ? ' ' + capitalize(numeral2(over200Counties.length)) + ' ' + plural1(over200Counties.length)  + ' ' + plural4(over200Counties.length) + ' sogar den Grenzwert von 200 Fällen in der 7-Tage-Inzidenz.' : '' }`;

  const detailText = `Die drei am stärksten betroffenen Kreise sind zur Zeit ${preposition1(worstCounties[0].type)} ${worstCounties[0].type} ${worstCounties[0].name}, ${preposition1(worstCounties[1].type)} ${worstCounties[1].type} ${worstCounties[1].name} und ${preposition1(worstCounties[2].type)} ${worstCounties[2].type} ${worstCounties[2].name}.

  ${preposition2(worstCounties[0].type)} ${worstCounties[0].type} ${worstCounties[0].name} (${worstCounties[0].state}) wurden bislang ${pretty(worstCounties[0].incidence)} Fälle pro 100.000 Einwohner in den letzten sieben Tagen gemeldet.

  ${preposition2(worstCounties[1].type)} ${worstCounties[1].type} ${worstCounties[1].name} (${worstCounties[1].state}) waren es ${pretty(worstCounties[1].incidence)} Fälle.

  Aus ${preposition3(worstCounties[2].type)} ${worstCounties[2].type} ${worstCounties[2].name} (${worstCounties[2].state}) wurden ${pretty(worstCounties[2].incidence)} Fälle gemeldet.`;

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
