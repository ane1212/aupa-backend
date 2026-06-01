import { Request, Response } from 'express'
import {
    getAllCategoriesService,
    getCategoryByIdService,
    createCategoryService,
    updateCategoryService,
    deleteCategoryService
} from '@/services'
import { AppError } from '@/utils'

const handleError = (error: unknown, res: Response) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ code: error.code })
    }
    return res.status(500).json({ code: 'INTERNAL_SERVER_ERROR' })
}

export const getAllCategory = async (_req: Request, res: Response) => {
    try {
        const categories = await getAllCategoriesService()
        res.json(categories)
    } catch (error) { handleError(error, res) }
}

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const category = await getCategoryByIdService(req.params.id as string)
        res.json(category)
    } catch (error) { handleError(error, res) }
}

export const createCategory = async (req: Request, res: Response) => {
    try {
        const category = await createCategoryService(req.body)
        res.status(201).json(category)
    } catch (error) { handleError(error, res) }
}

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const category = await updateCategoryService(req.params.id as string, req.body)
        res.json(category)
    } catch (error) { handleError(error, res) }
}

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        await deleteCategoryService(req.params.id as string)
        res.json({ code: 'CATEGORY_DELETED' })
    } catch (error) { handleError(error, res) }
}
