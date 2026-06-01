import { Router } from "express";
import { apiRouter } from "./api.routes";

export const router = Router();

router.use("/", apiRouter);
