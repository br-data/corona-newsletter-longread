import { pretty, currentCount, currentIncrease, casesPerThousand, trendArrow, weekTrend, json2table } from '../utils';

export function init(config) {
  const { selector, caseData, deathData, metaData } = config;

  const analysis = metaData.map(stateMeta => {
    const stateCases = caseData.filter(d => d.Bundesland === stateMeta.name);
    const stateDeaths = deathData.filter(d => d.Bundesland === stateMeta.name);

    return {
      'Bundesland': stateMeta.name,
      'Fälle (1.000 Ew.)': `${pretty(casesPerThousand(currentCount(stateCases), stateMeta.pop))}`,
      'Fälle': `<span class="${trendArrow(weekTrend(stateCases))}" title="${pretty(weekTrend(stateCases))} %"></span> ${pretty(currentCount(stateCases))} (+${pretty(currentIncrease(stateCases))})`,
      'Todesfälle': `<span class="${trendArrow(weekTrend(stateDeaths))}" title="${pretty(weekTrend(stateDeaths))} %"></span> ${pretty(currentCount(stateDeaths))} (+${pretty(currentIncrease(stateDeaths))})`
    };
  });

  const tableHtml = json2table(analysis);
  const parentElement = document.querySelector(selector);
  parentElement.innerHTML = tableHtml;
}
