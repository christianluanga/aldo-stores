import { useEffect } from "react";
import { ShoeDTO } from "../types";
import { handleInventoryRequest } from "./helpers";
import { socket } from "../socketioConfig";

/**
 * Custom hook to handle inventory updates via socket event when requesting inventory from another.
 * @param shoes - The current list of shoes.
 * @param setShoes - Function to update the list of shoes.
 */
export const useInventoryRequest = (shoes: ShoeDTO[], setShoes: (shoes: ShoeDTO[]) => void) => {

  useEffect(() => {
    const onInventoryUpdate = ({ fromShoe, toShoe }: { fromShoe: ShoeDTO, toShoe: ShoeDTO }) => {
      setShoes(handleInventoryRequest({ fromShoe, toShoe, shoes }));
    };

    socket.on("inventoriesUpdated", onInventoryUpdate);

    return () => {
      socket.off("inventoriesUpdated", onInventoryUpdate);
    };
  }, [shoes]);
};
