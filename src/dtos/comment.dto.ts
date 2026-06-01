export class CreateCommentDto {
  userId!: string
  eventId!: string
  content!: string
  rating!: number
}

export class UpdateCommentDto {
  content?: string
  rating?: number
}

export class CommentResponseDto {
  id!: string
  userId!: string
  eventId!: string
  content!: string
  rating!: number
  createdAt?: Date
  updatedAt?: Date

  constructor(partial: Partial<CommentResponseDto>) {
    Object.assign(this, partial)
  }
}