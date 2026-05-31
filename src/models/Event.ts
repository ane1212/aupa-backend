import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '@/config'

interface EventAttributes {
  id: string
  title: string
  description?: string
  date: Date
  startTime: string
  endTime?: string
  image?: string
  price: number
  capacity?: number
  address?: string
  latitude?: number
  longitude?: number
  localId: string
  categoryId?: string
  active: boolean
  createdAt?: Date
  updatedAt?: Date
}

interface EventCreationAttributes extends Optional<EventAttributes, 'id' | 'description' | 'endTime' | 'image' | 'price' | 'capacity' | 'address' | 'latitude' | 'longitude' | 'categoryId' | 'active'> {}

export class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
  public id!: string
  public title!: string
  public description?: string
  public date!: Date
  public startTime!: string
  public endTime?: string
  public image?: string
  public price!: number
  public capacity?: number
  public address?: string
  public latitude?: number
  public longitude?: number
  public localId!: string
  public categoryId?: string
  public active!: boolean
  public createdAt?: Date
  public updatedAt?: Date
}

Event.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  latitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: true,
  },
  longitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: true,
  },
  localId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize,
  tableName: 'events',
  underscored: true,
})