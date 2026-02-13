import { Router } from "express";
import { CreateLineupController } from "./controller/CreateLineupController";
import { GetLineupByIdController } from "./controller/GetLineupByIdController";
import { GetLineupsByTeamController } from "./controller/GetLineupsByTeamController";
import { UpdateLineupController } from "./controller/UpdateLineupController";
import { DeleteLineupController } from "./controller/DeleteLineupController";
import { ensureAuth } from "@/shared/middlewares/ensureAuth";
import { validate } from "@/shared/middlewares/validate";
import { createLineupValidator, updateLineupValidator, lineupIdParamValidator } from "./validators/lineupValidators";

const routes = Router({ mergeParams: true });

const createLineupController = new CreateLineupController();
const getLineupByIdController = new GetLineupByIdController();
const getLineupsByTeamController = new GetLineupsByTeamController();
const updateLineupController = new UpdateLineupController();
const deleteLineupController = new DeleteLineupController();

// Todas as rotas de lineup são protegidas
routes.use(ensureAuth);

routes.post("/", createLineupValidator, validate, createLineupController.handle);
routes.get("/", getLineupsByTeamController.handle);
routes.get("/:id", lineupIdParamValidator, validate, getLineupByIdController.handle);
routes.put("/:id", updateLineupValidator, validate, updateLineupController.handle);
routes.delete("/:id", lineupIdParamValidator, validate, deleteLineupController.handle);

export default routes;
