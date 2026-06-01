import { Request, Response, NextFunction } from 'express'
import {
    createLocalService,
    getMyLocalService,
    getLocalByIdService,
    getAllLocalsService,
    updateLocalService,
    verifyLocalService,
    deleteLocalService,
} from '@/services'

export const createLocal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const local = await createLocalService(req.user!.id, req.body)
        return res.status(201).json(local)
    } catch (error) { next(error) }
}

export const getMyLocal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const local = await getMyLocalService(req.user!.id)
        return res.json(local)
    } catch (error) { next(error) }
}

export const getLocalById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const local = await getLocalByIdService(req.params.id as string)
        return res.json(local)
    } catch (error) { next(error) }
}

export const getAllLocals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const locals = await getAllLocalsService()
        return res.json(locals)
    } catch (error) { next(error) }
}

export const updateLocal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const local = await updateLocalService(req.user!.id, req.body)
        return res.json(local)
    } catch (error) { next(error) }
}

export const verifyLocal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const local = await verifyLocalService(req.params.id as string, req.user!.id, req.body)
        return res.json(local)
    } catch (error) { next(error) }
}

export const deleteLocal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deleteLocalService(req.params.id as string)
        return res.json({ code: 'LOCAL_DELETED' })
    } catch (error) { next(error) }
}
