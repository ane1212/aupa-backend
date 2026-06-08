import { Incident } from '@/models'
import { CreateIncidentDto, UpdateIncidentDto } from '@/dtos'
import { AppError, ErrorCode, buildQueryOptions, getPaginatedResponse } from '@/utils'
import { PaginationQuery } from '@/types'

export const createIncidentService = async (data: CreateIncidentDto) => {
    return await Incident.create(data)
}

export const getIncidentByIdService = async (id: string) => {
    const incident = await Incident.findByPk(id)
    if (!incident) throw new AppError(ErrorCode.INCIDENT_NOT_FOUND, 404)
    return incident
}

export const getAllIncidentsByEventService = async (eventId: string, query: PaginationQuery) => {
    const options = buildQueryOptions(query, ['content'], ['userId', 'status'])
    options.where = { ...options.where, eventId }
    if (!options.order) options.order = [['createdAt', 'DESC']]
    const result = await Incident.findAndCountAll(options)
    const page = query.page ? parseInt(query.page as any, 10) : 1
    const limit = query.limit ? parseInt(query.limit as any, 10) : 10
    return getPaginatedResponse(result, page, limit)
}

export const getAllIncidentsByUserService = async (userId: string, query: PaginationQuery) => {
    const options = buildQueryOptions(query, ['content'], ['eventId', 'status'])
    options.where = { ...options.where, userId }
    if (!options.order) options.order = [['createdAt', 'DESC']]
    const result = await Incident.findAndCountAll(options)
    const page = query.page ? parseInt(query.page as any, 10) : 1
    const limit = query.limit ? parseInt(query.limit as any, 10) : 10
    return getPaginatedResponse(result, page, limit)
}

export const updateIncidentService = async (id: string, userId: string, data: UpdateIncidentDto, isAdmin = false) => {
    const incident = isAdmin
        ? await Incident.findByPk(id)
        : await Incident.findOne({ where: { id, userId } })
    if (!incident) throw new AppError(ErrorCode.INCIDENT_NOT_FOUND, 404)
    await incident.update(data)
    return incident
}

export const deleteIncidentService = async (id: string, userId: string, isAdmin = false) => {
    const incident = isAdmin
        ? await Incident.findByPk(id)
        : await Incident.findOne({ where: { id, userId } })
    if (!incident) throw new AppError(ErrorCode.INCIDENT_NOT_FOUND, 404)
    await incident.destroy()
}
