import metaDataDistricts from '../data/meta/bayern-regbez-meta.json';

import { pretty, currentCount, currentIncrease, currentIncreasePerc, doublingTime, json2table } from './utils';

export function init(config) {
  const { selector, caseData } = config;

  const analysis = metaDataDistricts.map(district => {
    const districtData = caseData.filter(d => d.Regierungsbezirk === district.name);

    return {
      'Regierungsbezirk': district.name,
      'bisher bestätigte Fälle': `${pretty(currentCount(districtData))}`,
      'neue Fälle': `${pretty(currentIncrease(districtData))} (+${pretty(currentIncreasePerc(districtData))} %)`,
      'Verdopplungszeit': `${doublingTime(districtData)} Tage`
    };
  });

  const tableHtml = json2table(analysis);
  const parentElement = document.querySelector(selector);
  parentElement.innerHTML = tableHtml;
}
