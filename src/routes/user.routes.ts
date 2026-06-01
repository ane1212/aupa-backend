import { deleteProfile, getAllUsers, getProfile, getUserById, toggleUserActive, updateAvatar, updateProfile, updateUserRole } from '@/controllers'
import { Router } from 'express'


export const userRouter = Router()

// Rutas de perfil propio
userRouter.get('/profile', getProfile)
userRouter.put('/profile', updateProfile)
userRouter.delete('/profile', deleteProfile)
userRouter.patch('/profile/avatar', updateAvatar)

// Rutas solo superAdmin
userRouter.get('/', getAllUsers)
userRouter.get('/:id', getUserById)
userRouter.patch('/:id/active', toggleUserActive)
userRouter.patch('/:id/role', updateUserRole)