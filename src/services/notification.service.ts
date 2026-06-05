import { Notification } from '@/models'
import { CreateNotificationDto } from '@/dtos'
import { AppError, ErrorCode, buildQueryOptions, getPaginatedResponse } from '@/utils'
import { NotificationType } from '@/enums'
import { PaginationQuery } from '@/types'
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

export const getMyNotificationsService = async (userId: string, query: PaginationQuery = {}) => {
    const options = buildQueryOptions(query, [], ['read', 'type'])
    options.where = { ...options.where, userId }
    if (!options.order) options.order = [['createdAt', 'DESC']]
    const result = await Notification.findAndCountAll(options)
    const page = query.page ? parseInt(query.page as any, 10) : 1
    const limit = query.limit ? parseInt(query.limit as any, 10) : 10
    return getPaginatedResponse(result, page, limit)
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
