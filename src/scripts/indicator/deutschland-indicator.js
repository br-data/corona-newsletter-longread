import { pretty, currentCount, currentIncrease, trendArrow, weekTrend } from '../utils';

export function init(config) {
  const { target, caseData, recoveredData, deathData } = config;

  const elements = `
    <div class="box">
      <strong>😷 ${pretty(currentCount(caseData))}</strong> (+${pretty(currentIncrease(caseData))})<br>
      Bestä­tigte Fälle
    </div>
    <div class="box">
      <strong><span class="${trendArrow(weekTrend(caseData))}"></span> ${pretty(weekTrend(caseData))} %</strong><br>
      Wochentrend
    </div>
    <div class="box">
      <strong>😊 ${pretty(currentCount(recoveredData))}</strong> (+${pretty(currentIncrease(recoveredData))})<br>
      Genesungen
    </div>
    <div class="box">
      <strong>💀 ${pretty(currentCount(deathData))}</strong> (+${pretty(currentIncrease(deathData))})<br>
      Todesfälle
    </div>
  `;

  const deathElement = document.querySelector(target);
  deathElement.innerHTML = elements;
}
