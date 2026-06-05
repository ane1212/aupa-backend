import { Request, Response } from 'express'
import {
    createFavoriteService,
    getFavoriteByIdService,
    getAllFavoritesByUserService,
    deleteFavoriteService,
    favoriteExistsByUserAndEventService
} from '@/services'
import { AppError, ErrorCode } from '@/utils'
import { UserRole } from '@/enums'

const handleError = (error: unknown, res: Response) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ code: error.code })
    }
    return res.status(500).json({ code: 'INTERNAL_SERVER_ERROR' })
}

export const createFavorite = async (req: Request, res: Response) => {
    try {
        const alreadyExists = await favoriteExistsByUserAndEventService(req.user!.id, req.body.eventId as string)
        if (alreadyExists) return res.status(409).json({ code: ErrorCode.FAVORITE_ALREADY_EXISTS })
        const favorite = await createFavoriteService({ userId: req.user!.id, eventId: req.body.eventId as string })
        res.status(201).json(favorite)
    } catch (error) { handleError(error, res) }
}

export const getFavoritesByUser = async (req: Request, res: Response) => {
    try {
        if (req.user!.id !== req.params.userId && req.user!.role !== UserRole.SUPER_ADMIN)
            return res.status(403).json({ code: ErrorCode.FORBIDDEN })
        const favorites = await getAllFavoritesByUserService(req.params.userId as string, req.query)
        res.json(favorites)
    } catch (error) { handleError(error, res) }
}

export const getFavoriteById = async (req: Request, res: Response) => {
    try {
        const favorite = await getFavoriteByIdService(req.params.id as string)
        if (favorite.userId !== req.user!.id && req.user!.role !== UserRole.SUPER_ADMIN)
            return res.status(403).json({ code: ErrorCode.FORBIDDEN })
        res.json(favorite)
    } catch (error) { handleError(error, res) }
}

export const deleteFavorite = async (req: Request, res: Response) => {
    try {
        await deleteFavoriteService(req.params.id as string, req.user!.id)
        res.json({ code: 'FAVORITE_DELETED' })
    } catch (error) { handleError(error, res) }
}
