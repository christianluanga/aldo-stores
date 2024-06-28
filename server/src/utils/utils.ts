import { ShoeDTO } from "../types"

const GetFullShoeFromInventory =  (inventory: any) : ShoeDTO => {
    return {
        id: inventory.Shoe.id,
        guid: inventory.Shoe.guid,
        model: inventory.Shoe.model,
        inventory: inventory.inventory,
        store: inventory.Store,
    }
}

export { GetFullShoeFromInventory }