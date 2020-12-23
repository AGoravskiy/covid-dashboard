export default function getMixObj(poligon, data) {
  const mixObj = {};
  for (const item of data) {
    mixObj[item.countryInfo.iso3] = {
      country: item.country,
      cases: item.cases,
      recovered: item.recovered,
      deaths: item.deaths,
      todayCases: item.todayCases,
      todayDeaths: item.todayDeaths,
      todayRecovered: item.todayRecovered,
      flag: item.countryInfo.flag,
    };
  }
  for (const item of poligon.features) {
    if (!(item.properties.ISO_A3 in mixObj)) {
      mixObj[item.properties.ISO_A3] = {
        country: item.properties.ADMIN,
        cases: 'none',
        recovered: 'none',
        deaths: 'none',
        todayCases: 'none',
        todayDeaths: 'none',
        todayRecovered: 'none',
        flag: './assets/images/whiteflag.png',
      };
    }
  }
  return mixObj;
}
