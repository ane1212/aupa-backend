import { Router } from 'express'
import { favoriteController } from '@/controllers/favorite.controller'

const router = Router()

// POST /favorites
router.post('/', favoriteController.create.bind(favoriteController))

// GET /favorites/user/:userId
router.get('/user/:userId', favoriteController.findAllByUser.bind(favoriteController))

// GET /favorites/:id
router.get('/:id', favoriteController.findOne.bind(favoriteController))

// DELETE /favorites/:id
router.delete('/:id', favoriteController.delete.bind(favoriteController))

export default router