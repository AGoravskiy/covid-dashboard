import table from './js/components/table.component';
import map from './js/components/map.component';
import constants from './js/constants/covidAPI.constants';
import tableConstants from './js/constants/tables.constants';
import utils from './js/utils/index.util';
import generateChart from './js/components/chart.component';
import allTime from './js/constants/chart.constants';

const init = async () => {
  const covidStats = {};
  let poligon = {};
  let mixObj = {};

  covidStats.countriesStats = await utils.getCovidStats(constants.countriesData);
  covidStats.generalStats = await utils.getCovidStats(constants.generalData);
  covidStats.countriesStats.splice(
    covidStats.countriesStats.indexOf(covidStats.countriesStats.find((country) => country.country === 'MS Zaandam')),
    1,
  );
  covidStats.countriesStats.splice(
    covidStats.countriesStats.indexOf(covidStats.countriesStats.find((country) => country.country === 'Diamond Princess')),
    1,
  );

  const updatedDate = new Date(covidStats.generalStats.updated);
  document.body.querySelector('.date').innerText = `${document.body.querySelector('.date').innerText} ${updatedDate.toLocaleString()}`;
  covidStats.chartStats = await utils.getCovidStats(allTime);
  table.generateTables(covidStats);
  table.addEvents(covidStats);

  poligon = await utils.getCountriesPoligon();
  mixObj = utils.getMixObj(poligon, covidStats.countriesStats);
  map.generateMap(poligon, covidStats.countriesStats, mixObj, tableConstants.allTimeStats);
  // map.focusOnCountry(covidStats.countriesStats, 'Belarus')
  generateChart(utils.divide(covidStats.chartStats.cases)[0], utils.divide(covidStats.chartStats.cases)[1], 'cases');
};

export default { init };

// window.addEventListener('load', () => {
//   setTimeout(() => {
//     const preloader = document.getElementById('page-preloader');
//     if (!preloader.classList.contains('done')) {
//       preloader.classList.add('done');
//     }
//   }, 1000);
// });
