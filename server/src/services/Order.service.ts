import { Context, IOrderHistory, OrderHistoryDTO, ShoeSaleDTO } from "../types";


export class OrderHistoryService implements IOrderHistory {

    private readonly context: Context

    constructor(ctx: Context){
        this.context = ctx
    }

    async getHistory(): Promise<OrderHistoryDTO[]> {

        const orders = await this.context.models.OrderHistory.findAll({
            include: [
                { model: this.context.models.Shoe },
                { model: this.context.models.Store }
            ],
        })

        return orders.map((order: any) : OrderHistoryDTO  => {
            return {
                dateSold: new Date(order.createdAt),
                quantitySold: order.quantity,
                shoe:{
                    id: order.Shoe.id,
                    guid: order.Shoe.guid,
                    model: order.Shoe.model,
                    store:{
                        id: order.Store.id,
                        guid: order.Store.guid,
                        name: order.Store.name
                    }
                }
            }
        })
    }

    async createOrder(details: ShoeSaleDTO): Promise<void> {
        await this.context.models.OrderHistory.create({ ...details })
    }

}
