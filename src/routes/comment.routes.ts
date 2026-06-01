import { Router } from 'express'
import { commentController } from '@/controllers/comment.controller'

const router = Router()

// POST /comments
router.post('/', commentController.create.bind(commentController))

// GET /comments/event/:eventId
router.get('/event/:eventId', commentController.findAllByEvent.bind(commentController))

// GET /comments/user/:userId
router.get('/user/:userId', commentController.findAllByUser.bind(commentController))

// GET /comments/:id
router.get('/:id', commentController.findOne.bind(commentController))

// PATCH /comments/:id
router.patch('/:id', commentController.update.bind(commentController))

// DELETE /comments/:id
router.delete('/:id', commentController.delete.bind(commentController))

export default router