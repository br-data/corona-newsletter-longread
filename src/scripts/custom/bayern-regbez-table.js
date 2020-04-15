export function init(config) {
  const { selector, data } = config;

  console.log(data);

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
    return {
      Landkreis: district.name,
      'bisher bestätigte Fälle': 0,
      'neue Fälle': 0,
      'Verdopplungszeit': 0
    };
  });

  const tableHtml = json2table(analysis);
  const parentElement = document.querySelector(selector);
  parentElement.innerHTML = tableHtml;
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
