import { LocalStatus } from '@/enums'

export interface CreateLocalDto {
    name: string
    address: string
    description?: string
    phone?: string
    image?: string
}

export interface UpdateLocalDto {
    name?: string
    address?: string
    description?: string
    phone?: string
    image?: string
}

export interface VerifyLocalDto {
    status: LocalStatus.APPROVED | LocalStatus.REJECTED
    reason?: string
}
