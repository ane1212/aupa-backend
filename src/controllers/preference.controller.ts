import { Request, Response } from 'express'
import {
    createPreferenceService,
    getPreferenceByIdService,
    getAllPreferencesByUserService,
    deletePreferenceService,
    preferenceExistsByUserAndCategoryService
} from '@/services'
import { AppError, ErrorCode } from '@/utils'

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
        const preferences = await getAllPreferencesByUserService(req.params.userId as string)
        res.json(preferences)
    } catch (error) { handleError(error, res) }
}

export const getPreferenceById = async (req: Request, res: Response) => {
    try {
        const preference = await getPreferenceByIdService(req.params.id as string)
        res.json(preference)
    } catch (error) { handleError(error, res) }
}

export const deletePreference = async (req: Request, res: Response) => {
    try {
        await deletePreferenceService(req.params.id as string, req.user!.id)
        res.json({ code: 'PREFERENCE_DELETED' })
    } catch (error) { handleError(error, res) }
}
