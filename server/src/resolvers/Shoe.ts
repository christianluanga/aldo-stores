import { ShoeDTO, ShoeSaleDTO, Context, RequestShoeInventoryInput } from '../types';
import { ShoeService } from '../services';

const shoes = async (parent: any, { storeId }: { storeId?: number }, ctx: Context) : Promise<ShoeDTO[]> => {
    return await new ShoeService(ctx).shoes(storeId)
};

const shoe = async (parent: any, { id }: {id: string}, ctx: Context) => {
    return await new ShoeService(ctx).shoe(id)
};

const saleShoe = async (parent: any, args:  { details: ShoeSaleDTO }, ctx: Context): Promise<ShoeDTO> =>{
    if(args.details.quantity <= 0) {
        throw new Error(`Quantity must be > 0`);
    }

    return await new ShoeService(ctx).saleShoe(args.details)
}

const requestShoeInventory = async(parent: any, args: {details: RequestShoeInventoryInput}, ctx: Context): Promise<{fromShoe: ShoeDTO, toShoe: ShoeDTO}> => {
  return await new ShoeService(ctx).requestShoeInventory(args.details)
}

const allShoesInStock = async (parent: any, {}, ctx: Context) : Promise<ShoeDTO[]> => {
  return await new ShoeService(ctx).allShoesInStock()
};

export default {
  Query: {
    shoes,
    shoe,
    allShoesInStock
  },
  Mutation: {
    saleShoe,
    requestShoeInventory
  },
};
