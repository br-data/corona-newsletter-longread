import '../index.html';
import '../styles/index.scss';

import SimpleChart from './chart/simple-chart';
import BarChart from './chart/bar-chart';
import AreaChart from './chart/area-chart';
import LineChart from './chart/line-chart';
import BayernMap from './chart/bayern-map';
import DeutschlandMap from './chart/deutschland-map';

import * as bayernIndicator from './indicator/bayern-indicator';
import * as bayernText from './text/bayern-text';
import * as bayernRegbezText from './text/bayern-regbez-text';
import * as bayernRegbezTable from './table/bayern-regbez-table';
import * as bayernLkrText from './text/bayern-lkr-text';
import * as bayernLkrTable from './table/bayern-lkr-table';
import * as bayernVaccinationsText from './text/bayern-vaccinations-text';
import * as bayernPatientsText from './text/bayern-patients-text';

import bayernMeta from './data/meta/bayern-meta.json';
import bayernRegbezMeta from './data/meta/bayern-regbez-meta.json';
import bayernLkrMeta from './data/meta/bayern-lkr-meta.json';
import bayernLkrGeo from './data/geo/bayern-lkr.topo.json';
import bayernBigCities from './data/meta/bayern-big-cities.json';

import * as deutschlandIndicator from './indicator/deutschland-indicator';
import * as deutschlandText from './text/deutschland-text';
import * as deutschlandBlText from './text/deutschland-bl-text';
import * as deutschlandBlTable from './table/deutschland-bl-table';
import * as deutschlandLkrText from './text/deutschland-lkr-text';
import * as deutschlandVaccinationsText from './text/deutschland-vaccinations-text';
import * as deutschlandPatientsText from './text/deutschland-patients-text';

import deutschlandMeta from './data/meta/deutschland-meta.json';
import deutschlandBlMeta from './data/meta/deutschland-bl-meta.json';
import deutschlandLkrMeta from './data/meta/deutschland-lkr-meta.json';
import deutschlandLkrGeo from './data/geo/deutschland-lkr.topo.json';

import { germanDate, csvToJson } from './utils';

window.addEventListener('load', init);

async function init() {
  const logError = error => console.warn(error);
  const toDateString = date => date.toISOString().split('T')[0];

  const charts = [];
  
  const apiUrl = 'https://corona-deutschland-api.interaktiv.br.de/query';
  const urlParams = new URLSearchParams(window.location.search);

  const startDate = new Date(urlParams.get('startDate') || new Date('2020-02-25'));
  const startDateString = toDateString(startDate);

  const endDate = new Date(urlParams.get('endDate') || new Date());
  const endDateString = toDateString(endDate);

  const previousDayDate = new Date();
  previousDayDate.setDate(endDate.getDate()-1);
  const previousDayDateString = toDateString(previousDayDate);

  const previousTwoWeeksDate = new Date();
  previousTwoWeeksDate.setDate(endDate.getDate()-16);
  const previousTwoWeeksDateString = toDateString(previousTwoWeeksDate);

  document.querySelectorAll('span.date')
    .forEach(el => el.textContent = germanDate(endDateString));
  document.querySelectorAll('span.time')
    .forEach(el => el.textContent = `${new Date().toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin' }).split(':')[0]}:00 Uhr`);

  const dataCheckResult = await fetch(`${apiUrl}?startDate=${previousDayDateString}`)
    .then(response => response.json())
    .catch(logError);

  if (!dataCheckResult.length) {
    document.querySelectorAll('.warning')
      .forEach(el => el.textContent = 'Gerade scheint es Probleme mit der Datenschnittstelle des Robert Koch-Instituts zu geben. Bis die Probleme behoben sind, wird der Datenstand von gestern angezeigt.');
    document.querySelectorAll('span.date.updateable')
      .forEach(el => el.textContent = germanDate(previousDayDate));
    document.querySelectorAll('span.time.updateable')
      .forEach(el => el.textContent = '24:00');
  }

  // Text for Bavaria
  (async function () {
    const bayernCasesRequest = fetch(`${apiUrl}?startDate=${startDateString}&endDate=${endDateString}&newCases=true&group=Bundesland&bundesland=Bayern`)
      .then(response => response.json())
      .catch(logError);

    const bayernRecoveriesRequest = fetch(`${apiUrl}?startDate=${startDateString}&endDate=${endDateString}&newCases=true&group=Bundesland&bundesland=Bayern&sumField=AnzahlGenesen`)
      .then(response => response.json())
      .catch(logError);

    const bayernDeathsRequest = fetch(`${apiUrl}?startDate=${startDateString}&endDate=${endDateString}&newCases=true&group=Bundesland&bundesland=Bayern&sumField=AnzahlTodesfall`)
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
      reproTarget: '#bayern-repro-text',
      deathTarget: '#bayern-deaths-text',
      caseData: bayernCases,
      recoveredData: bayernRecoveries,
      deathData: bayernDeaths,
      metaData: bayernMeta
    });
  })();

  // Charts for Bavaria
  (async function () {
    const bayernCasesRefRequest = fetch(`${apiUrl}?startDate=${startDateString}&endDate=${endDateString}&dateField=Refdatum&newCases=true&group=Bundesland&bundesland=Bayern`)
      .then(response => response.json())
      .catch(logError);

    const bayernCurrentRefRequest = fetch(`${apiUrl}?startDate=${startDateString}&endDate=${endDateString}&dateField=Refdatum&group=Bundesland&bundesland=Bayern&currentCases=true`)
      .then(response => response.json())
      .catch(logError);

    const [bayernCasesRef, bayernCurrentRef] = await Promise.all([bayernCasesRefRequest, bayernCurrentRefRequest]);

    const bayernIndicatorsChart = new AreaChart({
      target: '#bayern-indicators-chart',
      data: bayernCurrentRef,
      meta: {
        title: 'Corona in Bayern',
        description: 'Entwicklung der wichtigsten Indikatoren nach Erkrankungsdatum',
        author: 'BR',
        source: 'Robert Koch-Institut, BR-Analyse',
        date: endDate
      }
    });

    charts.push(bayernIndicatorsChart);

    const bayernCasesChart = new BarChart({
      target: '#bayern-cases-chart',
      data: bayernCasesRef,
      meta: {
        title: 'Neue Coronafälle in Bayern',
        description: 'Entwicklung der Neuinfektionen nach Erkrankungsdatum',
        author: 'BR',
        source: 'Robert Koch-Institut, BR-Analyse',
        date: endDate
      }
    });

    charts.push(bayernCasesChart);
  })();

  // Text for Bavarian administrative districts (Regierungsbezirke)
  (async function () {
    const bayernRegbezCasesRequest = fetch(`${apiUrl}?startDate=${startDateString}&endDate=${endDateString}&newCases=true&group=Regierungsbezirk&bundesland=Bayern`)
      .then(response => response.json())
      .catch(logError);

    const bayernRegbezDeathsRequest = fetch(`${apiUrl}?startDate=${startDateString}&endDate=${endDateString}&newCases=true&group=Regierungsbezirk&bundesland=Bayern&sumField=AnzahlTodesfall`)
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

  // Text and map for Bavarian counties (Landkreise)
  (async function () {
    const bayernLkrCases = await fetch(`${apiUrl}?startDate=${previousTwoWeeksDateString}&endDate=${endDateString}&group=Landkreis&bundesland=Bayern`)
      .then(response => response.json())
      .catch(logError);

    const bayernMap = new BayernMap({
      target: '#bayern-cases-map',
      caseData: bayernLkrCases,
      metaData: bayernLkrMeta,
      geoData: bayernLkrGeo,
      labelData: bayernBigCities,
      meta: {
        title: '7-Tage-Inzidenz in Bayern',
        description: 'Neuinfektionen pro 100.000 Einwohner in den letzten sieben Tagen',
        author: 'BR',
        source: 'Robert Koch-Institut, BR-Analyse',
        date: endDate
      }
    });

    charts.push(bayernMap);

    bayernLkrText.init({
      summaryTarget: '#bayern-lkr-summary-text',
      detailTarget: '#bayern-lkr-detail-text',
      caseData: bayernLkrCases,
      metaData: bayernLkrMeta,
      metaDataDistricts: bayernRegbezMeta
    });
  })();

  // Table for Bavarian counties (Landkreise)
  (async function () {
    const bayernLkrCasesRequest = fetch(`${apiUrl}?startDate=${startDateString}&endDate=${endDateString}&newCases=true&group=Landkreis&bundesland=Bayern`)
      .then(response => response.json())
      .catch(logError);

    const bayernLkrDeathsRequest = fetch(`${apiUrl}?startDate=${startDateString}&endDate=${endDateString}&newCases=true&group=Landkreis&bundesland=Bayern&sumField=AnzahlTodesfall`)
      .then(response => response.json())
      .catch(logError);

    const [bayernLkrCases, bayernLkrDeaths] = await Promise.all([bayernLkrCasesRequest, bayernLkrDeathsRequest]);

    bayernLkrTable.init({
      target: '#bayern-lkr-table',
      caseData: bayernLkrCases,
      deathData: bayernLkrDeaths,
      metaData: bayernLkrMeta
    });
  })();

  // Text and chart for intensive care patients in Bavaria
  (async function () {
    const bayernPatients = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/diviApi/query?area=BY&indicator=Patienten')
      .then(response => response.json())
      .catch(logError);

    bayernPatientsText.init({
      target: '#bayern-patients-text',
      patientData: bayernPatients,
      metaData: bayernMeta
    });

    const bayernPatientsChart = new LineChart({
      target: '#bayern-patients-chart',
      data: bayernPatients,
      meta: {
        title: 'Intensivpatienten in Bayern',
        description: 'Anzahl der gemeldeten Corona-Fälle in intensivmedizinischer Behandlung',
        author: 'BR',
        source: 'DIVI-Intensivregister',
        date: endDate
      }
    });

    charts.push(bayernPatientsChart);
  })();

  // Text and chart for vaccinations in Bavaria
  (async function () {
    const bayernVaccinations = await fetch('https://raw.githubusercontent.com/ard-data/2020-rki-impf-archive/master/data/9_csv_v2/region_BY.csv')
      .then(response => response.text())
      .catch(logError);

    bayernVaccinationsText.init({
      target: '#bayern-vaccinations-text',
      data: csvToJson(bayernVaccinations)
    });

    const bayernVaccinationsChart = new SimpleChart({
      target: '#bayern-vaccinations-chart',
      data: csvToJson(bayernVaccinations),
      meta: {
        title: 'Corona-Impfungen in Bayern',
        description: 'Prozentualer Anteil der geimpften Personen an der Bevölkerung',
        author: 'BR',
        source: 'Robert Koch-Institut',
        date: endDate
      }
    });

    charts.push(bayernVaccinationsChart);
  })();

  // Text for Germany
  (async function () {
    const deutschlandCasesRequest = fetch(`${apiUrl}?startDate=${startDateString}&endDate=${endDateString}&newCases=true`)
      .then(response => response.json())
      .catch(logError);

    const deutschlandDeathsRequest = fetch(`${apiUrl}?startDate=${startDateString}&endDate=${endDateString}&newCases=true&sumField=AnzahlTodesfall`)
      .then(response => response.json())
      .catch(logError);

    const deutschlandRecoveriesRequest = fetch(`${apiUrl}?startDate=${startDateString}&endDate=${endDateString}&newCases=true&sumField=AnzahlGenesen`)
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
      reproTarget: '#deutschland-repro-text',
      deathTarget: '#deutschland-deaths-text',
      caseData: deutschlandCases,
      recoveredData: deutschlandRecoveries,
      deathData: deutschlandDeaths,
      metaData: deutschlandMeta
    });
  })();

  // Charts for Germany
  (async function () {
    const deutschlandCasesRefRequest = fetch(`${apiUrl}?startDate=${startDateString}&endDate=${endDateString}&dateField=Refdatum&newCases=true`)
      .then(response => response.json())
      .catch(logError);

    const deutschlandCurrentRefRequest = fetch(`${apiUrl}?startDate=${startDateString}&endDate=${endDateString}&dateField=Refdatum&currentCases=true`)
      .then(response => response.json())
      .catch(logError);

    const [deutschlandCasesRef, deutschlandCurrentRef] = await Promise.all([deutschlandCasesRefRequest, deutschlandCurrentRefRequest]);

    const deutschlandIndicatorsChart = new AreaChart({
      target: '#deutschland-indicators-chart',
      data: deutschlandCurrentRef,
      meta: {
        title: 'Corona in Deutschland',
        description: 'Entwicklung der wichtigsten Indikatoren nach Erkrankungsdatum',
        author: 'BR',
        source: 'Robert Koch-Institut, BR-Analyse',
        date: endDate
      }
    });

    charts.push(deutschlandIndicatorsChart);

    const deutschlandCasesChart = new BarChart({
      target: '#deutschland-cases-chart',
      data: deutschlandCasesRef,
      meta: {
        title: 'Neue Coronafälle in Deutschland',
        description: 'Entwicklung der Neuinfektionen nach Erkrankungsdatum',
        author: 'BR',
        source: 'Robert Koch-Institut, BR-Analyse',
        date: endDate
      }
    });

    charts.push(deutschlandCasesChart);
  })();

  // Text for German federal states (Bundesländer)
  (async function () {
    const deutschlandBlCasesRequest = fetch(`${apiUrl}?startDate=${startDateString}&endDate=${endDateString}&newCases=true&group=Bundesland`)
      .then(response => response.json())
      .catch(logError);

    const deutschlandBlDeathsRequest = fetch(`${apiUrl}?startDate=${startDateString}&endDate=${endDateString}&newCases=true&group=Bundesland&sumField=AnzahlTodesfall`)
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

  // Text and map for German counties (Landkreise)
  (async function () {
    const deutschlandLkrCases = await fetch(`${apiUrl}?startDate=${previousTwoWeeksDateString}&endDate=${endDateString}&group=Landkreis`)
      .then(response => response.json())
      .catch(logError);

    const deutschlandMap = new DeutschlandMap({
      target: '#deutschland-cases-map',
      caseData: deutschlandLkrCases,
      metaData: deutschlandLkrMeta,
      geoData: deutschlandLkrGeo,
      labelData: deutschlandBlMeta,
      meta: {
        title: '7-Tage-Inzidenz in Deutschland',
        description: 'Neuinfektionen pro 100.000 Einwohner in den letzten sieben Tagen',
        author: 'BR',
        source: 'Robert Koch-Institut, BR-Analyse',
        date: endDate
      }
    });

    charts.push(deutschlandMap);

    deutschlandLkrText.init({
      summaryTarget: '#deutschland-lkr-summary-text',
      detailTarget: '#deutschland-lkr-detail-text',
      caseData: deutschlandLkrCases,
      metaData: deutschlandLkrMeta,
      metaDataStates: deutschlandBlMeta
    });
  })();

  // Text and chart for intensive care patients in Germany
  (async function () {
    const deutschlandPatients = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/diviApi/query?area=DE&indicator=Patienten')
      .then(response => response.json())
      .catch(logError);

    deutschlandPatientsText.init({
      target: '#deutschland-patients-text',
      patientData: deutschlandPatients,
      metaData: deutschlandMeta
    });

    const deutschlandPatientsChart = new LineChart({
      target: '#deutschland-patients-chart',
      data: deutschlandPatients,
      meta: {
        title: 'Intensivpatienten in Deutschland',
        description: 'Anzahl der gemeldeten Corona-Fälle in intensivmedizinischer Behandlung',
        author: 'BR',
        source: 'DIVI-Intensivregister',
        date: endDate
      }
    });

    charts.push(deutschlandPatientsChart);
  })();


  // Text and chart for vaccinations in Bavaria
  (async function () {
    const deutschlandVaccinations = await fetch('https://raw.githubusercontent.com/ard-data/2020-rki-impf-archive/master/data/9_csv_v2/region_DE.csv')
      .then(response => response.text())
      .catch(logError);

    deutschlandVaccinationsText.init({
      target: '#deutschland-vaccinations-text',
      data: csvToJson(deutschlandVaccinations)
    });

    const deutschlandVaccinationsChart = new SimpleChart({
      target: '#deutschland-vaccinations-chart',
      data: csvToJson(deutschlandVaccinations),
      meta: {
        title: 'Corona-Impfungen in Deutschland',
        description: 'Prozentualer Anteil der geimpften Personen an der Bevölkerung',
        author: 'BR',
        source: 'Robert Koch-Institut',
        date: endDate
      }
    });

    charts.push(deutschlandVaccinationsChart);
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
