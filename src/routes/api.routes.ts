import { Router } from "express";
import { userRouter } from "./user.routes";
import favoriteRouter from "./favorite.routes";
import { localRouter } from "./local.routes";

export const apiRouter = Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/favorites', favoriteRouter);
apiRouter.use('/local', localRouter);

