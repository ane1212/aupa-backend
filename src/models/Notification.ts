import { NotificationType } from '@/enums'
import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '@/config'


interface NotificationAttributes {
  id: string
  userId: string
  title: string
  message: string
  read: boolean
  type: NotificationType
  createdAt?: Date
}

interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id' | 'read'> {}

export class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: string
  public userId!: string
  public title!: string
  public message!: string
  public read!: boolean
  public type!: NotificationType
  public createdAt?: Date
}

Notification.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  type: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: NotificationType.INFO,
    validate: {
      isIn: [Object.values(NotificationType)]
    }
  },
}, {
  sequelize,
  tableName: 'notifications',
  underscored: true,
  updatedAt: false,
})