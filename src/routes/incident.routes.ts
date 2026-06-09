import { Router } from 'express'
import { createIncident, getIncidentsByEvent, getIncidentsByUser, getIncidentById, updateIncident, deleteIncident } from '@/controllers'
import { verifyToken } from '@/middlewares'

export const incidentRouter = Router()

incidentRouter.post('/', verifyToken, createIncident)
incidentRouter.get('/event/:eventId', verifyToken, getIncidentsByEvent)
incidentRouter.get('/user/:userId', verifyToken, getIncidentsByUser)
incidentRouter.get('/:id', verifyToken, getIncidentById)
incidentRouter.patch('/:id', verifyToken, updateIncident)
incidentRouter.delete('/:id', verifyToken, deleteIncident)
