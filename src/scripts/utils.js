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
  return data[data.length-1].date;
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

export function doublingTime(data) {
  const date1 = new Date(data[data.length-2].date);
  const value1 = data[data.length-2].sumValue;
  const date2 = new Date(data[data.length-9].date);
  const value2 = data[data.length-9].sumValue;

  const diff = Math.ceil(date2.getTime() - date1.getTime()) / 86400000;
  const days = (Math.log(2) * diff) / (Math.log(value2) - Math.log(value1));

  const minDays = Math.floor(days);
  const maxDays = Math.ceil(days);

  return `${minDays} bis ${maxDays}`;
}

// Reproduction number
export function reproNumber(data, steps = 4, key = 'value') {
  const smoothData = sma(data);

  return smoothData.map((obj, i) => {
    const currentDays = smoothData.slice(i - steps, i);
    const previousDays = smoothData.slice(i - steps * 2, i - steps);
    const currentDaysSum = currentDays.reduce((sum, curr) => sum + curr[key], 0);
    const previousDaysSum = previousDays.reduce((sum, curr) => sum + curr[key], 0);

    return Object.assign(obj, {
      r: currentDaysSum / previousDaysSum
    });
  }).filter(d => isFinite(d.r || undefined));
}

// Simple moving average
export function sma(data, steps = 7, key = 'value') {
  return data.map((obj, index) => {
    const offset = index - Math.floor(steps / 2);
    const window = data.slice(offset, steps + offset);

    return Object.assign(obj, {
      value: window.reduce((sum, curr) => {
        return curr[key] ? sum + curr[key] : null;
      }, 0) / steps
    });
  }).filter(d => d.value);
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
