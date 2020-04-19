import { pretty, currentCount, currentIncrease, casesPerThousand, trendArrow, weekTrend, json2table } from '../utils';

export function init(config) {
  const { target, caseData, deathData, metaData } = config;

  const analysis = metaData.map(districtMeta => {
    const districtCases = caseData.filter(d => d.Regierungsbezirk === districtMeta.name);
    const districtDeaths = deathData.filter(d => d.Regierungsbezirk === districtMeta.name);

    return {
      'Regierungsbezirk': districtMeta.name,
      'Fälle (1.000 Ew.)': `${pretty(casesPerThousand(currentCount(districtCases), districtMeta.pop))}`,
      'Fälle': `<span class="${trendArrow(weekTrend(districtCases))}" title="${pretty(weekTrend(districtCases))} %"></span> ${pretty(currentCount(districtCases))} (+${pretty(currentIncrease(districtCases))})`,
      'Todesfälle': `<span class="${trendArrow(weekTrend(districtDeaths))}" title="${pretty(weekTrend(districtDeaths))} %"></span> ${pretty(currentCount(districtDeaths))} (+${pretty(currentIncrease(districtDeaths))})`
    };
  });

  const tableHtml = json2table(analysis);
  const parentElement = document.querySelector(target);
  parentElement.innerHTML = tableHtml;
}
