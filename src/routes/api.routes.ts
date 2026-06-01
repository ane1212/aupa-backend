import { Router } from 'express'
import { userRouter } from './user.routes'
import { authRouter } from './auth.routes'
import { categoryRouter } from './category.routes'
import { eventRouter } from './event.routes'
import { favoriteRouter } from './favorite.routes'
import { preferenceRouter } from './preference.routes'
import { commentRouter } from './comment.routes'

export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/user', userRouter)
apiRouter.use('/category', categoryRouter)
apiRouter.use('/event', eventRouter)
apiRouter.use('/favorites', favoriteRouter)
apiRouter.use('/preferences', preferenceRouter)
apiRouter.use('/comments', commentRouter)
