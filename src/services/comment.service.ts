import { Comment } from '@/models/Comment'
import { CreateCommentDto, UpdateCommentDto, CommentResponseDto } from '@/dtos/comment.dto'

export class CommentService {
  async create(dto: CreateCommentDto): Promise<CommentResponseDto> {
    const comment = await Comment.create({
      userId: dto.userId,
      eventId: dto.eventId,
      content: dto.content,
      rating: dto.rating,
    })
    return new CommentResponseDto(comment.toJSON())
  }

  async findAllByEvent(eventId: string): Promise<CommentResponseDto[]> {
    const comments = await Comment.findAll({
      where: { eventId },
      order: [['createdAt', 'DESC']],
    })
    return comments.map(c => new CommentResponseDto(c.toJSON()))
  }

  async findAllByUser(userId: string): Promise<CommentResponseDto[]> {
    const comments = await Comment.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    })
    return comments.map(c => new CommentResponseDto(c.toJSON()))
  }

  async findOne(id: string): Promise<CommentResponseDto | null> {
    const comment = await Comment.findByPk(id)
    if (!comment) return null
    return new CommentResponseDto(comment.toJSON())
  }

  async update(id: string, userId: string, dto: UpdateCommentDto): Promise<CommentResponseDto | null> {
    const comment = await Comment.findOne({ where: { id, userId } })
    if (!comment) return null

    await comment.update(dto)
    return new CommentResponseDto(comment.toJSON())
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const rows = await Comment.destroy({ where: { id, userId } })
    return rows > 0
  }
}

export const commentService = new CommentService()