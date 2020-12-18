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

    let grades = [];
    let colors = [];
    if(index == "cases"){
        grades = [1000, 10000, 100000, 500000, 1000000, 1500000, 2000000];
        colors = ['#800026','#BD0026','#E31A1C','#FC4E2A','#FD8D3C','#FEB24C','#FED976','#FFEDA0'];
    }
    if(index == "recovered"){
        grades = [1000, 10000, 100000, 500000, 1000000, 1500000, 2000000];
        colors = ['#00441b','#006d2c','#238b45','#41ab5d','#74c476','#a1d99b','#c7e9c0','#e5f5e0'];
    }
    if(index == "deaths"){
        grades = [1000, 10000, 20000, 50000, 100000, 200000, 300000];
        colors = ['#08306b','#08519c','#2171b5','#4292c6','#6baed6','#9ecae1','#c6dbef','#deebf7'];
    }
    
    function getColor(d) {
        return d > grades[6] ? colors[0] :
                d > grades[5]  ? colors[1] :
                d > grades[4]  ? colors[2] :
                d > grades[3]  ? colors[3] :
                d > grades[2]   ? colors[4] :
                d > grades[1]   ? colors[5] :
                d > grades[0]   ? colors[6] :
                            colors[7];
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

const mapBottons = L.control({ position: 'bottomleft' });
mapBottons.onAdd = function(){
    const div = L.DomUtil.create('div', 'map-bottons');
    div.innerHTML += `<div id ="cases" class="map-botton">Cases</div>`;
    div.innerHTML += `<div id ="recovered" class="map-botton">Recovered</div>`;
    div.innerHTML += `<div id ="deaths" class="map-botton">Deaths</div>`;
    return div
}
mapBottons.addTo(map);

export function addButtons(data){
    let recovered = document.getElementById("recovered")
    recovered.addEventListener('click',(event) =>{
        addMarker(data, 'recovered');
    })
    let cases = document.getElementById("cases")
    cases.addEventListener('click',(event) =>{
        addMarker(data, 'cases');
    })
    let deaths = document.getElementById("deaths")
    deaths.addEventListener('click',(event) =>{
        addMarker(data, 'deaths');
})

}
