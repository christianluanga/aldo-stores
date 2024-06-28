export interface ShoeDTO {
    id: number;
    model: string;
    guid: string
    updatedAt?: string
    inventory?: number;
    store?: StoreDTO
};

export type ShoeSaleDTO = {
    storeId: number
    shoeId: number
    quantity: number
}

export interface StoreDTO {
    id: number;
    guid: string
    name: string;
}

export interface OrderDTO {
    shoe: ShoeDTO
    quantitySold: number;
    dateSold: string;
}

export interface inventoryRequestProps {
    requestedAmount: number, 
    fromStoreId: number,
    toStoreId: number,
    shoeId: number
}