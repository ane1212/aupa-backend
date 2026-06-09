import { Router } from "express";
import { userRouter } from "./user.routes";
import { authRouter } from "./auth.routes";
import { categoryRouter } from "./category.routes";
import { eventRouter } from "./event.routes";
import {favoriteRouter} from "./favorite.routes";
import { localRouter } from "./local.routes";
import { commentRouter } from "./comment.routes";
import { preferenceRouter } from "./preference.routes";
import { notificationRouter } from "./notification.routes";
import { itineraryRouter } from "./itinerary.routes";
import { incidentRouter } from "./incident.routes";

export const apiRouter = Router()

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/category', categoryRouter);
apiRouter.use('/event', eventRouter);
apiRouter.use('/favorites', favoriteRouter);
apiRouter.use('/local', localRouter);
apiRouter.use('/comment', commentRouter);
apiRouter.use('/preference', preferenceRouter);
apiRouter.use('/notification', notificationRouter);
apiRouter.use('/itinerary', itineraryRouter)
apiRouter.use('/incident', incidentRouter)
