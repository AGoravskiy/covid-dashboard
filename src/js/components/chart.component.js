/* eslint-disable no-console */

import Chart from 'chart.js';
import utils from '../utils/index.util';

utils.divide(23);
const ctx = document.getElementById('chart-field').getContext('2d');

function generateChart(datesOnXaxis, numbers, dataLabel) {
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: datesOnXaxis,
      datasets: [
        {
          label: dataLabel,
          data: numbers,
          backgroundColor: [

          ],
          borderColor: [

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
}

export default generateChart;
