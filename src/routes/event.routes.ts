import { Router } from 'express'
import { getAllEvents, getEventById, createEvent, updateEvent, toggleEventActive, deleteEvent } from '@/controllers'
import { verifyToken, requireRole } from '@/middlewares'
import { UserRole } from '@/enums'

export const eventRouter = Router()

eventRouter.get('/', getAllEvents)
eventRouter.get('/:id', getEventById)
eventRouter.post('/', verifyToken, requireRole(UserRole.LOCAL, UserRole.SUPER_ADMIN), createEvent)
eventRouter.put('/:id', verifyToken, requireRole(UserRole.LOCAL, UserRole.SUPER_ADMIN), updateEvent)
eventRouter.patch('/:id/active', verifyToken, requireRole(UserRole.LOCAL, UserRole.SUPER_ADMIN), toggleEventActive)
eventRouter.delete('/:id', verifyToken, requireRole(UserRole.LOCAL, UserRole.SUPER_ADMIN), deleteEvent)
