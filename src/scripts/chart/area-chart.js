import { select, create } from 'd3-selection';
import { max, min } from 'd3-array';
import { scaleLinear, scaleBand } from 'd3-scale';
import { area, curveMonotoneX } from 'd3-shape';

import { pretty, germanDate, germanDateShort, dateRange, getRetinaRatio } from '../utils';

const defaults = {
  target: '#line-chart',
  margin: { top: 130, right: 25, bottom: 75, left: 25 }
};

export default class AreaChart {

  constructor(config) {
    config.recoveredData = config.recoveredData.map((d, i) => {
      return Object.assign({}, d, {
        sumValue: d.sumValue + config.deathData[i].sumValue
      });
    });

    this.set(config);
    this.draw();
  }

  set(config) {
    Object.assign(this, defaults, config);
  }

  draw() {
    const { target, caseData, recoveredData, deathData, meta, margin } = this;
    const container = select(target);
    const ratio = getRetinaRatio();

    // Set initial dimensions
    const width = container.node().getBoundingClientRect().width;
    const height = (width * 9) / 16;

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

    const xMax = max(caseData, d => new Date(d.date));
    const xMin = min(caseData, d => new Date(d.date));
    xMin.setDate(xMin.getDate() - 2);
    const yMax = max(caseData, d => d.sumValue);

    const x = scaleBand()
      .padding(0.2)
      .align(0.9)
      .domain(caseData.map(d => d.date))
      .rangeRound([0, innerWidth]);

    const y = scaleLinear()
      .domain([0, yMax * 1.1])
      .range([innerHeight, 0]);

    const xTicks = dateRange(xMin, xMax, Math.floor(caseData.length / 6));

    // Draw x axis
    context.textAlign = 'center';
    context.textBaseline = 'top';
    xTicks.forEach(d => {
      context.fillStyle = '#ffffff';
      context.textAlign = 'right';
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

    // Draw areas
    const areaConstructor = area()
      .x(d => x(d.date))
      .y0(y(0))
      .y1(d => y(d.sumValue))
      .curve(curveMonotoneX)
      .context(context);

    context.beginPath();
    areaConstructor(caseData);
    context.fillStyle = '#0b9fd8';
    context.fill();

    context.beginPath();
    areaConstructor(recoveredData);
    context.fillStyle = '#3ad29f';
    context.fill();

    context.beginPath();
    areaConstructor(deathData);
    context.fillStyle = '#fbb800';
    context.fill();

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
    const spacing = 120;

    context.beginPath();
    context.rect((0 * spacing), -margin.top + 85, 11, 11);
    context.fillStyle = '#0b9fd8';
    context.fill();

    context.font = '300 15px "Open Sans", OpenSans, Arial';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillStyle = '#ffffff';
    context.fillText('Infektionen', (0 * spacing) + 18, -margin.top + 85);

    context.beginPath();
    context.rect((1 * spacing), -margin.top + 85, 11, 11);
    context.fillStyle = '#3ad29f';
    context.fill();

    context.font = '300 15px "Open Sans", OpenSans, Arial';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillStyle = '#ffffff';
    context.fillText('Genesungen', (1 * spacing) + 18, -margin.top + 85);

    context.beginPath();
    context.rect((2 * spacing), -margin.top + 85, 11, 11);
    context.fillStyle = '#fbb800';
    context.fill();

    context.font = '300 15px "Open Sans", OpenSans, Arial';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillStyle = '#ffffff';
    context.fillText('Todesfälle', (2 * spacing) + 18, -margin.top + 85);

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
      .attr('title', meta.title)
      .attr('alt', `${meta.title}: ${meta.description}`);
  }

  update() {
    select(this.target).html('');
    this.draw();
  }
}
