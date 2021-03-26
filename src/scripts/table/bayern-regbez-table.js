import { pretty, currentCount, currentIncrease, incidence, trendArrow, weekTrend, jsonToTable } from '../utils';

export function init(config) {
  const { target, caseData, deathData, metaData } = config;

  const analysis = metaData.map(districtMeta => {
    const districtCases = caseData.filter(d => d.Regierungsbezirk === districtMeta.name);
    const districtDeaths = deathData.filter(d => d.Regierungsbezirk === districtMeta.name);

    return {
      'value': incidence(districtCases, districtMeta.pop),
      'Regierungsbezirk': districtMeta.name,
      'Inzidenz': `${pretty(incidence(districtCases, districtMeta.pop))}`,
      'Fälle (neu)': `<span class="${trendArrow(weekTrend(districtCases))}" title="${pretty((weekTrend(districtCases) || 0), true)} %"></span> ${pretty(currentCount(districtCases))} (${pretty(currentIncrease(districtCases), true)})`,
      'Todesfälle (neu)': `<span class="${trendArrow(weekTrend(districtDeaths))}" title="${pretty((weekTrend(districtDeaths) || 0), true)} %"></span> ${pretty(currentCount(districtDeaths))} (${pretty(currentIncrease(districtDeaths), true)})`
    };
  }).sort((a, b) => b.value - a.value).map(d => { delete d.value; return d;});

  const tableHtml = jsonToTable(analysis);
  const parentElement = document.querySelector(target);
  parentElement.innerHTML = tableHtml;
}
