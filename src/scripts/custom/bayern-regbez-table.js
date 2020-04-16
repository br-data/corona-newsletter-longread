import metaDataDistricts from '../data/meta/bayern-regbez-meta.json';

import { pretty, currentCount, currentIncrease, casesPerThousand, json2table } from './utils';

export function init(config) {
  const { selector, caseData, deathData } = config;

  const analysis = metaDataDistricts.map(districtMeta => {
    const districtCases = caseData.filter(d => d.Regierungsbezirk === districtMeta.name);
    const districtDeaths = deathData.filter(d => d.Regierungsbezirk === districtMeta.name);

    return {
      'Regierungsbezirk': districtMeta.name,
      'Fälle': `${pretty(currentCount(districtCases))} (+${pretty(currentIncrease(districtCases))})`,
      'Fälle pro 1.000 Ew.': `${pretty(casesPerThousand(currentCount(districtCases), districtMeta.pop))}`,
      'Todesfälle': `${pretty(currentCount(districtDeaths))} (+${pretty(currentIncrease(districtDeaths))})`
    };
  });

  const tableHtml = json2table(analysis);
  const parentElement = document.querySelector(selector);
  parentElement.innerHTML = tableHtml;
}
