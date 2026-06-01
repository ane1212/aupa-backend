import { Router } from 'express'
import {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    toggleEventActive,
    deleteEvent
} from '@/controllers/event.controller'

export const eventRouter = Router()

eventRouter.get('/', getAllEvents)
eventRouter.get('/:id', getEventById)
eventRouter.post('/', createEvent)
eventRouter.put('/:id', updateEvent)
eventRouter.patch('/:id/active', toggleEventActive)
eventRouter.delete('/:id', deleteEvent)