import React from 'react';
import { ShoeDTO } from '../types';

const Banner: React.FC<{ lowCountItems: ShoeDTO[], handleClick: () => void }> = ({ lowCountItems, handleClick }) => {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-red-300 overflow-hidden py-8 rounded-tl-lg rounded-br-xl mb-12">
      <div className="relative flex flex-col items-center justify-center text-center text-white">
        <p className="text-4xl text-red-300 blink-text">ALERT!</p>
        <p className="text-xl font-bold my-4 animate-move ">
          {lowCountItems.length} {lowCountItems.length === 1 ? ' shoe is' : ' shoes are '} 
          running low on inventory.
        </p>
        <button
          className="mt-4 py-2 px-4 rounded bg-gray-500 hover:bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
          onClick={handleClick}
        >
          SHOW ME !
        </button>
      </div>
    </div>
  );
};

export default Banner;
