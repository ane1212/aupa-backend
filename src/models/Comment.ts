import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '@/config'


interface CommentAttributes {
    id: string
    userId: string
    eventId: string
    content: string
    rating: number
    createdAt?: Date
    updatedAt?: Date
}

interface CommentCreationAttributes extends Optional<CommentAttributes, 'id'> { }

export class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
    public id!: string
    public userId!: string
    public eventId!: string
    public content!: string
    public rating!: number
    public createdAt?: Date
    public updatedAt?: Date
}

Comment.init({
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
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        }
    },
}, {
    sequelize,
    tableName: 'comments',
    underscored: true,
})