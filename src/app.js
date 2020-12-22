import table from './js/components/table.component';
import constants from './js/constants/covidAPI.constants';
import utils from './js/utils/index.util';

const init = async () => {
  const covidStats = {};

  covidStats.countriesStats = await utils.getCovidStats(constants.countriesData);
  covidStats.generalStats = await utils.getCovidStats(constants.generalData);
  table.generateTables(covidStats);
  table.addEvents(covidStats);
};

export default { init };
