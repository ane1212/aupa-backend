import { Router } from "express";
import { userRouter } from "./user.routes";
import favoriteRouter from "./favorite.routes";

export const apiRouter = Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/favorites', favoriteRouter);

