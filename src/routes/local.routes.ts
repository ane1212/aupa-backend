import { Router } from 'express'
import { createLocal, getMyLocal, getLocalById, getAllLocals, updateLocal, verifyLocal, deleteLocal } from '@/controllers'
import { verifyToken, requireRole } from '@/middlewares'
import { UserRole } from '@/enums'

export const localRouter = Router()

// Rutas del local propio (rol LOCAL)
localRouter.post('/', verifyToken, requireRole(UserRole.LOCAL), createLocal)
localRouter.get('/mine', verifyToken, requireRole(UserRole.LOCAL), getMyLocal)
localRouter.put('/', verifyToken, requireRole(UserRole.LOCAL), updateLocal)

// Rutas superAdmin
localRouter.get('/', verifyToken, requireRole(UserRole.SUPER_ADMIN), getAllLocals)
localRouter.patch('/:id/verify', verifyToken, requireRole(UserRole.SUPER_ADMIN), verifyLocal)
localRouter.delete('/:id', verifyToken, requireRole(UserRole.SUPER_ADMIN), deleteLocal)

// Ruta pública (cualquier autenticado)
localRouter.get('/:id', verifyToken, getLocalById)
