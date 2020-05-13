import { pretty, currentCount, currentIncrease, casesPer100Tsd7Days, trendArrow, weekTrend, json2table } from '../utils';

export function init(config) {
  const { target, caseData, deathData, metaData } = config;

  const analysis = metaData.map(stateMeta => {
    const stateCases = caseData.filter(d => d.Bundesland === stateMeta.name);
    const stateDeaths = deathData.filter(d => d.Bundesland === stateMeta.name);

    return {
      'Bundesland': stateMeta.name,
      'Fälle pro 100.000 <br>Einwohner, <br>letzte 7 Tage': `<span class="${trendArrow(weekTrend(stateCases))}" title="${pretty(weekTrend(stateCases))} %"></span> ${pretty(casesPer100Tsd7Days(stateCases, stateMeta.pop))}`,
      'Fälle': `<span class="${trendArrow(weekTrend(stateCases))}" title="${pretty(weekTrend(stateCases))} %"></span> ${pretty(currentCount(stateCases))} (+${pretty(currentIncrease(stateCases))})`,
      'Todesfälle': `<span class="${trendArrow(weekTrend(stateDeaths))}" title="${pretty(weekTrend(stateDeaths))} %"></span> ${pretty(currentCount(stateDeaths))} (+${pretty(currentIncrease(stateDeaths))})`
    };
  }).sort((a, b) => a.Bundesland.localeCompare(b.Bundesland));

  const tableHtml = json2table(analysis);
  const parentElement = document.querySelector(target);
  parentElement.innerHTML = tableHtml;
}
