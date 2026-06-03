import { CategoryType } from "@/enums"

export interface CreateCategoryDto {
    name: CategoryType
    description?: string
    icon?: string
}

export interface UpdateCategoryDto {
    name?: CategoryType
    description?: string
    icon?: string
}