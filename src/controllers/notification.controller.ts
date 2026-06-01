import { Request, Response, NextFunction } from 'express'
import {
    createNotificationService,
    getMyNotificationsService,
    markAsReadService,
    markAllAsReadService,
    deleteNotificationService,
} from '@/services'

export const createNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await createNotificationService(req.body)
        return res.status(201).json(notification)
    } catch (error) { next(error) }
}

export const getMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifications = await getMyNotificationsService(req.user!.id)
        return res.json(notifications)
    } catch (error) { next(error) }
}

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await markAsReadService(req.params.id as string, req.user!.id)
        return res.json(notification)
    } catch (error) { next(error) }
}

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await markAllAsReadService(req.user!.id)
        return res.json({ code: 'NOTIFICATIONS_READ' })
    } catch (error) { next(error) }
}

export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deleteNotificationService(req.params.id as string, req.user!.id)
        return res.json({ code: 'NOTIFICATION_DELETED' })
    } catch (error) { next(error) }
}
