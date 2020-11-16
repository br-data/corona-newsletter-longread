import { select } from 'd3-selection';
import { max, min } from 'd3-array';
import { scaleLinear, scaleBand } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';
import { axisRight, axisBottom } from 'd3-axis';
import { sma } from '../utils';

import { pretty, germanDate, germanDateShort, dateRange } from '../utils';

const defaults = {
  target: '#bar-chart',
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
    const container = select(target);

    // Set initial dimensions
    const width = container.node().getBoundingClientRect().width;
    const height = (width * 9) / 16;

    // Set drawing dimensions
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Calculate horizontal scale and axis
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
    
    // Calculate vertical scale and axis
    const yMax = max(data, d => d.value);

    const y = scaleLinear()
      .domain([0, yMax * 1.1])
      .range([innerHeight, 0]);

    // Add SVG and set dimensions
    const svg = container.append('svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('preserveAspectRatio', 'xMidYMid')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('id', `${target.replace('#', '')}-${meta.date.toISOString().split('T')[0]}`)
      .style('width', '100%');

    // Add background element and apply definition
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#radial-gradient)');

    const xAxis = axisBottom(x)
      .tickValues(xTicks)
      .tickFormat(d => germanDateShort(d));

    const yAxis = axisRight(y)
      .tickSize(width - margin.left - margin.right)
      .tickFormat(d => pretty(d))
      .ticks(3);

    // Add axes
    const axes = svg.append('g')
      .classed('axes', true)
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    axes.append('g')
      .call(yAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line')
        .attr('stroke', '#6d7182')
      )
      .call(g => g.selectAll('.tick text')
        .attr('x', 0)
        .attr('dy', -5)
        .attr('font-family', '"Open Sans", sans-serif')
        .attr('font-size', 14)
        .attr('font-weight', 300)
        .attr('fill', '#ffffff')
      );

    axes.append('g')
      .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
      .call(xAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').remove())
      .call(g => g.selectAll('.tick text')
        .attr('dy', 8)
        .attr('font-family', '"Open Sans", sans-serif')
        .attr('font-size', 14)
        .attr('font-weight', 300)
        .attr('fill', '#ffffff')
      );

    // Draw bars
    svg.append('g')
      .classed('bars', true)
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.date))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.value))
      // .attr('shape-rendering', 'crispEdges')
      .attr('fill', '#0b9fd8');

    // Draw line
    const lineConstructor = line()
      .x(d => x(d.date) + (x.bandwidth() / 2))
      .y(d => y(d.value))
      .curve(curveMonotoneX);

    svg.append('g')
      .classed('line', true)
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .append('path')
      .attr('d', lineConstructor(sma(data, 7, 'value')))
      .attr('fill', 'none')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', [10, 10])
      .attr('stroke-linecap', 'round');

    // Add title and description
    const header = svg.append('g')
      .classed('header', true)
      .attr('transform', `translate(${margin.left}, 40)`);

    header.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('font-family', '"Open Sans", sans-serif')
      .attr('font-size', 24)
      .attr('font-weight', 600)
      .attr('fill', '#ffffff')
      .text(meta.title);

    header.append('text')
      .attr('x', 0)
      .attr('y', 25)
      .attr('font-family', '"Open Sans", sans-serif')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#9fa3b3')
      .text(meta.description);

    // Add key
    const spacing = 155;

    const key = svg.append('g')
      .classed('key', true)
      .attr('transform', `translate(${margin.left}, 90)`);
    
    key.append('rect')
      .attr('x', 0 * spacing)
      .attr('y', 2)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', '#0b9fd8');

    key.append('text')
      .attr('x', (0 * spacing) + 20)
      .attr('dominant-baseline', 'hanging')
      .attr('font-family', '"Open Sans", sans-serif')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .text('Neuinfektionen');

    key.append('path')
      .attr('d', `M ${1 * spacing} 8 L ${(1 * spacing) + 30} 8`)
      .attr('fill', 'none')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', [5, 5])
      .attr('stroke-linecap', 'round');

    key.append('text')
      .attr('x', (1 * spacing) + 35)
      .attr('dominant-baseline', 'hanging')
      .attr('font-family', '"Open Sans", sans-serif')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .text('7-Tage-Mittelwert');

    // Add author and source
    const footer = svg.append('g')
      .classed('footer', true)
      .attr('transform', `translate(${margin.left}, ${height - 25})`);

    footer.append('text')
      .attr('font-family', '"Open Sans", sans-serif')
      .attr('font-size', 14)
      .attr('font-weight', 300)
      .attr('fill', '#9fa3b3')
      .text(`Grafik: ${meta.author}, Daten: ${meta.source} (Stand: ${germanDate(meta.date)})`);
  }

  update() {
    select(this.target).html('');
    this.draw();
  }
}
