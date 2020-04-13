import '../styles/index.scss';

import 'intersection-observer';

import * as lazyload from './components/lazyload';
import * as marginals from './components/marginals';
import * as navigation from './components/navigation';
import * as analytics from './components/analytics/analytics';

import Chart from './custom/chart/chart';
import chartData from './custom/chart/chart-data.json';

let chart;

window.addEventListener('load', init);

function init() {
  lazyload
    .init('.lazyload', {
      rootMargin: '300px 0px 300px 0px',
      threshold: 0
    })
    .observe();

  navigation.init();
  marginals.init();

  chart = new Chart({
    target: '#chart',
    data: chartData
  });

  analytics.init({
    serviceUrl: 'https://ddj.br.de/analytics/track',
    projectId: 'test',
    tracker: {
      client: true,
      click: true,
      observer: true,
      timer: true,
      custom: true
    },
    respectDoNotTrack: false,
    debug: false
  });

  resize();
}

function resize() {
  let timeout;

  window.onresize = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      marginals.update();
      chart.update();
    }, 200);
  };
}
