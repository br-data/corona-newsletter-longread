import { pretty, currentCount, currentIncrease, incidence, weekTrend, trendArrow, thresholdIndicator, jsonToTable } from '../utils';

export function init(config) {
  const { target, caseData, deathData, metaData } = config;

  const analysis = metaData.map(countyMeta => {
    const countyCases = caseData.filter(d => d.Landkreis === countyMeta.rkiName);
    const countyDeaths = deathData.filter(d => d.Landkreis === countyMeta.rkiName);

    return {
      'value': incidence(countyCases, countyMeta.pop),
      'Landkreis/Stadt': `${countyMeta.name} (${countyMeta.type})`,
      'Inzidenz': `<span class="${thresholdIndicator(incidence(countyCases, countyMeta.pop))}" title="${pretty(incidence(countyCases, countyMeta.pop))}"></span>${pretty(incidence(countyCases, countyMeta.pop))}`,
      'Fälle (neu)': `<span class="${trendArrow(weekTrend(countyCases))}" title="${pretty((weekTrend(countyCases) || 0), true)} %"></span> ${pretty(currentCount(countyCases))} (${pretty(currentIncrease(countyCases), true)})`,
      'Todesfälle (neu)': `${pretty(currentCount(countyDeaths))} (${pretty(currentIncrease(countyDeaths), true)})`
      // 'Todesfälle (neu)': `<span class="${trendArrow(weekTrend(countyDeaths))}" title="${pretty((weekTrend(countyDeaths) || 0), true)} %"></span> ${pretty(currentCount(countyDeaths))} (${pretty(currentIncrease(countyDeaths), true)})`
    };
  }).sort((a, b) => b.value - a.value).map(d => { delete d.value; return d;});

  const tableHtml = jsonToTable(analysis);
  const parentElement = document.querySelector(target);
  parentElement.innerHTML = tableHtml;
}
