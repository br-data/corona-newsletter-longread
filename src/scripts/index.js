import '../index.html';
import '../styles/index.scss';
import metadata from '../metadata.json';

import VaccinationChart from './chart/vaccination-chart';
import InfectionChart from './chart/infection-chart';
import OverviewChart from './chart/overview-chart';
import IntensiveCareChart from './chart/intensive-care-chart';
import BavariaMap from './chart/bavaria-map';
import GermanyMap from './chart/germany-map';

import * as bavariaIndicator from './indicator/bavaria-indicator';
import * as bavariaText from './text/bavaria-text';
import * as bavariaDistrictsText from './text/bavaria-districts-text';
import * as bavariaDistrictsTable from './table/bavaria-districts-table';
import * as bavariaCountiesText from './text/bavaria-counties-text';
import * as bavariaCountiesTable from './table/bavaria-counties-table';
import * as bavariaVaccinationsText from './text/bavaria-vaccinations-text';
import * as bavariaPatientsText from './text/bavaria-patients-text';

import bavariaMeta from './data/meta/bavaria-meta.json';
import bavariaDistrictsMeta from './data/meta/bavaria-districts-meta.json';
import bavariaCountiesMeta from './data/meta/bavaria-counties-meta.json';
import bavariaCountiesGeo from './data/geo/bavaria-counties.topo.json';
import bavariaBigCities from './data/meta/bavaria-big-cities.json';

import * as germanyIndicator from './indicator/germany-indicator';
import * as germanyText from './text/germany-text';
import * as germanyStatesText from './text/germany-state-text';
import * as germanyStatesTable from './table/germany-states-table';
import * as germanyCountiesText from './text/germany-counties-text';
import * as germanyVaccinationsText from './text/germany-vaccinations-text';
import * as germanyPatientsText from './text/germany-patients-text';

import germanyMeta from './data/meta/germany-meta.json';
import germanyStatesMeta from './data/meta/germany-states-meta.json';
import germanyStatesGeo from './data/geo/germany-states.topo.json';
import germanyCountiesMeta from './data/meta/germany-counties-meta.json';
import germanyCountiesGeo from './data/geo/germany-counties.topo.json';

import { germanDate, germanTime, updateMetaData } from './utils';

window.addEventListener('load', init);

async function init() {
  // eslint-disable-next-line no-console
  const logError = error => console.warn(error);
  const toDateString = date => date.toISOString().split('T')[0];

  const charts = [];

  // const apiUrl = 'https://corona-api.brdata-dev.de/query';
  const apiUrl = 'https://corona-api.interaktiv.br.de/query';
  const urlParams = new URLSearchParams(window.location.search);

  const startDate = new Date(urlParams.get('startDate') || new Date('2020-02-25'));
  const startDateString = toDateString(startDate);

  const endDate = new Date(urlParams.get('endDate') || new Date());
  const endDateString = toDateString(endDate);

  const previousDayDate = new Date(endDate);
  previousDayDate.setDate(endDate.getDate()-1);
  const previousDayDateString = toDateString(previousDayDate);

  const previousTwoWeeksDate = new Date(endDate);
  previousTwoWeeksDate.setDate(endDate.getDate()-18); // 14 days + 2 days cut-off + 2 days weekend
  const previousTwoWeeksDateString = toDateString(previousTwoWeeksDate);

  // Add structured metadata to header
  const metaDataTag = document.createElement('script');
  metaDataTag.type = 'application/ld+json';
  metaDataTag.textContent = JSON.stringify(
    updateMetaData(metadata, `${endDateString}T02:00:00`, endDate)
  );
  document.head.appendChild(metaDataTag);
  
  // Add date strings to page
  document.querySelectorAll('span.date')
    .forEach(el => el.textContent = germanDate(endDateString));
  document.querySelectorAll('span.time')
    .forEach(el => el.textContent = germanTime(new Date()));

  // Check if yesterday's data is available
  const dataCheckResult = await fetch(`${apiUrl}/infektionen-de?filter=meldedatum==${previousDayDateString}&format=json`)
    .then(response => response.json())
    .catch(logError);
  
  // Get the timestamp from the last available data point
  const dataLastUpdated = await fetch(`${apiUrl}/infektionen-de?fieldList=meldedatum&format=json`)
    .then(response => response.json())
    .catch(logError);
  const lastUpdatedDate = dataLastUpdated[dataLastUpdated.length - 1].meldedatum;
  
  // Display warning if there is no data from yesterday
  if (!dataCheckResult.length) {
    document.querySelectorAll('.warning')
      .forEach(el => el.textContent = 'Für den heutigen Tag wurden noch keine vollständigen Daten vom Robert Koch-Institut übermittelt. Da die Aussagekraft der Zahlen am Wochenende und zu Beginn der Woche stark eingeschränkt ist, wird nur der letzte vollständige Datenstand angezeigt.');
    document.querySelectorAll('span.date.updateable')
      .forEach(el => el.textContent = germanDate(lastUpdatedDate));
    document.querySelectorAll('span.time.updateable')
      .forEach(el => el.textContent = '24:00');
  }

  // Text for Bavaria
  (async function () {
    const bavariaCasesRequest = fetch(`${apiUrl}/infektionen-bl?filter=meldedatum%3E=${previousTwoWeeksDateString}&filter=bundesland==Bayern&format=json`)
      .then(response => response.json())
      .catch(logError);

    const bavariaNewCasesRequest = fetch(`${apiUrl}/infektionen-bl-aktuell?filter=bundesland==Bayern&format=json`)
      .then(response => response.json())
      .catch(logError);

    const [bavariaCases, bavariaNewCases] = await Promise.all([bavariaCasesRequest, bavariaNewCasesRequest]);

    bavariaIndicator.init({
      target: '#bavaria-indicator',
      cases: bavariaCases,
      newCases: bavariaNewCases
    });

    bavariaText.init({
      caseTarget: '#bavaria-cases-text',
      reproTarget: '#bavaria-repro-text',
      deathTarget: '#bavaria-deaths-text',
      cases: bavariaCases,
      newCases: bavariaNewCases
    });
  })();

  // Charts for Bavaria
  (async function () {
    const bavariaCases = await fetch(`${apiUrl}/infektionen-bl?filter=meldedatum%3E=${startDateString}&filter=bundesland==Bayern&format=json`)
      .then(response => response.json())
      .catch(logError);

    const bavariaOverviewChart = new OverviewChart({
      target: '#bavaria-indicators-chart',
      cases: bavariaCases,
      meta: {
        title: 'Corona in Bayern',
        description: 'Entwicklung der wichtigsten Indikatoren',
        author: 'BR',
        source: 'Robert Koch-Institut, BR-Analyse',
        date: endDate
      }
    });

    charts.push(bavariaOverviewChart);

    const bavariaCasesChart = new InfectionChart({
      target: '#bavaria-cases-chart',
      cases: bavariaCases,
      meta: {
        title: 'Neue Coronafälle in Bayern',
        description: 'Entwicklung der Neuinfektionen nach Referenzdatum',
        author: 'BR',
        source: 'Robert Koch-Institut, BR-Analyse',
        date: endDate
      }
    });

    charts.push(bavariaCasesChart);
  })();

  // Text and table for Bavarian administrative districts (Regierungsbezirke)
  (async function () {
    const bavariaAdmDistrictCasesRequest = fetch(`${apiUrl}/infektionen-rb?filter=meldedatum%3E=${previousTwoWeeksDateString}&format=json`)
      .then(response => response.json())
      .catch(logError);

    const bavariaAdmDistrictNewCasesRequest = fetch(`${apiUrl}/infektionen-rb-aktuell?format=json`)
      .then(response => response.json())
      .catch(logError);

    const [bavariaAdmDistrictCases, bavariaAdmDistrictNewCases] = await Promise.all([bavariaAdmDistrictCasesRequest, bavariaAdmDistrictNewCasesRequest]);

    bavariaDistrictsTable.init({
      target: '#bavaria-districts-table',
      cases: bavariaAdmDistrictCases,
      newCases: bavariaAdmDistrictNewCases
    });

    bavariaDistrictsText.init({
      target: '#bavaria-districts-text',
      cases: bavariaAdmDistrictCases,
      newCases: bavariaAdmDistrictNewCases
    });
  })();

  // Text, table and map for Bavarian counties (Landkreise)
  (async function () {
    const bavariaCountyCasesRequest = fetch(`${apiUrl}/infektionen-lk?filter=meldedatum%3E=${previousTwoWeeksDateString}&filter=bundesland==Bayern&format=json`)
      .then(response => response.json())
      .catch(logError);

    const bavariaCountyNewCasesRequest = fetch(`${apiUrl}/infektionen-lk-aktuell?filter=bundesland==Bayern&format=json`)
      .then(response => response.json())
      .catch(logError);

    const [bavariaCountyCases, bavariaCountyNewCases] = await Promise.all([bavariaCountyCasesRequest, bavariaCountyNewCasesRequest]);

    const bavariaMap = new BavariaMap({
      target: '#bavaria-cases-map',
      cases: bavariaCountyCases,
      metaData: bavariaCountiesMeta,
      geoData: bavariaCountiesGeo,
      labelData: bavariaBigCities,
      meta: {
        title: '7-Tage-Inzidenz in Bayern',
        description: 'Neuinfektionen pro 100.000 Einwohner in den letzten sieben Tagen',
        author: 'BR',
        source: 'Robert Koch-Institut, BR-Analyse',
        date: endDate
      }
    });

    charts.push(bavariaMap);

    bavariaCountiesTable.init({
      target: '#bavaria-counties-table',
      cases: bavariaCountyCases,
      newCases: bavariaCountyNewCases
    });

    bavariaCountiesText.init({
      summaryTarget: '#bavaria-counties-summary-text',
      detailTarget: '#bavaria-counties-detail-text',
      cases: bavariaCountyCases,
      newCases: bavariaCountyNewCases,
      metaDataDistricts: bavariaDistrictsMeta
    });
  })();

  // Text and chart for intensive care patients in Bavaria
  (async function () {
    const bavariaPatients = await fetch(`${apiUrl}/intensivpatienten-bl?filter=bundesland==Bayern&fieldList=datum,anzahlIntensivpatienten&format=json`)
      .then(response => response.json())
      .catch(logError);

    bavariaPatientsText.init({
      target: '#bavaria-patients-text',
      patientData: bavariaPatients,
      metaData: bavariaMeta
    });

    const bavariaPatientsChart = new IntensiveCareChart({
      target: '#bavaria-patients-chart',
      data: bavariaPatients,
      meta: {
        title: 'Intensivpatienten in Bayern',
        description: 'Anzahl der gemeldeten Corona-Fälle in intensivmedizinischer Behandlung',
        author: 'BR',
        source: 'DIVI-Intensivregister',
        date: endDate
      }
    });

    charts.push(bavariaPatientsChart);
  })();

  // Text and chart for vaccinations in Bavaria
  (async function () {
    const bavariaVaccinations = await fetch(`${apiUrl}/impfungen-bl?filter=bundesland==Bayern&format=json`)
      .then(response => response.json())
      .catch(logError);

    bavariaVaccinationsText.init({
      target: '#bavaria-vaccinations-text',
      data: bavariaVaccinations
    });

    const bavariaVaccinationsChart = new VaccinationChart({
      target: '#bavaria-vaccinations-chart',
      data: bavariaVaccinations,
      meta: {
        title: 'Corona-Impfungen in Bayern',
        description: 'Prozentualer Anteil der geimpften Personen an der Bevölkerung',
        author: 'BR',
        source: 'Robert Koch-Institut',
        date: endDate
      }
    });

    charts.push(bavariaVaccinationsChart);
  })();

  // Text for Germany
  (async function () {
    const germanyCasesRequest = fetch(`${apiUrl}/infektionen-de?filter=meldedatum%3E=${previousTwoWeeksDateString}&format=json`)
      .then(response => response.json())
      .catch(logError);

    const germanyNewCasesRequest = fetch(`${apiUrl}/infektionen-de-aktuell?format=json`)
      .then(response => response.json())
      .catch(logError);

    const [germanyCases, germanyNewCases] = await Promise.all([germanyCasesRequest, germanyNewCasesRequest]);

    germanyIndicator.init({
      target: '#germany-indicator',
      cases: germanyCases,
      newCases: germanyNewCases
    });

    germanyText.init({
      caseTarget: '#germany-cases-text',
      reproTarget: '#germany-repro-text',
      deathTarget: '#germany-deaths-text',
      cases: germanyCases,
      newCases: germanyNewCases
    });
  })();

  // Charts for Germany
  (async function () {
    const germanyCases = await fetch(`${apiUrl}/infektionen-de?filter=meldedatum%3E=${startDateString}&format=json`)
      .then(response => response.json())
      .catch(logError);

    const germanyOverviewChart = new OverviewChart({
      target: '#germany-indicators-chart',
      cases: germanyCases,
      meta: {
        title: 'Corona in Deutschland',
        description: 'Entwicklung der wichtigsten Indikatoren',
        author: 'BR',
        source: 'Robert Koch-Institut, BR-Analyse',
        date: endDate
      }
    });

    charts.push(germanyOverviewChart);

    const germanyCasesChart = new InfectionChart({
      target: '#germany-cases-chart',
      cases: germanyCases,
      meta: {
        title: 'Neue Coronafälle in Deutschland',
        description: 'Entwicklung der Neuinfektionen nach Referenzdatum',
        author: 'BR',
        source: 'Robert Koch-Institut, BR-Analyse',
        date: endDate
      }
    });

    charts.push(germanyCasesChart);
  })();

  // Text for German State states (Bundesländer)
  (async function () {
    const germanyStateCasesRequest = fetch(`${apiUrl}/infektionen-bl?filter=meldedatum%3E=${previousTwoWeeksDateString}&format=json`)
      .then(response => response.json())
      .catch(logError);

    const germanyStateNewCasesRequest = fetch(`${apiUrl}/infektionen-bl-aktuell?format=json`)
      .then(response => response.json())
      .catch(logError);

    const [germanyStateCases, germanyStateNewCases] = await Promise.all([germanyStateCasesRequest,germanyStateNewCasesRequest]);

    germanyStatesText.init({
      target: '#germany-states-text',
      cases: germanyStateCases,
      newCases: germanyStateNewCases
    });

    germanyStatesTable.init({
      target: '#germany-states-table',
      cases: germanyStateCases,
      newCases: germanyStateNewCases
    });
  })();

  // Text and map for German counties (Landkreise)
  (async function () {
    const germanyCountyCases = await fetch(`${apiUrl}/infektionen-lk?filter=meldedatum%3E=${previousTwoWeeksDateString}&format=json`)
      .then(response => response.json())
      .catch(logError);

    const bavariaMap = new GermanyMap({
      target: '#germany-cases-map',
      cases: germanyCountyCases,
      metaData: germanyCountiesMeta,
      countiesGeoData: germanyCountiesGeo,
      statesGeoData: germanyStatesGeo,
      labelData: germanyStatesMeta,
      meta: {
        title: '7-Tage-Inzidenz in Deutschland',
        description: 'Neuinfektionen pro 100.000 Einwohner in den letzten sieben Tagen',
        author: 'BR',
        source: 'Robert Koch-Institut, BR-Analyse',
        date: endDate
      }
    });

    charts.push(bavariaMap);

    germanyCountiesText.init({
      summaryTarget: '#germany-counties-summary-text',
      detailTarget: '#germany-counties-detail-text',
      cases: germanyCountyCases
    });
  })();

  // Text and chart for intensive care patients in Germany
  (async function () {
    const germanyPatients = await fetch(`${apiUrl}/intensivpatienten-de?fieldList=datum,anzahlIntensivpatienten&format=json`)
      .then(response => response.json())
      .catch(logError);

    germanyPatientsText.init({
      target: '#germany-patients-text',
      patientData: germanyPatients,
      metaData: germanyMeta
    });

    const germanyPatientsChart = new IntensiveCareChart({
      target: '#germany-patients-chart',
      data: germanyPatients,
      meta: {
        title: 'Intensivpatienten in Deutschland',
        description: 'Anzahl der gemeldeten Corona-Fälle in intensivmedizinischer Behandlung',
        author: 'BR',
        source: 'DIVI-Intensivregister',
        date: endDate
      }
    });

    charts.push(germanyPatientsChart);
  })();

  // Text and chart for vaccinations in Germany
  (async function () {
    const germanyVaccinations = await fetch(`${apiUrl}/impfungen-bl?filter=bundesland==Deutschland&format=json`)
      .then(response => response.json())
      .catch(logError);

    germanyVaccinationsText.init({
      target: '#germany-vaccinations-text',
      data: germanyVaccinations
    });

    const germanyVaccinationsChart = new VaccinationChart({
      target: '#germany-vaccinations-chart',
      data: germanyVaccinations,
      meta: {
        title: 'Corona-Impfungen in Deutschland',
        description: 'Prozentualer Anteil der geimpften Personen an der Bevölkerung',
        author: 'BR',
        source: 'Robert Koch-Institut',
        date: endDate
      }
    });

    charts.push(germanyVaccinationsChart);
  })();

  resize(charts);
}

function resize(charts) {
  let timeout;

  window.onresize = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      charts.forEach(chart => chart.update());
    }, 200);
  };
}
