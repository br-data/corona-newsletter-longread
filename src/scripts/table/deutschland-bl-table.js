import { pretty, currentCount, currentIncrease, incidence, trendArrow, weekTrend, jsonToTable } from '../utils';

export function init(config) {
  const { target, caseData, deathData, metaData } = config;

  const analysis = metaData.map(stateMeta => {
    const stateCases = caseData.filter(d => d.Bundesland === stateMeta.name);
    const stateDeaths = deathData.filter(d => d.Bundesland === stateMeta.name);

    return {
      'value': incidence(stateCases, stateMeta.pop),
      'Bundesland': stateMeta.name,
      'Inzidenz': `${pretty(incidence(stateCases, stateMeta.pop))}`,
      'Fälle (neu)': `<span class="${trendArrow(weekTrend(stateCases))}" title="${pretty((weekTrend(stateCases) || 0), true)} %"></span> ${pretty(currentCount(stateCases))} (${pretty(currentIncrease(stateCases), true)})`,
      'Todesfälle (neu)': `<span class="${trendArrow(weekTrend(stateDeaths))}" title="${pretty((weekTrend(stateDeaths) || 0), true)} %"></span> ${pretty(currentCount(stateDeaths))} (${pretty(currentIncrease(stateDeaths), true)})`
    };
  }).sort((a, b) => b.value - a.value).map(d => { delete d.value; return d;});

  const tableHtml = jsonToTable(analysis);
  const parentElement = document.querySelector(target);
  parentElement.innerHTML = tableHtml;
}
