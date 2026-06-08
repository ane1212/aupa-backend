import { Router } from 'express'
import {
  createItinerary,
  getMyItinerary,
  getItineraryByUser,
  updateItineraryIndex,
  reorderItinerary,
  deleteItinerary,
} from '@/controllers'
import { verifyToken, requireRole } from '@/middlewares'
import { UserRole } from '@/enums'

export const itineraryRouter = Router()

itineraryRouter.get('/mine', verifyToken, getMyItinerary)
itineraryRouter.get('/user/:userId', verifyToken, getItineraryByUser)
itineraryRouter.post('/', verifyToken, createItinerary)
itineraryRouter.patch('/reorder', verifyToken, reorderItinerary)
itineraryRouter.patch('/:id/index', verifyToken, updateItineraryIndex)
itineraryRouter.delete('/:id', verifyToken, deleteItinerary)