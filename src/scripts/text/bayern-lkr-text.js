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

  const text = `Die zur Zeit am stärksten betroffenen Regionen in Bayern sind ${worstCounties[0].name} (${worstCounties[0].type}), ${worstCounties[1].name} (${worstCounties[1].type}) und ${worstCounties[2].name} (${worstCounties[2].type}), wenn man die Zahl der gemeldeten Fällen pro 100.000 Einwohnern in den letzten sieben Tagen vergleicht.

  ${preposition1(worstCounties[0].type)} ${worstCounties[0].type} ${worstCounties[0].name} (${worstCounties[0].district}) wurden bisher ${pretty(worstCounties[0].casesPer100Tsd7Days)} Fälle gemeldet.

  ${preposition1(worstCounties[1].type)} ${worstCounties[1].type} ${worstCounties[1].name} (${worstCounties[1].district}) sind es zur Zeit ${pretty(worstCounties[1].casesPer100Tsd7Days)} Fälle.

  Aus ${preposition2(worstCounties[2].type)} ${worstCounties[2].type} ${worstCounties[2].name} (${worstCounties[2].district}) wurden ${pretty(worstCounties[2].casesPer100Tsd7Days)} Fälle pro 100.000 Einwohner in den letzten sieben Tagen gemeldet.`;

  const textElement = document.querySelector(target);
  textElement.textContent = text;
}

function preposition1(type) {
  switch (type) {
    case 'Stadt': return 'In der';
    case 'Landkreis': return  'Im';
    default: return 'Im';
  }
}

function preposition2(type) {
  switch (type) {
    case 'Stadt': return 'der';
    case 'Landkreis': return  'dem';
    default: return 'dem';
  }
}
