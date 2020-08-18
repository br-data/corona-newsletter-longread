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

    // Calculate 7-day-incidence per 100.000 population for each county
    const mergedCounties = uniqueCounties.map(name => {
      const caseDataDistrict = caseData.filter(c => c.Landkreis === name);
      const metaInfoCounty = metaData.find(m => m.rkiName === name);
      return Object.assign(
        metaInfoCounty,
        { valuePer100Tsd: casesPer100Tsd7Days(caseDataDistrict, metaInfoCounty.pop) }
      );
    });

    // Create labels for all counties over 35 cases
    const worstCounties = mergedCounties.filter(d => d.valuePer100Tsd >= 35);

    // Create labels for all district capitals which don't have cases
    const capitals = districts.filter(district =>
      worstCounties.find(county =>
        county.district === district.name
      ) === undefined
    );

    const container = select(target);
    container.select('svg.map').remove();

    const bounds = container.node().getBoundingClientRect();
    const width = bounds.width;
    const height = width;

    // Set scale for circle radiuses or radii, if you are a Latin nerd
    const radius = scaleSqrt()
      .domain([0, 150])
      .range([3, 20]);

    // Set map center and dimensions
    const projection = geoMercator()
      .translate([width/2, height/2])
      .scale(6300)
      .center([11.4, 49.15]);

    const path = geoPath().projection(projection);

    // Add SVG
    const svg = container.append('svg')
      .attr('class', 'map')
      .style('width', '100%')
      .attr('preserveAspectRatio', 'xMidYMid')
      .attr('viewBox', `0 0 ${width} ${height}`);

    // Add dark background gradient
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

    // Add base map
    map.append('path')
      .attr('d', path(geoData))
      .attr('fill', '#858999')
      .attr('stroke', '#383B47')
      .attr('stroke-width', 1.25);

    // Add circles to visualize the number of COVID-19 cases
    map.append('g')
      .selectAll('circle')
      .data(mergedCounties, d => d.ags)
      .enter()
      .append('circle')
      .attr('r', d => d.valuePer100Tsd ? radius(d.valuePer100Tsd) : 0)
      .attr('cx', d => projection([d.long, d.lat])[0])
      .attr('cy', d => projection([d.long, d.lat])[1])
      .attr('fill', d => getColor(d.valuePer100Tsd))
      .style('mix-blend-mode', 'hard-light');

    // Add labels for bigger cities

    const capitalLabels = map.append('g')
      .selectAll('.capitals')
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

    // Add labels for the most affected counties
    const worstCountyLabels = map.append('g')
      .selectAll('.worstCounties')
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

    // Add legend
    const legend = svg.append('g');

    // Add key ”Obergrenze“
    legend.append('circle')
      .attr('transform', 'translate(25, 85)')
      .attr('r', radius(50))
      .attr('cx', radius(50))
      .attr('cy', 10)
      .attr('fill', getColor(50));

    legend.append('text')
      .attr('transform', 'translate(58, 85)')
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .attr('dy', 15)
      .text('Obergrenze (ab 50 Fällen)');

    // Add key “Warngrenze”
    legend.append('circle')
      .attr('transform', 'translate(260, 85)')
      .attr('r', radius(30))
      .attr('cx', radius(30))
      .attr('cy', 10)
      .attr('fill', getColor(35));

    legend.append('text')
      .attr('transform', 'translate(290, 85)')
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .attr('dy', 15)
      .text('Warngrenze (ab 35 Fällen)');

    // Add key “Untergrenze”
    legend.append('circle')
      .attr('transform', 'translate(490, 85)')
      .attr('r', radius(10))
      .attr('cx', radius(10))
      .attr('cy', 10)
      .attr('fill', getColor(10));

    legend.append('text')
      .attr('transform', 'translate(512, 85)')
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