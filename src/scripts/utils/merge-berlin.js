export function mergeBerlinData(caseData) {
  const berlinCounties = ['SK Berlin Mitte', 'SK Berlin Charlottenburg-Wilmersdorf', 'SK Berlin Neukölln', 'SK Berlin Tempelhof-Schöneberg', 'SK Berlin Pankow', 'SK Berlin Steglitz-Zehlendorf', 'SK Berlin Friedrichshain-Kreuzberg', 'SK Berlin Reinickendorf', 'SK Berlin Treptow-Köpenick', 'SK Berlin Spandau', 'SK Berlin Marzahn-Hellersdorf', 'SK Berlin Lichtenberg'];
  const uniqueDates = [...new Set(caseData.map(d => d.date))];
  const berlinCasesMerged = uniqueDates.map(date => {

    return caseData
      .filter(d => berlinCounties.includes(d.Landkreis) && d.date === date)
      .reduce((acc, curr) => {
        acc.date = curr.date;
        acc.value += curr.value;
        acc.sumValue += curr.value;

        return acc;
      }, {
        Landkreis: 'Berlin',
        value: 0,
        sumValue: 0
      });
  });

  return caseData
    .filter(d => !berlinCounties.includes(d.Landkreis))
    .concat(berlinCasesMerged);
}