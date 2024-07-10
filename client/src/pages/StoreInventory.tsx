import React, { useEffect, useState } from "react";
import { capitalize, orderBy } from "lodash";
import { useMutation, useQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";
import { ShoeDTO, ShoeSaleDTO } from "../types";
import { GET_STORE_INVENTORY, UPDATE_STORE_INVENTORY } from "../graphql";
import ShoeCard from "../components/ShoeCard";
import { toastAlert } from "../utils";
import { ToastContainer, toast } from "../components/TosatifyConfig";
import { isUpdatedShoe } from "../hooks/helpers";
import { socket } from "../socketioConfig";

const StoreInventory: React.FC = () => {
  const location = useLocation();
  const { id: storeId, name } = location.state || { id: 1, name: "No name" };

  const { loading, error, data } = useQuery<{ shoes: ShoeDTO[] }>(GET_STORE_INVENTORY, {
    fetchPolicy: "no-cache",
    variables: { storeId: +storeId },
  });

  const [shoes, setShoes] = useState<ShoeDTO[]>([]);

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
    };

    //Listen for a server emitted event with the update shoe object
    socket.on("saleCompleted", handleSaleCompleted);

    return () => {
      socket.off("saleCompleted", handleSaleCompleted);
      clearTimeout(timeId);
    };
  }, [shoes]);

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

  const [updateStoreInventoryMutation] = useMutation(UPDATE_STORE_INVENTORY);

  const handleTransactionProcessing = async ({
    quantity,
    shoeId,
  }: {
    quantity: number;
    shoeId: string;
  }) => {
    const details: ShoeSaleDTO = {
      quantity,
      shoeId: parseInt(shoeId),
      storeId: parseInt(storeId),
    };

    try {
      const { data }: { data?: { shoe: ShoeDTO } } =
        await updateStoreInventoryMutation({ variables: { details } });

      toast.dismiss();
      toastAlert({
        type: "success",
        message: `${quantity} unit(s) of  ${capitalize(data?.shoe.model)} sold`,
        options: {},
      });
    } catch (error) {
      console.error("Mutation error:", error);
      toastAlert({
        type: "success",
        message: "Transaction not completed. Something went wrong",
        options: {},
      });
    }
  };

  if (loading) return <p>Loading Stores...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <React.Fragment>
      <ToastContainer />
      <p className="text-lg text-gray-500 ml-6 my-4 sticky top-0 z-50">
        You are shopping at <span className="font-semibold">{" " + name} </span>
        store
      </p>
      <div className="min-h-screen flex justify-center items-center">
        <div className="card-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl p-4">
          {orderBy(shoes, ["model"], ["asc"]).map((shoe) => (
            <ShoeCard
              key={shoe.id}
              shoe={shoe}
              handleSubmit={handleTransactionProcessing}
            />
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default StoreInventory;
