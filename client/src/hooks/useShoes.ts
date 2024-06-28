import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_SHOES_IN_STOCK, GET_STORE_INVENTORY } from "../graphql";
import { ShoeDTO } from "../types";
import { io } from "socket.io-client";
import { shoeMatched } from "../utils";

const socket = io(process.env.REACT_APP_SERVER_URL!);

const useShoes = ({
  storeId = undefined,
  source,
}: {
  source: "INVENTORY" | "STOCK";
  storeId?: number;
}) => {
  const query =
    source === "INVENTORY" ? GET_STORE_INVENTORY : GET_ALL_SHOES_IN_STOCK;
  const variables = storeId ? { variables: { storeId } } : {};

  const { loading, error, data } = useQuery<{ shoes: ShoeDTO[] }>(query, {
    fetchPolicy: "no-cache",
    ...variables,
  });

  const [updatedShoe, setUpdatedShoe] = useState<ShoeDTO | null>(null);
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
          shoeMatched({
            shoeId: prevShoe.id,
            updatedShoeId: updatedShoe.id,
            shoeStoreId: prevShoe.store?.id!,
            updatedShoeStoreId: updatedShoe.store?.id!,
          })
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
    const handleInventoryRequest = ({fromShoe, toShoe}: { fromShoe: ShoeDTO, toShoe: ShoeDTO}) => {
      setShoes((prevShoes) =>
        prevShoes.map((shoe) => {
          const shoeProps = { shoeId: shoe.id, shoeStoreId: shoe.store?.id! };

          if (
            shoeMatched({
              ...shoeProps,
              updatedShoeId: fromShoe.id,
              updatedShoeStoreId: fromShoe.store?.id!,
            })
          ) {
            return {
              ...fromShoe,
              updatedAt: `${new Date(fromShoe.updatedAt!).getTime()}`,
            };
          }
          if (
            shoeMatched({
              ...shoeProps,
              updatedShoeId: toShoe.id,
              updatedShoeStoreId: toShoe.store?.id!,
            })
          ) {
            return {
              ...toShoe,
              updatedAt: `${new Date(toShoe.updatedAt!).getTime()}`,
            };
          }
          return shoe;
        })
      );
    };

    socket.on("inventoriesUpdated", handleInventoryRequest);

    return () => {
      socket.off("inventoriesUpdated", handleInventoryRequest);
    };
  }, []);

  return { loading, error, shoes, updatedShoe };
};

export default useShoes;
