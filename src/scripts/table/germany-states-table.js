import { pretty, current, trendArrow, weekTrend, thresholdIndicator, jsonToTable } from '../utils';

export function init(config) {
  const { target, cases, newCases } = config;

  const analysis = newCases.map(stateNewCases => {
    const stateCases = cases.filter(d => d.bundesland === stateNewCases.bundesland);

    return {
      'value': current(stateCases, 'inzidenz'),
      'Bundesland': stateNewCases.bundesland,
      'Inzidenz': `<span class="${thresholdIndicator(current(stateCases, 'inzidenz'))}" title="${pretty(current(stateCases, 'inzidenz'))}"></span>${pretty(current(stateCases, 'inzidenz'))}`,
      'Fälle (neu)': `<span class="${trendArrow(weekTrend(stateCases, 10, 'anzahlFall'))}" title="${pretty((weekTrend(stateCases, 10, 'anzahlFall') || 0), true)} %"></span> ${pretty(current(stateCases, 'summeFall'))} (${pretty(stateNewCases.anzahlFallNeu, true)})`,
      // 'Todesfälle (neu)': `${pretty(current(stateCases, 'summeTodesfall'))} (${pretty(current(stateNewCases, 'anzahlTodesfallNeu'), true)})`,
      'Todesfälle (neu)': `<span class="${trendArrow(weekTrend(stateCases, 10, 'anzahlTodesfall'))}" title="${pretty((weekTrend(stateCases, 10, 'anzahlTodesfall') || 0), true)} %"></span> ${pretty(current(stateCases, 'summeTodesfall'))} (${pretty(stateNewCases.anzahlTodesfallNeu, true)})`
    };
  }).sort((a, b) => b.value - a.value).map(d => { delete d.value; return d;});

  const tableHtml = jsonToTable(analysis);
  const parentElement = document.querySelector(target);
  parentElement.innerHTML = tableHtml;
}
