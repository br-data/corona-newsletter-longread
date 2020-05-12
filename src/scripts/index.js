import '../index.html';
import '../styles/index.scss';

import * as bayernIndicator from './indicator/bayern-indicator';
import * as bayernText from './text/bayern-text';
import * as bayernRegbezText from './text/bayern-regbez-text';
import * as bayernLkrText from './text/bayern-lkr-text';
import * as bayernRegbezTable from './table/bayern-regbez-table';

import * as deutschlandIndicator from './indicator/deutschland-indicator';
import * as deutschlandText from './text/deutschland-text';
import * as deutschlandBlText from './text/deutschland-bl-text';
import * as deutschlandBlTable from './table/deutschland-bl-table';

import BarChart from './chart/bar-chart';
import AreaChart from './chart/area-chart';

import bayernMeta from './data/meta/bayern-meta.json';
import bayernRegbezMeta from './data/meta/bayern-regbez-meta.json';
import bayernLkrMeta from './data/meta/bayern-lkr-meta.json';

import deutschlandMeta from './data/meta/deutschland-meta.json';
import deutschlandBlMeta from './data/meta/deutschland-bl-meta.json';

import { germanDate } from './utils';

window.addEventListener('load', init);

async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const date = new Date(urlParams.get('date') || new Date());
  // const date = new Date(urlParams.get('date') || new Date('2020-04-14'));
  const endDate = date.toISOString().split('T')[0];
  const startDate = '2020-02-25';
  const logError = error => console.warn(error);

  const dateElements = document.querySelectorAll('span.date');
  dateElements.forEach(el => el.textContent = germanDate(endDate));

  const charts = [];

  const bayernCases = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&newCases=true&group=Bundesland&bundesland=Bayern`)
    .then(response => response.json())
    .catch(logError);

  const bayernRecoveries = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&newCases=true&group=Bundesland&bundesland=Bayern&sumField=AnzahlGenesen`)
    .then(response => response.json())
    .catch(logError);

  const bayernDeaths = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&newCases=true&group=Bundesland&bundesland=Bayern&sumField=AnzahlTodesfall`)
    .then(response => response.json())
    .catch(logError);

  bayernIndicator.init({
    target: '#bayern-indicator',
    caseData: bayernCases,
    recoveredData: bayernRecoveries,
    deathData: bayernDeaths
  });

  bayernText.init({
    caseTarget: '#bayern-cases-text',
    deathTarget: '#bayern-deaths-text',
    caseData: bayernCases,
    recoveredData: bayernRecoveries,
    deathData: bayernDeaths,
    metaData: bayernMeta
  });

  const bayernAreaChart = new AreaChart({
    target: '#bayern-line-chart',
    caseData: bayernCases,
    recoveredData: bayernRecoveries,
    deathData: bayernDeaths,
    meta: {
      title: 'Corona in Bayern',
      description: 'Enwicklung der wichtigsten Indikatoren',
      author: 'BR',
      source: 'Robert Koch-Institut',
      date: endDate
    }
  });

  charts.push(bayernAreaChart);

  const bayernBarChart = new BarChart({
    target: '#bayern-bar-chart',
    data: bayernCases,
    meta: {
      title: 'Neue Coronafälle in Bayern',
      description: 'Gemeldeten Neuinfektionen pro Tag',
      author: 'BR',
      source: 'Robert Koch-Institut',
      date: endDate
    }
  });

  charts.push(bayernBarChart);

  const bayernRegbezCases = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&newCases=true&group=Regierungsbezirk&bundesland=Bayern`)
    .then(response => response.json())
    .catch(logError);

  const bayernRegbezDeaths = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&newCases=true&group=Regierungsbezirk&bundesland=Bayern&sumField=AnzahlTodesfall`)
    .then(response => response.json())
    .catch(logError);

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

  const bayernLkrCases = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&newCases=true&group=Landkreis&bundesland=Bayern`)
    .then(response => response.json())
    .catch(logError);

  const bayernLkrDeaths = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&newCases=true&group=Landkreis&bundesland=Bayern&sumField=AnzahlTodesfall`)
    .then(response => response.json())
    .catch(logError);

  bayernLkrText.init({
    target: '#bayern-lkr-text',
    caseData: bayernLkrCases,
    deathData: bayernLkrDeaths,
    metaData: bayernLkrMeta,
    metaDataDistricts: bayernRegbezMeta
  });

  const deutschlandCases = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&newCases=true`)
    .then(response => response.json())
    .catch(logError);

  const deutschlandDeaths = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&newCases=true&sumField=AnzahlTodesfall`)
    .then(response => response.json())
    .catch(logError);

  const deutschlandRecoveries = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&newCases=true&sumField=AnzahlGenesen`)
    .then(response => response.json())
    .catch(logError);

  deutschlandIndicator.init({
    target: '#deutschland-indicator',
    caseData: deutschlandCases,
    recoveredData: deutschlandRecoveries,
    deathData: deutschlandDeaths
  });

  deutschlandText.init({
    caseTarget: '#deutschland-cases-text',
    deathTarget: '#deutschland-deaths-text',
    caseData: deutschlandCases,
    recoveredData: deutschlandRecoveries,
    deathData: deutschlandDeaths,
    metaData: deutschlandMeta
  });

  const deutschlandAreaChart = new AreaChart({
    target: '#deutschland-line-chart',
    caseData: deutschlandCases,
    recoveredData: deutschlandRecoveries,
    deathData: deutschlandDeaths,
    meta: {
      title: 'Corona in Deutschland',
      description: 'Enwicklung der wichtigsten Indikatoren',
      author: 'BR',
      source: 'Robert Koch-Institut',
      date: endDate
    }
  });

  charts.push(deutschlandAreaChart);

  const deutschlandBarChart = new BarChart({
    target: '#deutschland-bar-chart',
    data: deutschlandCases,
    meta: {
      title: 'Neue Coronafälle in Deutschland',
      description: 'Gemeldeten Neuinfektionen pro Tag',
      author: 'BR',
      source: 'Robert Koch-Institut',
      date: endDate
    }
  });

  charts.push(deutschlandBarChart);

  const deutschlandBlCases = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&newCases=true&group=Bundesland`)
    .then(response => response.json())
    .catch(logError);

  const deutschlandBlDeaths = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDate}&endDate=${endDate}&dateField=Refdatum&newCases=true&group=Bundesland&sumField=AnzahlTodesfall`)
    .then(response => response.json())
    .catch(logError);

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
