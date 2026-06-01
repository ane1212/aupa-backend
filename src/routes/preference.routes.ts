import { Router } from 'express'
import { createPreference, getPreferencesByUser, getPreferenceById, deletePreference } from '@/controllers'
import { verifyToken } from '@/middlewares'

export const preferenceRouter = Router()

preferenceRouter.post('/', verifyToken, createPreference)
preferenceRouter.get('/user/:userId', getPreferencesByUser)
preferenceRouter.get('/:id', getPreferenceById)
preferenceRouter.delete('/:id', verifyToken, deletePreference)
