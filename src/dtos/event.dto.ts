export interface CreateEventDto {
    title: string
    description?: string
    date: Date
    startTime: string
    endTime?: string
    image?: string
    price?: number
    capacity?: number
    address?: string
    latitude?: number
    longitude?: number
    localId: string
    categoryId?: string
}

export interface UpdateEventDto {
    title?: string
    description?: string
    date?: Date
    startTime?: string
    endTime?: string
    image?: string
    price?: number
    capacity?: number
    address?: string
    latitude?: number
    longitude?: number
    localId?: string
    categoryId?: string
}