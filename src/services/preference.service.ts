import { Preference } from '@/models'
import { CreatePreferenceDto } from '@/dtos'
import { AppError, ErrorCode } from '@/utils'

export const createPreferenceService = async (data: CreatePreferenceDto) => {
    return await Preference.create(data)
}

export const getPreferenceByIdService = async (id: string) => {
    const preference = await Preference.findByPk(id)
    if (!preference) throw new AppError(ErrorCode.PREFERENCE_NOT_FOUND, 404)
    return preference
}

export const getAllPreferencesByUserService = async (userId: string) => {
    return await Preference.findAll({ where: { userId } })
}

export const deletePreferenceService = async (id: string, userId: string) => {
    const preference = await Preference.findOne({ where: { id, userId } })
    if (!preference) throw new AppError(ErrorCode.PREFERENCE_NOT_FOUND, 404)
    await preference.destroy()
}

export const preferenceExistsByUserAndCategoryService = async (userId: string, categoryId: string) => {
    const preference = await Preference.findOne({ where: { userId, categoryId } })
    return !!preference
}
