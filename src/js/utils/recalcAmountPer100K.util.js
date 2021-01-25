const PEOPLE = 100000;

const recalcAmount = (value, population) => ((value * PEOPLE) / population).toFixed(2);

export default recalcAmount;
