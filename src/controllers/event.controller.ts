import { Request, Response } from 'express'
import {
    getAllEventsService,
    getEventByIdService,
    createEventService,
    updateEventService,
    toggleEventActiveService,
    deleteEventService
} from '@/services/event.service'

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const onlyActive = req.query.active === 'true'
        const events = await getAllEventsService(onlyActive)
        res.json(events)
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export const getEventById = async (req: Request, res: Response) => {
    try {
        const event = await getEventByIdService(req.params.id as string)
        res.json(event)
    } catch (error: any) {
        res.status(404).json({ message: error.message })
    }
}

export const createEvent = async (req: Request, res: Response) => {
    try {
        const newEvent = await createEventService(req.body)
        res.status(201).json(newEvent)
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const updatedEvent = await updateEventService(req.params.id as string, req.body)
        res.json(updatedEvent)
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const toggleEventActive = async (req: Request, res: Response) => {
    try {
        const updatedEvent = await toggleEventActiveService(req.params.id as string)
        res.json(updatedEvent)
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        await deleteEventService(req.params.id as string)
        res.json({ message: 'Evento eliminado correctamente' })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}