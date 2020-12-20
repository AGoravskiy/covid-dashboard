/* eslint-disable no-console */

const getCovidStats = async (type) => {
  const dataNew = await fetch(`https://corona.lmao.ninja/v3/covid-19/${type}`);
  const jsonNew = await dataNew.json();

  return jsonNew;
};

export default getCovidStats;
