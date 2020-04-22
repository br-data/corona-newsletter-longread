export function currentCount(data) {
  return data[data.length-1].sumValue;
}

export function currentIncrease(data) {
  return data[data.length-1].value;
}

export function currentIncreasePerc(data) {
  const currentDay = data[data.length-1].sumValue;
  const previousDay = data[data.length-2].sumValue;

  const percentChange = ((currentDay - previousDay) / previousDay) * 100;

  return percentChange;
}

export function currentDate(data) {
  return data[data.length-1].Meldedatum;
}

export function germanDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);

  return date.toLocaleDateString('de-DE', options);
}

export function germanDateShort(dateString) {
  const options = { month: 'numeric', day: 'numeric' };
  const date = new Date(dateString);

  return date.toLocaleDateString('de-DE', options);
}


export function casesPerThousand(cases, population) {
  return (cases * 1000) / population;
}

export function trendClassifier(value) {
  if (value <= -50) {
    return 'stark zurückgegangen';
  } else if (value <= -25) {
    return 'zurückgegangen';
  } else if (value <= -5) {
    return 'leicht zurückgegangen';
  } else if (value > -5 && value < 5) {
    return 'nahezu gleich geblieben';
  } else if (value >= 5 && value < 25) {
    return 'leicht angestiegen';
  } else if (value >= 25 && value < 50) {
    return 'angestiegen';
  } else if (value >= 50) {
    return 'stark angestiegen';
  }
}

export function trendArrow(value) {
  if (value <= -50) {
    return 'icono-arrow-down';
  } else if (value <= -25) {
    return 'icono-arrow-right-down';
  } else if (value <= -5) {
    return 'icono-arrow-right-down';
  } else if (value > -5 && value < 5) {
    return 'icono-arrow-right';
  } else if (value >= 5 && value < 25) {
    return 'icono-arrow-right-up';
  } else if (value >= 25 && value < 50) {
    return 'icono-arrow-right-up';
  } else if (value >= 50) {
    return 'icono-arrow-up';
  }
}

export function weekTrend(data) {
  const currentWeek = data.slice(data.length-9, data.length-2);
  const previousWeek = data.slice(data.length-16, data.length-9);

  const currentWeekSum = currentWeek.reduce((sum, curr) => { return sum + curr.value; }, 0);
  const previousWeekSum = previousWeek.reduce((sum, curr) => { return sum + curr.value; }, 0);

  const percentChange = ((currentWeekSum - previousWeekSum) / previousWeekSum) * 100;

  return percentChange;
}

export function reproRate(data) {
  const currentDays = data.slice(data.length-6, data.length-2);
  const previousDays = data.slice(data.length-10, data.length-6);

  const currentDaysSum = currentDays.reduce((sum, curr) => { return sum + curr.value; }, 0);
  const previousDaysSum = previousDays.reduce((sum, curr) => { return sum + curr.value; }, 0);

  const rate = previousDaysSum / currentDaysSum;

  return rate;
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

// Simple moving average
export function sma(data, gap = 7, key = 'value') {
  const result = [];

  data.forEach((obj, i) => {
    let group = data.slice(i, gap + i);
    if (group.length < gap) return;
    result.push(group.reduce((sum, curr) => {
      return curr[key] ? sum + curr[key] : null;
    }, 0) / gap);
  });

  return result;
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
      bodyRows += `<td data-label="${colName}">${row[colName]}</td>`;
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
