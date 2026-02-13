import { Router } from "express";
import { CreateTeamController } from "./controller/CreateTeamController";
import { GetTeamByIdController } from "./controller/GetTeamByIdController";
import { GetTeamsByUserController } from "./controller/GetTeamsByUserController";
import { UpdateTeamController } from "./controller/UpdateTeamController";
import { DeleteTeamController } from "./controller/DeleteTeamController";
import { ensureAuth } from "@/shared/middlewares/ensureAuth";
import { upload } from "@/shared/config/upload";
import { validate } from "@/shared/middlewares/validate";
import { createTeamValidator, updateTeamValidator, teamIdParamValidator } from "./validators/teamValidators";

const routes = Router();

const createTeamController = new CreateTeamController();
const getTeamByIdController = new GetTeamByIdController();
const getTeamsByUserController = new GetTeamsByUserController();
const updateTeamController = new UpdateTeamController();
const deleteTeamController = new DeleteTeamController();

const teamUpload = upload.fields([
  { name: "badge", maxCount: 1 },
  { name: "sponsor_logo", maxCount: 1 },
]);

// Todas as rotas de team são protegidas
routes.use(ensureAuth);

routes.post("/", teamUpload, createTeamValidator, validate, createTeamController.handle);
routes.get("/", getTeamsByUserController.handle);
routes.get("/:id", teamIdParamValidator, validate, getTeamByIdController.handle);
routes.put("/:id", teamUpload, updateTeamValidator, validate, updateTeamController.handle);
routes.delete("/:id", teamIdParamValidator, validate, deleteTeamController.handle);

export default routes;
