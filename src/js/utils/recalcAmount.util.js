const PEOPLE = 100000;

const recalcAmount = (value, population) => Math.round((value * PEOPLE) / population);

export default recalcAmount;
