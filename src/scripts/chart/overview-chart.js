import { select } from 'd3-selection';
import { max, min } from 'd3-array';
import { scaleLinear, scaleBand } from 'd3-scale';
import { area, curveMonotoneX } from 'd3-shape';
import { axisRight, axisBottom } from 'd3-axis';

import { pretty, germanDate, germanDateShort, dateRange } from '../utils';

const defaults = {
  target: '#area-chart',
  margin: { top: 130, right: 25, bottom: 75, left: 25 }
};

export default class OverviewChart {

  constructor(config) {
    this.set(config);
    this.draw();
  }

  set(config) {
    Object.assign(this, defaults, config);
  }

  draw() {
    const { target, cases, meta, margin } = this;
    const container = select(target);

    // Set initial dimensions
    const width = container.node().getBoundingClientRect().width;
    const height = (width * 9) / 16;

    // Set drawing dimensions
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Calculate horizontal scale and axis
    const xMin = min(cases, d => d.meldedatum);
    const xMinBracket = new Date(xMin);
    xMinBracket.setDate(xMinBracket.getDate() - 8);

    const xMax = max(cases, d => d.meldedatum);
    const xMaxBracket = new Date(xMax);
    xMaxBracket.setDate(xMaxBracket.getDate() + 8);

    const xValues = dateRange(xMinBracket, xMaxBracket, 1);
    const xTicks = dateRange(xMin, xMax, Math.floor(cases.length / 6));

    const x = scaleBand()
      .paddingOuter(0)
      .paddingInner(.4)
      .domain(xValues)
      .range([0, innerWidth]);

    const xAxis = axisBottom(x)
      .tickValues(xTicks)
      .tickFormat(d => germanDateShort(d));
    
    // Calculate vertical scale and axis
    const yMax = max(cases, d => d.aktuellInfiziert + d.aktuellGenesen);

    const y = scaleLinear()
      .domain([0, yMax * 1.1])
      .range([innerHeight, 0]);

    const yAxis = axisRight(y)
      .tickSize(innerWidth)
      .tickFormat(d => pretty(d))
      .ticks(3);

    // Add SVG and set dimensions
    const svg = container.append('svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('preserveAspectRatio', 'xMidYMid')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('id', `${target.replace('#', '')}-${meta.date.toISOString().split('T')[0]}`)
      .style('width', '100%');

    // Add background definition
    const defs = svg.append('defs');

    const radialGradient = defs.append('radialGradient')
      .attr('id', 'radial-gradient');

    radialGradient.append('stop')
      .attr('offset', '.25')
      .attr('stop-color', '#484B5A');

    radialGradient.append('stop')
      .attr('offset', '1')
      .attr('stop-color', '#1D2029');
   
    // Add background element and apply definition
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#radial-gradient)');

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
      .attr('transform', `translate(0, ${innerHeight})`)
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

    // Add area plot
    const areas = svg.append('g')
      .classed('areas', true)
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const recoveredCasesArea = area()
      .x(d => x(d.meldedatum))
      .y0(d => y(d.aktuellInfiziert + d.summeTodesfall))
      .y1(d => y(d.aktuellGenesen + d.aktuellInfiziert + d.summeTodesfall))
      .curve(curveMonotoneX);

    areas.append('path')
      .datum(cases)
      .attr('d', recoveredCasesArea)
      .attr('fill', '#3ad29f');

    const activeCasesArea = area()
      .x(d => x(d.meldedatum))
      .y0(d => y(d.summeTodesfall) + 1)
      .y1(d => y(d.aktuellInfiziert + d.summeTodesfall) - 1)
      .curve(curveMonotoneX);

    areas.append('path')
      .datum(cases)
      .attr('d', activeCasesArea)
      .attr('fill', '#0b9fd8');

    const deathsArea = area()
      .x(d => x(d.meldedatum))
      .y0(y(0))
      .y1(d => y(d.summeTodesfall))
      .curve(curveMonotoneX);

    areas.append('path')
      .datum(cases)
      .attr('d', deathsArea)
      .attr('fill', '#fbb800');

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
    const spacing = 105;

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
      .text('Erkrankte');

    key.append('rect')
      .attr('x', 1 * spacing)
      .attr('y', 2)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', '#3ad29f');

    key.append('text')
      .attr('x', (1 * spacing) + 20)
      .attr('dominant-baseline', 'hanging')
      .attr('font-family', '"Open Sans", sans-serif')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .text('Genesene');

    key.append('rect')
      .attr('x', 2 * spacing)
      .attr('y', 2)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', '#fbb800');

    key.append('text')
      .attr('x', (2 * spacing) + 20)
      .attr('dominant-baseline', 'hanging')
      .attr('font-family', '"Open Sans", sans-serif')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .text('Todesfälle');

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
