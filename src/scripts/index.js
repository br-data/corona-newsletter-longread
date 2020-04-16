import '../styles/index.scss';

import * as lazyload from './components/lazyload';
import * as marginals from './components/marginals';
import * as navigation from './components/navigation';

import * as bayernText from './custom/bayern-text';
import * as bayernRegbezText from './custom/bayern-regbez-text';
import * as bayernLkrText from './custom/bayern-lkr-text';

import * as bayernRegbezTable from './custom/bayern-regbez-table';

import * as deutschlandText from './custom/deutschland-text';
import * as deutschlandBlText from './custom/deutschland-bl-text';

// Mock data for testing
import bayernCases from './data/cases/bayern-cases.json';
import bayernDeaths from './data/deaths/bayern-deaths.json';

import bayernRegbezCases from './data/cases/bayern-regbez-cases.json';
import bayernRegbezDeaths from './data/deaths/bayern-regbez-deaths.json';

import bayernLkrCases from './data/cases/bayern-lkr-cases.json';
import bayernLkrDeaths from './data/deaths/bayern-lkr-deaths.json';

import deutschlandCases from './data/cases/deutschland-cases.json';
import deutschlandDeaths from './data/deaths/deutschland-deaths.json';

import deutschlandBlCases from './data/cases/deutschland-bl-cases.json';
import deutschlandBlDeaths from './data/deaths/deutschland-bl-deaths.json';

// import Chart from './custom/chart/chart';
// import chartData from './custom/chart/chart-data.json';
// let chart;

window.addEventListener('load', init);

async function init() {

  // const bayernCases = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12&group=Bundesland&bundesland=Bayern').then((response) => { return response.json(); });

  // const bayernDeaths = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12&group=Bundesland&bundesland=Bayern&sumField=AnzahlTodesfall').then((response) => { return response.json(); });

  bayernText.init({
    selector: '#bayern-text',
    caseData: bayernCases,
    deathData: bayernDeaths
  });

  // const bayernRegbezCases = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12&group=Regierungsbezirk&bundesland=Bayern').then((response) => { return response.json(); });

  // const bayernRegbezDeaths = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12&group=Regierungsbezirk&bundesland=Bayern&sumField=AnzahlTodesfall').then((response) => { return response.json(); });

  bayernRegbezTable.init({
    selector: '#bayern-regbez-table',
    caseData: bayernRegbezCases,
    deathData: bayernRegbezDeaths
  });

  bayernRegbezText.init({
    selector: '#bayern-regbez-text',
    caseData: bayernRegbezCases,
    deathData: bayernRegbezDeaths
  });

  // const bayernLkrCases = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12&group=Landkreis&bundesland=Bayern').then((response) => { return response.json(); });

  // const bayernLkrDeaths = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12&group=Landkreis&bundesland=Bayern&sumField=AnzahlTodesfall').then((response) => { return response.json(); });

  bayernLkrText.init({
    selector: '#bayern-lkr-text',
    caseData: bayernLkrCases,
    deathData: bayernLkrDeaths
  });

  // const deutschlandCases = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12').then((response) => { return response.json(); });

  // const deutschlandDeaths = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12&sumField=AnzahlTodesfall').then((response) => { return response.json(); });

  deutschlandText.init({
    selector: '#deutschland-text',
    caseData: deutschlandCases,
    deathData: deutschlandDeaths
  });

  // const deutschlandBlCases = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12&endDate=2020-04-13&group=Bundesland').then((response) => { return response.json(); });

  // const deutschlandBlDeaths = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12&endDate=2020-04-13&group=Bundesland&sumField=AnzahlTodesfall').then((response) => { return response.json(); });

  deutschlandBlText.init({
    selector: '#deutschland-bl-text',
    caseData: deutschlandBlCases,
    deathData: deutschlandBlDeaths
  });

  lazyload
    .init('.lazyload', {
      rootMargin: '300px 0px 300px 0px',
      threshold: 0
    })
    .observe();

  navigation.init();
  marginals.init();

  // chart = new Chart({
  //   target: '#chart',
  //   data: chartData
  // });

  // resize();
}

// function resize() {
//   let timeout;

//   window.onresize = () => {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => {
//       marginals.update();
//       chart.update();
//     }, 200);
//   };
// }
