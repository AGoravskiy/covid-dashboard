const getCountriesPoligon = async () => {
  const preloader = document.getElementById('page-preloader');
  const dataNew = await fetch('./assets/countries.json');
  const countriesPoligon = await dataNew.json().then((data) => data);
  preloader.classList.add('done');

  return countriesPoligon;
};

export default getCountriesPoligon;
