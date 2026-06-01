import { Router } from "express";
import { userRouter } from "./user.routes";
import { authRouter } from "./auth.routes";
import favoriteRouter from "./favorite.routes";
import preferenceRouter from "./preference.routes";

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/favorites', favoriteRouter);
apiRouter.use('/preferences', preferenceRouter);

