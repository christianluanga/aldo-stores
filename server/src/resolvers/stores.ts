import { StoreService } from "../services"

const stores = async ()=>{
    return new StoreService().getStore()
}

export default {
    Query : {
        stores
    }
}