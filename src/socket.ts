import { Server, Socket } from 'socket.io'
import { Server as HttpServer } from 'http'
import jwt from 'jsonwebtoken'
import { User } from '@/models'
import { UserRole } from '@/enums'

type TokenPayload = {
    id: string
    role: UserRole
}

let io: Server | null = null

const userRoom = (userId: string) => `user:${userId}`

const getTokenFromSocket = (socket: Socket) => {
    const authToken = socket.handshake.auth?.token
    if (typeof authToken === 'string') return authToken

    const header = socket.handshake.headers.authorization
    if (typeof header === 'string' && header.startsWith('Bearer ')) {
        return header.split(' ')[1]
    }

    return null
}

export const initSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: '*',
        },
    })

    io.use(async (socket, next) => {
        try {
            const token = getTokenFromSocket(socket)
            if (!token) return next(new Error('UNAUTHORIZED'))

            const payload = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload
            const user = await User.findByPk(payload.id)
            if (!user) return next(new Error('USER_NOT_FOUND'))

            socket.data.user = { id: user.id, role: user.role }
            next()
        } catch {
            next(new Error('INVALID_TOKEN'))
        }
    })

    io.on('connection', (socket) => {
        const userId = socket.data.user.id as string
        socket.join(userRoom(userId))
        socket.emit('notification:ready', { userId })
    })

    return io
}

export const emitNotificationToUser = (userId: string, notification: unknown) => {
    io?.to(userRoom(userId)).emit('notification:new', notification)
}

export const emitNotificationReadToUser = (userId: string, notification: unknown) => {
    io?.to(userRoom(userId)).emit('notification:read', notification)
}

export const emitAllNotificationsReadToUser = (userId: string) => {
    io?.to(userRoom(userId)).emit('notification:read-all')
}

export const emitNotificationDeletedToUser = (userId: string, notificationId: string) => {
    io?.to(userRoom(userId)).emit('notification:deleted', { id: notificationId })
}
