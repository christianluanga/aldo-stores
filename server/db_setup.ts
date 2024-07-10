import { ShoeDTO, StoreDTO} from './src/types'
import { STORE_STORES, SHOES_MODELS } from './mock_data/index';
import sequelize from './src/config/database'
import { Shoe, Store, StoreInventory, OrderHistory } from './src/models/'

const models = [
  Shoe,
  Store,
  StoreInventory,
  OrderHistory
];

const generateRandomInventory = ()=> {
    return Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
}

const populateTables = async()=>{
  try {
    // Check if database connection is established
    await sequelize.authenticate();

    // Insert stores and shoes
    const stores: StoreDTO [] = [];
    const shoes: ShoeDTO[] = [];

    for (const storeName of STORE_STORES) {
      const store = await Store.create({ name: storeName });
      stores.push(store);
      console.log(`Creating store ${storeName}`);
    }

    for (const modelName of SHOES_MODELS) {
      const shoe = await Shoe.create({ model: modelName });
      shoes.push(shoe);
      console.log(`Creating shoe model ${modelName}`);
    }

    // Populate store inventory
    for (const store of stores) {
      for (const shoe of shoes) {
        const inventory = generateRandomInventory();
        await StoreInventory.create({
          StoreId: store.id,
          ShoeId: shoe.id,
          inventory
        });
        console.log(`Inserted ${inventory} inventory for shoe model ${shoe.model} in store ${store.name}`);
      }
    }

  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    await sequelize.close(); // Close Sequelize connection after operation
  }

  console.log('Database seeded')
}

const createTables = async()=> {
  try {
    await sequelize.authenticate();

    for (const model of models) {
      await model.sync({ force: true })
    }

    console.log('Tables are synchronized');

    console.log('Seeding the database');

    await populateTables();

  } catch (error) {
    console.error('Error synchronizing models:', error);
  } finally {
    await sequelize.close();
  }
}

createTables();
