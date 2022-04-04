import { pretty, current, trendArrow, weekTrend } from '../utils';

export function init(config) {
  const { target, cases, newCases } = config;

  const elements = `
    <div class="box">
      <span class="blue"><strong>${pretty(current(cases, 'summeFall'))}</strong> (${pretty(current(newCases, 'anzahlFallNeu'), true)})</span><br>
      bestä­tigte Fälle
    </div>
    <div class="box">
      <strong><span class="${trendArrow(weekTrend(cases, 10, 'anzahlFall'))}"></span> ${pretty(weekTrend(cases, 10, 'anzahlFall'), true)} %</strong><br>
      neue Fälle im Vergleich zur Vorwoche
    </div>
    <div class="box">
      <span class="green"><strong>${pretty(current(cases, 'summeGenesen'))}</strong> (${pretty(current(newCases, 'anzahlGenesenNeu'), true)})</span><br>
      geschätzte Genesungen
    </div>
    <div class="box">
      <span class="yellow"><strong>${pretty(current(cases, 'summeTodesfall'))}</strong> (${pretty(current(newCases, 'anzahlTodesfallNeu'), true)})</span><br>
      gemeldete Todesfälle
    </div>
  `;

  const deathElement = document.querySelector(target);
  deathElement.innerHTML = elements;
}
