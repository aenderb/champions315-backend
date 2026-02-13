// Main routes

import { Router } from "express";
import userRoutes from "./modules/user/routes";
import teamRoutes from "./modules/team/routes";
import playerRoutes from "./modules/player/routes";
import lineupRoutes from "./modules/lineup/routes";
import matchRoutes from "./modules/match/routes";
import { HealthCheckController } from "./shared/controllers/HealthCheckController";

const routes = Router();
const healthCheckController = new HealthCheckController();

// Health check endpoint
routes.get("/health", healthCheckController.handle);

routes.use("/users", userRoutes);
routes.use("/teams", teamRoutes);
routes.use("/teams/:teamId/players", playerRoutes);
routes.use("/teams/:teamId/lineups", lineupRoutes);
routes.use("/teams/:teamId/matches", matchRoutes);

export default routes;