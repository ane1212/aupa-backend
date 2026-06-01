import { Local } from '@/models'
import { CreateLocalDto, UpdateLocalDto, VerifyLocalDto } from '@/dtos'
import { AppError, ErrorCode } from '@/utils'

export const createLocalService = async (userId: string, data: CreateLocalDto) => {
    const existing = await Local.findOne({ where: { userId } })
    if (existing) throw new AppError(ErrorCode.LOCAL_ALREADY_EXISTS, 409)
    return await Local.create({ ...data, userId })
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
    await local.update(data)
    return local
}

export const verifyLocalService = async (id: string, adminId: string, data: VerifyLocalDto) => {
    const local = await Local.findByPk(id)
    if (!local) throw new AppError(ErrorCode.LOCAL_NOT_FOUND, 404)
    await local.update({
        status: data.status,
        reason: data.reason,
        verifiedBy: adminId,
        verifiedAt: new Date(),
    })
    return local
}

export const deleteLocalService = async (id: string) => {
    const local = await Local.findByPk(id)
    if (!local) throw new AppError(ErrorCode.LOCAL_NOT_FOUND, 404)
    await local.destroy()
}
