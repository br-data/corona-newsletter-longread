import { select, create } from 'd3-selection';
import { max, min } from 'd3-array';
import { scaleLinear, scaleTime } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';

import { pretty, germanDate, germanDateShort } from '../utils';

const defaults = {
  target: '#line-chart',
  height: 420,
  margin: { top: 100, right: 25, bottom: 75, left: 25 }
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
    const { target, data, meta, height, margin } = this;
    const container = select(target);
    const ratio = getRetinaRatio();

    // Set initial dimensions
    let width = container.node().getBoundingClientRect().width;

    // Create canvas and context
    const canvas = create('canvas')
      .attr('width', width * ratio)
      .attr('height', height * ratio)
      .style('width', `${width}px`)
      .style('height', `${height}px`)
      .node();

    const context = canvas.getContext('2d');

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
    context.font = '300 14px "Open Sans", OpenSans, Arial';

    // Adjust for margins
    context.translate(margin.left, margin.top);

    // Set drawing dimensions
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xMax = max(data, d => new Date(d.date));
    const xMin = min(data, d => new Date(d.date));
    xMin.setDate(xMin.getDate() - 2);
    const yMax = max(data, d => d.sumValue);

    const x = scaleTime()
      .domain([xMin, xMax])
      .range([0, innerWidth]);

    const y = scaleLinear()
      .domain([0, yMax * 1.2])
      .range([innerHeight, 0]);

    const xTicks = dateRange(xMin, xMax, Math.floor(data.length / 6));

    // Draw x axis
    context.textAlign = 'center';
    context.textBaseline = 'top';
    xTicks.forEach(d => {
      context.fillStyle = '#ffffff';
      context.textAlign = 'right';
      context.fillText(germanDateShort(d), x(d), innerHeight + 5);
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
    context.textBaseline = 'bottom';
    y.ticks(5).forEach(d => {
      context.fillStyle = '#ffffff';
      context.fillText(pretty(d), 0, y(d) - 2);
    });

    // Draw line
    const lineConstructor = line()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.sumValue))
      .curve(curveMonotoneX)
      .context(context);

    context.beginPath();
    context.lineCap = 'round';
    lineConstructor(data);
    context.lineWidth = 4;
    context.strokeStyle = '#0b9fd8' ;
    context.stroke();

    // Draw dot for last value
    const lastValue = data[data.length - 1];
    const lastX = x(new Date(lastValue.date));
    const lastY = y(lastValue.sumValue);

    context.beginPath();
    context.arc(lastX, lastY, 5, 0, 2 * Math.PI, false);
    context.fillStyle = '#0b9fd8';
    context.fill();

    context.font = 'bold 15px "Open Sans", OpenSans, Arial';
    context.textAlign = 'right';
    context.textBaseline = 'bottom';
    context.fillStyle = '#ffffff';
    context.fillText(pretty(lastValue.sumValue), lastX + 5, lastY - 7);

    // Add title
    context.font = '600 24px "Open Sans", OpenSans, Arial';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillStyle = '#ffffff';
    context.fillText(meta.title, 0, -margin.top + 20);

    // Add description
    context.font = '300 15px "Open Sans", OpenSans, Arial';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillStyle = '#9fa3b3';
    context.fillText(meta.description, 0, -margin.top + 50);

    // Add author and source
    context.font = '300 14px "Open Sans", OpenSans, Arial';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillStyle = '#9fa3b3';
    context.fillText(`Grafik: ${meta.author}, Quelle: ${meta.source} (Stand: ${germanDate(meta.date)})`, 0, innerHeight + 40);

    // Scale canvas by pixel density
    context.scale(1, 1);

    // Create image from canvas and append it to the DOM
    container.append('img')
      .attr('src', canvas.toDataURL())
      .attr('alt', `${meta.title}: ${meta.description}`);
  }

  update() {
    select(this.target).html('');
    this.draw();
  }
}

function dateRange(startDate, endDate, steps) {
  const dateArray = [];
  const currentDate = new Date(endDate);

  while (currentDate >= new Date(startDate)) {
    dateArray.push(new Date(+currentDate));
    currentDate.setDate(currentDate.getDate() - steps);
  }

  return dateArray;
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
