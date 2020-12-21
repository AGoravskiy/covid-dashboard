const mapOptions = {
  center: [17.385044, 8.486671],
  zoom: 2,
};
export const map = new L.map('mymap', mapOptions);
const layer = new L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
  maxZoom: 20,
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
});
map.addLayer(layer);

const countries = [];
const legenBox = [];
const activeIndex = [];

export function focusOnCountry(data, chooseCountry) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].country === chooseCountry) {
      map.setView([data[i].countryInfo.lat, data[i].countryInfo.long], 5);

      const c = L.circle([data[i].countryInfo.lat, data[i].countryInfo.long], {
        color: '#08306b',
        fillOpacity: 0.3,
        radius: 300000,
        className: 'blink',
      }).addTo(map);
      setTimeout(() => { c.removeFrom(map); }, 3000);
    }
  }
}

export function addMarker(data, index) {
  activeIndex.length = 0;
  activeIndex.push('index');
  if (countries.length > 0) {
    countries.forEach((item) => {
      item.removeFrom(map);
    });
    countries.length = 0;
  }

  if (legenBox.length > 0) {
    legenBox.forEach((item) => {
      item.remove(map);
    });
    legenBox.length = 0;
  }

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
    colors = ['#14075b','#08306b', '#08519c', '#2171b5', '#4292c6', '#6baed6', '#9ecae1', '#c6dbef'];
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

  for (let i = 0; i < data.length; i++) {
    countries.push(L.circle([data[i].countryInfo.lat, data[i].countryInfo.long], {
      color: getColor(data[i][index]),
      fillColor: getColor(data[i][index]),
      fillOpacity: 0.5,
      radius: 100000,
      country: data[i].country,
    }).addTo(map).bindPopup(
      `
            <b>${data[i].country}</b><img style="height:100%" src = ${data[i].countryInfo.flag} ><br>
            ${index}: <b>${data[i][index]}</b>
            `,
    ));
  }
  countries.forEach((item) => {
    item.addEventListener('mouseover', () => {
      item.openPopup();
    });
  });
  countries.forEach((item) => {
    item.addEventListener('mouseout', () => {
      item.closePopup();
    });
  });
  countries.forEach((item) => {
    item.addEventListener('click', () => {
      focusOnCountry(data, item.options.country);
    });
  });
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');

    div.innerHTML += `<div class="map-legend-title">${index} :</div>`;
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML
            += `   
                <div class="map-legen-marker" style="background: ${getColor(grades[i] + 1)}">
                    ${grades[i]}${(grades[i + 1] ? `&ndash;${grades[i + 1]}<br>` : '+')}
                </div>
            `;
    }
    return div;
  };
  legend.addTo(map);
  legenBox.push(legend);
}

const mapBottons = L.control({ position: 'bottomleft' });
mapBottons.onAdd = function () {
  const div = L.DomUtil.create('div', 'map-bottons');
  div.innerHTML += '<div id ="cases" class="map-botton">Cases</div>';
  div.innerHTML += '<div id ="recovered" class="map-botton">Recovered</div>';
  div.innerHTML += '<div id ="deaths" class="map-botton">Deaths</div>';
  return div;
};
mapBottons.addTo(map);

export function addButtons(data) {
  const recovered = document.getElementById('recovered');
  recovered.addEventListener('click', () => {
    addMarker(data, 'recovered');
  });
  const cases = document.getElementById('cases');
  cases.addEventListener('click', () => {
    addMarker(data, 'cases');
  });
  const deaths = document.getElementById('deaths');
  deaths.addEventListener('click', () => {
    addMarker(data, 'deaths');
  });
}
