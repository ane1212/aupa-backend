import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '@/config'

interface FavoriteAttributes {
  id: string
  userId: string
  eventId: string
  createdAt?: Date
}

interface FavoriteCreationAttributes extends Optional<FavoriteAttributes, 'id'> {}

export class Favorite extends Model<FavoriteAttributes, FavoriteCreationAttributes> implements FavoriteAttributes {
  public id!: string
  public userId!: string
  public eventId!: string
  public createdAt?: Date
}

Favorite.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'favorites',
  underscored: true,
  updatedAt: false,
})