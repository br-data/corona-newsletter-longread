import { pretty } from '../utils';

export function init(config) {
  const { target, cases } = config;

  const uniqueDistricts = [...new Set(cases.map(d => d.bundeslandId))];

  const worstDistricts = uniqueDistricts.map(districtId => {
    const currentDistrictCases = cases.filter(c => c.bundeslandId === districtId);

    return currentDistrictCases[currentDistrictCases.length - 1];
  }).sort((a, b) => b.inzidenz - a.inzidenz);

  const text = `Am stärksten betroffen ist der Regierungsbezirk ${worstDistricts[0].regierungsbezirk}. Pro 100.000 Einwohner wurden in der letzten Woche ${pretty(worstDistricts[0].inzidenz)} Corona-Fälle gemeldet.

  Vergleichsweise am besten steht der Regierungsbezirk ${worstDistricts[worstDistricts.length-1].regierungsbezirk} da. Dort wurden in den letzten sieben Tagen nur ${pretty(worstDistricts[worstDistricts.length-1].inzidenz)} Fälle pro 100.000 Einwohner gemeldet.`;

  const textElement = document.querySelector(target);
  textElement.textContent = text;
}
