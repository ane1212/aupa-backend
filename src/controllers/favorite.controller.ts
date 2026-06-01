import { Request, Response } from 'express'
import { favoriteService } from '@/services/favorite.service'
import { CreateFavoriteDto } from '@/dtos/favorite.dto'
export class FavoriteController {
  async create(req: Request, res: Response): Promise<void> {
    const dto: CreateFavoriteDto = req.body

    const alreadyExists = await favoriteService.existsByUserAndEvent(dto.userId, dto.eventId)
    if (alreadyExists) {
      res.status(409).json({ message: 'Favorite already exists' })
      return
    }

    const favorite = await favoriteService.create(dto)
    res.status(201).json(favorite)
  }

  async findAllByUser(req: Request, res: Response): Promise<void> {
    const { userId } = req.params
    const favorites = await favoriteService.findAllByUser(userId as string)
    res.status(200).json(favorites)
  }

  async findOne(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const favorite = await favoriteService.findOne(id as string)

    if (!favorite) {
      res.status(404).json({ message: 'Favorite not found' })
      return
    }

    res.status(200).json(favorite)
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { userId } = req.body

    const deleted = await favoriteService.delete(id as string, userId)

    if (!deleted) {
      res.status(404).json({ message: 'Favorite not found or unauthorized' })
      return
    }

    res.status(204).send()
  }
}

export const favoriteController = new FavoriteController()