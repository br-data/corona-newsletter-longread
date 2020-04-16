export function currentCount(data) {
  return data[data.length-1].sumValue;
}

export function currentIncrease(data) {
  return data[data.length-1].value;
}

export function currentIncreasePerc(data) {
  const currentDay = data[data.length-1].sumValue;
  const previousDay = data[data.length-2].sumValue;

  return (currentDay - previousDay) / currentDay * 100;
}

export function currentDate(data) {
  return data[data.length-1].Meldedatum;
}

export function germanDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', options);
}

export function casesPerThousand(cases, population) {
  return (cases * 1000) / population;
}

export function doublingTime(data) {
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

export function pretty(number) {
  const string = (Math.round(number * 10) / 10).toString().split('.');
  return string[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (string[1] ? `,${string[1]}` : '');
}

export function json2table(json) {
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
