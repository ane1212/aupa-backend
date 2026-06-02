import { Notification } from '@/models'
import { CreateNotificationDto } from '@/dtos'
import { AppError, ErrorCode } from '@/utils'
import { NotificationType } from '@/enums'
import {
    emitAllNotificationsReadToUser,
    emitNotificationDeletedToUser,
    emitNotificationReadToUser,
    emitNotificationToUser,
} from '@/socket'

export const createNotificationService = async (data: CreateNotificationDto) => {
    const notification = await Notification.create({ type: NotificationType.INFO, ...data })
    emitNotificationToUser(notification.userId, notification)
    return notification
}

export const getMyNotificationsService = async (userId: string) => {
    return await Notification.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
    })
}

export const markAsReadService = async (id: string, userId: string) => {
    const notification = await Notification.findOne({ where: { id, userId } })
    if (!notification) throw new AppError(ErrorCode.NOTIFICATION_NOT_FOUND, 404)
    await notification.update({ read: true })
    emitNotificationReadToUser(userId, notification)
    return notification
}

export const markAllAsReadService = async (userId: string) => {
    await Notification.update({ read: true }, { where: { userId, read: false } })
    emitAllNotificationsReadToUser(userId)
}

export const deleteNotificationService = async (id: string, userId: string) => {
    const notification = await Notification.findOne({ where: { id, userId } })
    if (!notification) throw new AppError(ErrorCode.NOTIFICATION_NOT_FOUND, 404)
    await notification.destroy()
    emitNotificationDeletedToUser(userId, id)
}
