import { Router } from "express";
import { userRouter } from "./user.routes";
import { categoryRouter } from "./category.routes";
import { eventRouter } from "./event.routes";
import favoriteRouter from "./favorite.routes";

export const apiRouter = Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/category', categoryRouter);
apiRouter.use('/event', eventRouter);
apiRouter.use('/favorites', favoriteRouter);

