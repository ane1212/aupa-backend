import { Category } from '@/models'
import { CreateCategoryDto, UpdateCategoryDto } from '@/dtos'
import { AppError, ErrorCode } from '@/utils'

export const getAllCategoriesService = async () => {
    return await Category.findAll()
}

export const getCategoryByIdService = async (id: string) => {
    const category = await Category.findByPk(id)
    if (!category) throw new AppError(ErrorCode.CATEGORY_NOT_FOUND, 404)
    return category
}

export const createCategoryService = async (data: CreateCategoryDto) => {
    const existing = await Category.findOne({ where: { name: data.name } })
    if (existing) throw new AppError(ErrorCode.CATEGORY_ALREADY_EXISTS, 409)
    return await Category.create(data)
}

export const updateCategoryService = async (id: string, data: UpdateCategoryDto) => {
    const category = await Category.findByPk(id)
    if (!category) throw new AppError(ErrorCode.CATEGORY_NOT_FOUND, 404)
    await category.update(data)
    return category
}

export const deleteCategoryService = async (id: string) => {
    const category = await Category.findByPk(id)
    if (!category) throw new AppError(ErrorCode.CATEGORY_NOT_FOUND, 404)
    await category.destroy()
}
