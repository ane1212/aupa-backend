import { NotificationType } from '@/enums'

export interface CreateNotificationDto {
    userId: string
    title: string
    message: string
    type?: NotificationType
}
