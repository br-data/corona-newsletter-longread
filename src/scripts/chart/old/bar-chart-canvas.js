import { select, create } from 'd3-selection';
import { max, min } from 'd3-array';
import { scaleLinear, scaleBand } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';
import { sma } from '../utils';

import { pretty, germanDate, germanDateShort, dateRange, getRetinaRatio } from '../utils';

const defaults = {
  target: '#bar-chart-canvas',
  margin: { top: 130, right: 25, bottom: 75, left: 25 }
};

export default class BarChart {

  constructor(config) {
    this.set(config);
    this.draw();
  }

  set(config) {
    Object.assign(this, defaults, config);
  }

  draw() {
    const { target, data, meta, margin } = this;
    const caseDataAverage = sma(data.slice(0, data.length - 2), 7, 'value');
    const container = select(target);
    const ratio = getRetinaRatio();

    // Set initial dimensions
    const width = container.node().getBoundingClientRect().width;
    const height = (width * 9) / 16;

    // Set drawing dimensions
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Calculate horizontal scale
    const xMin = min(data, d => new Date(d.date));
    const xMinBracket = new Date(xMin);
    xMinBracket.setDate(xMinBracket.getDate() - 8);

    const xMax = max(data, d => new Date(d.date));
    const xMaxBracket = new Date(xMax);
    xMaxBracket.setDate(xMaxBracket.getDate() + 8);

    const xValues = dateRange(xMinBracket, xMaxBracket, 1);
    const xTicks = dateRange(xMin, xMax, Math.floor(data.length / 6));

    const x = scaleBand()
      .paddingOuter(0)
      .paddingInner(.4)
      .domain(xValues)
      .range([0, innerWidth]);
    
    // Calculate vertical scale
    const yMax = max(data, d => d.value);

    const y = scaleLinear()
      .domain([0, yMax * 1.1])
      .range([innerHeight, 0]);

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

    // Draw x axis
    context.textAlign = 'center';
    context.textBaseline = 'top';
    xTicks.forEach(d => {
      context.fillStyle = '#ffffff';
      context.fillText(germanDateShort(d), x(d) + x.bandwidth() / 2, innerHeight + 5);
    });

    // Draw y axis
    context.beginPath();
    context.lineWidth = 1;
    y.ticks(3).forEach(d => {
      context.moveTo(0, y(d));
      context.lineTo(innerWidth, y(d));
    });
    context.strokeStyle = '#6d7182';
    context.stroke();

    context.textAlign = 'left';
    context.textBaseline = 'bottom';
    y.ticks(3).forEach(d => {
      context.fillStyle = '#ffffff';
      context.fillText(pretty(d), 0, y(d) - 2);
    });

    // Draw bars
    context.fillStyle = '#0b9fd8';
    data.forEach(d => {
      context.fillRect(x(d.date), y(d.value), x.bandwidth(), innerHeight - y(d.value));
    });

    // Draw line
    const lineConstructor = line()
      .x(d => x(d.date) + (x.bandwidth() / 2))
      .y(d => y(d.value))
      .curve(curveMonotoneX)
      .context(context);

    context.setLineDash([10, 10]);
    context.beginPath();
    context.lineCap = 'round';
    lineConstructor(caseDataAverage);
    context.lineWidth = 3;
    context.strokeStyle = '#ffffff';
    context.stroke();

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

    // Add key
    context.beginPath();
    context.rect(0, -margin.top + 85, 11, 11);
    context.fillStyle = '#0b9fd8';
    context.fill();

    context.font = '300 15px "Open Sans", OpenSans, Arial';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillStyle = '#ffffff';
    context.fillText('Neuinfektionen', 18, -margin.top + 85);

    context.setLineDash([5, 5]);
    context.beginPath();
    context.moveTo(145, -margin.top + 91);
    context.lineTo(175, -margin.top + 91);
    context.lineCap = 'round';
    context.lineWidth = 3;
    context.stroke();

    context.font = '300 15px "Open Sans", OpenSans, Arial';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillStyle = '#ffffff';
    context.fillText('7-Tage-Mittelwert', 180, -margin.top + 85);

    // Add author and source
    context.font = '300 14px "Open Sans", OpenSans, Arial';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillStyle = '#9fa3b3';
    context.fillText(`Grafik: ${meta.author}, Daten: ${meta.source} (Stand: ${germanDate(meta.date)})`, 0, innerHeight + 40);

    // Scale canvas by pixel density
    context.scale(1, 1);

    // Create image from canvas and append it to the DOM
    container.append('img')
      .attr('src', canvas.toDataURL())
      .attr('title', meta.title)
      .attr('alt', `${meta.title}: ${meta.description}`);
  }

  update() {
    select(this.target).html('');
    this.draw();
  }
}
