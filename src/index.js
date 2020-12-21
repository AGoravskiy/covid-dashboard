/* eslint-disable no-console */
import './styles/styles.css';
import table from './js/components/table.component';
import { addMarker, addButtons } from './map.js';

table.generateTables();
table.addEvents();


fetch('https://corona.lmao.ninja/v3/covid-19/countries')
  .then((result) => result.json())
  .then((data) => {
    addMarker(data, 'cases');
    addButtons(data);
  });
