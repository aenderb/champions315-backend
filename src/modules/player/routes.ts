import { Router } from "express";
import { CreatePlayerController } from "./controller/CreatePlayerController";
import { GetPlayerByIdController } from "./controller/GetPlayerByIdController";
import { GetPlayersByTeamController } from "./controller/GetPlayersByTeamController";
import { UpdatePlayerController } from "./controller/UpdatePlayerController";
import { DeletePlayerController } from "./controller/DeletePlayerController";
import { ensureAuth } from "@/shared/middlewares/ensureAuth";
import { upload } from "@/shared/config/upload";
import { validate } from "@/shared/middlewares/validate";
import { createPlayerValidator, updatePlayerValidator, playerIdParamValidator } from "./validators/playerValidators";

const routes = Router({ mergeParams: true });

const createPlayerController = new CreatePlayerController();
const getPlayerByIdController = new GetPlayerByIdController();
const getPlayersByTeamController = new GetPlayersByTeamController();
const updatePlayerController = new UpdatePlayerController();
const deletePlayerController = new DeletePlayerController();

// Todas as rotas de player são protegidas
routes.use(ensureAuth);

routes.post("/", upload.single("avatar"), createPlayerValidator, validate, createPlayerController.handle);
routes.get("/", getPlayersByTeamController.handle);
routes.get("/:id", playerIdParamValidator, validate, getPlayerByIdController.handle);
routes.put("/:id", upload.single("avatar"), updatePlayerValidator, validate, updatePlayerController.handle);
routes.delete("/:id", playerIdParamValidator, validate, deletePlayerController.handle);

export default routes;
