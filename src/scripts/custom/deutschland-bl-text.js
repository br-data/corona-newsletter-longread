import metaDataStates from '../data/meta/deutschland-bl-meta.json';

import { pretty, currentCount, casesPerThousand } from './utils';

export function init(config) {
  const { selector, caseData, deathData } = config;

  const enrichedData = metaDataStates.map(stateMeta => {
    const districtCases = caseData.filter(d => d.Bundesland === stateMeta.name);
    const districtDeaths = deathData.filter(d => d.Bundesland === stateMeta.name);

    return {
      name: stateMeta.name,
      cases: currentCount(districtCases),
      casesPerThousand: casesPerThousand(currentCount(districtCases), stateMeta.pop),
      deaths: currentCount(districtDeaths)
    };
  });

  const worstStates = enrichedData.sort((a, b) => b.casesPerThousand - a.casesPerThousand);


  const text = `Am stärksten betroffen ist das Bundesland ${worstStates[0].name}. Pro tausend Einwohner wurden hier bisher ${pretty(worstStates[0].casesPerThousand)} Fälle gemeldet.

  Vergleichsweise am besten steht das Bundesland ${worstStates[worstStates.length-1].name} da. Dort wurden bislang nur ${pretty(worstStates[worstStates.length-1].casesPerThousand)} Fälle pro tausend Einwohner gemeldet.`;

  const textElement = document.querySelector(selector);
  textElement.textContent = text;
}
