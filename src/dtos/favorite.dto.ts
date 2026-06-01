export class CreateFavoriteDto {
  userId!: string
  eventId!: string
}

export class FavoriteResponseDto {
  id!: string
  userId!: string
  eventId!: string
  createdAt?: Date

  constructor(partial: Partial<FavoriteResponseDto>) {
    Object.assign(this, partial)
  }
}