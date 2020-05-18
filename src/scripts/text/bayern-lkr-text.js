import { pretty, casesPer100Tsd7Days } from '../utils';

export function init(config) {
  const { target, caseData, metaData, metaDataDistricts } = config;
  const uniqueCounties = [...new Set(caseData.map(d => d.Landkreis))];

  const worstCounties = uniqueCounties.map(name => {
    const caseDataDistrict = caseData.filter(c => c.Landkreis === name);
    const metaInfoCounty = metaData.find(m => m.rkiName === name);
    const metaInfoDistrict = metaDataDistricts.find(m => m.ags === metaInfoCounty.ags.slice(0,3));
    return Object.assign(
      metaInfoCounty,
      { district: metaInfoDistrict.name },
      { casesPer100Tsd7Days: casesPer100Tsd7Days(caseDataDistrict, metaInfoCounty.pop) }
    );
  }).sort((a, b) => b.casesPer100Tsd7Days - a.casesPer100Tsd7Days);

  const over50Counties = worstCounties.filter(d => d.casesPer100Tsd7Days >= 50);

  const text = `In Bayern gibt es momentan ${numeral(over50Counties.length)} ${plural1(over50Counties.length)} ${plural2(over50Counties.length)} auf über 50 gemeldete Fälle pro 100.000 Einwohnern in den letzten sieben Tagen ${plural3(over50Counties.length)}.

  Die drei am stärksten betroffenen Kreise sind ${preposition1(worstCounties[0].type)} ${worstCounties[0].type} ${worstCounties[0].name}, ${preposition1(worstCounties[1].type)} ${worstCounties[1].type} ${worstCounties[1].name} und ${preposition1(worstCounties[2].type)} ${worstCounties[2].type} ${worstCounties[2].name}.

  ${preposition2(worstCounties[0].type)} ${worstCounties[0].type} ${worstCounties[0].name} (${worstCounties[0].district}) wurden bisher ${pretty(worstCounties[0].casesPer100Tsd7Days)} Fälle gemeldet.

  ${preposition2(worstCounties[1].type)} ${worstCounties[1].type} ${worstCounties[1].name} (${worstCounties[1].district}) sind es zur Zeit ${pretty(worstCounties[1].casesPer100Tsd7Days)} Fälle.

  Aus ${preposition3(worstCounties[2].type)} ${worstCounties[2].type} ${worstCounties[2].name} (${worstCounties[2].district}) wurden ${pretty(worstCounties[2].casesPer100Tsd7Days)} Fälle pro 100.000 Einwohner in den letzten sieben Tagen gemeldet.`;

  const textElement = document.querySelector(target);
  textElement.textContent = text;
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
    case 1: return  'kommen';
    default: return 'kommen';
  }
}

function numeral(number) {
  const names = [
    'kein', 'ein', 'zwei', 'drei', 'vier', 'fünf',
    'sechs', 'sieben', 'acht', 'neun', 'zehn',
    'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn',
    'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'
  ];

  return names[number] || number;
}
