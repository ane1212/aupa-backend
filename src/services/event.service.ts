import { Event } from '@/models'
import { CreateEventDto, UpdateEventDto } from '@/dtos'
import { AppError, ErrorCode } from '@/utils'

export const getAllEventsService = async (onlyActive: boolean = false) => {
    const whereClause = onlyActive ? { active: true } : {}
    return await Event.findAll({ where: whereClause })
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
