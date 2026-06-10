// ./models/Itinerary.ts
import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '@/config'

interface ItineraryAttributes {
  id: string
  eventId: string
  userId: string
  itemIndex: number
  createdAt?: Date
  updatedAt?: Date
}

interface ItineraryCreationAttributes extends Optional<ItineraryAttributes, 'id'> {}

export class Itinerary extends Model<ItineraryAttributes, ItineraryCreationAttributes> implements ItineraryAttributes {
  public id!: string
  public eventId!: string
  public userId!: string
  public itemIndex!: number
  public createdAt?: Date
  public updatedAt?: Date
}

Itinerary.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  eventId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'event_id',
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
  },
  itemIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'item_index',
  },
}, {
  sequelize,
  tableName: 'itineraries',
  underscored: true,
})