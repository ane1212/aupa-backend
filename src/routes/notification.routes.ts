import { Router } from 'express'
import { createNotification, getMyNotifications, markAsRead, markAllAsRead, deleteNotification } from '@/controllers'
import { verifyToken, requireRole } from '@/middlewares'
import { UserRole } from '@/enums'

export const notificationRouter = Router()

notificationRouter.get('/', verifyToken, getMyNotifications)
notificationRouter.patch('/:id/read', verifyToken, markAsRead)
notificationRouter.patch('/read-all', verifyToken, markAllAsRead)
notificationRouter.delete('/:id', verifyToken, deleteNotification)

// Solo superAdmin puede crear notificaciones manualmente
notificationRouter.post('/', verifyToken, requireRole(UserRole.SUPER_ADMIN), createNotification)
