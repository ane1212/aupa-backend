import { Router } from 'express'
import { createComment, getCommentsByEvent, getCommentsByUser, getCommentById, updateComment, deleteComment } from '@/controllers'
import { verifyToken } from '@/middlewares'

export const commentRouter = Router()

commentRouter.post('/', verifyToken, createComment)
commentRouter.get('/event/:eventId', getCommentsByEvent)
commentRouter.get('/user/:userId', getCommentsByUser)
commentRouter.get('/:id', getCommentById)
commentRouter.patch('/:id', verifyToken, updateComment)
commentRouter.delete('/:id', verifyToken, deleteComment)
