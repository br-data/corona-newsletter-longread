import { select } from 'd3-selection';
import { geoPath, geoMercator } from 'd3-geo';
import { scaleSqrt } from 'd3-scale';
import { feature } from 'topojson-client';

import { casesPer100Tsd7Days, germanDate } from '../utils';

const defaults = {
  target: '#map',
  minValue: 0,
  maxValue: 300,
  minRadius: 3,
  maxRadius: 18
};

export default class BayernMap {
  constructor(config) {
    this.set(config);
    this.draw();
  }

  set(config) {
    Object.assign(this, defaults, config);
  }

  draw() {
    const { target, caseData, metaData, geoData, labelData,
      meta, minValue, maxValue, minRadius, maxRadius } = this;

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
    // const worstCounties = mergedCounties.filter(d => d.valuePer100Tsd >= 35);

    // Create city labels for all districts which don't have cases
    // const cities = labelData.filter(city =>
    //   worstCounties.find(county =>
    //     county.district === city.district
    //   ) === undefined
    // );

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
      .data(mergedCounties, d => d.ags)
      .enter()
      .append('circle')
      .attr('r', d => {
        if (d.valuePer100Tsd) {
          return (radius(d.valuePer100Tsd) > maxRadius) ?
            maxRadius : radius(d.valuePer100Tsd);
        } else {
          return 0;
        }
      })
      .attr('cx', d => projection([d.long, d.lat])[0])
      .attr('cy', d => projection([d.long, d.lat])[1])
      .attr('fill', d => getColor(d.valuePer100Tsd))
      .style('mix-blend-mode', 'hard-light')
      .append('title')
      .text(d => `${d.name} (${d.type}): ${Math.round(d.valuePer100Tsd)}`);

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

    // Add labels for the most affected counties
    // const worstCountyLabels = map.append('g')
    //   .selectAll('.worstCounties')
    //   .data(worstCounties)
    //   .enter();

    // worstCountyLabels.append('text')
    //   .attr('font-family', '"Open Sans", OpenSans, Arial')
    //   .attr('font-size', 15)
    //   .attr('fill', '#ffffff')
    //   .attr('stroke', '#31343F')
    //   .attr('stroke-width', 3)
    //   .attr('stroke-linejoin', 'round')
    //   .attr('paint-order', 'stroke')
    //   .attr('text-anchor', 'middle')
    //   .attr('x', d => projection([d.long, d.lat])[0])
    //   .attr('y', d => projection([d.long, d.lat])[1])
    //   .attr('dy', 15)
    //   .style('pointer-events', 'none')
    //   .text(d => (d.name.length > 12) ? `${d.name.slice(0, 12)}…` : d.name);

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

    // Add key "more than 200 cases"
    key.append('circle')
      .attr('transform', 'translate(25, 90)')
      .attr('r', radius(200))
      .attr('cx', radius(200))
      .attr('cy', 10)
      .attr('fill', getColor(200));

    key.append('text')
      .attr('transform', 'translate(65, 90)')
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .attr('dy', 15)
      .text('200 Fälle und mehr');

    // Add key "more than 50 cases"
    key.append('circle')
      .attr('transform', 'translate(225, 90)')
      .attr('r', radius(50))
      .attr('cx', radius(50))
      .attr('cy', 10)
      .attr('fill', getColor(50));

    key.append('text')
      .attr('transform', 'translate(258, 90)')
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .attr('dy', 15)
      .text('50 Fälle und mehr');

    // Add key "more than 35 cases"
    key.append('circle')
      .attr('transform', 'translate(410, 90)')
      .attr('r', radius(30))
      .attr('cx', radius(30))
      .attr('cy', 10)
      .attr('fill', getColor(35));

    key.append('text')
      .attr('transform', 'translate(440, 90)')
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .attr('dy', 15)
      .text('35 Fälle und mehr');

    // Add key "more than 1 case"
    key.append('circle')
      .attr('transform', 'translate(590, 90)')
      .attr('r', radius(10))
      .attr('cx', radius(10))
      .attr('cy', 10)
      .attr('fill', getColor(10));

    key.append('text')
      .attr('transform', 'translate(610, 90)')
      .attr('font-family', '"Open Sans", OpenSans, Arial')
      .attr('font-size', 15)
      .attr('font-weight', 300)
      .attr('fill', '#ffffff')
      .attr('dy', 15)
      .text('mindestens 1 Fall');

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
  if (value >= 200) {
    // dark red
    return '#bd0026';
  } else if (value >= 50) {
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
