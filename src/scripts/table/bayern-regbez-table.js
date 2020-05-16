import { pretty, currentCount, currentIncrease, casesPer100Tsd7Days, trendArrow, weekTrend, json2table } from '../utils';

export function init(config) {
  const { target, caseData, deathData, metaData } = config;

  const analysis = metaData.map(districtMeta => {
    const districtCases = caseData.filter(d => d.Regierungsbezirk === districtMeta.name);
    const districtDeaths = deathData.filter(d => d.Regierungsbezirk === districtMeta.name);

    return {
      'value': casesPer100Tsd7Days(districtCases, districtMeta.pop),
      'Regierungsbezirk': districtMeta.name,
      'Fälle pro 100.000 <br>Einwohner (7 Tage)': `<span class="${trendArrow(weekTrend(districtCases))}" title="${pretty(weekTrend(districtCases) || 0)} %"></span>${pretty(casesPer100Tsd7Days(districtCases, districtMeta.pop))}`,
      'Fälle': `<span class="${trendArrow(weekTrend(districtCases))}" title="${pretty(weekTrend(districtCases) || 0)} %"></span> ${pretty(currentCount(districtCases))} (+${pretty(currentIncrease(districtCases))})`,
      'Todesfälle': `<span class="${trendArrow(weekTrend(districtDeaths))}" title="${pretty(weekTrend(districtDeaths) || 0)} %"></span> ${pretty(currentCount(districtDeaths))} (+${pretty(currentIncrease(districtDeaths))})`
    };
  }).sort((a, b) => b.value - a.value).map(d => { delete d.value; return d;});

  const tableHtml = json2table(analysis);
  const parentElement = document.querySelector(target);
  parentElement.innerHTML = tableHtml;
}
