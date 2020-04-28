import '../styles/index.scss';

import * as bayernText from './text/bayern-text';
import * as bayernRegbezText from './text/bayern-regbez-text';
import * as bayernLkrText from './text/bayern-lkr-text';
import * as bayernRegbezTable from './table/bayern-regbez-table';
import * as deutschlandText from './text/deutschland-text';
import * as deutschlandBlText from './text/deutschland-bl-text';
import * as deutschlandBlTable from './table/deutschland-bl-table';

import LineChart from './chart/line-chart';

import bayernCases from './data/cases/bayern-cases.json';
import bayernRecoveries from './data/recoveries/bayern-recoveries.json';
import bayernDeaths from './data/deaths/bayern-deaths.json';
import bayernMeta from './data/meta/bayern-meta.json';

import bayernRegbezCases from './data/cases/bayern-regbez-cases.json';
import bayernRegbezDeaths from './data/deaths/bayern-regbez-deaths.json';
import bayernRegbezMeta from './data/meta/bayern-regbez-meta.json';

import bayernLkrCases from './data/cases/bayern-lkr-cases.json';
import bayernLkrDeaths from './data/deaths/bayern-lkr-deaths.json';
import bayernLkrMeta from './data/meta/bayern-lkr-meta.json';

import deutschlandCases from './data/cases/deutschland-cases.json';
import deutschlandRecoveries from './data/recoveries/deutschland-recoveries.json';
import deutschlandDeaths from './data/deaths/deutschland-deaths.json';
import deutschlandMeta from './data/meta/deutschland-meta.json';

import deutschlandBlCases from './data/cases/deutschland-bl-cases.json';
import deutschlandBlDeaths from './data/deaths/deutschland-bl-deaths.json';
import deutschlandBlMeta from './data/meta/deutschland-bl-meta.json';

import { germanDate } from './utils';

window.addEventListener('load', init);

async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  // const date = new Date(urlParams.get('date') || new Date());
  const date = new Date(urlParams.get('date') || new Date('2020-04-14'));
  const endDate = date.toISOString().split('T')[0];
  // const startDate = '2020-03-01';
  // const logError = error => console.warn(error);

  const dateElements = document.querySelectorAll('span.date');
  dateElements.forEach(el => el.textContent = germanDate(endDate));

  const charts = [];

  // const bayernCases = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&group=Bundesland&bundesland=Bayern`)
  //   .then(response => response.json())
  //   .catch(logError);

  // const bayernRecoveries = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&group=Bundesland&bundesland=Bayern&sumField=AnzahlGenesen`)
  //   .then(response => response.json())
  //   .catch(logError);

  // const bayernDeaths = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&group=Bundesland&bundesland=Bayern&sumField=AnzahlTodesfall`)
  //   .then(response => response.json())
  //   .catch(logError);

  bayernText.init({
    caseTarget: '#bayern-cases-text',
    deathTarget: '#bayern-deaths-text',
    caseData: bayernCases,
    recoveredData: bayernRecoveries,
    deathData: bayernDeaths,
    metaData: bayernMeta
  });

  const bayernChart = new LineChart({
    target: '#bayern-chart',
    data: bayernCases,
    meta: {
      title: 'Corona in Bayern',
      description: 'Enwicklung der gemeldeten Fallzahlen',
      author: 'BR',
      source: 'Robert Koch-Institut',
      date: endDate
    }
  });

  charts.push(bayernChart);

  // const bayernRegbezCases = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&group=Regierungsbezirk&bundesland=Bayern`)
  //   .then(response => response.json())
  //   .catch(logError);

  // const bayernRegbezDeaths = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&group=Regierungsbezirk&bundesland=Bayern&sumField=AnzahlTodesfall`)
  //   .then(response => response.json())
  //   .catch(logError);

  bayernRegbezTable.init({
    target: '#bayern-regbez-table',
    caseData: bayernRegbezCases,
    deathData: bayernRegbezDeaths,
    metaData: bayernRegbezMeta
  });

  bayernRegbezText.init({
    target: '#bayern-regbez-text',
    caseData: bayernRegbezCases,
    deathData: bayernRegbezDeaths,
    metaData: bayernRegbezMeta
  });

  // const bayernLkrCases = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&group=Landkreis&bundesland=Bayern`)
  //   .then(response => response.json())
  //   .catch(logError);

  // const bayernLkrDeaths = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&group=Landkreis&bundesland=Bayern&sumField=AnzahlTodesfall`)
  //   .then(response => response.json())
  //   .catch(logError);

  bayernLkrText.init({
    target: '#bayern-lkr-text',
    caseData: bayernLkrCases,
    deathData: bayernLkrDeaths,
    metaData: bayernLkrMeta,
    metaDataDistricts: bayernRegbezMeta
  });

  // const deutschlandCases = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum`)
  //   .then(response => response.json())
  //   .catch(logError);

  // const deutschlandDeaths = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&sumField=AnzahlTodesfall`)
  //   .then(response => response.json())
  //   .catch(logError);

  // const deutschlandRecoveries = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&sumField=AnzahlGenesen`)
  //   .then(response => response.json())
  //   .catch(logError);

  deutschlandText.init({
    caseTarget: '#deutschland-cases-text',
    deathTarget: '#deutschland-deaths-text',
    caseData: deutschlandCases,
    recoveredData: deutschlandRecoveries,
    deathData: deutschlandDeaths,
    metaData: deutschlandMeta
  });

  const deutschlandChart = new LineChart({
    target: '#deutschland-chart',
    data: deutschlandCases,
    meta: {
      title: 'Corona in Deutschland',
      description: 'Enwicklung der gemeldeten Fallzahlen',
      author: 'BR',
      source: 'Robert Koch-Institut',
      date: endDate
    }
  });

  charts.push(deutschlandChart);

  // const deutschlandBlCases = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&group=Bundesland`)
  //   .then(response => response.json())
  //   .catch(logError);

  // const deutschlandBlDeaths = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&group=Bundesland&sumField=AnzahlTodesfall`)
  //   .then(response => response.json())
  //   .catch(logError);

  deutschlandBlText.init({
    target: '#deutschland-bl-text',
    caseData: deutschlandBlCases,
    deathData: deutschlandBlDeaths,
    metaData: deutschlandBlMeta
  });

  deutschlandBlTable.init({
    target: '#deutschland-bl-table',
    caseData: deutschlandBlCases,
    deathData: deutschlandBlDeaths,
    metaData: deutschlandBlMeta
  });

  resize(charts);
}

function resize(charts) {
  let timeout;

  window.onresize = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      charts.forEach(chart => chart.update());
    }, 200);
  };
}
