import { Router } from "express";
import { CreateUserController } from "./controller/CreateUserController";
import { GetUserByIdController } from "./controller/GetUserByIdController";
import { AuthenticateUserController } from "./controller/AuthenticateUserController";
import { LogoutController } from "./controller/LogoutController";
import { RefreshTokenController } from "./controller/RefreshTokenController";
import { authLimiter, signupLimiter } from "@/shared/middlewares/rateLimiter";
import { uploadAvatar } from "@/shared/config/upload";
import { ensureAuth } from "@/shared/middlewares/ensureAuth";

// User routes
const routes = Router();

const createUserController = new CreateUserController();
const getUserByIdController = new GetUserByIdController();
const authenticateUserController = new AuthenticateUserController();
const logoutController = new LogoutController();
const refreshTokenController = new RefreshTokenController();

// Rotas públicas
routes.post("/signup", signupLimiter, uploadAvatar.single("avatar"), createUserController.handle);
routes.post("/signin", authLimiter, authenticateUserController.handle);
routes.post("/refresh", authLimiter, refreshTokenController.handle);

// Rotas protegidas (requerem cookie de autenticação)
routes.post("/logout", ensureAuth, logoutController.handle);
routes.get("/:id", ensureAuth, getUserByIdController.handle);

export default routes;