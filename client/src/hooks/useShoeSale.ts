import { useEffect, useRef, useState } from "react";
import { ShoeDTO } from "../types";
import { handleShoeUpdateOnSale } from "./helpers";
import { socket } from "../socketioConfig";

/**
 * Custom hook to handle shoe sale updates via socket event when a shoe is sold.
 * @param shoes - The current list of shoes.
 * @param setShoes - Function to update the list of shoes.
 * @returns The updated shoe.
 */
export const useShoeSale = (
  shoes: ShoeDTO[],
  setShoes: (shoes: ShoeDTO[]) => void
) => {
  const [updatedShoe, setUpdatedShoe] = useState<ShoeDTO | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let timeId: NodeJS.Timeout;

    const onSaleCompleted = (updatedShoe: ShoeDTO) => {
      setShoes(handleShoeUpdateOnSale(updatedShoe, shoes));
      setUpdatedShoe(updatedShoe);

      // Used to highlight the updated shoe row on the inventory table for time t
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      timeoutIdRef.current = setTimeout(() => setUpdatedShoe(null), 3000);
    };

    // Listen for a server emitted event with the updated shoe object
    socket.on("saleCompleted", onSaleCompleted);

    return () => {
      socket.off("saleCompleted", onSaleCompleted);
      clearTimeout(timeId);
    };
  }, [shoes]);

  return { updatedShoe };
};
