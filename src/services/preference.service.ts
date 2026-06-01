import { Preference } from '@/models/Preference'
import { CreatePreferenceDto, PreferenceResponseDto } from '@/dtos/preference.dto'

export class PreferenceService {
  async create(dto: CreatePreferenceDto): Promise<PreferenceResponseDto> {
    const preference = await Preference.create({
      userId: dto.userId,
      categoryId: dto.categoryId,
    })
    return new PreferenceResponseDto(preference.toJSON())
  }

  async findAllByUser(userId: string): Promise<PreferenceResponseDto[]> {
    const preferences = await Preference.findAll({ where: { userId } })
    return preferences.map(p => new PreferenceResponseDto(p.toJSON()))
  }

  async findOne(id: string): Promise<PreferenceResponseDto | null> {
    const preference = await Preference.findByPk(id)
    if (!preference) return null
    return new PreferenceResponseDto(preference.toJSON())
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const rows = await Preference.destroy({ where: { id, userId } })
    return rows > 0
  }

  async existsByUserAndCategory(userId: string, categoryId: string): Promise<boolean> {
    const preference = await Preference.findOne({ where: { userId, categoryId } })
    return !!preference
  }
}

export const preferenceService = new PreferenceService()