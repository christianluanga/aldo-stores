import React, { useState } from 'react';
import { ShoeDTO } from '../types';
import { LOW_STOCK } from './constants/constants';

const StoreCard = ({ shoe, handleSubmit }: {shoe: ShoeDTO, handleSubmit: any}) => {
    const { model, inventory } = shoe
  const [shoeCount, setShoeCount] = useState(0);

  const imageUrl = `https://placehold.co/400x300?text=${encodeURIComponent(model)}`;

  const handleAddItem = () => {
    if (shoeCount < inventory!) {
      setShoeCount(shoeCount + 1);
    }
  };

  const handleRemoveItem = () => {
    if (shoeCount > 0) {
      setShoeCount(shoeCount - 1);
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value
    if (!isNaN(value) && value >= 0 && value <= inventory!) {
      setShoeCount(value);
    }
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white hover:shadow-xl transform transition duration-300 ease-in-out hover:scale-110 hover:cursor-pointer">
      <img className="w-full" src={imageUrl} alt={model} />
      <div className="flex items-center justify-center px-6 py-[2rem]">
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold px-6 rounded mr-2 ${shoeCount === shoe.inventory && 'opacity-50 cursor-not-allowed'}`}
          onClick={handleAddItem}
        >
          <span>+</span>
        </button>
        <input
          type="number"
          value={shoeCount}
          onChange={handleInputChange}
          className="w-12 text-center border border-gray-300 rounded"
          min="0"
          max={inventory}
        />
        <button
          className={`bg-red-500 hover:bg-red-700 text-white font-bold px-6 rounded ml-2 ${shoeCount === 0 && 'opacity-50 cursor-not-allowed'}`}
          onClick={handleRemoveItem}
        >
          <span className='mb-2 pb-2'>-</span>
        </button>
      </div>
      <div className="px-4 py-2 flex justify-center">
        <button
          className={`w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${shoeCount === 0 && 'opacity-50 cursor-not-allowed'}`}
          onClick={()=>{
            handleSubmit({shoeId: shoe.id, quantity: shoeCount});
            setShoeCount(0)
          }}
          disabled={shoeCount === 0}
        >
          Buy
        </button>
      </div>
      <div className={`text-gray-700 px-4 py-2 mt-2 text-md text-center ${inventory! < LOW_STOCK ? 'bg-red-500' : 'bg-gray-200'}`}>
        {inventory} in stock
      </div>
    </div>
  );
};

export default StoreCard;
