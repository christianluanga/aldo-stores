import React, { useState, useEffect } from "react";
import { orderBy } from "lodash";
import { DateTime } from "luxon";
import { toast, ToastContainer } from "../components/TosatifyConfig";
import RequestModal from "../components/Modal";
import Banner from "../components/LowStockBanner";
import { GET_ALL_SHOES_IN_STOCK, UPDATE_STORES_INVENTORY } from "../graphql";
import { useMutation, useQuery } from "@apollo/client";
import { getRowClasses, toastAlert } from "../utils";
import { LOW_STOCK } from "../components/constants/constants";
import { ShoeDTO, inventoryRequestProps } from "../types";
import Pagination from "../components/Pagination";
import { isUpdatedShoe } from "../hooks/helpers";
import { socket } from "../socketioConfig";

const ITEMS_PER_PAGE = 10;

const StockMonitor: React.FC = () => {

  const { loading, error, data } = useQuery<{ shoes: ShoeDTO[] }>(GET_ALL_SHOES_IN_STOCK,{
    fetchPolicy: "no-cache",
  });

  const [shoes, setShoes] = useState<ShoeDTO[]>([]);
  const [updatedShoe, setUpdatedShoe] = useState<ShoeDTO | null>(null);

  useEffect(() => {
    if (data) {
      setShoes(data.shoes);
    }
  }, [data]);

  useEffect(() => {
    let timeId: NodeJS.Timeout;

    const handleSaleCompleted = (updatedShoe: ShoeDTO) => {
      setShoes((prevShoes) =>
        prevShoes.map((prevShoe) =>
          isUpdatedShoe(prevShoe, updatedShoe)
            ? {
                ...updatedShoe,
                updatedAt: `${new Date(updatedShoe.updatedAt!).getTime()}`,
              }
            : prevShoe
        )
      );

      setUpdatedShoe(updatedShoe);
      //Used to highlight to updated shoe row o the inventory table for t time
      timeId = setTimeout(() => setUpdatedShoe(null), 3000);
    };

    //Listen for a server emitted event with the update shoe object
    socket.on("saleCompleted", handleSaleCompleted);

    return () => {
      socket.off("saleCompleted", handleSaleCompleted);
      clearTimeout(timeId);
    };
  }, []);

  useEffect(() => {
    const handleInventoryRequest = ({
      fromShoe,
      toShoe,
    }: {
      fromShoe: ShoeDTO;
      toShoe: ShoeDTO;
    }) => {
      setShoes((prevShoes) =>
        prevShoes.map((prevShoe) => {
          if (isUpdatedShoe(prevShoe, fromShoe)) {
            return {
              ...fromShoe,
              updatedAt: `${new Date(fromShoe.updatedAt!).getTime()}`,
            };
          }
          if (isUpdatedShoe(prevShoe, toShoe)) {
            return {
              ...toShoe,
              updatedAt: `${new Date(toShoe.updatedAt!).getTime()}`,
            };
          }
          return prevShoe;
        })
      );
    };

    socket.on("inventoriesUpdated", handleInventoryRequest);

    return () => {
      socket.off("inventoriesUpdated", handleInventoryRequest);
    };
  }, []);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedShoe, setSelectedShoe] = useState<ShoeDTO | null>(null);
  const [filterModel, setFilterModel] = useState("");
  const [filterStore, setFilterStore] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLowInStock, setIsLowInStock] = useState(false);

  const [updateStoreInventories] = useMutation(UPDATE_STORES_INVENTORY);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterModel, filterStore]);

  useEffect(()=>{
    if (updatedShoe) {
      toast.dismiss()
      toastAlert({
        type: "success",
        message: "Shoe inventory updated!",
        options: {},
      });
    }
  }, [updatedShoe])

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
                className={getRowClasses(
                  shoe,
                  index,
                  updatedShoe as ShoeDTO,
                  isLowInStock
                )}
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default StockMonitor;
