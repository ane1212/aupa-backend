import { sequelize } from '@/config'
import { Local, User } from '@/models'
import { CreateLocalDto, UpdateLocalDto, VerifyLocalDto } from '@/dtos'
import { LocalStatus, NotificationType, UserRole } from '@/enums'
import { AppError, ErrorCode, buildQueryOptions, getPaginatedResponse } from '@/utils'
import { PaginationQuery } from '@/types'
import { createNotificationService } from './notification.service'

export const createLocalService = async (userId: string, data: CreateLocalDto) => {
    const existing = await Local.findOne({ where: { userId } })
    if (existing) throw new AppError(ErrorCode.LOCAL_ALREADY_EXISTS, 409)
    const local = await Local.create({
        name: data.name,
        address: data.address,
        description: data.description,
        phone: data.phone,
        image: data.image,
        userId,
        status: LocalStatus.PENDING,
    })

    const admins = await User.findAll({ where: { role: UserRole.SUPER_ADMIN } })
    for (const admin of admins) {
        await createNotificationService({
            userId: admin.id,
            title: 'Nuevo local pendiente',
            message: `Se ha enviado una solicitud para registrar el local "${data.name}". Por favor, revísalo en la sección de locales.`,
            type: NotificationType.ALERT,
        })
    }

    return local
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

export const getAllLocalsService = async (query: PaginationQuery = {}) => {
    const options = buildQueryOptions(query, ['name', 'description', 'address'], ['status', 'categoryId'])
    const result = await Local.findAndCountAll(options)
    const page = query.page ? parseInt(query.page as any, 10) : 1
    const limit = query.limit ? parseInt(query.limit as any, 10) : 10
    return getPaginatedResponse(result, page, limit)
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
