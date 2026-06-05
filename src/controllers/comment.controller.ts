import { Request, Response } from 'express'
import {
    createCommentService,
    getCommentByIdService,
    getAllCommentsByEventService,
    getAllCommentsByUserService,
    updateCommentService,
    deleteCommentService
} from '@/services'
import { AppError, ErrorCode } from '@/utils'
import { UserRole } from '@/enums'

const handleError = (error: unknown, res: Response) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ code: error.code })
    }
    return res.status(500).json({ code: 'INTERNAL_SERVER_ERROR' })
}

export const createComment = async (req: Request, res: Response) => {
    try {
        if (req.body.rating === undefined || req.body.rating < 1 || req.body.rating > 5) {
            return res.status(400).json({ code: ErrorCode.VALIDATION_ERROR })
        }
        const comment = await createCommentService({ ...req.body, userId: req.user!.id, eventId: req.body.eventId as string })
        res.status(201).json(comment)
    } catch (error) { handleError(error, res) }
}

export const getCommentsByEvent = async (req: Request, res: Response) => {
    try {
        const comments = await getAllCommentsByEventService(req.params.eventId as string, req.query)
        res.json(comments)
    } catch (error) { handleError(error, res) }
}

export const getCommentsByUser = async (req: Request, res: Response) => {
    try {
        const comments = await getAllCommentsByUserService(req.params.userId as string, req.query)
        res.json(comments)
    } catch (error) { handleError(error, res) }
}

export const getCommentById = async (req: Request, res: Response) => {
    try {
        const comment = await getCommentByIdService(req.params.id as string)
        res.json(comment)
    } catch (error) { handleError(error, res) }
}

export const updateComment = async (req: Request, res: Response) => {
    try {
        if (req.body.rating !== undefined && (req.body.rating < 1 || req.body.rating > 5)) {
            return res.status(400).json({ code: ErrorCode.VALIDATION_ERROR })
        }
        const comment = await updateCommentService(req.params.id as string, req.user!.id, req.body)
        res.json(comment)
    } catch (error) { handleError(error, res) }
}

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const isAdmin = req.user!.role === UserRole.SUPER_ADMIN
        await deleteCommentService(req.params.id as string, req.user!.id, isAdmin)
        res.json({ code: 'COMMENT_DELETED' })
    } catch (error) { handleError(error, res) }
}
