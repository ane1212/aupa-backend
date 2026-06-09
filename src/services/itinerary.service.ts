import { Itinerary } from '@/models'
import { CreateItineraryDto, UpdateItineraryDto, ReorderItineraryItemDto } from '@/dtos'
import { AppError, ErrorCode, buildQueryOptions, getPaginatedResponse } from '@/utils'
import { PaginationQuery } from '@/types'
import { sequelize } from '@/config'

export const createItineraryService = async (data: CreateItineraryDto) => {
  const existing = await Itinerary.findOne({
    where: { userId: data.userId, eventId: data.eventId },
  })
  if (existing) throw new AppError(ErrorCode.VALIDATION_ERROR, 400)

  const maxIndex = await Itinerary.max('itemIndex', {
    where: { userId: data.userId },
  })

  return await Itinerary.create({
    ...data,
    itemIndex: data.itemIndex ?? ((typeof maxIndex === 'number' ? maxIndex : -1) + 1),
  })
}

export const getItineraryByUserService = async (userId: string, query: PaginationQuery = {}) => {
  const options = buildQueryOptions(query, [], ['eventId', 'itemIndex'])
  options.where = { ...options.where, userId }
  if (!options.order) options.order = [['itemIndex', 'ASC']]
  const result = await Itinerary.findAndCountAll(options)
  const page = query.page ? parseInt(query.page as any, 10) : 1
  const limit = query.limit ? parseInt(query.limit as any, 10) : 10
  return getPaginatedResponse(result, page, limit)
}

export const updateItineraryIndexService = async (id: string, userId: string, data: UpdateItineraryDto) => {
  const itinerary = await Itinerary.findOne({ where: { id, userId } })
  if (!itinerary) throw new AppError(ErrorCode.VALIDATION_ERROR, 404)
  await itinerary.update(data)
  return itinerary
}

export const reorderItineraryService = async (userId: string, items: ReorderItineraryItemDto[]) => {
  return await sequelize.transaction(async (transaction) => {
    const ids = items.map(i => i.id)
    const itineraries = await Itinerary.findAll({
      where: { userId, id: ids },
      transaction,
    })

    if (itineraries.length !== items.length) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 400)
    }

    for (const item of items) {
      const itinerary = itineraries.find(i => i.id === item.id)
      if (!itinerary) continue
      await itinerary.update({ itemIndex: item.itemIndex }, { transaction })
    }

    return await Itinerary.findAll({
      where: { userId },
      order: [['itemIndex', 'ASC']],
      transaction,
    })
  })
}

export const deleteItineraryService = async (id: string, userId: string) => {
  const itinerary = await Itinerary.findOne({ where: { id, userId } })
  if (!itinerary) throw new AppError(ErrorCode.VALIDATION_ERROR, 404)
  await itinerary.destroy()
}