import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisBottom } from 'd3-axis';

import { pretty, germanDate } from '../utils';

const defaults = {
  target: '#simple-chart',
  chartHeight: 230,
  barHeight: 25,
  margin: { top: 140, right: 25, bottom: 80, left: 25 }
};

export default class SimpleChart {

  constructor(config) {
    this.set(config);
    this.draw();
  }

  set(config) {
    Object.assign(this, defaults, config);
  }

  draw() {
    const { target, data, meta, chartHeight, barHeight, margin } = this;
    const currentData = data[data.length - 1];
    const container = select(target);
    
    // Set initial dimensions
    const width = container.node().getBoundingClientRect().width;
    // const height = (width * 1) / 4;
    const height = chartHeight;

    // Set drawing dimensions
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = scaleLinear()
      .domain([0, 100])
      .range([0, innerWidth]);

    const xAxis = axisBottom(x)
      .ticks(5)
      .tickFormat(d => `${d} %`);
    
    // Add SVG and set dimensions
    const svg = container.append('svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('preserveAspectRatio', 'xMidYMid')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('id', `${target.replace('#', '')}-${meta.date.toISOString().split('T')[0]}`)
      .style('width', '100%');

    // Add definition for background gradient
    const defs = svg.append('defs');

    const radialGradient = defs.append('radialGradient')
      .attr('id', 'radial-gradient');

    radialGradient.append('stop')
      .attr('offset', '.25')
      .attr('stop-color', '#484B5A');

    radialGradient.append('stop')
      .attr('offset', '1')
      .attr('stop-color', '#1D2029');

    // Add definition for immunity gradient
    const linearGradient = defs.append('linearGradient')
      .attr('id', 'linear-gradient');

    linearGradient.append('stop')
      .attr('offset', '.6')
      .attr('stop-color', '#6d7182')
      .attr('stop-opacity', '0');

    linearGradient.append('stop')
      .attr('offset', '1')
      .attr('stop-color', '#6d7182')
      .attr('stop-opacity', '1');

    const diagonalHatching = defs.append('pattern')
      .attr('id', 'diagonal-hatching')
      .attr('width', 4)
      .attr('height', 4)
      .attr('patternUnits', 'userSpaceOnUse');

    diagonalHatching.append('path')
      .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
      .attr('stroke', '#3ad29f')
      .attr('stop-opacity', '0');
   
    // Add background element and apply gradient
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#radial-gradient)');

    // Add axes
    const axes = svg.append('g')
      .classed('axes', true)
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    axes.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').remove())
      .call(g => g.selectAll('.tick text')
        .attr('dy', 8)
        .attr('dx', d => d === 0 ? 11 : (d === 100 ? -19 : 0))
        .attr('font-family', '"Open Sans", sans-serif')
        .attr('font-size', 14)
        .attr('font-weight', 300)
        .attr('fill', '#ffffff')
      );

    // Add bars
    const bars = svg.append('g')
      .classed('bars', true)
      .attr('transform', `translate(${margin.left}, ${height - margin.bottom - 27})`);

    // Population
    bars.append('rect')
      .attr('width', x(100))
      .attr('height', barHeight)
      .attr('stroke', '#6d7182')
      .attr('stroke-width', 1)
      .attr('fill', 'url(#linear-gradient)');

    // First dose
    bars.append('rect')
      .attr('width', x(currentData['impf_quote_erst']))
      .attr('height', barHeight)
      .attr('fill', 'url(#diagonal-hatching)')
      .append('title')
      .text(`${pretty(currentData['personen_erst_kumulativ'])} (${pretty(currentData['impf_quote_erst'])} %)`);
    
    // Second dose
    bars.append('rect')
      .attr('width', x(currentData['impf_quote_voll']))
      .attr('height', barHeight)
      .attr('fill', '#3ad29f')
      .append('title')
      .text(`${pretty(currentData['personen_voll_kumulativ'])} (${pretty(currentData['impf_quote_voll'])} %)`);

    // Add label for herd immunity
    bars.append('text')
      .attr('x', x(100))
      .attr('y', 17)
      .attr('dx', -7)
      .attr('text-anchor', 'end')
      .attr('font-family', '"Open Sans", sans-serif')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .text('Herdenimmunität erreicht');

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
    const spacing = 190;

    const key = svg.append('g')
      .classed('key', true)
      .attr('transform', `translate(${margin.left}, 90)`);
    
    key.append('rect')
      .attr('x', 1 + 0 * spacing)
      .attr('y', 2)
      .attr('width', 12)
      .attr('height', 12)
      .attr('stroke', '#6d7182')
      .attr('stroke-width', 1)
      .attr('fill', 'none');

    key.append('text')
      .attr('x', (0 * spacing) + 20)
      .attr('dominant-baseline', 'hanging')
      .attr('font-family', '"Open Sans", sans-serif')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .text('Gesamtbevölkerung');
    
    key.append('rect')
      .attr('x', 1 * spacing)
      .attr('y', 2)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', 'url(#diagonal-hatching)');

    key.append('text')
      .attr('x', (1 * spacing) + 20)
      .attr('dominant-baseline', 'hanging')
      .attr('font-family', '"Open Sans", sans-serif')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .text('Erstimpfung erhalten');
    
    key.append('rect')
      .attr('x', 2 * spacing)
      .attr('y', 2)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', '#3ad29f');

    key.append('text')
      .attr('x', (2 * spacing) + 20)
      .attr('dominant-baseline', 'hanging')
      .attr('font-family', '"Open Sans", sans-serif')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .text('Zweitimpfung erhalten');

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
