import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '@/config'

interface PreferenceAttributes {
  id: string
  userId: string
  categoryId: string
  createdAt?: Date
}

interface PreferenceCreationAttributes extends Optional<PreferenceAttributes, 'id'> {}

export class Preference extends Model<PreferenceAttributes, PreferenceCreationAttributes> implements PreferenceAttributes {
  public id!: string
  public userId!: string
  public categoryId!: string
  public createdAt?: Date
}

Preference.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'preferences',
  underscored: true,
  updatedAt: false,
})