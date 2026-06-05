import { Request, Response } from 'express'
import {
    createPreferenceService,
    getPreferenceByIdService,
    getAllPreferencesByUserService,
    deletePreferenceService,
    preferenceExistsByUserAndCategoryService,
    getUserCategoryNamesService,
} from '@/services'
import { getRecommendationsService } from '@/services'
import { AppError, ErrorCode } from '@/utils'
import { UserRole } from '@/enums'

const handleError = (error: unknown, res: Response) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ code: error.code })
    }
    return res.status(500).json({ code: 'INTERNAL_SERVER_ERROR' })
}

export const createPreference = async (req: Request, res: Response) => {
    try {
        const alreadyExists = await preferenceExistsByUserAndCategoryService(req.user!.id, req.body.categoryId as string)
        if (alreadyExists) return res.status(409).json({ code: ErrorCode.PREFERENCE_ALREADY_EXISTS })
        const preference = await createPreferenceService({ userId: req.user!.id, categoryId: req.body.categoryId as string })
        res.status(201).json(preference)
    } catch (error) { handleError(error, res) }
}

export const getPreferencesByUser = async (req: Request, res: Response) => {
    try {
        if (req.user!.id !== req.params.userId && req.user!.role !== UserRole.SUPER_ADMIN)
            return res.status(403).json({ code: ErrorCode.FORBIDDEN })
        const preferences = await getAllPreferencesByUserService(req.params.userId as string, req.query)
        res.json(preferences)
    } catch (error) { handleError(error, res) }
}

export const getPreferenceById = async (req: Request, res: Response) => {
    try {
        const preference = await getPreferenceByIdService(req.params.id as string)
        if (preference.userId !== req.user!.id && req.user!.role !== UserRole.SUPER_ADMIN)
            return res.status(403).json({ code: ErrorCode.FORBIDDEN })
        res.json(preference)
    } catch (error) { handleError(error, res) }
}

export const deletePreference = async (req: Request, res: Response) => {
    try {
        await deletePreferenceService(req.params.id as string, req.user!.id)
        res.json({ code: 'PREFERENCE_DELETED' })
    } catch (error) { handleError(error, res) }
}

export const getRecommendations = async (req: Request, res: Response) => {
    try {
        const { lat, len } = req.query

        if (!lat || !len) {
            return res.status(400).json({ code: ErrorCode.VALIDATION_ERROR })
        }

        const parsedLat = parseFloat(lat as string)
        const parsedLen = parseFloat(len as string)

        if (isNaN(parsedLat) || isNaN(parsedLen)) {
            return res.status(400).json({ code: ErrorCode.VALIDATION_ERROR })
        }

        const categories = await getUserCategoryNamesService(req.user!.id)
        const recommendations = await getRecommendationsService(parsedLat, parsedLen, categories)

        res.json(recommendations)
    } catch (error) { handleError(error, res) }
}
