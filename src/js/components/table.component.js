/* eslint-disable no-console */
import utils from '../utils/index.util';
import constants from '../constants/index.constants';

let isAllTimeStats = true;
let isTotalAmount = true;

const generateTableBody = (covidData, title) => {
  const tableBody = utils.create('tbody', 'table-body');
  covidData.forEach((country) => {
    const countryFlag = utils.create('td', 'table-img',
      utils.create('img', null, null, null, ['src', `${country.countryInfo.flag}`]));
    const tableValueText = isTotalAmount
      ? utils.addSpaces(country[title])
      : utils.addSpaces(utils.recalcAmount(country[title], country.population));
    const tableValue = utils.create('td', 'table-digits', tableValueText);
    const tableCountry = utils.create('td', 'table-letters', country.country);
    utils.create('tr', null, [tableValue, countryFlag, tableCountry], tableBody);
  });
  return tableBody;
};

const generateTableHead = (title) => {
  const headTh = utils.create('th', 'table-title', `Global ${title}`, null, ['colspan', '3'], ['table', title]);
  if (title === 'cases' || title === 'todayCases') {
    headTh.classList.add('negative');
  }
  const headTr = utils.create('tr', null, headTh);
  return utils.create('thead', 'table-title-wrapper', headTr);
};

const generateTableFooter = () => {
  utils.getCovidStats(constants.covidAPI.generalData).then((request) => {
    const tableFooter = utils.create('div', 'table-footer');
    const tableParams = isAllTimeStats
      ? constants.tableParams.allTimeStats
      : constants.tableParams.todayStats;
    tableParams.forEach((params) => {
      const footerDigitText = isTotalAmount
        ? utils.addSpaces(request[params])
        : utils.addSpaces(utils.recalcAmount(request[params], request.population));
      const footerDigit = utils.create('span', 'table-footer-digit', footerDigitText);
      const footerLetters = utils.create('span', 'table-footer-letters', 'Total');
      if (params === 'cases' || params === 'todayCases') {
        footerDigit.classList.add('negative');
        footerLetters.classList.add('negative');
      }
      utils.create('div', 'table-footer-title', [footerDigit, footerLetters], tableFooter);
    });

    const domTableFooter = document.querySelector('.table-footer');

    if (domTableFooter) {
      domTableFooter.parentElement.removeChild(domTableFooter);
    }

    document.querySelector('#table').append(tableFooter);
  });
};

const sortCovidStats = (covidStats, params) => {
  if (isTotalAmount) {
    covidStats.sort((countryFirst, countrySecond) => countrySecond[params] - countryFirst[params]);
  } else {
    if (params === 'cases' || params === 'todayCases') {
      covidStats.sort((countryFirst, countrySecond) => countrySecond.casesPerOneMillion
        - countryFirst.casesPerOneMillion);
    }
    if (params === 'deaths' || params === 'todayDeaths') {
      covidStats.sort((countryFirst, countrySecond) => countrySecond.deathsPerOneMillion
        - countryFirst.deathsPerOneMillion);
    }
    if (params === 'recovered' || params === 'todayRecovered') {
      covidStats.sort((countryFirst, countrySecond) => countrySecond.recoveredPerOneMillion
        - countryFirst.recoveredPerOneMillion);
    }
  }
};

const generateTables = () => {
  const tablesWrapper = utils.create('div', 'table-wrapper');
  utils.getCovidStats(constants.covidAPI.countriesData).then((request) => {
    const tableParams = isAllTimeStats
      ? constants.tableParams.allTimeStats
      : constants.tableParams.todayStats;
    tableParams.forEach((params) => {
      sortCovidStats(request, params);
      const tableLayout = utils.create('table', 'table', [generateTableHead(params), generateTableBody(request, params)]);
      utils.create('div', '', tableLayout, tablesWrapper);
    });

    const domTableWrapper = document.querySelector('.table-wrapper');
    console.log(domTableWrapper);

    if (domTableWrapper) {
      console.log('in');
      domTableWrapper.parentNode.removeChild(domTableWrapper);
    }
    document.querySelector('#table').append(tablesWrapper);

    generateTableFooter();
  });
};

const addEvents = () => {
  const covidStatsParam = [...document.querySelectorAll('.control-unit')];

  covidStatsParam.forEach((param) => {
    if (param.innerText === '24H') {
      param.addEventListener('click', () => {
        if (!isAllTimeStats) {
          return;
        }
        param.classList.add('active');
        covidStatsParam.find((item) => item.innerText === 'All Time').classList.remove('active');
        isAllTimeStats = false;
        generateTables();
      });
    }
    if (param.innerText === 'All Time') {
      param.addEventListener('click', () => {
        if (isAllTimeStats) {
          return;
        }
        param.classList.add('active');
        covidStatsParam.find((item) => item.innerText === '24H').classList.remove('active');
        isAllTimeStats = true;
        generateTables();
      });
    }
    if (param.innerText === 'Total Amount') {
      param.addEventListener('click', () => {
        if (isTotalAmount) {
          return;
        }
        param.classList.add('active');
        covidStatsParam.find((item) => item.innerText === 'per 100K citizens').classList.remove('active');
        isTotalAmount = true;
        generateTables();
      });
    }
    if (param.innerText === 'per 100K citizens') {
      param.addEventListener('click', () => {
        if (!isTotalAmount) {
          return;
        }
        param.classList.add('active');
        covidStatsParam.find((item) => item.innerText === 'Total Amount').classList.remove('active');
        isTotalAmount = false;
        generateTables();
      });
    }
  });
};

export default { generateTables, addEvents };
