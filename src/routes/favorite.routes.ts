import { Router } from 'express'
import { createFavorite, getFavoritesByUser, getFavoriteById, deleteFavorite } from '@/controllers'
import { verifyToken } from '@/middlewares'

export const favoriteRouter = Router()

favoriteRouter.post('/', verifyToken, createFavorite)
favoriteRouter.get('/user/:userId', getFavoritesByUser)
favoriteRouter.get('/:id', getFavoriteById)
favoriteRouter.delete('/:id', verifyToken, deleteFavorite)
