import { select } from 'd3-selection';
import { scaleSqrt } from 'd3-scale';
import { geoPath, geoMercator } from 'd3-geo';
import { feature } from 'topojson-client';

import { incidenceColor, germanDate } from '../utils';

const defaults = {
  target: '#map',
  minValue: 0,
  maxValue: 1000,
  minRadius: 5,
  maxRadius: 18
};

export default class BavariaMap {
  constructor(config) {
    this.set(config);
    this.draw();
  }

  set(config) {
    Object.assign(this, defaults, config);
  }

  draw() {
    const { target, cases, metaData, geoData, labelData,
      meta, minValue, maxValue, minRadius, maxRadius } = this;

    const uniqueCounties = [...new Set(cases.map(d => d.landkreisId))];

    // Get latest cases and geo coordinates for each county
    const mergedCounties = uniqueCounties.map(countyId => {
      const currentCountyCases = cases.filter(c => c.landkreisId === countyId);
      const metaInfoCounty = metaData.find(m => parseInt(m.ags) === countyId);
      
      return Object.assign(
        { lat: metaInfoCounty.lat, long: metaInfoCounty.long },
        currentCountyCases[currentCountyCases.length - 1]
      );
    });

    // Set up map
    const container = select(target);
    container.select('svg.map').remove();

    const bounds = container.node().getBoundingClientRect();
    const width = bounds.width;
    const height = width;

    const isMobile = width <= 640;

    // Set scaling factor for circles
    const scalingFactor = width / 800;

    // Set scale for circle radiuses or radii, if you are a Latin nerd
    const radius = scaleSqrt()
      .domain([minValue, maxValue])
      .range([minRadius * scalingFactor, maxRadius * scalingFactor]);

    // Set map center and dimensions
    const projection = geoMercator()
      .translate([width/2, height/2])
      .scale(width * 8)
      .center([11.4, 49.15]);

    const path = geoPath().projection(projection);

    // TopoJSON to GeoJSON feature
    const geoFeature = feature(geoData, geoData.objects.counties);

    // Add SVG
    const svg = container.append('svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('preserveAspectRatio', 'xMidYMid')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('id', `${target.replace('#', '')}-${meta.date.toISOString().split('T')[0]}`)
      .attr('class', 'map')
      .style('width', '100%');

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
      .attr('d', path(geoFeature))
      .attr('fill', '#858999')
      .attr('stroke', '#383B47')
      .attr('stroke-width', 1.25)
      .attr('stroke-opacity', 0.75);

    // Add circles to visualize the number of COVID-19 cases
    map.append('g')
      .selectAll('circle')
      .data(mergedCounties)
      .enter()
      .append('circle')
      .attr('r', d => {
        if (d.inzidenz) {
          return (radius(d.inzidenz) > maxRadius) ?
            maxRadius : radius(d.inzidenz);
        } else {
          return 0;
        }
      })
      .attr('cx', d => projection([d.long, d.lat])[0])
      .attr('cy', d => projection([d.long, d.lat])[1])
      .attr('fill', d => incidenceColor(d.inzidenz))
      .style('mix-blend-mode', 'hard-light')
      .append('title')
      .text(d => `${d.landkreis} (${d.landkreisTyp}): ${Math.round(d.inzidenz)}`);

    // Add labels for bigger cities
    const cityLabels = map.append('g')
      .selectAll('.cities')
      .data(labelData)
      .enter();

    cityLabels.append('text')
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', isMobile ? '13' : '15')
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .attr('stroke', '#7A7E8E')
      .attr('stroke-width', 3)
      .attr('stroke-linejoin', 'round')
      .attr('paint-order', 'stroke')
      .attr('text-anchor', 'middle')
      .attr('x', d => projection([d.long, d.lat])[0])
      .attr('y', d => projection([d.long, d.lat])[1])
      .attr('dy', 13)
      .style('pointer-events', 'none')
      .text((d, i) =>
        // Show fewer labels on small maps
        (isMobile && i > 6) ? '' : d.name
      );

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

    // Add key
    const key = svg.append('g')
      .style('display', isMobile ? 'none' : 'block');
      
    // Add key "more than 1000 cases"
    key.append('circle')
      .attr('transform', 'translate(25, 90)')
      .attr('r', radius(1000))
      .attr('cx', radius(1000))
      .attr('cy', 10)
      .attr('fill', incidenceColor(1000));

    key.append('text')
      .attr('transform', 'translate(70, 90)')
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .attr('dy', 15)
      .text('≥ 1.000');

    // Add key "more than 500 cases"
    key.append('circle')
      .attr('transform', 'translate(150, 90)')
      .attr('r', radius(500))
      .attr('cx', radius(500))
      .attr('cy', 10)
      .attr('fill', incidenceColor(500));

    key.append('text')
      .attr('transform', 'translate(188, 90)')
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .attr('dy', 15)
      .text('≥ 500');

    // Add key "more than 200 cases"
    key.append('circle')
      .attr('transform', 'translate(255, 90)')
      .attr('r', radius(200))
      .attr('cx', radius(200))
      .attr('cy', 10)
      .attr('fill', incidenceColor(200));

    key.append('text')
      .attr('transform', 'translate(285, 90)')
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .attr('dy', 15)
      .text('≥ 200');

    // Add key "more than 100 cases"
    key.append('circle')
      .attr('transform', 'translate(350, 90)')
      .attr('r', radius(100))
      .attr('cx', radius(100))
      .attr('cy', 10)
      .attr('fill', incidenceColor(100));

    key.append('text')
      .attr('transform', 'translate(378, 90)')
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .attr('dy', 15)
      .text('≥ 100');

    // Add key "more than 50 cases"
    key.append('circle')
      .attr('transform', 'translate(442, 90)')
      .attr('r', radius(50))
      .attr('cx', radius(50))
      .attr('cy', 10)
      .attr('fill', incidenceColor(50));

    key.append('text')
      .attr('transform', 'translate(468, 90)')
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .attr('dy', 15)
      .text('≥ 50');

    // Add key "more than 35 cases"
    key.append('circle')
      .attr('transform', 'translate(525, 90)')
      .attr('r', radius(35))
      .attr('cx', radius(35))
      .attr('cy', 10)
      .attr('fill', incidenceColor(35));

    key.append('text')
      .attr('transform', 'translate(548, 90)')
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .attr('dy', 15)
      .text('≥ 35');

    // Add key "more than 1 case"
    key.append('circle')
      .attr('transform', 'translate(600, 90)')
      .attr('r', radius(1))
      .attr('cx', radius(1))
      .attr('cy', 10)
      .attr('fill', incidenceColor(1));

    key.append('text')
      .attr('transform', 'translate(622, 90)')
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .attr('dy', 15)
      .text('≥ 1 Fall');

    // Add author and source
    svg.append('text')
      .attr('transform', `translate(27, ${height - 25})`)
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
