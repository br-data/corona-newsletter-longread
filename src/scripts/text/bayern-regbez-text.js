import { pretty, currentCount, incidence } from '../utils';

export function init(config) {
  const { target, caseData, deathData, metaData } = config;

  const worstDistrics = metaData.map(districtMeta => {
    const districtCases = caseData.filter(d => d.Regierungsbezirk === districtMeta.name);
    const districtDeaths = deathData.filter(d => d.Regierungsbezirk === districtMeta.name);

    return {
      name: districtMeta.name,
      cases: currentCount(districtCases),
      incidence: incidence(districtCases, districtMeta.pop),
      deaths: currentCount(districtDeaths)
    };
  }).sort((a, b) => b.incidence - a.incidence);

  const text = `Am stärksten betroffen ist der Regierungsbezirk ${worstDistrics[0].name}. Pro 100.000 Einwohner wurden in der letzten Woche ${pretty(worstDistrics[0].incidence)} Corona-Fälle gemeldet.

  Vergleichsweise am besten steht der Regierungsbezirk ${worstDistrics[worstDistrics.length-1].name} da. Dort wurden in den letzten sieben Tagen nur ${pretty(worstDistrics[worstDistrics.length-1].incidence)} Fälle pro 100.000 Einwohner gemeldet.`;

  const textElement = document.querySelector(target);
  textElement.textContent = text;
}
