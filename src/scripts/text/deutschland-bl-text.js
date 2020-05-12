import { pretty, currentCount, casesPer100Tsd7Days } from '../utils';

export function init(config) {
  const { target, caseData, deathData, metaData } = config;

  const enrichedData = metaData.map(stateMeta => {
    const districtCases = caseData.filter(d => d.Bundesland === stateMeta.name);
    const districtDeaths = deathData.filter(d => d.Bundesland === stateMeta.name);

    return {
      name: stateMeta.name,
      cases: currentCount(districtCases),
      casesPer100Tsd7Days: casesPer100Tsd7Days(districtCases, stateMeta.pop),
      deaths: currentCount(districtDeaths)
    };
  });

  const worstStates = enrichedData.sort((a, b) => b.casesPer100Tsd7Days - a.casesPer100Tsd7Days);

  const text = `Am stärksten betroffen ist das Bundesland ${worstStates[0].name}. Pro 100.000 Einwohner wurden in der letzten Wochen ${pretty(worstStates[0].casesPer100Tsd7Days)} Fälle gemeldet.

  Vergleichsweise am besten steht ${worstStates[worstStates.length-1].name} da. Dort wurden bislang nur ${pretty(worstStates[worstStates.length-1].casesPer100Tsd7Days)} Fälle pro 100.000 Einwohner in den letzten sieben Tagen gemeldet.`;

  const textElement = document.querySelector(target);
  textElement.textContent = text;
}
