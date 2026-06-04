import { UserRole } from '@/enums'

export interface CreateUserDto {
    name: string
    email: string
    password: string
    role?: UserRole
}

export interface UpdateUserDto {
    name?: string
    avatar?: string
}

export interface UpdateAvatarDto {
    avatar: string
}

export interface UpdateUserRoleDto {
    role: UserRole
}