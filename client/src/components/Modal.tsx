import React, { useState } from 'react';
import Modal from 'react-modal';
import { ShoeDTO, inventoryRequestProps } from '../types'; 

interface RequestModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  selectedShoe: ShoeDTO;
  modelShoes: ShoeDTO[];
  onSubmitRequest: (details: inventoryRequestProps) => void;
}

//Minimum invetory for a shoe to be allowed to complete an inventory transfer
const MIN_INVENTORY = 150

const RequestModal: React.FC<RequestModalProps> = ({
  isOpen,
  onRequestClose,
  selectedShoe,
  modelShoes,
  onSubmitRequest,
}) => {
  const [amount, setAmount] = useState(0);
  const [selectedStoreId, setSelectedStore] = useState(0);

  const handleSubmit = () => {
    if (amount > 0 && selectedStoreId) {
      onSubmitRequest({
        requestedAmount: amount, 
        toStoreId: parseInt((selectedShoe.store?.id!).toString()),
        fromStoreId: selectedStoreId,
        shoeId: parseInt(selectedShoe.id.toString())
        });
      setAmount(0);
      setSelectedStore(0);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2 className="text-xl font-medium mb-4">{selectedShoe?.store?.name} Store requests {amount} item(s) of {selectedShoe?.model}</h2>
      <p className="mb-2">Enter the amount to request:</p>
      <input
        type="number"
        value={amount}
        onChange={(e)=>setAmount(parseInt(e.target.value))}
        className="border p-2 rounded mb-4"
        min={0}
      />
      <p className="mb-2">Select a store with sufficient inventory:</p>
      <select
        value={selectedStoreId}
        onChange={(e)=>setSelectedStore(+e.target.value)}
        className="border p-2 rounded mb-4"
      >
        <option value="">Select Store</option>
        {modelShoes
          .filter(shoe => shoe.inventory! >= MIN_INVENTORY)
          .map(shoe => (
            <option key={shoe.store?.id} value={shoe.store?.id}>
              {shoe.store?.name} ({shoe.inventory} items)
            </option>
          ))}
      </select>
      <div className="flex justify-end">
        <button
          className={`px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 mr-8 
            ${amount === 0 || selectedStoreId === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSubmit}
          disabled={amount === 0 || selectedStoreId === 0}
        >
          Submit
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
          onClick={onRequestClose}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default RequestModal;
