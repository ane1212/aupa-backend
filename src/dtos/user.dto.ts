import { UserRole, LanguageType } from '@/enums'

export interface CreateUserDto {
    name: string
    email: string
    password: string
    role?: UserRole
    language?: LanguageType
}

export interface UpdateUserDto {
    name?: string
    avatar?: string
    language?: LanguageType
}

export interface UpdateAvatarDto {
    avatar: string
}

export interface UpdateUserRoleDto {
    role: UserRole
}