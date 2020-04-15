export function init(config) {
  const { selector, data } = config;

  const districts = [
    { name: 'Oberbayern', pop: '4686163' },
    { name: 'Niederbayern', pop: '1238528' },
    { name: 'Oberpfalz', pop: '1109269' },
    { name: 'Oberfranken', pop: '1067482' },
    { name: 'Mittelfranken', pop: '1770401' },
    { name: 'Unterfranken', pop: '1317124' },
    { name: 'Schwaben', pop: '1887754' }
  ];

  const analysis = districts.map(district => {
    const districtData = data.filter(d => d.Regierungsbezirk === district.name);

    return {
      'Regierungsbezirk': district.name,
      'bisher bestätigte Fälle': `${pretty(currentCount(districtData))}`,
      'neue Fälle': `${pretty(currentIncrease(districtData))} (+${pretty(currentIncreasePerc(districtData))} %)`,
      'Verdopplungszeit': `${doublingTime(districtData)} Tage`
    };
  });

  const tableHtml = json2table(analysis);
  const parentElement = document.querySelector(selector);
  parentElement.innerHTML = tableHtml;
}

function currentCount(data) {
  return data[data.length-1].sumValue;
}

function currentIncrease(data) {
  return data[data.length-1].value;
}

function currentIncreasePerc(data) {
  const currentDay = data[data.length-1].sumValue;
  const previousDay = data[data.length-2].sumValue;

  return (currentDay - previousDay) / currentDay * 100;
}

function doublingTime(data) {
  const date1 = new Date(data[data.length-2].Meldedatum);
  const value1 = data[data.length-2].sumValue;
  const date2 = new Date(data[data.length-9].Meldedatum);
  const value2 = data[data.length-9].sumValue;

  const diff = Math.ceil(date2.getTime() - date1.getTime()) / 86400000;
  const days = (Math.log(2) * diff) / (Math.log(value2) - Math.log(value1));

  const minDays = Math.floor(days);
  const maxDays = Math.ceil(days);

  return `${minDays} bis ${maxDays}`;
}

function pretty(number) {
  const string = (Math.round(number * 10) / 10).toString().split('.');

  return string[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (string[1] ? `,${string[1]}` : '');
}

function json2table(json) {
  const columns = Object.keys(json[0]);

  let headerRow = '';
  let bodyRows = '';

  columns.map(col => {
    headerRow += `<th>${col}</th>`;
  });

  json.map(row => {
    bodyRows += '<tr>';
    columns.map(colName => {
      bodyRows += `<td>${row[colName]}</td>`;
    });
    bodyRows += '</tr>';
  });

  const tableHtml = `
  <table>
    <thead>
      <tr>${headerRow}</tr>
    </thead>
    <tbody>
      ${bodyRows}
    </tbody>
  </table>`;

  return tableHtml;
}
