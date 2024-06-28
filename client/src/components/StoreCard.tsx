import React from 'react';
import { StoreDTO } from '../types';
import { Link } from 'react-router-dom';

const StoreCard = ({ store }: { store: StoreDTO }) => {
  const imageUrl = `https://placehold.co/400x300?text=${encodeURIComponent(store.name)}`;
  const { guid, id, name } = store;

  return (
    <Link 
      to={`/store/${guid}`} 
      state={{ id, name }}
      className="block"
    >
      <div className="mb-4 max-w-sm rounded overflow-hidden shadow-lg bg-white hover:shadow-xl transform transition duration-300 ease-in-out hover:scale-110 hover:cursor-pointer">
        <img className="w-full" src={imageUrl} alt={name} />
        <div className="px-6 py-[2rem]">
          <p className="text-gray-800 text-base text-center">{name}</p>
        </div>
      </div>
    </Link>
  );
};

export default StoreCard;
