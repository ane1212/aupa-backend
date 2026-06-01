import { Router } from 'express'
import { preferenceController } from '@/controllers/preference.controller'

const router = Router()

// POST /preferences
router.post('/', preferenceController.create.bind(preferenceController))

// GET /preferences/user/:userId
router.get('/user/:userId', preferenceController.findAllByUser.bind(preferenceController))

// GET /preferences/:id
router.get('/:id', preferenceController.findOne.bind(preferenceController))

// DELETE /preferences/:id
router.delete('/:id', preferenceController.delete.bind(preferenceController))

export default router