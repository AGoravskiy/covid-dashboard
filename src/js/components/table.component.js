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

const generateTableFooter = (covidStats) => {
  const tableFooter = utils.create('div', 'table-footer');
  const tableParams = isAllTimeStats
    ? constants.tableParams.allTimeStats
    : constants.tableParams.todayStats;
  tableParams.forEach((params) => {
    const footerDigitText = isTotalAmount
      ? utils.addSpaces(covidStats[params])
      : utils.addSpaces(utils.recalcAmount(covidStats[params], covidStats.population));
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

const generateTables = (covidStats) => {
  const tablesWrapper = utils.create('div', 'table-wrapper');
  const tableParams = isAllTimeStats
    ? constants.tableParams.allTimeStats
    : constants.tableParams.todayStats;
  tableParams.forEach((params) => {
    sortCovidStats(covidStats.countriesStats, params);
    const tableLayout = utils.create('table', 'table', [generateTableHead(params), generateTableBody(covidStats.countriesStats, params)]);
    utils.create('div', '', tableLayout, tablesWrapper);

    const domTableWrapper = document.querySelector('.table-wrapper');

    if (domTableWrapper) {
      domTableWrapper.parentNode.removeChild(domTableWrapper);
    }
    document.querySelector('#table').append(tablesWrapper);

    generateTableFooter(covidStats.generalStats);
  });
};

const addEvents = (covidStats) => {
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
        generateTables(covidStats);
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
        generateTables(covidStats);
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
        generateTables(covidStats);
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
        generateTables(covidStats);
      });
    }
  });
};

export default { generateTables, addEvents };
