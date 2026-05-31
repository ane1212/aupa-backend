import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '@/config'

interface CategoryAttributes {
  id: string
  name: string
  description?: string
  icon?: string
  createdAt?: Date
  updatedAt?: Date
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'description' | 'icon'> {}

export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: string
  public name!: string
  public description?: string
  public icon?: string
  public createdAt?: Date
  public updatedAt?: Date
}

Category.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'categories',
  underscored: true,
})