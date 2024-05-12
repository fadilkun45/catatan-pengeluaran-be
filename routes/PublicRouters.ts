import { Router } from "express";
import { apiAuthMiddleware } from "../middleware/middleware";
import { GenerateHelper } from "../helper/generateToken";
import { UserController } from "../controllers/UserController";


export const PublicRouter = Router()

PublicRouter.post('/login', UserController.login )
PublicRouter.post("/generate", GenerateHelper.create)