import { DataTypes, Model, Optional,  } from 'sequelize';
import sequelize from '../config/database';

// Define the attributes of the Shoe model
interface ShoeAttributes {
  id: number;
  model: string;
  guid: string
}

// Define creation attributes which are all optional except 'model' and 'StoreId'
interface ShoeCreationAttributes extends Optional<ShoeAttributes, 'id' | 'guid'> {}

// Define the Shoe class which extends Model with the attributes and creation attributes
class Shoe extends Model<ShoeAttributes, ShoeCreationAttributes> implements ShoeAttributes {
  public id!: number;
  public model!: string;
  public guid!: string
}

Shoe.init({
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
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Shoe',
});


export default Shoe;
