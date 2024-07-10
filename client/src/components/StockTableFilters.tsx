import React, { useState, useEffect } from 'react';
import { ShoeDTO } from '../types';

interface FiltersProps {
  shoes: ShoeDTO[]
  isLowInStock: boolean;
  handleSeeLowInStock: () => void;
  currentPage: (index: number) => void;
}

const Filters: React.FC<FiltersProps> = ({
  shoes,  
  isLowInStock,
  handleSeeLowInStock,
  currentPage,
}) => {
  const [filterModel, setFilterModel] = useState('');
  const [filterStore, setFilterStore] = useState('');

  const shoeModels = Array.from(new Set(shoes.map((shoe) => shoe.model)));
  const stores = Array.from(new Set(shoes.map((shoe) => shoe.store?.name)));
  
  useEffect(() => {
    currentPage(1);
  }, [filterModel, setFilterStore]);

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4 filters">
      <select
        className="border p-2 rounded"
        value={filterModel}
        onChange={(e) => setFilterModel(e.target.value)}
        disabled={isLowInStock}
      >
        <option value="">Filter by Model</option>
        {shoeModels.map((model, index) => (
          <option key={index} value={model}>
            {model}
          </option>
        ))}
      </select>
      <select
        className="border p-2 rounded"
        value={filterStore}
        onChange={(e) => setFilterStore(e.target.value)}
        disabled={isLowInStock}
      >
        <option value="">Filter by Store</option>
        {stores.map((store, index) => (
          <option key={index} value={store}>
            {store}
          </option>
        ))}
      </select>
      {isLowInStock && (
        <p
          onClick={handleSeeLowInStock}
          className="text-red-700 pt-2 text-center text-lg font-semibold ml-8 cursor-pointer"
        >
          Clear and see all shoes
        </p>
      )}
    </div>
  );
};

export default Filters;
