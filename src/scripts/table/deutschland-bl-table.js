import { pretty, currentCount, currentIncrease, casesPer100Tsd7Days, trendArrow, weekTrend, json2table } from '../utils';

export function init(config) {
  const { target, caseData, deathData, metaData } = config;

  const analysis = metaData.map(stateMeta => {
    const stateCases = caseData.filter(d => d.Bundesland === stateMeta.name);
    const stateDeaths = deathData.filter(d => d.Bundesland === stateMeta.name);

    return {
      'value': casesPer100Tsd7Days(stateCases, stateMeta.pop),
      'Bundesland': stateMeta.name,
      '7-Tage-Inzidenz': `${pretty(casesPer100Tsd7Days(stateCases, stateMeta.pop))}`,
      'Fälle (neu)': `<span class="${trendArrow(weekTrend(stateCases))}" title="${pretty((weekTrend(stateCases) || 0), true)} %"></span> ${pretty(currentCount(stateCases))} (${pretty(currentIncrease(stateCases), true)})`,
      'Todesfälle (neu)': `<span class="${trendArrow(weekTrend(stateDeaths))}" title="${pretty((weekTrend(stateDeaths) || 0), true)} %"></span> ${pretty(currentCount(stateDeaths))} (${pretty(currentIncrease(stateDeaths), true)})`
    };
  }).sort((a, b) => b.value - a.value).map(d => { delete d.value; return d;});

  const tableHtml = json2table(analysis);
  const parentElement = document.querySelector(target);
  parentElement.innerHTML = tableHtml;
}
