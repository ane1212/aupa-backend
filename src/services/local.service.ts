import { sequelize } from '@/config'
import { Local, User } from '@/models'
import { CreateLocalDto, UpdateLocalDto, VerifyLocalDto } from '@/dtos'
import { LocalStatus, NotificationType, UserRole } from '@/enums'
import { AppError, ErrorCode } from '@/utils'
import { createNotificationService } from './notification.service'

export const createLocalService = async (userId: string, data: CreateLocalDto) => {
    const existing = await Local.findOne({ where: { userId } })
    if (existing) throw new AppError(ErrorCode.LOCAL_ALREADY_EXISTS, 409)
    return await Local.create({
        name: data.name,
        address: data.address,
        description: data.description,
        phone: data.phone,
        image: data.image,
        userId,
        status: LocalStatus.PENDING,
    })
}

export const getMyLocalService = async (userId: string) => {
    const local = await Local.findOne({ where: { userId } })
    if (!local) throw new AppError(ErrorCode.LOCAL_NOT_FOUND, 404)
    return local
}

export const getLocalByIdService = async (id: string) => {
    const local = await Local.findByPk(id)
    if (!local) throw new AppError(ErrorCode.LOCAL_NOT_FOUND, 404)
    return local
}

export const getAllLocalsService = async () => {
    return await Local.findAll()
}

export const updateLocalService = async (userId: string, data: UpdateLocalDto) => {
    const local = await Local.findOne({ where: { userId } })
    if (!local) throw new AppError(ErrorCode.LOCAL_NOT_FOUND, 404)
    const allowedData: UpdateLocalDto = {}
    if (data.name !== undefined) allowedData.name = data.name
    if (data.address !== undefined) allowedData.address = data.address
    if (data.description !== undefined) allowedData.description = data.description
    if (data.phone !== undefined) allowedData.phone = data.phone
    if (data.image !== undefined) allowedData.image = data.image

    await local.update(allowedData, { fields: ['name', 'address', 'description', 'phone', 'image'] })
    return local
}

export const verifyLocalService = async (id: string, adminId: string, data: VerifyLocalDto) => {
    const local = await Local.findByPk(id)
    if (!local) throw new AppError(ErrorCode.LOCAL_NOT_FOUND, 404)
    await sequelize.transaction(async (transaction) => {
        await local.update({
            status: data.status,
            reason: data.reason,
            verifiedBy: adminId,
            verifiedAt: new Date(),
        }, { transaction })

        const role = data.status === LocalStatus.APPROVED ? UserRole.LOCAL : UserRole.USER
        await User.update({ role }, {
            where: { id: local.userId },
            fields: ['role'],
            transaction,
        })
    })

    await createNotificationService({
        userId: local.userId,
        title: data.status === LocalStatus.APPROVED ? 'Local aprobado' : 'Local rechazado',
        message: data.status === LocalStatus.APPROVED
            ? `Tu local ${local.name} ha sido aprobado.`
            : data.reason || `Tu local ${local.name} ha sido rechazado.`,
        type: data.status === LocalStatus.APPROVED ? NotificationType.INFO : NotificationType.ALERT,
    })

    return local
}

export const deleteLocalService = async (id: string) => {
    const local = await Local.findByPk(id)
    if (!local) throw new AppError(ErrorCode.LOCAL_NOT_FOUND, 404)
    await local.destroy()
}
