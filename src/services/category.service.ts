import { Category } from "@/models/Category";
import { CreateCategoryDto, UpdateCategoryDto } from "@/dtos/category.dto";

export const getAllCategoriesService = async () => {
    return await Category.findAll();
}

export const getCategoryByIdService = async (id: string) => {
    const category = await Category.findByPk(id);
    if (!category) throw new Error('Categoria no encontrada')
    return category
}

export const createCategoryService = async (data: CreateCategoryDto) => {
    const exist = await Category.findOne({ where: { name: data.name } })
    if (exist) throw new Error('Ya existe una categoria con ese nombre');

    return await Category.create(data)
}

export const updateCategoryService = async (id: string, data: UpdateCategoryDto) => {
    const category = await Category.findByPk(id)
    if (!category) throw new Error('Categoria no encontrada')

    await category.update(data)
    return category
}

export const deleteCategoryService = async (id: string) => {
    const category = await Category.findByPk(id)
    if (!category) throw new Error('Categoria no encontrada')

    await category.destroy();
}