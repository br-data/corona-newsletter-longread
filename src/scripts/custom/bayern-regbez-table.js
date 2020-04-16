import metaDataDistricts from '../data/meta/bayern-regbez-meta.json';

import { pretty, currentCount, currentIncrease, doublingTime, json2table } from './utils';

export function init(config) {
  const { selector, caseData, deathData } = config;

  const analysis = metaDataDistricts.map(district => {
    const districtCases = caseData
      .filter(d => d.Regierungsbezirk === district.name);
    const districtDeaths = deathData.filter(d => d.Regierungsbezirk === district.name);

    return {
      'Regierungsbezirk': district.name,
      'Fälle': `${pretty(currentCount(districtCases))} (+${pretty(currentIncrease(districtCases))})`,
      'Todesfälle': `${pretty(currentCount(districtDeaths))} (+${pretty(currentIncrease(districtDeaths))})`,
      'Verdopplungszeit': `${doublingTime(districtCases)} Tage`
    };
  });

  const tableHtml = json2table(analysis);
  const parentElement = document.querySelector(selector);
  parentElement.innerHTML = tableHtml;
}
