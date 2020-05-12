import { pretty, currentCount, casesPer100Tsd7Days } from '../utils';

export function init(config) {
  const { target, caseData, deathData, metaData } = config;

  const worstDistrics = metaData.map(districtMeta => {
    const districtCases = caseData.filter(d => d.Regierungsbezirk === districtMeta.name);
    const districtDeaths = deathData.filter(d => d.Regierungsbezirk === districtMeta.name);

    return {
      name: districtMeta.name,
      cases: currentCount(districtCases),
      casesPer100Tsd7Days: casesPer100Tsd7Days(districtCases, districtMeta.pop),
      deaths: currentCount(districtDeaths)
    };
  }).sort((a, b) => b.casesPer100Tsd7Days - a.casesPer100Tsd7Days);

  const text = `Am stärksten betroffen ist der Regierungsbezirk ${worstDistrics[0].name}. Pro 100.000 Einwohner wurden in der letzten Woche ${pretty(worstDistrics[0].casesPer100Tsd7Days)} Corona-Fälle gemeldet.

  Vergleichsweise am besten steht der Regierungsbezirk ${worstDistrics[worstDistrics.length-1].name} da. Dort wurden in den letzten sieben Tagen nur ${pretty(worstDistrics[worstDistrics.length-1].casesPer100Tsd7Days)} Fälle pro 100.000 Einwohner gemeldet.`;

  const textElement = document.querySelector(target);
  textElement.textContent = text;
}
