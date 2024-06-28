import { DataTypes, Model } from 'sequelize';

import sequelize from '../config/database';
import Store from './Store';
import Shoe from './Shoe';

class StoreInventory extends Model {
    public id!: number;
    public inventory!: number;
    public guid!: string
}

StoreInventory.init({
  inventory: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  guid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'StoreInventory',
});


StoreInventory.belongsTo(Store);
StoreInventory.belongsTo(Shoe);

export default StoreInventory;
