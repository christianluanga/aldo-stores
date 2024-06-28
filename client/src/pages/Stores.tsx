import React from 'react';
import { useQuery } from '@apollo/client';
import StoreCard from '../components/StoreCard';
import { StoreDTO } from '../types';
import { GET_STORES } from '../graphql';

const StoreList = () => {
  const { loading, error, data } = useQuery<{ stores: StoreDTO[] }>(GET_STORES);

  if (loading) return <p>Loading Stores...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="card-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl p-4">
        {data?.stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
};

export default StoreList;
