import { ShoeDTO } from "../types";

interface InvtoryUpdateProps {
  fromShoe: ShoeDTO;
  toShoe: ShoeDTO;
  shoes: ShoeDTO[];
}

/**
 * Checks if the provided shoe matches the updated shoe.
 * @param {ShoeDTO} previousShoe - The previous state of the shoe.
 * @param {ShoeDTO} updatedShoe - The updated state of the shoe.
 * @returns {boolean} - Returns true if the shoes match, false otherwise.
 */
export const isUpdatedShoe = (
  previousShoe: ShoeDTO,
  updatedShoe: ShoeDTO
): boolean => {
  return (
    previousShoe.guid === updatedShoe.guid &&
    previousShoe.store?.guid === updatedShoe.store?.guid
  );
};

/**
 * Updates the list of shoes with the updated shoe after a sale.
 * @param {ShoeDTO} updatedShoe - The updated state of the shoe.
 * @param {ShoeDTO[]} shoes - The current list of shoes.
 * @returns {ShoeDTO[]} - The updated list of shoes.
 */
export const handleShoeUpdateOnSale = (
  updatedShoe: ShoeDTO,
  shoes: ShoeDTO[]
) => {
  return shoes.map((prevShoe) =>
    isUpdatedShoe(prevShoe, updatedShoe)
      ? {
          ...updatedShoe,
          updatedAt: `${new Date(updatedShoe.updatedAt!).getTime()}`,
        }
      : prevShoe
  );
};

/**
 * Updates the list of shoes based on an inventory update.
 * @param {InventoryUpdateProps} - The fromShoe, toShoe, and current list of shoes.
 * @returns {ShoeDTO[]} - The updated list of shoes.
 */
export const handleInventoryRequest = ({
  fromShoe,
  toShoe,
  shoes,
}: InvtoryUpdateProps): ShoeDTO[] => {
  return shoes.map((shoe) => {
    if (isUpdatedShoe(shoe, fromShoe)) {
      return {
        ...fromShoe,
        updatedAt: `${new Date(fromShoe.updatedAt!).getTime()}`,
      };
    }
    if (isUpdatedShoe(shoe, toShoe)) {
      return {
        ...toShoe,
        updatedAt: `${new Date(toShoe.updatedAt!).getTime()}`,
      };
    }
    return shoe;
  });
};
