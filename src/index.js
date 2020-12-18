import { addMarker } from './map.js';

fetch('https://corona.lmao.ninja/v3/covid-19/countries')
  .then((result) => result.json())
  .then((data) => {
    addMarker(data, 'cases');
    addMarker(data, 'recovered');
  });
