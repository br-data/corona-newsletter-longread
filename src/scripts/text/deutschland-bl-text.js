import { pretty, currentCount, incidence } from '../utils';

export function init(config) {
  const { target, caseData, deathData, metaData } = config;

  const enrichedData = metaData.map(stateMeta => {
    const districtCases = caseData.filter(d => d.Bundesland === stateMeta.name);
    const districtDeaths = deathData.filter(d => d.Bundesland === stateMeta.name);

    return {
      name: stateMeta.name,
      cases: currentCount(districtCases),
      incidence: incidence(districtCases, stateMeta.pop),
      deaths: currentCount(districtDeaths)
    };
  });

  const worstStates = enrichedData.sort((a, b) => b.incidence - a.incidence);

  const text = `Am stärksten betroffen ist das Bundesland ${worstStates[0].name}. Pro 100.000 Einwohner wurden in der letzten Wochen ${pretty(worstStates[0].incidence)} Fälle gemeldet.

  Vergleichsweise am besten steht ${worstStates[worstStates.length-1].name} da. Dort wurden bislang nur ${pretty(worstStates[worstStates.length-1].incidence)} Fälle pro 100.000 Einwohner in den letzten sieben Tagen gemeldet.`;

  const textElement = document.querySelector(target);
  textElement.textContent = text;
}
