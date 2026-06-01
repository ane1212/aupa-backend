import { Favorite } from '@/models'
import { CreateFavoriteDto } from '@/dtos'
import { AppError, ErrorCode } from '@/utils'

export const createFavoriteService = async (data: CreateFavoriteDto) => {
    return await Favorite.create(data)
}

export const getFavoriteByIdService = async (id: string) => {
    const favorite = await Favorite.findByPk(id)
    if (!favorite) throw new AppError(ErrorCode.FAVORITE_NOT_FOUND, 404)
    return favorite
}

export const getAllFavoritesByUserService = async (userId: string) => {
    return await Favorite.findAll({ where: { userId } })
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
