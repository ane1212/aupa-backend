    import { Request, Response } from 'express'
import { commentService } from '@/services/comment.service'
import { CreateCommentDto, UpdateCommentDto } from '@/dtos/comment.dto'

export class CommentController {
  async create(req: Request, res: Response): Promise<void> {
    const dto: CreateCommentDto = req.body

    if (dto.rating < 1 || dto.rating > 5) {
      res.status(400).json({ message: 'Rating must be between 1 and 5' })
      return
    }

    const comment = await commentService.create(dto)
    res.status(201).json(comment)
  }

  async findAllByEvent(req: Request, res: Response): Promise<void> {
    const { eventId } = req.params
    const comments = await commentService.findAllByEvent(eventId as string)
    res.status(200).json(comments)
  }

  async findAllByUser(req: Request, res: Response): Promise<void> {
    const { userId } = req.params
    const comments = await commentService.findAllByUser(userId as string)
    res.status(200).json(comments)
  }

  async findOne(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const comment = await commentService.findOne(id as string)

    if (!comment) {
      res.status(404).json({ message: 'Comment not found' })
      return
    }

    res.status(200).json(comment)
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { userId, ...dto }: { userId: string } & UpdateCommentDto = req.body

    if (dto.rating !== undefined && (dto.rating < 1 || dto.rating > 5)) {
      res.status(400).json({ message: 'Rating must be between 1 and 5' })
      return
    }

    const updated = await commentService.update(id as string, userId, dto)

    if (!updated) {
      res.status(404).json({ message: 'Comment not found or unauthorized' })
      return
    }

    res.status(200).json(updated)
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { userId } = req.body

    const deleted = await commentService.delete(id as string, userId)

    if (!deleted) {
      res.status(404).json({ message: 'Comment not found or unauthorized' })
      return
    }

    res.status(204).send()
  }
}

export const commentController = new CommentController()