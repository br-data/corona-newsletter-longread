import { pretty, currentCount, currentIncrease, trendArrow, weekTrend } from '../utils';

export function init(config) {
  const { target, caseData, recoveredData, deathData } = config;

  const elements = `
    <div class="box">
      <span class="blue"><strong>${pretty(currentCount(caseData))}</strong> (+${pretty(currentIncrease(caseData))})</span><br>
      bestä­tigte Fälle
    </div>
    <div class="box">
      <strong><span class="${trendArrow(weekTrend(caseData))}"></span> ${pretty(weekTrend(caseData))} %</strong><br>
      neue Fälle seit vorletzter Woche
    </div>
    <div class="box">
      <span class="green"><strong>${pretty(currentCount(recoveredData))}</strong> (+${pretty(currentIncrease(recoveredData))})</span><br>
      geschätze Genesungen
    </div>
    <div class="box">
      <span class="yellow"><strong>${pretty(currentCount(deathData))}</strong> (+${pretty(currentIncrease(deathData))})</span><br>
      gemeldete Todesfälle
    </div>
  `;

  const deathElement = document.querySelector(target);
  deathElement.innerHTML = elements;
}
