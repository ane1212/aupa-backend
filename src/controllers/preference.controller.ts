import { Request, Response } from 'express'
import { preferenceService } from '@/services/preference.service'
import { CreatePreferenceDto } from '@/dtos/preference.dto'

export class PreferenceController {
  async create(req: Request, res: Response): Promise<void> {
    const dto: CreatePreferenceDto = req.body

    const alreadyExists = await preferenceService.existsByUserAndCategory(dto.userId, dto.categoryId)
    if (alreadyExists) {
      res.status(409).json({ message: 'Preference already exists' })
      return
    }

    const preference = await preferenceService.create(dto)
    res.status(201).json(preference)
  }

  async findAllByUser(req: Request, res: Response): Promise<void> {
    const { userId } = req.params
    const preferences = await preferenceService.findAllByUser(userId as string)
    res.status(200).json(preferences)
  }

  async findOne(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const preference = await preferenceService.findOne(id as string)

    if (!preference) {
      res.status(404).json({ message: 'Preference not found' })
      return
    }

    res.status(200).json(preference)
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { userId } = req.body

    const deleted = await preferenceService.delete(id as string, userId)

    if (!deleted) {
      res.status(404).json({ message: 'Preference not found or unauthorized' })
      return
    }

    res.status(204).send()
  }
}

export const preferenceController = new PreferenceController()