// import utils from './js/utils/index.util';

const grid = document.querySelector('.dash-grid-layout');
const wide = document.querySelector('.map-wide-screen');
const open = document.querySelector('.open-button');
const close = document.querySelector('.close-button');
wide.addEventListener('click', (e) => {
  open.classList.toggle('hidden');
  grid.classList.toggle('wide-map');
  close.classList.toggle('hidden');
});
const mapOptions = {
  center: [17.385044, 8.486671],
  zoom: 2,
};

const map = new L.map('mymap', mapOptions);
const layer = new L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
  maxZoom: 20,
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
});
map.addLayer(layer);
const info = L.control();
const legend = L.control({ position: 'bottomright' });
const geojsonBox = [];

const mapBottons = L.control({ position: 'bottomleft' });
mapBottons.onAdd = function () {
  const div = L.DomUtil.create('div', 'map-bottons');
  div.innerHTML += '<div id ="cases" class="map-botton">Cases</div>';
  div.innerHTML += '<div id ="recovered" class="map-botton">Recovered</div>';
  div.innerHTML += '<div id ="deaths" class="map-botton">Deaths</div>';
  return div;
};
mapBottons.addTo(map);

// let data = await utils.getCovidStats(constants.countriesData);
// let poligon = await utils.getCountriesPoligon();
// let mixObj = utils.getMixObj(poligon, covidStats.countriesStats);

function generateMap(poligon, data, mixObj, tableParams, index = tableParams[0]) {
  geojsonBox.length = 0;
  let grades = [];
  let colors = [];
  if (index === 'cases') {
    grades = [1000, 10000, 100000, 500000, 1000000, 1500000, 2000000];
    colors = ['#800026', '#BD0026', '#E31A1C', '#FC4E2A', '#FD8D3C', '#FEB24C', '#FED976', '#FFEDA0'];
  }
  if (index === 'recovered') {
    grades = [1000, 10000, 100000, 500000, 1000000, 1500000, 2000000];
    colors = ['#00441b', '#006d2c', '#238b45', '#41ab5d', '#74c476', '#a1d99b', '#c7e9c0', '#e5f5e0'];
  }
  if (index === 'deaths') {
    grades = [1000, 10000, 20000, 50000, 100000, 200000, 300000];
    colors = ['#08306b', '#08519c', '#2171b5', '#4292c6', '#6baed6', '#9ecae1', '#c6dbef', '#deebf7'];
  }

  if (index === 'todayCases') {
    grades = [10, 50, 100, 200, 500, 1000, 2000];
    colors = ['#800026', '#BD0026', '#E31A1C', '#FC4E2A', '#FD8D3C', '#FEB24C', '#FED976', '#FFEDA0'];
  }
  if (index === 'todayDeaths') {
    grades = [10, 50, 100, 200, 500, 1000, 2000];
    colors = ['#00441b', '#006d2c', '#238b45', '#41ab5d', '#74c476', '#a1d99b', '#c7e9c0', '#e5f5e0'];
  }
  if (index === 'todayRecovered') {
    grades = [10, 50, 100, 200, 500, 1000, 2000];
    colors = ['#08306b', '#08519c', '#2171b5', '#4292c6', '#6baed6', '#9ecae1', '#c6dbef', '#deebf7'];
  }
  function getColor(d) {
    if (d > grades[6]) {
      return colors[0];
    }

    if (d > grades[5]) {
      return colors[1];
    }

    if (d > grades[4]) {
      return colors[2];
    }

    if (d > grades[3]) {
      return colors[3];
    }

    if (d > grades[2]) {
      return colors[4];
    }

    if (d > grades[1]) {
      return colors[5];
    }

    if (d > grades[0]) {
      return colors[6];
    }

    return colors[7];
  }

  if (geojsonBox.length > 0) {
    geojsonBox.forEach((item) => {
      item.remove(map);
    });
    geojsonBox.length = 0;
  }

  function style(feature) {
    if (feature.properties.ISO_A3 in mixObj) {
      return {
        fillColor: getColor(mixObj[feature.properties.ISO_A3][index]),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
      };
    }
    return {
      fillColor: getColor(grades[0]),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
    };
  }
  // Adding Interaction

  function highlightFeature(e) {
    const layer = e.target;
    info.update(layer.feature.properties);

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  }
  let geojson;
  function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
  }
  geojson = L.geoJson(poligon);

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature,
    });
  }
  geojson = L.geoJson(poligon, {
    style,
    onEachFeature,
  });

  const layerGroup = new L.LayerGroup();
  layerGroup.addTo(map);
  geojsonBox.push(layerGroup);
  geojsonBox[0].addLayer(geojson);

  // Custom Info Control
  info.onAdd = function () {
    this.div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this.div;
  };

  // method that we will use to update the control based on feature properties passed
  info.update = function (props) {
    this.div.innerHTML = (props
      ? `<b>${props.ADMIN}</b><img class="flag" src =${mixObj[props.ISO_A3].flag}><br/>${index}: <b>${mixObj[props.ISO_A3][index]}</b> people`
      : 'Hover over a country');
  };

  info.addTo(map);

  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');

    div.innerHTML += `<div class="map-legend-title">${index} :</div>`;
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML
            += `   
                <div class="map-legen-marker" style="background: ${getColor((grades[i] + 1), index)}">
                    ${grades[i]}${(grades[i + 1] ? `&ndash;${grades[i + 1]}<br>` : '+')}
                </div>
            `;
    }
    return div;
  };
  legend.addTo(map);

  const recovered = document.getElementById('recovered');
  recovered.addEventListener('click', () => {
    map.removeLayer(geojsonBox[0]);
    generateMap(poligon, data, mixObj, tableParams, tableParams[2]);
  });
  const cases = document.getElementById('cases');
  cases.addEventListener('click', () => {
    map.removeLayer(geojsonBox[0]);
    generateMap(poligon, data, mixObj, tableParams, tableParams[0]);
  });
  const deaths = document.getElementById('deaths');
  deaths.addEventListener('click', () => {
    map.removeLayer(geojsonBox[0]);
    generateMap(poligon, data, mixObj, tableParams, tableParams[1]);
  });
}

function focusOnCountry(data, chooseCountry) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].country === chooseCountry) {
      map.setView([data[i].countryInfo.lat, data[i].countryInfo.long], 6);
    }
  }
}
export default { generateMap, focusOnCountry };
