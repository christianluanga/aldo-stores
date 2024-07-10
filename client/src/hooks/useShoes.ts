import { useEffect, useState } from "react";
import { DocumentNode, useQuery } from "@apollo/client";
import { GET_ALL_SHOES_IN_STOCK } from "../graphql";
import { ShoeDTO } from "../types";
import { useInventoryRequest } from "./useInventoryRequest";
import { useShoeSale } from "./useShoeSale";
import { isUpdatedShoe } from "./helpers";
import { socket } from "../socketioConfig";

/**
 * Custom hook to manage the state of shoes, including fetching and real-time updates.
 * @param query - GraphQL query to fetch shoes data.
 * @param variables - Variables for the GraphQL query.
 * @returns Loading status, error, list of shoes, and updated shoe.
 */
const useShoes = (
  query: DocumentNode = GET_ALL_SHOES_IN_STOCK,
  variables: any = {}
) => {
  const { loading, error, data } = useQuery<{ shoes: ShoeDTO[] }>(query, {
    fetchPolicy: "no-cache",
    ...variables,
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

  return { loading, error, shoes, updatedShoe };
};

export default useShoes;
