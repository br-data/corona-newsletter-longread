import { select } from 'd3-selection';
import { geoPath, geoMercator } from 'd3-geo';
import { scaleSqrt } from 'd3-scale';

import { casesPer100Tsd7Days, germanDate } from '../utils';
import districts from '../data/meta/bayern-regbez-meta.json';

const defaults = {
  target: '#map'
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
    const { target, caseData, metaData, geoData, meta } = this;

    const uniqueCounties = [...new Set(caseData.map(d => d.Landkreis))];
    const mergedCounties = uniqueCounties.map(name => {
      const caseDataDistrict = caseData.filter(c => c.Landkreis === name);
      const metaInfoCounty = metaData.find(m => m.rkiName === name);
      return Object.assign(
        metaInfoCounty,
        { valuePer100Tsd: casesPer100Tsd7Days(caseDataDistrict, metaInfoCounty.pop) }
      );
    });
    const worstCounties = mergedCounties.filter(d => d.valuePer100Tsd >= 35);

    const capitals = districts.filter(district => worstCounties.find(county => county.district === district.name) === undefined);

    const container = select(target);
    container.select('svg.map').remove();

    const bounds = container.node().getBoundingClientRect();
    const width = bounds.width;
    const height = width;

    const scale = scaleSqrt()
      .domain([0, 150])
      .range([3, 20]);

    const projection = geoMercator()
      .translate([width/2, height/2])
      .scale(6300)
      .center([11.4, 49.15]);

    const path = geoPath().projection(projection);

    const svg = container.append('svg')
      .attr('class', 'map')
      .attr('width', width)
      .attr('height', height)
      // .attr('preserveAspectRatio', 'xMidYMid');
      .attr('viewBox', `0 0 ${width} ${height}`);

    const defs = svg.append('defs');

    const radialGradient = defs.append('radialGradient')
      .attr('id', 'radial-gradient');

    radialGradient.append('stop')
      .attr('offset', '.25')
      .attr('stop-color', '#484B5A');

    radialGradient.append('stop')
      .attr('offset', '1')
      .attr('stop-color', '#1D2029');

    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#radial-gradient)');

    const map = svg.append('g');

    map.append('path')
      .attr('d', path(geoData))
      .attr('fill', '#858999')
      .attr('stroke', '#383B47')
      .attr('stroke-width', 1.25);

    map.selectAll('circle')
      .data(mergedCounties, d => d.ags)
      .enter()
      .append('circle')
      .attr('r', d => d.valuePer100Tsd ? scale(d.valuePer100Tsd) : 0)
      .attr('cx', d => projection([d.long, d.lat])[0])
      .attr('cy', d => projection([d.long, d.lat])[1])
      .attr('fill', d => getColor(d.valuePer100Tsd));

    const capitalLabels = map.selectAll('.capitals')
      .data(capitals)
      .enter();

    capitalLabels.append('text')
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', 12)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .attr('stroke', '#7A7E8E')
      .attr('stroke-width', 3)
      .attr('stroke-linejoin', 'round')
      .attr('paint-order', 'stroke')
      .attr('x', d => projection([d.long, d.lat])[0])
      .attr('y', d => projection([d.long, d.lat])[1])
      .attr('text-anchor', 'middle')
      .attr('dy', 13)
      .text(d => d.capital);

    const worstCountyLabels = map.selectAll('.worstCounties')
      .data(worstCounties)
      .enter();

    worstCountyLabels.append('text')
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', 15)
      .attr('fill', '#ffffff')
      .attr('stroke', '#31343F')
      .attr('stroke-width', 3)
      .attr('stroke-linejoin', 'round')
      .attr('paint-order', 'stroke')
      .attr('x', d => projection([d.long, d.lat])[0])
      .attr('y', d => projection([d.long, d.lat])[1])
      .attr('text-anchor', 'middle')
      .attr('dy', 15)
      .text(d => (d.name.length > 12) ? `${d.name.slice(0, 12)}…` : d.name);

    // Add title
    svg.append('text')
      .attr('transform', 'translate(25, 17.5)')
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', 24)
      .attr('font-weight', 600)
      .attr('fill', '#ffffff')
      .attr('dy', 24)
      .text(meta.title);

    // Add description
    svg.append('text')
      .attr('transform', 'translate(25, 50)')
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#9fa3b3')
      .attr('dy', 15)
      .text(meta.description);

    // Obergrenze
    svg.append('circle')
      .attr('transform', 'translate(25, 85)')
      .attr('r', scale(50))
      .attr('cx', scale(50))
      .attr('cy', 10)
      .attr('fill', getColor(50));

    svg.append('text')
      .attr('transform', 'translate(58, 85)')
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .attr('dy', 15)
      .text('Obergrenze (50 Fälle)');

    // Warngrenze
    svg.append('circle')
      .attr('transform', 'translate(230, 85)')
      .attr('r', scale(30))
      .attr('cx', scale(30))
      .attr('cy', 10)
      .attr('fill', getColor(35));

    svg.append('text')
      .attr('transform', 'translate(260, 85)')
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .attr('dy', 15)
      .text('Warngrenze (35 Fälle)');

    // Untergrenze
    svg.append('circle')
      .attr('transform', 'translate(435, 85)')
      .attr('r', scale(10))
      .attr('cx', scale(10))
      .attr('cy', 10)
      .attr('fill', getColor(10));

    svg.append('text')
      .attr('transform', 'translate(457, 85)')
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .attr('dy', 15)
      .text('mehr als 1 Fall');

    // Add author and source
    svg.append('text')
      .attr('transform', `translate(25, ${height - 25})`)
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#9fa3b3')
      .text(`Grafik: ${meta.author}, Daten: ${meta.source} (Stand: ${germanDate(meta.date)})`);
  }

  update() {
    select(this.target).html('');
    this.draw();
  }
}

function getColor(value) {
  if (value >= 50) {
    // red
    return '#f03b20';
  } else if (value >= 35) {
    // orange
    return '#feb24c';
  } else {
    // yellow
    return '#ffeda0';
  }
}
