// есть график, который строится по общему количеству случаев заболевания +10
// есть возможность просмотреть график по любому из выбранных показателей из тех, которые выводятся в таблице +20
// при наведении курсора на график появляется всплывающая подсказка с датой, соответствующей этой точке графика и данными по этой дате
// есть возможность просмотреть график как для мира в целом, так и для любой выбранной страны +10

// const dailyCases //число заболевших по дням за все время. Столбчатая, каждый стоблик = 1 день. Легенда: день и кол-во за этот день
// const dailyDeath //число смертей по дням за все время. Столбчатая, каждый стоблик = 1 день Легенда: день и кол-во
// const dailyRecovered //число выздоровевших по дням за все время. Столбчатая, каждый стоблик = 1 день Легенда: день и кол-во

// сonst totalCases // кривая, в ней накапливается сумма случаев.
// сonst totalDeath // кривая, в ней накапливается сумма случаев.
// сonst totalRecovered // кривая, в ней накапливается сумма случаев.

// function per100KCitizens(amount){
//   const per100k = amount / 100000;
//   const per100KStatus = true;
//   return per100k, per100KStatus
// }

import Chart from "chart.js";
let ctx = document.getElementById("chart-field").getContext("2d");

const pandemiaStart = new Date(2020, 0, 22, 0, 0, 0, 0);
const currentDate = new Date();
const timeConvert = 86400000;
let pandemiaLength = Math.round((currentDate - pandemiaStart) / timeConvert);

const allTimeCases = [];
const totalCases = `https://disease.sh/v3/covid-19/historical/all?lastdays=${pandemiaLength}`;

//может быть универсальная функция, которой надо сообщить урл и свойство, она из него свернет массив
const dates = [];
const cases = [];

function getData(url) {
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      const casesArr = Object.entries(res.cases);
      casesArr.forEach((element) => {
        allTimeCases.push(element);
      });
      allTimeCases.forEach((el) => {
        dates.push(el[0]);
        cases.push(el[1]);
      });
      console.log(dates);
      console.log(cases);

      const myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: dates,
          datasets: [
            {
              label: "Cases",
              data: cases,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    });
}

//в функцию надо передоавать url, тип графика, ось X, название. Потом подумать, как это поделить на кусочкиё

// console.log(allTimeCases);
// console.log(allTimeCases[0]);
// console.log(typeof allTimeCases);

// const tempArr = allTimeCases;
// tempArr.forEach((el) => {
//   console.log(el);
// });

getData(totalCases);

// console.log(Object.entries(allTimeCases));

for (let i = 0; i < allTimeCases.length; i++) {
  console.log(allTimeCases.length);
}

// console.log(allTimeCases.keys);

// function passData() {}
