import table from './js/components/table.component';
import constants from './js/constants/covidAPI.constants';
import utils from './js/utils/index.util';

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
  table.generateTables(covidStats);
  table.addEvents(covidStats);
};

export default { init };
