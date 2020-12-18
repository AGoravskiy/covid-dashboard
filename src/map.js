const mapOptions = {
        center: [17.385044, 8.486671],
        zoom: 2,
    }
export let map = new L.map('mymap', mapOptions);
    const layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    map.addLayer(layer);

export let countries = [];
export let legenBox = [];


export function addMarker(data,index) {
    if (countries.length > 0){
        countries.forEach((item) => {
            item.removeFrom(map)
        })
        countries.length = 0;
    };

    if (legenBox.length > 0){
        legenBox.forEach((item) => {
            item.remove(map)
        })
        legenBox.length = 0;
    };
    

    function getColor(d) {

        return d > 2000000 ? '#800026' :
                d > 1500000  ? '#BD0026' :
                d > 1000000  ? '#E31A1C' :
                d > 500000  ? '#FC4E2A' :
                d > 100000   ? '#FD8D3C' :
                d > 10000   ? '#FEB24C' :
                d > 1000   ? '#FED976' :
                            '#FFEDA0';
        }

    for(let i = 0; i < data.length ; i++){
        countries.push(L.circle([data[i].countryInfo.lat, data[i].countryInfo.long], {
            color: getColor(data[i][index]),
            fillColor: getColor(data[i][index]),
            fillOpacity: 0.5,
            // radius: data[i].cases < 100000? data[i].cases * 5 : data[i].cases/10
            // radius: data[i][index] /10
            radius: 200000
        }).addTo(map).bindPopup(
            `
            <b>${data[i].country}</b><img style="height:100%" src = ${data[i].countryInfo.flag} ><br>
            ${index}: <b>${data[i][index]}</b>
            `
            )
        )
    };
    countries.forEach((item) => {
        item.addEventListener('mouseover',(event) => {
            item.openPopup()
        })
    })
    countries.forEach((item) =>{
        item.addEventListener('mouseout',(event) => {
        item.closePopup()
        })
    })
    
    let  legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [1000, 10000, 100000, 500000, 1000000, 1500000, 2000000],
        labels = [];

    div.innerHTML += `<div class="map-legend-title">${index} :</div>`;
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            `   
                <div class="map-legen-marker" style="background: ${getColor(grades[i] + 1)}">
                    ${grades[i]}${(grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')}
                </div>
                

            `    
    }
    return div;
    };
    legend.addTo(map);
    legenBox.push(legend);


} 
