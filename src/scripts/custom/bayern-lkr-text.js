import metaData from '../data/meta/deutschland-lkr-meta.json';

export function init(config) {
  const { selector, data } = config;

  const enrichedData = data.map(d => {
    const metaInfo = metaData.find(m => m.rkiName === d.Landkreis);
    return Object.assign(
      d,
      metaInfo,
      { casesPerThousand: (d.sumValue * 1000) / metaInfo.pop }
    );
  });

  const uniqueCounties = [...new Set(enrichedData.map(d => d.Landkreis))];

  const worstCounties = uniqueCounties.map(county => {
    const countyData = enrichedData.filter(d => d.Landkreis === county);
    return countyData[countyData.length-1];
  }).sort((a, b) => b.casesPerThousand - a.casesPerThousand);

  const text = `Die zur Zeit am stärksten betroffenen Landkreise in Bayern sind ${worstCounties[0].name}, ${worstCounties[1].name} und ${worstCounties[2].name}.

  ${preposition1(worstCounties[0].type)} ${worstCounties[0].type} ${worstCounties[0].name} wurden bisher ${pretty(worstCounties[0].casesPerThousand)} Fälle pro 1.000 Einwohner gemeldet.

  ${preposition1(worstCounties[1].type)} ${worstCounties[1].type} ${worstCounties[1].name} sind es bislang ${pretty(worstCounties[0].casesPerThousand)} Fälle pro 1.000 Einwohner.

  Aus ${preposition2(worstCounties[2].type)}  ${worstCounties[2].type} ${worstCounties[2].name} wurden ${pretty(worstCounties[2].casesPerThousand)} Fälle pro 1.000 Einwohner gemeldet.`;

  const textElement = document.querySelector(selector);
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

function pretty(number) {
  const string = (Math.round(number * 10) / 10).toString().split('.');
  return string[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (string[1] ? `,${string[1]}` : '');
}
