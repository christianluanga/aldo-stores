import React, { useState, useEffect } from 'react';
import { aggregateSales, getTopItems, getStoresWithMostItems } from './chartUtils';
import { chartOptions, colors, Pie } from './chartConfig';
import { OrderDTO } from '../../types';

const PieChart: React.FC<{orders: OrderDTO[]}> = ({ orders }) => {
  
  const [shoeCount, setShoeCount] = useState<number>(5);
  // Initialize selectedStore with the store that sold the most distinct items
  const storesWithMostItems = getStoresWithMostItems(orders, shoeCount);
  const initialSelectedStore = storesWithMostItems.length > 0 ? storesWithMostItems[0][0] : '';
  
  const [selectedStore, setSelectedStore] = useState<string>(initialSelectedStore);

  useEffect(() => {
    setShoeCount(5);
  }, [selectedStore]);

  const selectedStoreShoeSales = aggregateSales(
    orders.filter(order => order.shoe.store?.name === selectedStore),
     'shoe'
  );
  const selectedStoreTopShoes = getTopItems(selectedStoreShoeSales, shoeCount);

  const storesWithSales = Array.from(new Set(orders.map(order => order.shoe.store?.name))) as string[];

  const pieData = {
    labels: selectedStoreTopShoes.map(([label]) => label),
    datasets: [
      {
        data: selectedStoreTopShoes.map(([, value]) => value),
        backgroundColor: colors.slice(0, selectedStoreTopShoes.length),
        hoverBackgroundColor: colors.slice(0, selectedStoreTopShoes.length),
      },
    ],
  };

  return (
    <div className='pt-10'>
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4 text-gray-600">Top { shoeCount } shoes sold by store</h2>
        <div className="flex justify-center mb-4">
          <select
            value={selectedStore}
            onChange={(e)=>setSelectedStore(e.target.value)}
            className="mr-2 p-2 border border-gray-300 rounded"
          >
            {storesWithSales.map((storeName) => (
              <option key={storeName} value={storeName}>{storeName}</option>
            ))}
          </select>
          <select
            value={shoeCount}
            onChange={(e)=>setShoeCount(+e.target.value)}
            className="p-2 border border-gray-300 rounded w-20"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="relative h-96 mt-8 mx-auto w-11/12 md:w-3/4">
        <Pie data={pieData} options={chartOptions} />
      </div>
    </div>
  );
};

export default PieChart;
