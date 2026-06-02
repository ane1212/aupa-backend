import { Request, Response } from 'express'
import {
    getAllEventsService,
    getEventByIdService,
    createEventService,
    updateEventService,
    toggleEventActiveService,
    deleteEventService
} from '@/services'
import { AppError, ErrorCode } from '@/utils'
import { UserRole } from '@/enums'
import { Local } from '@/models'

const handleError = (error: unknown, res: Response) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ code: error.code })
    }
    return res.status(500).json({ code: 'INTERNAL_SERVER_ERROR' })
}

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const onlyActive = req.query.active === 'true'
        const events = await getAllEventsService(onlyActive)
        res.json(events)
    } catch (error) { handleError(error, res) }
}

export const getEventById = async (req: Request, res: Response) => {
    try {
        const event = await getEventByIdService(req.params.id as string)
        res.json(event)
    } catch (error) { handleError(error, res) }
}

const getOwnLocalId = async (userId: string): Promise<string> => {
    const local = await Local.findOne({ where: { userId } })
    if (!local) throw new AppError(ErrorCode.LOCAL_NOT_FOUND, 404)
    return local.id
}

const assertOwnsEvent = async (userId: string, eventId: string): Promise<void> => {
    const [local, event] = await Promise.all([
        Local.findOne({ where: { userId } }),
        getEventByIdService(eventId),
    ])
    if (!local || local.id !== event.localId) throw new AppError(ErrorCode.FORBIDDEN, 403)
}

export const createEvent = async (req: Request, res: Response) => {
    try {
        let localId = req.body.localId
        if (req.user!.role === UserRole.LOCAL) {
            localId = await getOwnLocalId(req.user!.id)
        }
        const event = await createEventService({ ...req.body, localId })
        res.status(201).json(event)
    } catch (error) { handleError(error, res) }
}

export const updateEvent = async (req: Request, res: Response) => {
    try {
        if (req.user!.role === UserRole.LOCAL) {
            await assertOwnsEvent(req.user!.id, req.params.id as string)
        }
        const event = await updateEventService(req.params.id as string, req.body)
        res.json(event)
    } catch (error) { handleError(error, res) }
}

export const toggleEventActive = async (req: Request, res: Response) => {
    try {
        if (req.user!.role === UserRole.LOCAL) {
            await assertOwnsEvent(req.user!.id, req.params.id as string)
        }
        const event = await toggleEventActiveService(req.params.id as string)
        res.json(event)
    } catch (error) { handleError(error, res) }
}

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        if (req.user!.role === UserRole.LOCAL) {
            await assertOwnsEvent(req.user!.id, req.params.id as string)
        }
        await deleteEventService(req.params.id as string)
        res.json({ code: 'EVENT_DELETED' })
    } catch (error) { handleError(error, res) }
}
