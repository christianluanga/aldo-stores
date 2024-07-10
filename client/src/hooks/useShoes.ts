import { useEffect, useState } from "react";
import { DocumentNode, useQuery } from "@apollo/client";
import { GET_ALL_SHOES_IN_STOCK } from "../graphql";
import { ShoeDTO } from "../types";
import { useInventoryRequest } from "./useInventoryRequest";
import { useShoeSale } from "./useShoeSale";

/**
 * Custom hook to manage the state of shoes, including fetching and real-time updates.
 * @param query - GraphQL query to fetch shoes data.
 * @param variables - Variables for the GraphQL query.
 * @returns Loading status, error, list of shoes, and updated shoe.
 */
const useShoes = (query: DocumentNode = GET_ALL_SHOES_IN_STOCK, variables: any = {}) => {

  const { loading, error, data } = useQuery<{ shoes: ShoeDTO[] }>(query, {
    fetchPolicy: "no-cache",
    ...variables,
  });

  const [shoes, setShoes] = useState<ShoeDTO[]>([]);

  useEffect(() => {
    if (data) {
      setShoes(data.shoes);
    }
  }, [data]);

  //Update a shoe inventory when a shoe is sold 
  const { updatedShoe } = useShoeSale(shoes, setShoes);

  //Update a shoe invontory when requesting an invontory from another store
  useInventoryRequest(shoes, setShoes);

  return { loading, error, shoes, updatedShoe };
};

export default useShoes;
