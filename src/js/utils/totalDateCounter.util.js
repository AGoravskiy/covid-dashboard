function totalDateCount() {
  const pandemiaStart = new Date(2020, 0, 22, 0, 0, 0, 0);
  const currentDate = new Date();
  const timeConvert = 86400000;
  console.log(Math.round((currentDate - pandemiaStart) / timeConvert));
  return Math.round((currentDate - pandemiaStart) / timeConvert);
}

export default totalDateCount;
