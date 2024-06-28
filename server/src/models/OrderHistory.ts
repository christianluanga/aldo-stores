import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Shoe from './Shoe';
import Store from './Store';

interface OrderAttributes {
  id: number;
  guid: string;
  shoeId: number;
  storeId: number;
  quantity: number;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'guid'> {}

class OrderHistory extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public guid!: string;
  public shoeId!: number;
  public storeId!: number;
  public quantity!: number;
  public timestamp!: Date;
}

OrderHistory.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  guid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  shoeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Shoe,
      key: 'id',
    },
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Store,
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'OrderHistory',
});

OrderHistory.belongsTo(Shoe, { foreignKey: 'shoeId' });
OrderHistory.belongsTo(Store, { foreignKey: 'storeId' });

export default OrderHistory;
