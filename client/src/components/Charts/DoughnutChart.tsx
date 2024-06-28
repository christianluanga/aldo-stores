import React, { useState, useEffect } from 'react';
import { aggregateSales, getTopItems } from './chartUtils';
import { chartOptions, colors, Doughnut } from './chartConfig';
import { OrderDTO } from '../../types';

const DoughnutChart: React.FC<{ orders: OrderDTO[] }> = ({ orders }) => {
  const [shoeCount, setShoeCount] = useState(5);
  const [showLeastSold, setShowLeastSold] = useState(false);
  const [topShoesState, setTopShoesState] = useState<any[]>([]);

  useEffect(() => {
    const shoeSales = aggregateSales(orders, 'shoe');
    const topShoes = getTopItems(shoeSales, shoeCount, !showLeastSold);
    setTopShoesState(topShoes);
  }, [orders, shoeCount, showLeastSold]);

  return (
    <div>
      <div className="text-center">
        <div className="flex items-center justify-evenly mb-4">
          <h2 className="text-xl font-bold text-gray-600">
            {`${showLeastSold ? `${shoeCount} Least Sold Shoes` : `${shoeCount} Most Sold Shoes`} across all stores`}
          </h2>
          <select
            value={shoeCount}
            onChange={(e) => setShoeCount(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded w-32"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <div className="flex items-center">
            <label className="mr-2">See Least Sold</label>
            <input
              type="checkbox"
              checked={showLeastSold}
              onChange={()=>setShowLeastSold(!showLeastSold)}
              className="rounded-full h-6 w-6"
            />
          </div>
        </div>
      </div>
      <div className="h-[350px]">
        <Doughnut data={{
          labels: topShoesState.map(([label]) => label),
          datasets: [
            {
              data: topShoesState.map(([, value]) => value),
              backgroundColor: colors.slice(0, shoeCount),
              hoverBackgroundColor: colors.slice(0, shoeCount),
            },
          ],
        }} options={chartOptions} />
      </div>
    </div>
  );
};

export default DoughnutChart;
