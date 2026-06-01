import { UserRole } from '@/enums'

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