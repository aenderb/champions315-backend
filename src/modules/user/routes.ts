import { Router } from "express";
import { CreateUserController } from "./controller/CreateUserController";
import { GetUserByIdController } from "./controller/GetUserByIdController";
import { AuthenticateUserController } from "./controller/AuthenticateUserController";
import { LogoutController } from "./controller/LogoutController";
import { RefreshTokenController } from "./controller/RefreshTokenController";
import { UpdateUserAvatarController } from "./controller/UpdateUserAvatarController";
import { authLimiter, signupLimiter } from "@/shared/middlewares/rateLimiter";
import { upload } from "@/shared/config/upload";
import { ensureAuth } from "@/shared/middlewares/ensureAuth";
import { validate } from "@/shared/middlewares/validate";
import { signupValidator, signinValidator, getUserByIdValidator } from "./validators/userValidators";

// User routes
const routes = Router();

const createUserController = new CreateUserController();
const getUserByIdController = new GetUserByIdController();
const authenticateUserController = new AuthenticateUserController();
const logoutController = new LogoutController();
const refreshTokenController = new RefreshTokenController();
const updateUserAvatarController = new UpdateUserAvatarController();

// Rotas públicas
routes.post("/signup", signupLimiter, upload.single("avatar"), signupValidator, validate, createUserController.handle);
routes.post("/signin", authLimiter, signinValidator, validate, authenticateUserController.handle);
routes.post("/refresh", authLimiter, refreshTokenController.handle);

// Rotas protegidas (requerem cookie de autenticação)
routes.post("/logout", ensureAuth, logoutController.handle);
routes.patch("/avatar", ensureAuth, upload.single("avatar"), updateUserAvatarController.handle);
routes.get("/:id", ensureAuth, getUserByIdValidator, validate, getUserByIdController.handle);

export default routes;