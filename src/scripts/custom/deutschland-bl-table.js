import metaDataStates from '../data/meta/deutschland-bl-meta.json';

import { pretty, currentCount, currentIncrease, casesPerThousand, json2table } from './utils';

export function init(config) {
  const { selector, caseData, deathData } = config;

  const analysis = metaDataStates.map(stateMeta => {
    const districtCases = caseData.filter(d => d.Bundesland === stateMeta.name);
    const districtDeaths = deathData.filter(d => d.Bundesland === stateMeta.name);

    return {
      'Bundesland': stateMeta.name,
      'Fälle': `${pretty(currentCount(districtCases))} (+${pretty(currentIncrease(districtCases))})`,
      'Fälle pro 1.000 Ew.': `${pretty(casesPerThousand(currentCount(districtCases), stateMeta.pop))}`,
      'Todesfälle': `${pretty(currentCount(districtDeaths))} (+${pretty(currentIncrease(districtDeaths))})`
    };
  });

  const tableHtml = json2table(analysis);
  const parentElement = document.querySelector(selector);
  parentElement.innerHTML = tableHtml;
}
