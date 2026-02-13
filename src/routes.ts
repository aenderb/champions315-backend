// Main routes

import { Router } from "express";
import userRoutes from "./modules/user/routes";
import { HealthCheckController } from "./shared/controllers/HealthCheckController";

const routes = Router();
const healthCheckController = new HealthCheckController();

// Health check endpoint
routes.get("/health", healthCheckController.handle);

routes.use("/users", userRoutes);

export default routes;