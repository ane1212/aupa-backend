import { Router } from "express";
import {
    getAllCategory,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from '@/controllers/category.controller'

export const categoryRouter = Router()

categoryRouter.get('/', getAllCategory)
categoryRouter.get('/:id', getCategoryById)

categoryRouter.post('/', createCategory)
categoryRouter.put('/:id', updateCategory)
categoryRouter.delete('/:id', deleteCategory)