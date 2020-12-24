import totalDateCount from '../utils/totalDateCounter.util';
import divide from '../utils/divider.util'

const allTimeStatsChart = {
path: `historical/all?lastdays=${totalDateCount()}`,
};


export default allTimeStatsChart;
