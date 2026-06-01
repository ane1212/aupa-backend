import { Request, Response } from "express";
import {
    getAllCategoriesService,
    getCategoryByIdService,
    createCategoryService,
    updateCategoryService,
    deleteCategoryService
} from "@/services/category.service";

export const getAllCategory = async (req: Request, res: Response) => {
    try {
        const categories = await getAllCategoriesService()
        res.json(categories)
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const category = await getCategoryByIdService(req.params.id as string)
        res.json(category);
    } catch (error: any) {
        res.status(404).json({ message: error.message })
    }
}

export const createCategory = async (req: Request, res: Response) => {
    try {
        const newCategory = await createCategoryService(req.body)
        res.status(201).json(newCategory)
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const categoryUpdate = await updateCategoryService(req.params.id as string, req.body)
        res.json(categoryUpdate)
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        await deleteCategoryService(req.params.id as string)
        res.json({ message: 'Categoría eliminada correctamente' })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}