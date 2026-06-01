import { Favorite } from '@/models/Favorite'
import { CreateFavoriteDto, FavoriteResponseDto } from '@/dtos/favorite.dto'

export class FavoriteService {
  async create(dto: CreateFavoriteDto): Promise<FavoriteResponseDto> {
    const favorite = await Favorite.create({
      userId: dto.userId,
      eventId: dto.eventId,
    })
    return new FavoriteResponseDto(favorite.toJSON())
  }

  async findAllByUser(userId: string): Promise<FavoriteResponseDto[]> {
    const favorites = await Favorite.findAll({ where: { userId } })
    return favorites.map(f => new FavoriteResponseDto(f.toJSON()))
  }

  async findOne(id: string): Promise<FavoriteResponseDto | null> {
    const favorite = await Favorite.findByPk(id)
    if (!favorite) return null
    return new FavoriteResponseDto(favorite.toJSON())
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const rows = await Favorite.destroy({ where: { id, userId } })
    return rows > 0
  }

  async existsByUserAndEvent(userId: string, eventId: string): Promise<boolean> {
    const favorite = await Favorite.findOne({ where: { userId, eventId } })
    return !!favorite
  }
}

export const favoriteService = new FavoriteService()