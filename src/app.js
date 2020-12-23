import table from './js/components/table.component';
import constants from './js/constants/covidAPI.constants';
import utils from './js/utils/index.util';
import generateChart from './js/components/chart.component';
import allTime from './js/constants/chart.constants';

const init = async () => {
  const covidStats = {};

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
  generateChart(utils.divide(covidStats.chartStats.cases)[0], utils.divide(covidStats.chartStats.cases)[1], 'cases');
};

export default { init };
