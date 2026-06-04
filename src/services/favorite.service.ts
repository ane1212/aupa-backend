import { Favorite } from '@/models'
import { CreateFavoriteDto } from '@/dtos'
import { AppError, ErrorCode, buildQueryOptions, getPaginatedResponse } from '@/utils'
import { PaginationQuery } from '@/types'

export const createFavoriteService = async (data: CreateFavoriteDto) => {
    return await Favorite.create(data)
}

export const getFavoriteByIdService = async (id: string) => {
    const favorite = await Favorite.findByPk(id)
    if (!favorite) throw new AppError(ErrorCode.FAVORITE_NOT_FOUND, 404)
    return favorite
}

export const getAllFavoritesByUserService = async (userId: string, query: PaginationQuery = {}) => {
    const options = buildQueryOptions(query, [], ['eventId', 'localId'])
    options.where = { ...options.where, userId }
    const result = await Favorite.findAndCountAll(options)
    const page = query.page ? parseInt(query.page as any, 10) : 1
    const limit = query.limit ? parseInt(query.limit as any, 10) : 10
    return getPaginatedResponse(result, page, limit)
}

export const deleteFavoriteService = async (id: string, userId: string) => {
    const favorite = await Favorite.findOne({ where: { id, userId } })
    if (!favorite) throw new AppError(ErrorCode.FAVORITE_NOT_FOUND, 404)
    await favorite.destroy()
}

export const favoriteExistsByUserAndEventService = async (userId: string, eventId: string) => {
    const favorite = await Favorite.findOne({ where: { userId, eventId } })
    return !!favorite
}
