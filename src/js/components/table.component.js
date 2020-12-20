import utils from '../utils/index.util';
import constants from '../constants/index.constants';

const tablesWrapper = utils.create('div', 'table-wrapper');

const generateTableBody = (covidData, title) => {
  const tableBody = utils.create('tbody', 'table-body');
  covidData.forEach((country) => {
    const countryFlag = utils.create('td', 'table-img',
      utils.create('img', null, null, null, ['src', `${country.countryInfo.flag}`]));
    const tableValue = utils.create('td', 'table-digits', utils.addSpaces(country[title]));
    const tableCountry = utils.create('td', 'table-letters', country.country);
    utils.create('tr', null, [tableValue, countryFlag, tableCountry], tableBody);
  });
  return tableBody;
};

const generateTableHead = (title) => {
  const headTh = utils.create('th', 'table-title', `Global ${title}`, null, ['colspan', '3'], ['table', title]);
  if (title === 'cases') {
    headTh.classList.add('negative');
  }
  const headTr = utils.create('tr', null, headTh);
  return utils.create('thead', 'table-title-wrapper', headTr);
};

const generateTableFooter = () => {
  utils.getCovidStats(constants.covidAPI.generalData).then((request) => {
    const tableFooter = utils.create('div', 'table-footer');
    constants.tables.forEach((table) => {
      const footerDigit = utils.create('span', 'table-footer-digit', `${utils.addSpaces(request[table])}`);
      const footerLetters = utils.create('span', 'table-footer-letters', 'Total');
      if (table === 'cases') {
        footerDigit.classList.add('negative');
        footerLetters.classList.add('negative');
      }
      utils.create('div', 'table-footer-title', [footerDigit, footerLetters], tableFooter);
    });
    document.querySelector('#table').append(tableFooter);
  });
};

const generateTables = () => {
  utils.getCovidStats(constants.covidAPI.countriesData).then((value) => {
    constants.tables.forEach((table) => {
      value.sort((countryFirst, countrySecond) => countrySecond[table] - countryFirst[table]);
      const tableLayout = utils.create('table', 'table', [generateTableHead(table), generateTableBody(value, table)]);
      utils.create('div', '', tableLayout, tablesWrapper);
    });
    document.querySelector('#table').append(tablesWrapper);

    generateTableFooter();
  });
};

export default generateTables;
