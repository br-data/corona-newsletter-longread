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
  const logError = error => console.warn(error);

  const urlParams = new URLSearchParams(window.location.search);
  const startDate = new Date(urlParams.get('startDate') || new Date('2020-02-25'));
  const startDateString = startDate.toISOString().split('T')[0];
  const endDate = new Date(urlParams.get('endDate') || new Date());
  const endDateString = endDate.toISOString().split('T')[0];

  const dateElements = document.querySelectorAll('span.date');
  dateElements.forEach(el => el.textContent = germanDate(endDateString));
  const timeElements = document.querySelectorAll('span.time');
  timeElements.forEach(el => el.textContent = `${new Date().toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin' }).split(':')[0]}:00 Uhr`);

  const charts = [];

  // Text for Bavaria
  (async function () {
    const bayernCasesRequest = fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDateString}&endDate=${endDateString}&newCases=true&group=Bundesland&bundesland=Bayern`)
      .then(response => response.json())
      .catch(logError);

    const bayernRecoveriesRequest = fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDateString}&endDate=${endDateString}&newCases=true&group=Bundesland&bundesland=Bayern&sumField=AnzahlGenesen`)
      .then(response => response.json())
      .catch(logError);

    const bayernDeathsRequest = fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDateString}&endDate=${endDateString}&newCases=true&group=Bundesland&bundesland=Bayern&sumField=AnzahlTodesfall`)
      .then(response => response.json())
      .catch(logError);

    const [bayernCases, bayernRecoveries, bayernDeaths] = await Promise.all([bayernCasesRequest, bayernRecoveriesRequest, bayernDeathsRequest]);

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
  })();

  // Charts for Bavaria
  (async function () {
    const bayernCasesRefRequest = fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDateString}&endDate=${endDateString}&dateField=Refdatum&newCases=true&group=Bundesland&bundesland=Bayern`)
      .then(response => response.json())
      .catch(logError);

    const bayernCurrentRefRequest = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDateString}&endDate=${endDateString}&dateField=Refdatum&group=Bundesland&bundesland=Bayern&currentCases=true`)
      .then(response => response.json())
      .catch(logError);

    const [bayernCasesRef, bayernCurrentRef] = await Promise.all([bayernCasesRefRequest, bayernCurrentRefRequest]);

    const bayernAreaChart = new AreaChart({
      target: '#bayern-line-chart',
      data: bayernCurrentRef,
      meta: {
        title: 'Corona in Bayern',
        description: 'Entwicklung der wichtigsten Indikatoren nach Erkrankungsdatum',
        author: 'BR',
        source: 'Robert Koch-Institut, BR-Analyse',
        date: endDate
      }
    });

    charts.push(bayernAreaChart);

    const bayernBarChart = new BarChart({
      target: '#bayern-bar-chart',
      data: bayernCasesRef,
      meta: {
        title: 'Neue Coronafälle in Bayern',
        description: 'Entwicklung der Neuinfektionen nach Erkrankungsdatum',
        author: 'BR',
        source: 'Robert Koch-Institut, BR-Analyse',
        date: endDate
      }
    });

    charts.push(bayernBarChart);
  })();

  // Text for Bavarian administrative districts
  (async function () {
    const bayernRegbezCasesRequest = fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDateString}&endDate=${endDateString}&newCases=true&group=Regierungsbezirk&bundesland=Bayern`)
      .then(response => response.json())
      .catch(logError);

    const bayernRegbezDeathsRequest = fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDateString}&endDate=${endDateString}&newCases=true&group=Regierungsbezirk&bundesland=Bayern&sumField=AnzahlTodesfall`)
      .then(response => response.json())
      .catch(logError);

    const [bayernRegbezCases, bayernRegbezDeaths] = await Promise.all([bayernRegbezCasesRequest, bayernRegbezDeathsRequest]);

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
  })();

  // Text for Bavarian counties
  (async function () {
    const bayernLkrCases = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDateString}&endDate=${endDateString}&newCases=true&group=Landkreis&bundesland=Bayern`)
      .then(response => response.json())
      .catch(logError);

    bayernLkrText.init({
      target: '#bayern-lkr-text',
      caseData: bayernLkrCases,
      metaData: bayernLkrMeta,
      metaDataDistricts: bayernRegbezMeta
    });
  })();

  // Text for Germany
  (async function () {
    const deutschlandCasesRequest = fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDateString}&endDate=${endDateString}&newCases=true`)
      .then(response => response.json())
      .catch(logError);

    const deutschlandDeathsRequest = fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDateString}&endDate=${endDateString}&newCases=true&sumField=AnzahlTodesfall`)
      .then(response => response.json())
      .catch(logError);

    const deutschlandRecoveriesRequest = fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDateString}&endDate=${endDateString}&newCases=true&sumField=AnzahlGenesen`)
      .then(response => response.json())
      .catch(logError);

    const [deutschlandCases, deutschlandDeaths, deutschlandRecoveries] = await Promise.all([deutschlandCasesRequest, deutschlandDeathsRequest, deutschlandRecoveriesRequest]);

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
  })();

  // Charts for Germany
  (async function () {
    const deutschlandCasesRefRequest = fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDateString}&endDate=${endDateString}&dateField=Refdatum&newCases=true`)
      .then(response => response.json())
      .catch(logError);

    const deutschlandCurrentRefRequest = await fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDateString}&endDate=${endDateString}&dateField=Refdatum&currentCases=true`)
      .then(response => response.json())
      .catch(logError);

    const [deutschlandCasesRef, deutschlandCurrentRef] = await Promise.all([deutschlandCasesRefRequest, deutschlandCurrentRefRequest]);

    const deutschlandAreaChart = new AreaChart({
      target: '#deutschland-line-chart',
      data: deutschlandCurrentRef,
      meta: {
        title: 'Corona in Deutschland',
        description: 'Entwicklung der wichtigsten Indikatoren nach Erkrankungsdatum',
        author: 'BR',
        source: 'Robert Koch-Institut, BR-Analyse',
        date: endDate
      }
    });

    charts.push(deutschlandAreaChart);

    const deutschlandBarChart = new BarChart({
      target: '#deutschland-bar-chart',
      data: deutschlandCasesRef,
      meta: {
        title: 'Neue Coronafälle in Deutschland',
        description: 'Entwicklung der Neuinfektionen nach Erkrankungsdatum',
        author: 'BR',
        source: 'Robert Koch-Institut, BR-Analyse',
        date: endDate
      }
    });

    charts.push(deutschlandBarChart);
  })();

  // Text for German federal states
  (async function () {
    const deutschlandBlCasesRequest = fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDateString}&endDate=${endDateString}&newCases=true&group=Bundesland`)
      .then(response => response.json())
      .catch(logError);

    const deutschlandBlDeathsRequest = fetch(`https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=${startDateString}&endDate=${endDateString}&newCases=true&group=Bundesland&sumField=AnzahlTodesfall`)
      .then(response => response.json())
      .catch(logError);

    const [deutschlandBlCases, deutschlandBlDeaths] = await Promise.all([deutschlandBlCasesRequest,deutschlandBlDeathsRequest]);

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
  })();

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
