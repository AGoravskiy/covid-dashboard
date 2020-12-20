const addSpaces = (number) => {
  const str = number.toString();
  return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1\u00A0');
};

export default addSpaces;
