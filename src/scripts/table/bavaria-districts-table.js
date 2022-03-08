import { pretty, current, trendArrow, weekTrend, thresholdIndicator, jsonToTable } from '../utils';

export function init(config) {
  const { target, cases, newCases } = config;

  const analysis = newCases.map(districtNewCases => {
    const districtCases = cases.filter(d => d.regierungsbezirk === districtNewCases.regierungsbezirk);

    return {
      'value': current(districtCases, 'inzidenz'),
      'Regierungsbezirk': districtNewCases.regierungsbezirk,
      'Inzidenz': `<span class="${thresholdIndicator(current(districtCases, 'inzidenz'))}" title="${pretty(current(districtCases, 'inzidenz'))}"></span>${pretty(current(districtCases, 'inzidenz'))}`,
      'Fälle (neu)': `<span class="${trendArrow(weekTrend(districtCases, 10, 'anzahlFall'))}" title="${pretty((weekTrend(districtCases, 10, 'anzahlFall') || 0), true)} %"></span> ${pretty(current(districtCases, 'summeFall'))} (${pretty(districtNewCases.anzahlFallNeu, true)})`,
      // 'Todesfälle (neu)': `${pretty(current(districtCases, 'summeTodesfall'))} (${pretty(current(districtNewCases, 'anzahlTodesfallNeu'), true)})`,
      'Todesfälle (neu)': `<span class="${trendArrow(weekTrend(districtCases, 10, 'anzahlTodesfall'))}" title="${pretty((weekTrend(districtCases, 10, 'anzahlTodesfall') || 0), true)} %"></span> ${pretty(current(districtCases, 'summeTodesfall'))} (${pretty(districtNewCases.anzahlTodesfallNeu, true)})`
    };
  }).sort((a, b) => b.value - a.value).map(d => { delete d.value; return d;});

  const tableHtml = jsonToTable(analysis);
  const parentElement = document.querySelector(target);
  parentElement.innerHTML = tableHtml;
}
