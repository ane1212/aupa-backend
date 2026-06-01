import { Router } from 'express'
import { getAllCategory, getCategoryById, createCategory, updateCategory, deleteCategory } from '@/controllers'
import { verifyToken, requireRole } from '@/middlewares'
import { UserRole } from '@/enums'

export const categoryRouter = Router()

categoryRouter.get('/', getAllCategory)
categoryRouter.get('/:id', getCategoryById)
categoryRouter.post('/', verifyToken, requireRole(UserRole.SUPER_ADMIN), createCategory)
categoryRouter.put('/:id', verifyToken, requireRole(UserRole.SUPER_ADMIN), updateCategory)
categoryRouter.delete('/:id', verifyToken, requireRole(UserRole.SUPER_ADMIN), deleteCategory)
