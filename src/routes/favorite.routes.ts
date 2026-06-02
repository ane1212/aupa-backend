import { Router } from 'express'
import { createFavorite, getFavoritesByUser, getFavoriteById, deleteFavorite } from '@/controllers'
import { verifyToken } from '@/middlewares'

export const favoriteRouter = Router()

favoriteRouter.post('/', verifyToken, createFavorite)
favoriteRouter.get('/user/:userId', verifyToken, getFavoritesByUser)
favoriteRouter.get('/:id', verifyToken, getFavoriteById)
favoriteRouter.delete('/:id', verifyToken, deleteFavorite)
