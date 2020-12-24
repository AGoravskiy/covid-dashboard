

function getChartDate(obj,index) {
  
    const Arr = Object.entries(obj);
  Arr.forEach((el) => data.push(el[index]));
  return data;
}

export default getChartDate;
