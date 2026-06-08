export interface CreateItineraryDto {
  eventId: string
  userId: string
  itemIndex?: number
}

export interface UpdateItineraryDto {
  itemIndex?: number
}

export interface ReorderItineraryItemDto {
  id: string
  itemIndex: number
}