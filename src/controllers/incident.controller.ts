import { Request, Response } from 'express'
import {
    createIncidentService,
    getIncidentByIdService,
    getAllIncidentsByEventService,
    getAllIncidentsByUserService,
    updateIncidentService,
    deleteIncidentService,
} from '@/services'
import { AppError, ErrorCode } from '@/utils'
import { UserRole } from '@/enums'

const handleError = (error: unknown, res: Response) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ code: error.code })
    }
    return res.status(500).json({ code: 'INTERNAL_SERVER_ERROR' })
}

export const createIncident = async (req: Request, res: Response) => {
    try {
        if (!req.body.content?.trim()) {
            return res.status(400).json({ code: ErrorCode.VALIDATION_ERROR })
        }
        const incident = await createIncidentService({
            userId: req.user!.id,
            eventId: req.body.eventId as string,
            content: req.body.content as string,
        })
        res.status(201).json(incident)
    } catch (error) { handleError(error, res) }
}

export const getIncidentsByEvent = async (req: Request, res: Response) => {
    try {
        const incidents = await getAllIncidentsByEventService(req.params.eventId as string, req.query)
        res.json(incidents)
    } catch (error) { handleError(error, res) }
}

export const getIncidentsByUser = async (req: Request, res: Response) => {
    try {
        const incidents = await getAllIncidentsByUserService(req.params.userId as string, req.query)
        res.json(incidents)
    } catch (error) { handleError(error, res) }
}

export const getIncidentById = async (req: Request, res: Response) => {
    try {
        const incident = await getIncidentByIdService(req.params.id as string)
        res.json(incident)
    } catch (error) { handleError(error, res) }
}

export const updateIncident = async (req: Request, res: Response) => {
    try {
        const isAdmin = req.user!.role === UserRole.SUPER_ADMIN
        const incident = await updateIncidentService(req.params.id as string, req.user!.id, req.body, isAdmin)
        res.json(incident)
    } catch (error) { handleError(error, res) }
}

export const deleteIncident = async (req: Request, res: Response) => {
    try {
        const isAdmin = req.user!.role === UserRole.SUPER_ADMIN
        await deleteIncidentService(req.params.id as string, req.user!.id, isAdmin)
        res.json({ code: 'INCIDENT_DELETED' })
    } catch (error) { handleError(error, res) }
}
