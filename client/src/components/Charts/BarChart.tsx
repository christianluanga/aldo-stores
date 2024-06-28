import React, { useState } from 'react';
import { aggregateSales, getTopItems } from './chartUtils';
import { chartOptions, colors, Bar } from './chartConfig';
import { OrderDTO } from '../../types';

const BarChart: React.FC<{orders: OrderDTO[]}> = ({ orders }) => {
  const [storeCount, setStoreCount] = useState(5);

  const storeSales = aggregateSales(orders, 'store');
  const topStores = getTopItems(storeSales, storeCount);

  const barData = {
    labels: topStores.map(([label]) => label),
    datasets: [
      {
        label: 'Sales',
        backgroundColor: colors.slice(0, storeCount),
        borderColor: colors.slice(0, storeCount),
        borderWidth: 1,
        hoverBackgroundColor: colors.slice(0, storeCount),
        hoverBorderColor: colors.slice(0, storeCount),
        data: topStores.map(([, value]) => value),
      },
    ],
  };

  return (
    <div>
        <div className="text-center">
            <div className="flex items-center justify-evenly mb-4">
                <h2 className="text-xl font-bold mr-2 text-gray-600">Top {storeCount} Stores by Sales</h2>
                <select
                value={storeCount}
                onChange={(e) => setStoreCount(+e.target.value)}
                className="p-2 border border-gray-300 rounded w-32"
                >
                {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
                </select>
            </div>
        </div>
        <div className="h-[350px]">
            <Bar data={barData} options={chartOptions} />
        </div>
    </div>
  );
};

export default BarChart;
