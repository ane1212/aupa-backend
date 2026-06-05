import { Category } from '@/models'
import { CreateCategoryDto, UpdateCategoryDto } from '@/dtos'
import { AppError, ErrorCode, buildQueryOptions, getPaginatedResponse } from '@/utils'
import { CategoryType } from '@/enums'
import { PaginationQuery } from '@/types'

export const getAllCategoriesService = async (query: PaginationQuery) => {
    const options = buildQueryOptions(query, ['name'], []);
    const result = await Category.findAndCountAll(options);
    const page = query.page ? parseInt(query.page as any, 10) : 1;
    const limit = query.limit ? parseInt(query.limit as any, 10) : 10;
    return getPaginatedResponse(result, page, limit);
}

export const getCategoryByIdService = async (id: string) => {
    const category = await Category.findByPk(id)
    if (!category) throw new AppError(ErrorCode.CATEGORY_NOT_FOUND, 404)
    return category
}

export const createCategoryService = async (data: CreateCategoryDto) => {
    if (!Object.values(CategoryType).includes(data.name as CategoryType))
        throw new AppError(ErrorCode.VALIDATION_ERROR, 400)
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
