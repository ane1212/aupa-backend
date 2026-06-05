import { Comment } from '@/models'
import { CreateCommentDto, UpdateCommentDto } from '@/dtos'
import { AppError, ErrorCode, buildQueryOptions, getPaginatedResponse } from '@/utils'
import { PaginationQuery } from '@/types'

export const createCommentService = async (data: CreateCommentDto) => {
    return await Comment.create(data)
}

export const getCommentByIdService = async (id: string) => {
    const comment = await Comment.findByPk(id)
    if (!comment) throw new AppError(ErrorCode.COMMENT_NOT_FOUND, 404)
    return comment
}

export const getAllCommentsByEventService = async (eventId: string, query: PaginationQuery) => {
    const options = buildQueryOptions(query, ['content'], ['userId', 'localId'])
    options.where = { ...options.where, eventId }
    if (!options.order) options.order = [['createdAt', 'DESC']]
    const result = await Comment.findAndCountAll(options)
    const page = query.page ? parseInt(query.page as any, 10) : 1
    const limit = query.limit ? parseInt(query.limit as any, 10) : 10
    return getPaginatedResponse(result, page, limit)
}

export const getAllCommentsByUserService = async (userId: string, query: PaginationQuery) => {
    const options = buildQueryOptions(query, ['content'], ['eventId', 'localId'])
    options.where = { ...options.where, userId }
    if (!options.order) options.order = [['createdAt', 'DESC']]
    const result = await Comment.findAndCountAll(options)
    const page = query.page ? parseInt(query.page as any, 10) : 1
    const limit = query.limit ? parseInt(query.limit as any, 10) : 10
    return getPaginatedResponse(result, page, limit)
}

export const updateCommentService = async (id: string, userId: string, data: UpdateCommentDto) => {
    const comment = await Comment.findOne({ where: { id, userId } })
    if (!comment) throw new AppError(ErrorCode.COMMENT_NOT_FOUND, 404)
    await comment.update(data)
    return comment
}

export const deleteCommentService = async (id: string, userId: string, isAdmin = false) => {
    const comment = isAdmin
        ? await Comment.findByPk(id)
        : await Comment.findOne({ where: { id, userId } })
    if (!comment) throw new AppError(ErrorCode.COMMENT_NOT_FOUND, 404)
    await comment.destroy()
}
