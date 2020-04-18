import { select } from 'd3-selection';
import { max } from 'd3-array';
import { scaleLinear, scaleTime } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';

import { pretty } from '../utils';

const defaults = {
  selector: '#chart',
  height: 350,
  margin: { top: 5, right: 20, bottom: 30, left: 20 }
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
    const { selector, data, height, margin } = this;
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

    // Draw background gradient
    const gradient = context.createRadialGradient(
      width / 2,
      height / 2,
      height / 4,
      width / 2,
      height / 2,
      height
    );

    gradient.addColorStop(0, '#484B5A');
    gradient.addColorStop(1, '#1D2029');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    // Set canvas default font
    context.font = '300 15px "Open Sans", OpenSans, Arial';

    // Adjust for margins
    context.translate(margin.left, margin.top);

    // Set drawing dimensions
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xMax = max(data, d => new Date(d.Meldedatum));
    const yMax = max(data, d => d.sumValue);

    const x = scaleTime()
      .domain([new Date('2020-03-11'), xMax])
      .range([0, innerWidth]);

    const y = scaleLinear()
      .domain([0, yMax * 1.25])
      .range([innerHeight, 0]);


    // Draw x axis
    context.textAlign = 'center';
    context.textBaseline = 'top';
    x.ticks(5).forEach(d => {
      const options = {  month: 'numeric', day: 'numeric' };
      const tickValue = d.toLocaleDateString('de-DE', options);
      context.fillStyle = '#FFFFFF';
      context.fillText(tickValue, x(d), innerHeight + 5);
    });

    // Draw y axis
    context.beginPath();
    context.lineWidth = 1;
    y.ticks(5).forEach(d => {
      context.moveTo(0, y(d));
      context.lineTo(innerWidth, y(d));
    });
    context.strokeStyle = '#6d7182';
    context.stroke();

    context.textAlign = 'left';
    context.textBaseline = 'top';
    y.ticks(5).forEach(d => {
      context.fillStyle = '#FFFFFF';
      context.fillText(pretty(d), 0, y(d) + 5);
    });

    // Draw line
    const lineConstructor = line()
      .x(d => x(new Date(d.Meldedatum)))
      .y(d => y(d.sumValue))
      .curve(curveMonotoneX)
      .context(context);

    context.beginPath();
    lineConstructor(data);
    context.lineWidth = 4;
    context.strokeStyle = '#0b9fd8' ;
    context.stroke();

    // Draw dot for last value
    const lastValue = data[data.length - 1];
    const lastX = x(new Date(lastValue.Meldedatum));
    const lastY = y(lastValue.sumValue);

    context.beginPath();
    context.arc(lastX, lastY, 5, 0, 2 * Math.PI, false);
    context.fillStyle = '#0b9fd8';
    context.fill();

    context.font = 'bold 15px "Open Sans", OpenSans, Arial';
    context.textAlign = 'right';
    context.textBaseline = 'middle';
    context.fillStyle = '#FFFFFF';
    context.fillText(pretty(lastValue.sumValue), lastX + 5, lastY - 15);

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
