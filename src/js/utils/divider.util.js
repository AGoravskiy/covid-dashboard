function divide(data) {
  const allTimeCases = [];
  const dates = [];
  const cases = [];
  const casesArr = Object.entries(data);
  casesArr.forEach((element) => {
    allTimeCases.push(element);
  });
  allTimeCases.forEach((el) => {
    dates.push(el[0]);
    cases.push(el[1]);
  });
  
  return [dates, cases];
}

export default divide;
