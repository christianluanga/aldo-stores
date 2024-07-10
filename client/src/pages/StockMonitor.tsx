import React, { useState, useEffect } from "react";
import { orderBy } from "lodash";
import { DateTime } from "luxon";
import useShoes from "../hooks/useShoes";
import { toast, ToastContainer } from "../components/TosatifyConfig";
import RequestModal from "../components/Modal";
import Banner from "../components/LowStockBanner";
import { UPDATE_STORES_INVENTORY } from "../graphql";
import { useMutation } from "@apollo/client";
import { toastAlert } from "../utils";
import { LOW_STOCK } from "../components/constants/constants";
import { ShoeDTO, inventoryRequestProps } from "../types";

const ITEMS_PER_PAGE = 10;

const StockMonitor: React.FC = () => {
  const { loading, error, shoes, updatedShoe } = useShoes();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedShoe, setSelectedShoe] = useState<ShoeDTO | null>(null);
  const [filterModel, setFilterModel] = useState("");
  const [filterStore, setFilterStore] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLowInStock, setIsLowInStock] = useState(false);

  const [updateStoreInventories] = useMutation(UPDATE_STORES_INVENTORY);

  const handleInventoryRequest = async (details: inventoryRequestProps) => {
    try {
      await updateStoreInventories({ variables: { details } });

      toast.dismiss();
      toastAlert({
        type: "success",
        message: "Shoe inventory request successful",
        options: { autoClose: 3000, delay: 100 },
      });
    } catch (error) {
      console.error("Mutation error:", error);
    }

    setModalIsOpen(false);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filterModel, filterStore]);

  if (updatedShoe) {
    toast.dismiss();
    toastAlert({
      type: "success",
      message: "Shoe inventory updated!",
      options: {},
    });
  }

  const lowInStock = shoes.filter((shoe) => shoe.inventory! < LOW_STOCK);

  const getFilteredShoes = () => {
    if (isLowInStock) return lowInStock;

    return shoes.filter(
      (shoe) =>
        (!filterModel || shoe.model === filterModel) &&
        (!filterStore || shoe.store?.name === filterStore)
    );
  };

  // Put shoes with the most recent inventory update to the top
  const filteredShoes = orderBy(getFilteredShoes(), ["updatedAt"], ["desc"]);

  const totalPages = Math.ceil(filteredShoes.length / ITEMS_PER_PAGE);
  const paginatedShoes = filteredShoes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePagination = (direction: "back" | "forward") => {
    direction === "back"
      ? setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
      : setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleRequestAction = (shoe: ShoeDTO) => {
    setSelectedShoe(shoe);
    setModalIsOpen(true);
  };

  const handleSeeLowInStock = () => {
    setFilterModel("");
    setFilterStore("");
    setIsLowInStock(!isLowInStock);
  };

  if (loading) return <p>Loading Stores...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const shoeModels = Array.from(new Set(shoes.map((shoe) => shoe.model)));
  const stores = Array.from(new Set(shoes.map((shoe) => shoe.store?.name)));

  const getRowClasses = (
    shoe: ShoeDTO,
    index: number,
    updatedShoe: ShoeDTO
  ) => {
    const baseClass = index % 2 === 0 ? "bg-blue-50" : "bg-white";
    const updatedClass = shoe.id === updatedShoe?.id ? "bg-green-100" : "";
    const lowInventoryClass =
      !isLowInStock && shoe.inventory! < LOW_STOCK ? "bg-red-300 blink" : "";
    const hoverClass =
      !isLowInStock && shoe.inventory! < LOW_STOCK
        ? "hover:text-white"
        : "hover:bg-blue-100";

    return `${baseClass} ${updatedClass} ${lowInventoryClass} ${hoverClass} transition duration-300 ease-in-out`;
  };

  return (
    <div className="container mx-auto my-8 px-4">
      {lowInStock.length >= 1 && (
        <Banner lowCountItems={lowInStock} handleClick={handleSeeLowInStock} />
      )}

      <ToastContainer />
      <RequestModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        selectedShoe={selectedShoe as ShoeDTO}
        modelShoes={shoes.filter((shoe) => shoe?.model === selectedShoe?.model)}
        onSubmitRequest={handleInventoryRequest}
      />
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-300 sticky top-0">
            <tr>
              <th className="px-4 py-2 border-b text-center w-16"></th>
              <th className="px-4 py-2 border-b text-center">Store</th>
              <th className="px-4 py-2 border-b text-center">Model</th>
              <th className="px-4 py-2 border-b text-center">Inventory</th>
              <th className="px-4 py-2 border-b text-center">Last Updated</th>
              <th className="px-4 py-2 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedShoes.map((shoe, index) => (
              <tr
                key={`${shoe.id}-${shoe.store?.id}`}
                className={getRowClasses(shoe, index, updatedShoe as ShoeDTO)}
              >
                <td className="px-4 py-3 border-b text-center">
                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </td>
                <td className="px-4 py-3 border-b text-center">
                  {shoe.store?.name}
                </td>
                <td className="px-4 py-3 border-b text-center">{shoe.model}</td>
                <td className="px-4 py-3 border-b text-center">
                  {shoe.inventory}
                </td>
                <td className="px-4 py-3 border-b text-center">
                  {shoe.updatedAt &&
                    DateTime.fromMillis(parseInt(shoe.updatedAt)).toRelative()}
                </td>
                <td className="px-4 py-2 border-b text-center">
                  {shoe.inventory && shoe.inventory < LOW_STOCK ? (
                    <button
                      className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
                      onClick={() => handleRequestAction(shoe)}
                    >
                      Request more stock
                    </button>
                  ) : (
                    "No action required"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center items-center space-x-4">
        <button
          className={`px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 ${
            currentPage === 1 && "opacity-50"
          }`}
          onClick={() => handlePagination("back")}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 ${
            currentPage === totalPages && "opacity-50"
          }`}
          onClick={() => handlePagination("forward")}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StockMonitor;
