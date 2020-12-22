import app from './app';
import './styles/styles.css';
import './styles/map.css';
import { generateMap } from './js/components/map.component';
import mixData from './js/utils/mixData';

app.init();
fetch('./assets/countries.json')
  .then((result) => result.json())
  .then((poligon) => {
    fetch('https://corona.lmao.ninja/v3/covid-19/countries')
      .then((result) => result.json())
      .then((data) => {
        const mixObj = mixData(poligon, data);
        generateMap(poligon, data, 'cases', mixObj);
        // focusOnCountry(data,'Belarus')
      });
  });


