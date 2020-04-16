import metaDataDistricts from '../data/meta/bayern-regbez-meta.json';

import { pretty, currentCount, casesPerThousand } from './utils';

export function init(config) {
  const { selector, caseData, deathData } = config;

  const enrichedData = metaDataDistricts.map(districtMeta => {
    const districtCases = caseData.filter(d => d.Regierungsbezirk === districtMeta.name);
    const districtDeaths = deathData.filter(d => d.Regierungsbezirk === districtMeta.name);

    return {
      name: districtMeta.name,
      cases: currentCount(districtCases),
      casesPerThousand: casesPerThousand(currentCount(districtCases), districtMeta.pop),
      deaths: currentCount(districtDeaths)
    };
  });

  const worstDistrics = enrichedData.sort((a, b) => b.casesPerThousand - a.casesPerThousand);

  const text = `Am stärksten betroffen ist der Regierungsbezirk ${worstDistrics[0].name}. Pro tausend Einwohner wurden hier bisher ${pretty(worstDistrics[0].casesPerThousand)} Fälle gemeldet.

  Vergleichsweise am besten steht der Regierungsbezirk ${worstDistrics[worstDistrics.length-1].name} da. Dort wurden bislang nur ${pretty(worstDistrics[worstDistrics.length-1].casesPerThousand)} Fälle pro tausend Einwohner gemeldet.`;

  const textElement = document.querySelector(selector);
  textElement.textContent = text;
}
