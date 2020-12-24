import table from './js/components/table.component';
import constants from './js/constants/covidAPI.constants';
import utils from './js/utils/index.util';
import transformData from './js/components/chart.component';

import allTimeStatsChart from './js/constants/chart.constants';


const init = async () => {
  const covidStats = {};

  covidStats.countriesStats = await utils.getCovidStats(constants.countriesData);
  covidStats.generalStats = await utils.getCovidStats(constants.generalData);
  covidStats.chartStats = await utils.getCovidStats(allTimeStatsChart.path);
  table.generateTables(covidStats);
  table.addEvents(covidStats);
  transformData(covidStats);
  // generateChart(utils.divide(covidStats.chartStats.cases)[0], utils.divide(covidStats.chartStats.cases)[1], 'total amount');
};

export default { init };
