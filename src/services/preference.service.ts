import { Op } from 'sequelize'
import { Category, Preference } from '@/models'
import { CreatePreferenceDto } from '@/dtos'
import { AppError, ErrorCode, buildQueryOptions, getPaginatedResponse } from '@/utils'
import { PaginationQuery } from '@/types'

export const createPreferenceService = async (data: CreatePreferenceDto) => {
    return await Preference.create(data)
}

export const getPreferenceByIdService = async (id: string) => {
    const preference = await Preference.findByPk(id)
    if (!preference) throw new AppError(ErrorCode.PREFERENCE_NOT_FOUND, 404)
    return preference
}

export const getAllPreferencesByUserService = async (userId: string, query: PaginationQuery = {}) => {
    const options = buildQueryOptions(query, [], ['categoryId'])
    options.where = { ...options.where, userId }
    const result = await Preference.findAndCountAll(options)
    const page = query.page ? parseInt(query.page as any, 10) : 1
    const limit = query.limit ? parseInt(query.limit as any, 10) : 10
    return getPaginatedResponse(result, page, limit)
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

export const getUserCategoryNamesService = async (userId: string): Promise<string[]> => {
    const preferences = await Preference.findAll({ where: { userId } })
    if (preferences.length === 0) return []

    const categoryIds = preferences.map(p => p.categoryId)
    const categories = await Category.findAll({
        where: { id: { [Op.in]: categoryIds } },
        attributes: ['name'],
    })
    return categories.map(c => c.name)
}
