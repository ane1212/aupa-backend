import { UserRole, LanguageType } from '@/enums'
import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '@/config'

interface UserAttributes {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  language: LanguageType
  avatar?: string
  active: boolean
  createdAt?: Date
  updatedAt?: Date
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'avatar' | 'active' | 'language'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string
  public name!: string
  public email!: string
  public password!: string
  public role!: UserRole
  public language!: LanguageType
  public avatar?: string
  public active!: boolean
  public createdAt?: Date
  public updatedAt?: Date
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: UserRole.USER,
    validate: {
      isIn: [Object.values(UserRole)]
    }
  },
  language: {
    type: DataTypes.STRING(2),
    allowNull: false,
    defaultValue: LanguageType.ES,
    validate: {
      isIn: [Object.values(LanguageType)]
    }
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize,
  tableName: 'users',
  underscored: true,
})