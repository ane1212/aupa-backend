import { IncidentStatus } from '@/enums'

export interface CreateIncidentDto {
    userId: string
    eventId: string
    content: string
}

export interface UpdateIncidentDto {
    content?: string
    status?: IncidentStatus
}
