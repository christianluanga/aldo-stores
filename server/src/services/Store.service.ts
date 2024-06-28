import { Store } from "../models";
import { StoreDTO } from "../types";
import orderBy from "lodash.orderby";

export class StoreService {

    async getStore(): Promise<StoreDTO[]> {
        const stores = await Store.findAll();

        return orderBy(
            [...stores.map(store => {
                return {
                    id: store.id,
                    guid: store.guid,
                    name: store.name
                }})
            ], ['name'], ['asc']);
    }
}