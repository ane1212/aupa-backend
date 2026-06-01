import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '@/config'
import { IncidentStatus } from '@/enums'

interface IncidentAttributes {
    id: string
    userId: string
    eventId: string
    content: string
    status: IncidentStatus
    createdAt?: Date
    updatedAt?: Date
}

interface IncidentCreationAttributes extends Optional<IncidentAttributes, 'id' | 'status'> { }

export class Incident extends Model<IncidentAttributes, IncidentCreationAttributes> implements IncidentAttributes {
    public id!: string
    public userId!: string
    public eventId!: string
    public content!: string
    public status!: IncidentStatus
    public createdAt?: Date
    public updatedAt?: Date
}

Incident.init({
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
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: IncidentStatus.PENDING,
        validate: {
            isIn: [Object.values(IncidentStatus)]
        }
    },
}, {
    sequelize,
    tableName: 'incidents',
    underscored: true,
})