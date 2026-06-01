import { Comment } from '@/models'
import { CreateCommentDto, UpdateCommentDto } from '@/dtos'
import { AppError, ErrorCode } from '@/utils'

export const createCommentService = async (data: CreateCommentDto) => {
    return await Comment.create(data)
}

export const getCommentByIdService = async (id: string) => {
    const comment = await Comment.findByPk(id)
    if (!comment) throw new AppError(ErrorCode.COMMENT_NOT_FOUND, 404)
    return comment
}

export const getAllCommentsByEventService = async (eventId: string) => {
    return await Comment.findAll({ where: { eventId }, order: [['createdAt', 'DESC']] })
}

export const getAllCommentsByUserService = async (userId: string) => {
    return await Comment.findAll({ where: { userId }, order: [['createdAt', 'DESC']] })
}

export const updateCommentService = async (id: string, userId: string, data: UpdateCommentDto) => {
    const comment = await Comment.findOne({ where: { id, userId } })
    if (!comment) throw new AppError(ErrorCode.COMMENT_NOT_FOUND, 404)
    await comment.update(data)
    return comment
}

export const deleteCommentService = async (id: string, userId: string) => {
    const comment = await Comment.findOne({ where: { id, userId } })
    if (!comment) throw new AppError(ErrorCode.COMMENT_NOT_FOUND, 404)
    await comment.destroy()
}
