import '../styles/index.scss';

import * as lazyload from './components/lazyload';
import * as marginals from './components/marginals';
import * as navigation from './components/navigation';

import * as bayernText from './custom/text/bayern-text';
import * as bayernRegbezText from './custom/text/bayern-regbez-text';
import * as bayernLkrText from './custom/text/bayern-lkr-text';

import LineChart from './custom/chart/line-chart';

import * as bayernRegbezTable from './custom/table/bayern-regbez-table';

import * as deutschlandText from './custom/text/deutschland-text';
import * as deutschlandBlText from './custom/text/deutschland-bl-text';

import * as deutschlandBlTable from './custom/table/deutschland-bl-table';

// Mock data for testing
import bayernCases from './custom/data/cases/bayern-cases.json';
import bayernDeaths from './custom/data/deaths/bayern-deaths.json';
import bayernMeta from './custom/data/meta/bayern-meta.json';

import bayernRegbezCases from './custom/data/cases/bayern-regbez-cases.json';
import bayernRegbezDeaths from './custom/data/deaths/bayern-regbez-deaths.json';
import bayernRegbezMeta from './custom/data/meta/bayern-regbez-meta.json';

import bayernLkrCases from './custom/data/cases/bayern-lkr-cases.json';
import bayernLkrDeaths from './custom/data/deaths/bayern-lkr-deaths.json';
import bayernLkrMeta from './custom/data/meta/bayern-lkr-meta.json';

import deutschlandCases from './custom/data/cases/deutschland-cases.json';
import deutschlandDeaths from './custom/data/deaths/deutschland-deaths.json';
import deutschlandMeta from './custom/data/meta/deutschland-meta.json';

import deutschlandBlCases from './custom/data/cases/deutschland-bl-cases.json';
import deutschlandBlDeaths from './custom/data/deaths/deutschland-bl-deaths.json';
import deutschlandBlMeta from './custom/data/meta/deutschland-bl-meta.json';

window.addEventListener('load', init);

async function init() {
  const charts = [];

  // const bayernCases = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12&group=Bundesland&bundesland=Bayern').then(response => response.json());

  // const bayernDeaths = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12&group=Bundesland&bundesland=Bayern&sumField=AnzahlTodesfall').then(response => response.json());

  bayernText.init({
    caseTarget: '#bayern-cases-text',
    deathTarget: '#bayern-deaths-text',
    caseData: bayernCases,
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
      source: 'Robert Koch-Institut'
    }
  });

  charts.push(bayernChart);

  // const bayernRegbezCases = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12&group=Regierungsbezirk&bundesland=Bayern').then(response => response.json());

  // const bayernRegbezDeaths = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12&group=Regierungsbezirk&bundesland=Bayern&sumField=AnzahlTodesfall').then(response => response.json());


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

  // const bayernLkrCases = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12&group=Landkreis&bundesland=Bayern').then(response => response.json());

  // const bayernLkrDeaths = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12&group=Landkreis&bundesland=Bayern&sumField=AnzahlTodesfall').then(response => response.json());

  bayernLkrText.init({
    target: '#bayern-lkr-text',
    caseData: bayernLkrCases,
    deathData: bayernLkrDeaths,
    metaData: bayernLkrMeta,
    metaDataDistricts: bayernRegbezMeta
  });

  // const deutschlandCases = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12').then(response => response.json());

  // const deutschlandDeaths = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12&sumField=AnzahlTodesfall').then(response => response.json());

  deutschlandText.init({
    caseTarget: '#deutschland-cases-text',
    deathTarget: '#deutschland-deaths-text',
    caseData: deutschlandCases,
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
      source: 'Robert Koch-Institut'
    }
  });

  charts.push(deutschlandChart);

  // const deutschlandBlCases = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12&group=Bundesland').then(response => response.json());

  // const deutschlandBlDeaths = await fetch('https://europe-west3-brdata-corona.cloudfunctions.net/rkiApi/query?startDate=2020-03-12&endDate=2020-04-13&group=Bundesland&sumField=AnzahlTodesfall').then(response => response.json());

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

  lazyload
    .init('.lazyload', {
      rootMargin: '300px 0px 300px 0px',
      threshold: 0
    })
    .observe();

  navigation.init();
  marginals.init();

  resize(charts);
}

function resize(charts) {
  let timeout;

  window.onresize = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      marginals.update();
      charts.forEach(chart => chart.update());
    }, 200);
  };
}
