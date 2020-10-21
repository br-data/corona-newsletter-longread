export function currentCount(data) {
  return data[data.length-1].sumValue;
}

export function currentIncrease(data) {
  return data[data.length-1].sumNewCases || 0;
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

export function dateRange(startDate, endDate, steps) {
  const dateArray = [];
  const currentDate = new Date(endDate);

  while (currentDate >= new Date(startDate)) {
    dateArray.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() - steps);
  }

  return dateArray;
}

export function casesPerThousand(cases, population) {
  return (cases * 1000) / population;
}

export function casesPer100Tsd7Days(data, population) {
  const currentWeek = data.slice(data.length-7, data.length);
  const cases = currentWeek.reduce((sum, curr) => (sum += curr.value), 0);

  return (cases * 100000) / population;
}

export function thresholdIndicator(value) {
  if (value >= 100) {
    return 'dot-darkred';
  } else if (value >= 50) {
    return 'dot-red';
  } else if (value >= 35) {
    return 'dot-orange';
  } else {
    return 'dot-yellow';
  }
}

export function trendClassifier(value) {
  if (value <= -50) {
    return 'stark zurückgegangen';
  } else if (value <= -25) {
    return 'deutlich zurückgegangen';
  } else if (value <= -5) {
    return 'leicht zurückgegangen';
  } else if (value > -5 && value < 5) {
    return 'nahezu gleich geblieben';
  } else if (value >= 5 && value < 25) {
    return 'leicht angestiegen';
  } else if (value >= 25 && value < 50) {
    return 'deutlich angestiegen';
  } else if (value >= 50) {
    return 'stark angestiegen';
  } else {
    return 'nahezu gleich geblieben';
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
  } else {
    return 'icono-arrow-undefined';
  }
}

export function weekTrend(data, threshold = 10) {
  const currentWeek = data.slice(data.length-9, data.length-2);
  const previousWeek = data.slice(data.length-16, data.length-9);

  const currentWeekSum = currentWeek.reduce((sum, curr) => { return sum + curr.value; }, 0);
  const previousWeekSum = previousWeek.reduce((sum, curr) => { return sum + curr.value; }, 0);

  const percentChange = ((currentWeekSum - previousWeekSum) / previousWeekSum) * 100;

  const isDifferent = (currentWeekSum !== previousWeekSum);
  const isBigEnough = (currentWeekSum > threshold && previousWeekSum > threshold);

  let trend = isDifferent ? percentChange : 0;
  trend = isBigEnough ? trend : undefined;

  return trend;
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
  return data.map((obj, i) => {
    const currentDays = data.slice(i - steps, i);
    const previousDays = data.slice(i - steps * 2, i - steps);
    const currentDaysSum = currentDays.reduce((sum, curr) => sum + curr[key], 0);
    const previousDaysSum = previousDays.reduce((sum, curr) => sum + curr[key], 0);

    return Object.assign({}, obj, {
      value: currentDaysSum / previousDaysSum
    });
  }).filter(d => isFinite(d.value || undefined));
}

// Simple moving average
export function sma(data, steps = 7, key = 'value') {
  return data.map((obj, index) => {
    const offset = index - Math.floor(steps / 2);
    const window = data.slice(offset, steps + offset);

    return Object.assign({}, obj, {
      value: window.reduce((sum, curr) => {
        return curr[key] ? sum + curr[key] : null;
      }, 0) / window.length
    });
  }).filter(d => d.value);
}

export function confidence(data, level = '95', key = 'value') {
  const zValues = { '80': 1.28, '90': 1.645, '95': 1.96, '98': 2.33, '99': 2.58 };
  const zValue = zValues[level];
  const stdDevValue = stdDev(data, key);

  return zValue * (stdDevValue / Math.sqrt(data.length));
}

export function stdDev(data, key = 'value') {
  const avg = data.reduce((sum, curr) => sum + curr[key], 0) / data.length;
  const squareDiffs = data.map(obj => Math.pow(obj[key] - avg, 2));
  const squareDiffsAvg = squareDiffs.reduce((sum, curr) => sum + curr, 0) / squareDiffs.length;

  return Math.sqrt(squareDiffsAvg);
}

export function pretty(number, prefix = false, method = 'round', factor = 10) {
  const string = (Math[method](number * factor) / factor).toString().split('.');
  const prettyString = string[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (string[1] ? `,${string[1]}` : '');
  const prefixedString = (prefix && number > 0) ? `+${prettyString}` : prettyString;

  return prefixedString;
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
      bodyRows += `<td data-label="${colName.replace(/<br>/gi, '')}">${row[colName]}</td>`;
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

// http://bl.ocks.org/devgru/a9428ebd6e11353785f2
export function getRetinaRatio() {
  const devicePixelRatio = window.devicePixelRatio || 1;
  const c = document.createElement('canvas').getContext('2d');
  const backingStoreRatio = [
    c.webkitBackingStorePixelRatio,
    c.mozBackingStorePixelRatio,
    c.msBackingStorePixelRatio,
    c.oBackingStorePixelRatio,
    c.backingStorePixelRatio,
    1
  ].reduce((a, b) => a || b);

  return devicePixelRatio / backingStoreRatio;
}
