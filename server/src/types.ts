import { Server as SocketIOServer } from 'socket.io';
import * as models from './models'
import sequelize from './config/database';

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

export type RequestShoeInventoryInput = {
    fromStoreId: number
    toStoreId: number
    requestedAmount: number,
    shoeId: number
  }
export interface StoreDTO {
    id: number;
    guid: string
    name: string;
}

interface test extends ShoeDTO {
    store: StoreDTO
}
export interface OrderHistoryDTO {
    quantitySold: number
    shoe: test
    dateSold: string | Date
}

export interface Context {
    models: typeof models;
    io: SocketIOServer;
    db: typeof sequelize
  }

export interface IShoeService {
    shoes(storeId?: number) : Promise<ShoeDTO[]>
    shoe(id: string) : Promise<ShoeDTO>
    saleShoe(details: ShoeSaleDTO): Promise<ShoeDTO>
    allShoesInStock(): Promise<ShoeDTO[]>
    requestShoeInventory(details: RequestShoeInventoryInput): Promise<{fromShoe: ShoeDTO, toShoe: ShoeDTO}>
}

export interface IOrderHistory {
    getHistory() : Promise<OrderHistoryDTO[]>
    createOrder(details: ShoeSaleDTO) : void
}