import { IShoeService, RequestShoeInventoryInput, ShoeDTO, ShoeSaleDTO } from '../types';
import { OrderHistoryService } from './Order.service';
import { Context } from '../types';
import { Transaction } from 'sequelize';
export class ShoeService implements IShoeService {

    private readonly context: Context

    constructor(ctx: Context){
        this.context = ctx
    }

    async shoes(storeId: number | undefined): Promise<ShoeDTO[]> {
        if (storeId) {

            const storeInventories =  await this.context.models.StoreInventory.findAll({
                where: { StoreId : storeId },
                include: [
                    { model: this.context.models.Shoe },
                    { model: this.context.models.Store }
                ],
            });

            return storeInventories.map((inventory: any): ShoeDTO => this.ReturnShoeFromInventory(inventory));
    
        } else {
            return await this.context.models.Shoe.findAll() as ShoeDTO[]
        }
    }

    async shoe(id: string): Promise<ShoeDTO> {
        return await this.context.models.Shoe.findByPk(id) as ShoeDTO
    }

    async saleShoe(details: ShoeSaleDTO): Promise<ShoeDTO> {
        const { quantity, shoeId, storeId } = details

        try {

            const shoeInventory = await this.context.models.StoreInventory.findOne({
                where: { StoreId: storeId, ShoeId: shoeId },
                include: [
                    { model: this.context.models.Shoe }, 
                    { model: this.context.models.Store }
                ],
            });

            if (!shoeInventory) {
                throw new Error(`Store Inventory not found for shoeId ${shoeId} and storeId ${storeId}`);
            }
    
            if (shoeInventory.inventory < quantity) {
                //@ts-ignore
                throw new Error(`Not enough inventory available for shoeId ${shoeId} in store ${shoeInventory.Store.name}`);
            }
            
            shoeInventory.inventory -= quantity;
            
            await shoeInventory.save();
            
            const updatedInventory = this.ReturnShoeFromInventory(shoeInventory)

            //insert a row in the Order history table
            await new OrderHistoryService(this.context).createOrder({ shoeId, storeId, quantity })

            //Emit an event with the new shoe inventory
            this.context.io.emit('saleCompleted', updatedInventory)

            return updatedInventory
    
        } catch (error) {
            console.error('Error selling shoes:', error);
            //TODO: implement better error handling
            throw error; 
        }
    }

    async requestShoeInventory(details: RequestShoeInventoryInput): Promise<{fromShoe: ShoeDTO, toShoe: ShoeDTO}> {
        const { fromStoreId, requestedAmount, toStoreId, shoeId } = details;
    
        const transaction: Transaction = await this.context.db.transaction();
    
        try {
          const storeInventories = await this.context.models.StoreInventory.findAll({
            where: { ShoeId: shoeId, StoreId: [fromStoreId, toStoreId] },
            include: [
              { model: this.context.models.Shoe }, 
              { model: this.context.models.Store }
            ],
            transaction
          });

          const supplierStoreInventory = storeInventories.find((inv: any) => inv.StoreId === fromStoreId);
          const destinationStoreInventory = storeInventories.find((inv: any) => inv.StoreId === toStoreId);
    
          // Ensure the source store has enough inventory
          if (!supplierStoreInventory || supplierStoreInventory.inventory < requestedAmount) {
            throw new Error('Not enough inventory in the source store');
          }
          
          // Update inventories
          supplierStoreInventory.inventory -= requestedAmount;
          await supplierStoreInventory.save({ transaction });
    
          if (destinationStoreInventory) {
            destinationStoreInventory.inventory += requestedAmount;
            await destinationStoreInventory.save({ transaction });
          } else {
            throw new Error('Destination store does not have the shoe');
          }
          
          await transaction.commit();

          const updatedShoes = {
            fromShoe: this.ReturnShoeFromInventory(supplierStoreInventory),
            toShoe: this.ReturnShoeFromInventory(destinationStoreInventory)
          };

          // Return the updated inventory of the source store for confirmation
          this.context.io.emit('inventoriesUpdated', updatedShoes)
          return updatedShoes
    
        } catch (error) {
          // Rollback the transaction in case of error
          await transaction.rollback();
          console.error('Error transferring inventory:', error);
          throw error;
        }
    }

    async allShoesInStock(): Promise<ShoeDTO[]> {

        const storeInventories =  await this.context.models.StoreInventory.findAll({
            include: [
                { model: this.context.models.Shoe },
                { model: this.context.models.Store }
            ],
        });

        const shoes = storeInventories.map((inventory: any): ShoeDTO => this.ReturnShoeFromInventory(inventory));
        return shoes
    }

    ReturnShoeFromInventory (inventory: any) : ShoeDTO {
        return {
            id: inventory.Shoe.id,
            guid: inventory.Shoe.guid,
            model: inventory.Shoe.model,
            inventory: inventory.inventory,
            updatedAt: inventory.updatedAt,
            store: inventory.Store
        }
    }
}