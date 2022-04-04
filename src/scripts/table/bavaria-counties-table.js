import { pretty, current, weekTrend, trendArrow, thresholdIndicator, jsonToTable } from '../utils';

export function init(config) {
  const { target, cases, newCases } = config;

  const analysis = newCases.map(countyNewCases => {
    const countyCases = cases.filter(d => d.landkreis === countyNewCases.landkreis);

    return {
      'value': current(countyCases, 'inzidenz'),
      'Landkreis/Stadt': `${countyNewCases.landkreis} (${countyNewCases.landkreisTyp})`,
      'Inzidenz': `<span class="${thresholdIndicator(current(countyCases, 'inzidenz'))}" title="${pretty(current(countyCases, 'inzidenz'))}"></span>${pretty(current(countyCases, 'inzidenz'))}`,
      'Fälle (neu)': `<span class="${trendArrow(weekTrend(countyCases, 10, 'anzahlFall'))}" title="${pretty((weekTrend(countyCases, 10, 'anzahlFall') || 0), true)} %"></span> ${pretty(current(countyCases, 'summeFall'))} (${pretty(countyNewCases.anzahlFallNeu, true)})`,
      // 'Todesfälle (neu)': `${pretty(current(countyCases, 'summeTodesfall'))} (${pretty(current(countyNewCases, 'anzahlTodesfallNeu'), true)})`,
      'Todesfälle (neu)': `<span class="${trendArrow(weekTrend(countyCases, 10, 'anzahlTodesfall'))}" title="${pretty((weekTrend(countyCases, 10, 'anzahlTodesfall') || 0), true)} %"></span> ${pretty(current(countyCases, 'summeTodesfall'))} (${pretty(countyNewCases.anzahlTodesfallNeu, true)})`
    };
  }).sort((a, b) => b.value - a.value).map(d => { delete d.value; return d;});

  const tableHtml = jsonToTable(analysis);
  const parentElement = document.querySelector(target);
  parentElement.innerHTML = tableHtml;
}
