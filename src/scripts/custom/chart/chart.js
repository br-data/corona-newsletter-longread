import { select } from 'd3-selection';
import { max } from 'd3-array';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';

const defaults = {
  target: '#chart',
  data: [],
  margin: { top: 20, right: 20, bottom: 35, left: 35 },
  color: '#0b9fd8'
};

export default class Chart {
  constructor(config) {
    this.set(config);
    this.draw();
  }

  set(config) {
    Object.assign(this, defaults, config);
  }

  draw() {
    const { data, target, margin, color } = this;
    const container = select(`${target}`).html('');
    const bounds = container.node().getBoundingClientRect();
    const width = bounds.width - margin.left - margin.right;
    const height = bounds.height - margin.top - margin.bottom;

    const x = scaleBand()
      .padding(0.2)
      .domain(data.map(d => d.key))
      .rangeRound([0, width]);

    const y = scaleLinear()
      .domain([0, max(data, d => d.value)])
      .rangeRound([height, 0]);

    const svg = container
      .append('svg')
      .attr('width', bounds.width)
      .attr('height', bounds.height);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${height})`)
      .call(
        axisBottom(x)
          .tickSize(0)
          .tickPadding(10)
      );

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(axisLeft(y).ticks(5));

    g.append('text')
      //.attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .attr('font-weight', 'bold')
      .text('Wert');

    const bars = g.selectAll('.bar').data(data);

    bars
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', (d, i) => i == 3 ? '#3ad29f' : color);

    bars
      .attr('x', d => x(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.value));

    bars.exit().remove();
  }

  pretty(number) {
    number = number.toString().split('.');
    number =
      number[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') +
      (number[1] ? ',' + number[1] : '');
    return number;
  }

  update() {
    this.draw();
  }
}
