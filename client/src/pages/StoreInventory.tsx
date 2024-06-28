import React from 'react';
import { capitalize, orderBy } from 'lodash'
import { useMutation } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { ShoeDTO, ShoeSaleDTO } from '../types';
import { UPDATE_STORE_INVENTORY } from '../graphql';
import ShoeCard from '../components/ShoeCard';
import useShoes from '../hooks/useShoes';
import { toastAlert } from '../utils';
import { ToastContainer, toast } from '../components/TosatifyConfig'

const StoreInventory: React.FC = () => {
  const location = useLocation();
  const { id, name } = location.state || { id: 1, name: 'No name' };

  const [updateStoreInventory] = useMutation(UPDATE_STORE_INVENTORY);

  const { loading, error, shoes } = useShoes({ source: 'INVENTORY', storeId: parseInt(id) });

  const handleTransactionProcessing = async ({ quantity, shoeId }: { quantity: number, shoeId: string }) => {
    const details: ShoeSaleDTO = {
      quantity,
      shoeId: parseInt(shoeId),
      storeId: parseInt(id),
    };

    try {
      const { data }: { data?: { shoe: ShoeDTO } } = await updateStoreInventory({ variables: { details } });
      toast.dismiss()
      toastAlert({
        type: 'success',
        message: `${quantity} unit(s) of  ${capitalize(data?.shoe.model)}`,
        options: {}
      })

    } catch (error) {
      console.error('Mutation error:', error);
      toastAlert({
        type: 'success',
        message: 'Transaction not completed. Something went wrong',
        options: {}
      })
    }
  };

  if (loading) return <p>Loading Stores...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <React.Fragment>
      <ToastContainer />
      <p className="text-lg text-gray-500 ml-6 my-4 sticky top-0 z-50">
        You are shopping at <span className='font-semibold'>{' ' + name} </span>store
      </p>
      <div className="min-h-screen flex justify-center items-center">
        <div className="card-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl p-4">
          {orderBy(shoes, ['model'], ['asc']).map((shoe) => (
            <ShoeCard key={shoe.id} shoe={shoe} handleSubmit={handleTransactionProcessing} />
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default StoreInventory;
