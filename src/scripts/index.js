import '../styles/index.scss';

import 'intersection-observer';

import * as lazyload from './components/lazyload';
import * as marginals from './components/marginals';
import * as navigation from './components/navigation';

import * as bayernText from './custom/bayern-text';
import * as bayernRegierungsbezirkeText from './custom/bayern-regbez-text';
import * as bayernLandkreiseText from './custom/bayern-lkr-text';

import * as bayernRegierungsbezirkeTable from './custom/bayern-regbez-table';

// Mock data for testing
import bayernData from './data/bayern.json';
import bayernRegierungsbezirkeData from './data/bayern-regbez.json';
import bayernLandkreiseData from './data/bayern-lkr.json';

// import Chart from './custom/chart/chart';
// import chartData from './custom/chart/chart-data.json';
// let chart;

window.addEventListener('load', init);

async function init() {

  // const bayernData = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12&group=Bundesland&bundesland=Bayern').then((response) => { return response.json(); });

  bayernText.init({
    selector: '#bayern-text',
    data: bayernData
  });

  // const bayernRegierungsbezirkeData = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12&group=Regierungsbezirk&bundesland=Bayern').then((response) => { return response.json(); });

  bayernRegierungsbezirkeTable.init({
    selector: '#bayern-regbez-table',
    data: bayernRegierungsbezirkeData
  });

  bayernRegierungsbezirkeText.init({
    selector: '#bayern-regbez-text',
    data: bayernRegierungsbezirkeData
  });

  // const bayernLandkreiseData = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?group=Landkreis&bundesland=Bayern').then((response) => { return response.json(); });

  bayernLandkreiseText.init({
    selector: '#bayern-lkr-text',
    data: bayernLandkreiseData
  });

  // const deutschlandData = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12');

  // const regBezData = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12&group=Regierungsbezirk&bundesland=Bayern');

  // const landkreisData = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/lglApi/date');

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
