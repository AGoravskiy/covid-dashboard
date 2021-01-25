const getCovidStats = async (type) => {
  const dataNew = await fetch(`https://corona.lmao.ninja/v3/covid-19/${type}`);
  const covidStats = await dataNew.json().then((data) => data);

  return covidStats;
};

export default getCovidStats;
