
import { OrderHistoryService } from "../services"
import { Context, OrderHistoryDTO } from "../types"


const orders = async(parent: any, {}, context: Context) : Promise<OrderHistoryDTO[]> =>{
    return await new OrderHistoryService(context).getHistory()
}

export default {
    Query : {
        orders
    }
}