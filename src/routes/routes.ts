import { Router } from "express";
import { apiRouter } from "./api.routes";
import { authRouter } from "./auth.routes";


export const router = Router();

router.use("/auth", authRouter);
router.use("/", apiRouter);

