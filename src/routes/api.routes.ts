import { Router } from "express";
import { userRouter } from "./user.routes";
import { categoryRouter } from "./category.routes";

export const apiRouter = Router();

apiRouter.use('/user', userRouter);

apiRouter.use('/category', categoryRouter);
