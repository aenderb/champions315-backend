import { Router } from "express";
import { CreateTeamController } from "./controller/CreateTeamController";
import { GetTeamByIdController } from "./controller/GetTeamByIdController";
import { GetTeamsByUserController } from "./controller/GetTeamsByUserController";
import { UpdateTeamController } from "./controller/UpdateTeamController";
import { DeleteTeamController } from "./controller/DeleteTeamController";
import { ensureAuth } from "@/shared/middlewares/ensureAuth";

const routes = Router();

const createTeamController = new CreateTeamController();
const getTeamByIdController = new GetTeamByIdController();
const getTeamsByUserController = new GetTeamsByUserController();
const updateTeamController = new UpdateTeamController();
const deleteTeamController = new DeleteTeamController();

// Todas as rotas de team são protegidas
routes.use(ensureAuth);

routes.post("/", createTeamController.handle);
routes.get("/", getTeamsByUserController.handle);
routes.get("/:id", getTeamByIdController.handle);
routes.put("/:id", updateTeamController.handle);
routes.delete("/:id", deleteTeamController.handle);

export default routes;
