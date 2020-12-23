import utils from '../utils/index.util';
import constants from '../constants/index.constants';

let isAllTimeStats = true;
let isTotalAmount = true;

const generateTableBody = (covidData, title) => {
  const tableBody = utils.create('tbody', 'table-body');
  covidData.forEach((country) => {
    if (!Number.isNaN(country[title]) && country[title] !== Infinity) {
      const countryFlag = utils.create('td', 'table-img',
        utils.create('img', null, null, null, ['src', `${country.countryInfo.flag}`]));
      const tableValueText = utils.addSpaces(country[title]);
      const tableValue = utils.create('td', 'table-digits', tableValueText);
      const tableCountry = utils.create('td', 'table-letters', country.country);
      utils.create('tr', 'table-row', [tableValue, countryFlag, tableCountry], tableBody);
    }
  });
  return tableBody;
};

const generateTableHead = (title, index) => {
  const headTh = utils.create('th', 'table-title', `Global ${title}`, null, ['colspan', '3'], ['table', title]);
  if (index === 0) {
    headTh.classList.add('negative');
  }
  const headTr = utils.create('tr', 'table-row', headTh);
  return utils.create('thead', 'table-title-wrapper', headTr);
};

const findTableParams = () => {
  if (isAllTimeStats && isTotalAmount) {
    return constants.tableParams.allTimeStats;
  } if (isAllTimeStats && !isTotalAmount) {
    return constants.tableParams.allTimeStatsPer100K;
  } if (!isAllTimeStats && isTotalAmount) {
    return constants.tableParams.todayStats;
  }
  return constants.tableParams.todayStatsPer100K;
};

const generateTableFooter = (covidStats) => {
  const tableFooter = utils.create('div', 'table-footer');
  const tableParams = findTableParams();
  tableParams.forEach((params) => {
    const footerDigitText = utils.addSpaces(covidStats[params]);
    const footerDigit = utils.create('span', 'table-footer-digit', footerDigitText);
    const footerLetters = utils.create('span', 'table-footer-letters', 'Total');
    if (tableParams.indexOf(params) === 0) {
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
  covidStats.sort((countryFirst, countrySecond) => countrySecond[params] - countryFirst[params]);
};

const addStatsPer100K = (covidStats) => {
  const updatingStats = covidStats;
  if (!Object.prototype.hasOwnProperty.call(updatingStats.countriesStats[0], 'casesPer100K')) {
    constants.tableParams.allTimeStats.forEach((param) => {
      updatingStats.countriesStats.forEach((country) => {
        const currentCountry = country;
        currentCountry[`${param}Per100K`] = utils.recalcAmountPer100K(country[`${param}`], country.population);
      });
    });
  }

  if (!Object.prototype.hasOwnProperty.call(updatingStats.countriesStats[0], 'todayCasesPer100K')) {
    constants.tableParams.todayStats.forEach((param) => {
      updatingStats.countriesStats.forEach((country) => {
        const currentCountry = country;
        currentCountry[`${param}Per100K`] = utils.recalcAmountPer100K(country[`${param}`], country.population);
      });
    });
  }

  if (!Object.prototype.hasOwnProperty.call(updatingStats.generalStats, 'todayCasesPer100K')) {
    constants.tableParams.todayStatsPer100K.forEach((param) => {
      const todayStatsPer100K = updatingStats.countriesStats.reduce((sum, country) => {
        let currentSum = sum;
        if (parseInt(country[param], 10)) {
          currentSum += parseInt(country[param], 10);
        }
        return currentSum;
      }, 0);
      updatingStats.generalStats[param] = todayStatsPer100K;
    });
  }

  if (!Object.prototype.hasOwnProperty.call(updatingStats.generalStats, 'casesPer100K')) {
    constants.tableParams.allTimeStatsPer100K.forEach((param) => {
      const statsPer100K = updatingStats.countriesStats.reduce((sum, country) => {
        let currentSum = sum;
        if (parseInt(country[param], 10)) {
          currentSum += parseInt(country[param], 10);
        }
        return currentSum;
      }, 0);
      updatingStats.generalStats[param] = statsPer100K;
    });
  }
};

const generateTables = (covidStats) => {
  addStatsPer100K(covidStats);
  const tablesWrapper = utils.create('div', 'table-wrapper');
  const tableParams = findTableParams();
  tableParams.forEach((params) => {
    sortCovidStats(covidStats.countriesStats, params);
    const tableLayout = utils.create('table', 'table', [generateTableHead(params, tableParams.indexOf(params)), generateTableBody(covidStats.countriesStats, params)]);
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
  const table = document.querySelector('.table');

  table.onclick = (event) => {
    const { target } = event;

    if (target.tagName === 'TD' || target.tagName === 'IMG') {
      if (target.tagName === 'TD') {
        console.log(target.parentNode);
        target.parentNode.classList.add('active-row');
      }
    }
  };

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
