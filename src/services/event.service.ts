import { Event } from '@/models'
import { CreateEventDto, UpdateEventDto } from '@/dtos'
import { AppError, ErrorCode, buildQueryOptions, getPaginatedResponse } from '@/utils'
import { PaginationQuery } from '@/types'

export const getAllEventsService = async (onlyActive: boolean = false, query: PaginationQuery = {}) => {
    const options = buildQueryOptions(query, ['title', 'description'], ['categoryId', 'status', 'localId'])
    const whereClause = onlyActive ? { active: true } : {}
    options.where = { ...options.where, ...whereClause }
    const result = await Event.findAndCountAll(options)
    const page = query.page ? parseInt(query.page as any, 10) : 1
    const limit = query.limit ? parseInt(query.limit as any, 10) : 10
    return getPaginatedResponse(result, page, limit)
}

export const getEventByIdService = async (id: string) => {
    const event = await Event.findByPk(id)
    if (!event) throw new AppError(ErrorCode.EVENT_NOT_FOUND, 404)
    return event
}

export const createEventService = async (data: CreateEventDto) => {
    return await Event.create(data)
}

export const updateEventService = async (id: string, data: UpdateEventDto) => {
    const event = await Event.findByPk(id)
    if (!event) throw new AppError(ErrorCode.EVENT_NOT_FOUND, 404)
    await event.update(data)
    return event
}

export const toggleEventActiveService = async (id: string) => {
    const event = await Event.findByPk(id)
    if (!event) throw new AppError(ErrorCode.EVENT_NOT_FOUND, 404)
    await event.update({ active: !event.active })
    return event
}

export const deleteEventService = async (id: string) => {
    const event = await Event.findByPk(id)
    if (!event) throw new AppError(ErrorCode.EVENT_NOT_FOUND, 404)
    await event.destroy()
}
