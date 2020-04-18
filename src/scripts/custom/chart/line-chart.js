import { select } from 'd3-selection';
import { max } from 'd3-array';
import { scaleLinear, scaleTime } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';

const defaults = {
  selector: '#chart',
  height: 300,
  margin: { top: 10, right: 10, bottom: 30, left: 50 },
  tickCount: 5,
  tickSize: 6,
  tickPadding: 3
};

export default class LineChart {

  constructor(config) {
    this.set(config);
    this.draw();
  }

  set(config) {
    Object.assign(this, defaults, config);
  }

  draw() {
    const { selector, data, height, margin, tickCount, tickSize, tickPadding } = this;
    const container = select(selector);
    const ratio = getRetinaRatio();

    // Set initial dimensions
    let width = container.node().getBoundingClientRect().width;

    // Create canvas context
    const context = container
      .append('canvas')
      .attr('width', width * ratio)
      .attr('height', height * ratio)
      .style('width', `${width}px`)
      .style('height', `${height}px`)
      .node()
      .getContext('2d');

    // Scale canvas by retina ratio
    context.scale(ratio, ratio);

    // Set drawing dimensions
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xMax = max(data, d => new Date(d.Meldedatum));
    const yMax = max(data, d => d.sumValue);

    const x = scaleTime()
      .domain([new Date('2020-03-12'), xMax])
      .range([0, innerWidth]);

    const y = scaleLinear()
      .domain([0, yMax * 1.25])
      .range([innerHeight, 0]);

    const lineConstructor = line()
      .x(d => x(new Date(d.Meldedatum)))
      .y(d => y(d.sumValue))
      .curve(curveMonotoneX)
      .context(context);

    // Set up the canvas
    context.translate(margin.left, margin.top);
    context.font = '300 13px "Open Sans", OpenSans, Arial';

    // Draw line
    context.beginPath();
    lineConstructor(data);
    // lineConstructor([[new Date('2020-03-12'), 10000], [new Date('2020-04-12'), 20000]]);
    context.lineWidth = 3;
    context.strokeStyle = 'rgba(30,144,255,1)' ;
    context.stroke();

    // Draw x axis
    context.beginPath();
    context.lineWidth = 1;
    x.ticks(tickCount).forEach(d => {
      context.moveTo(x(d), innerHeight);
      context.lineTo(x(d), innerHeight + tickSize);
    });
    context.strokeStyle = 'black';
    context.stroke();

    context.textAlign = 'center';
    context.textBaseline = 'top';
    x.ticks(tickCount).forEach(d => {
      context.fillText(x.tickFormat()(d), x(d), innerHeight + tickSize);
    });

    // Draw y axis
    context.beginPath();
    context.lineWidth = 1;
    y.ticks(tickCount).forEach(d => {
      context.moveTo(0, y(d));
      context.lineTo(-6, y(d));
    });
    context.strokeStyle = 'black';
    context.stroke();

    context.textAlign = 'right';
    context.textBaseline = 'middle';
    y.ticks(tickCount).forEach(d => {
      const tickValue = d;
      context.fillText(tickValue, -tickSize - tickPadding, y(d));
    });

    // Draw dot for last value
    // const lastValue = data[data.length - 1].prices[0];
    // const lastX = x(new Date(lastValue.date));
    // const lastY = y(lastValue.price);

    // context.beginPath();
    // context.arc(lastX, lastY, 5, 0, 2 * Math.PI, false);
    // context.fillStyle = 'rgba(30,144,255,1)';
    // context.fill();

    // context.font = 'bold 14px Helvetica, Arial';
    // context.textAlign = 'right';
    // context.textBaseline = 'middle';
    // context.fillStyle = 'black';
    // context.fillText(`${Math.round(lastValue.price)} %`, lastX - 10, lastY);

    // Scale canvas by pixel density
    context.scale(1, 1);
  }

  update() {
    select('#bayern-chart').html('');
    this.draw();
  }
}

// http://bl.ocks.org/devgru/a9428ebd6e11353785f2
function getRetinaRatio() {
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
