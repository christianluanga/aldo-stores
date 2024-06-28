import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface StoreAttributes {
  id: number;
  name: string;
  guid: string
}

interface StoreCreationAttributes extends Optional<StoreAttributes, 'id' | 'guid'> {}

class Store extends Model<StoreAttributes, StoreCreationAttributes> implements StoreAttributes {
  public id!: number;
  public name!: string;
  public guid!: string
}

Store.init({
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  modelName: 'Store',
});

export default Store;
