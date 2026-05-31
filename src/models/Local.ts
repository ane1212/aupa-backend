import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '@/config'
import { LocalStatus } from '@/enums'

interface LocalAttributes {
  id: string
  name: string
  description?: string
  address: string
  phone?: string
  image?: string
  userId: string
  status: LocalStatus
  reason?: string
  verifiedBy?: string
  verifiedAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

interface LocalCreationAttributes extends Optional<LocalAttributes, 'id' | 'description' | 'phone' | 'image' | 'status' | 'reason' | 'verifiedBy' | 'verifiedAt'> {}

export class Local extends Model<LocalAttributes, LocalCreationAttributes> implements LocalAttributes {
  public id!: string
  public name!: string
  public description?: string
  public address!: string
  public phone?: string
  public image?: string
  public userId!: string
  public status!: LocalStatus
  public reason?: string
  public verifiedBy?: string
  public verifiedAt?: Date
  public createdAt?: Date
  public updatedAt?: Date
}

Local.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: LocalStatus.PENDING,
    validate: {
      isIn: [Object.values(LocalStatus)]
    }
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  verifiedBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'locals',
  underscored: true,
})