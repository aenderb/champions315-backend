// Main routes

import { Router } from "express";
import userRoutes from "./modules/user/routes";
import teamRoutes from "./modules/team/routes";
import { HealthCheckController } from "./shared/controllers/HealthCheckController";

const routes = Router();
const healthCheckController = new HealthCheckController();

// Health check endpoint
routes.get("/health", healthCheckController.handle);

routes.use("/users", userRoutes);
routes.use("/teams", teamRoutes);

export default routes;