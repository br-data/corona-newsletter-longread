export function init(config) {
  const { selector, data } = config;

  const text = `Bislang wurden ${pretty(currentCount(data))} Corona-Fälle in Bayern  gemeldet. Das sind ${pretty(currentIncrease(data))} Fälle (+${pretty(currentIncreasePerc(data))} %) mehr als noch am Vortag. Die Zahl der gemeldeten Fälle in Bayern verdoppelt sich damit ungefähr alle ${doublingTime(data)} Tage.

  Alle Angaben und Berechnungen beziehen sich auf die aktuellen Zahlen des Robert Koch-Instituts vom ${germanDate(currentDate(data))}.`;

  const textElement = document.querySelector(selector);
  textElement.textContent = text;
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

function currentDate(data) {
  return data[data.length-1].Meldedatum;
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

function germanDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', options);
}

function pretty(number) {
  const string = (Math.round(number * 10) / 10).toString().split('.');
  return string[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (string[1] ? `,${string[1]}` : '');
}
