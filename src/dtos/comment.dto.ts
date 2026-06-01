export interface CreateCommentDto {
    userId: string
    eventId: string
    content: string
    rating: number
}

export interface UpdateCommentDto {
    content?: string
    rating?: number
}
