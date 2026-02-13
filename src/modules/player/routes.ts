import { Router } from "express";
import { CreatePlayerController } from "./controller/CreatePlayerController";
import { GetPlayerByIdController } from "./controller/GetPlayerByIdController";
import { GetPlayersByTeamController } from "./controller/GetPlayersByTeamController";
import { UpdatePlayerController } from "./controller/UpdatePlayerController";
import { DeletePlayerController } from "./controller/DeletePlayerController";
import { ensureAuth } from "@/shared/middlewares/ensureAuth";

const routes = Router({ mergeParams: true });

const createPlayerController = new CreatePlayerController();
const getPlayerByIdController = new GetPlayerByIdController();
const getPlayersByTeamController = new GetPlayersByTeamController();
const updatePlayerController = new UpdatePlayerController();
const deletePlayerController = new DeletePlayerController();

// Todas as rotas de player são protegidas
routes.use(ensureAuth);

routes.post("/", createPlayerController.handle);
routes.get("/", getPlayersByTeamController.handle);
routes.get("/:id", getPlayerByIdController.handle);
routes.put("/:id", updatePlayerController.handle);
routes.delete("/:id", deletePlayerController.handle);

export default routes;
