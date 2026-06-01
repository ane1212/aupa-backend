import { deleteProfile, getAllUsers, getProfile, getUserById, toggleUserActive, updateAvatar, updateProfile, updateUserRole } from '@/controllers'
import { verifyToken, requireRole } from '@/middlewares'
import { UserRole } from '@/enums'
import { Router } from 'express'

export const userRouter = Router()

// Rutas de perfil propio
userRouter.get('/profile', verifyToken, getProfile)
userRouter.put('/profile', verifyToken, updateProfile)
userRouter.delete('/profile', verifyToken, deleteProfile)
userRouter.patch('/profile/avatar', verifyToken, updateAvatar)

// Rutas solo superAdmin
userRouter.get('/', verifyToken, requireRole(UserRole.SUPER_ADMIN), getAllUsers)
userRouter.get('/:id', verifyToken, requireRole(UserRole.SUPER_ADMIN), getUserById)
userRouter.patch('/:id/active', verifyToken, requireRole(UserRole.SUPER_ADMIN), toggleUserActive)
userRouter.patch('/:id/role', verifyToken, requireRole(UserRole.SUPER_ADMIN), updateUserRole)
