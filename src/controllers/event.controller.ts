import { Request, Response } from 'express'
import {
    getAllEventsService,
    getEventByIdService,
    createEventService,
    updateEventService,
    toggleEventActiveService,
    deleteEventService
} from '@/services'
import { AppError } from '@/utils'

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

export const createEvent = async (req: Request, res: Response) => {
    try {
        const event = await createEventService(req.body)
        res.status(201).json(event)
    } catch (error) { handleError(error, res) }
}

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const event = await updateEventService(req.params.id as string, req.body)
        res.json(event)
    } catch (error) { handleError(error, res) }
}

export const toggleEventActive = async (req: Request, res: Response) => {
    try {
        const event = await toggleEventActiveService(req.params.id as string)
        res.json(event)
    } catch (error) { handleError(error, res) }
}

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        await deleteEventService(req.params.id as string)
        res.json({ code: 'EVENT_DELETED' })
    } catch (error) { handleError(error, res) }
}
