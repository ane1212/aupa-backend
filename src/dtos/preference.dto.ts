export class CreatePreferenceDto {
  userId!: string
  categoryId!: string
}

export class PreferenceResponseDto {
  id!: string
  userId!: string
  categoryId!: string
  createdAt?: Date

  constructor(partial: Partial<PreferenceResponseDto>) {
    Object.assign(this, partial)
  }
}