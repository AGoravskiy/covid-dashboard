import { addMarker, addButtons } from './map.js';

fetch('https://corona.lmao.ninja/v3/covid-19/countries')
  .then((result) => result.json())
  .then((data) => {
    addMarker(data, 'cases');
    addButtons(data);
  });
