import { Event, User, Local } from '@/models'
import { CreateEventDto, UpdateEventDto } from '@/dtos'
import { AppError, ErrorCode, buildQueryOptions, getPaginatedResponse } from '@/utils'
import { NotificationType, LanguageType } from '@/enums'
import { PaginationQuery } from '@/types'
import { createNotificationService } from './notification.service'

const EVENT_NOTIF: Record<LanguageType, (local: string, title: string) => { title: string; message: string }> = {
    es: (local, title) => ({ title: '¡Nuevo evento publicado!', message: `${local} ha publicado un nuevo evento: "${title}"` }),
    en: (local, title) => ({ title: 'New event published!',     message: `${local} has published a new event: "${title}"` }),
    eu: (local, title) => ({ title: 'Ekitaldi berria argitaratu da!', message: `${local} ekitaldi berri bat argitaratu du: "${title}"` }),
    fr: (local, title) => ({ title: 'Nouvel événement publié !', message: `${local} a publié un nouvel événement : "${title}"` }),
}

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
    const event = await Event.create(data)
    // Fire-and-forget: notify all users in background
    notifyUsersAboutNewEvent(event.id, event.title, data.localId).catch(() => {})
    return event
}

const notifyUsersAboutNewEvent = async (eventId: string, eventTitle: string, localId: string) => {
    const [local, users] = await Promise.all([
        Local.findByPk(localId),
        User.findAll({ attributes: ['id', 'role', 'language'] }),
    ])
    const localName = local?.name ?? 'Un local'
    await Promise.all(
        users
            .filter(u => u.role !== 'local')
            .map(u => {
                const lang = (u.language as LanguageType) ?? LanguageType.ES
                const notif = (EVENT_NOTIF[lang] ?? EVENT_NOTIF.es)(localName, eventTitle)
                return createNotificationService({
                    userId: u.id,
                    title: notif.title,
                    message: notif.message,
                    type: NotificationType.INFO,
                })
            })
    )
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
