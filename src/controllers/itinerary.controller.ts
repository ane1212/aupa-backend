import { Request, Response } from 'express'
import {
  createItineraryService,
  getItineraryByUserService,
  updateItineraryIndexService,
  reorderItineraryService,
  deleteItineraryService,
} from '@/services'
import { AppError, ErrorCode } from '@/utils'
import { UserRole } from '@/enums'

const handleError = (error: unknown, res: Response) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ code: error.code })
  }
  return res.status(500).json({ code: 'INTERNAL_SERVER_ERROR' })
}

export const createItinerary = async (req: Request, res: Response) => {
  try {
    const itinerary = await createItineraryService({
      userId: req.user!.id,
      eventId: req.body.eventId as string,
      itemIndex: req.body.itemIndex,
    })
    res.status(201).json(itinerary)
  } catch (error) {
    handleError(error, res)
  }
}

export const getMyItinerary = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const itinerary = await getItineraryByUserService(userId, req.query)
    res.json(itinerary)
  } catch (error) {
    handleError(error, res)
  }
}

export const getItineraryByUser = async (req: Request, res: Response) => {
  try {
    if (req.user!.id !== req.params.userId && req.user!.role !== UserRole.SUPER_ADMIN) {
      return res.status(403).json({ code: ErrorCode.FORBIDDEN })
    }
    const itinerary = await getItineraryByUserService(req.params.userId as string, req.query)
    res.json(itinerary)
  } catch (error) {
    handleError(error, res)
  }
}

export const updateItineraryIndex = async (req: Request, res: Response) => {
  try {
    const itinerary = await updateItineraryIndexService(
      req.params.id as string,
      req.user!.id,
      { itemIndex: req.body.itemIndex }
    )
    res.json(itinerary)
  } catch (error) {
    handleError(error, res)
  }
}

export const reorderItinerary = async (req: Request, res: Response) => {
  try {
    const items = req.body.items as { id: string; itemIndex: number }[]
    const itinerary = await reorderItineraryService(req.user!.id, items)
    res.json(itinerary)
  } catch (error) {
    handleError(error, res)
  }
}

export const deleteItinerary = async (req: Request, res: Response) => {
  try {
    await deleteItineraryService(req.params.id as string, req.user!.id)
    res.json({ code: 'ITINERARY_DELETED' })
  } catch (error) {
    handleError(error, res)
  }
}