import { Router } from "express";
import { CreateMatchController } from "./controller/CreateMatchController";
import { GetMatchByIdController } from "./controller/GetMatchByIdController";
import { GetMatchesByTeamController } from "./controller/GetMatchesByTeamController";
import { UpdateMatchController } from "./controller/UpdateMatchController";
import { DeleteMatchController } from "./controller/DeleteMatchController";
import { AddCardController } from "./controller/AddCardController";
import { RemoveCardController } from "./controller/RemoveCardController";
import { ensureAuth } from "@/shared/middlewares/ensureAuth";
import { validate } from "@/shared/middlewares/validate";
import { createMatchValidator, updateMatchValidator, matchIdParamValidator, addCardValidator, removeCardValidator } from "./validators/matchValidators";

const routes = Router({ mergeParams: true });

const createMatchController = new CreateMatchController();
const getMatchByIdController = new GetMatchByIdController();
const getMatchesByTeamController = new GetMatchesByTeamController();
const updateMatchController = new UpdateMatchController();
const deleteMatchController = new DeleteMatchController();
const addCardController = new AddCardController();
const removeCardController = new RemoveCardController();

// Todas as rotas de match são protegidas
routes.use(ensureAuth);

// CRUD de partidas
routes.post("/", createMatchValidator, validate, createMatchController.handle);
routes.get("/", getMatchesByTeamController.handle);
routes.get("/:id", matchIdParamValidator, validate, getMatchByIdController.handle);
routes.put("/:id", updateMatchValidator, validate, updateMatchController.handle);
routes.delete("/:id", matchIdParamValidator, validate, deleteMatchController.handle);

// Cartões dentro de uma partida
routes.post("/:id/cards", addCardValidator, validate, addCardController.handle);
routes.delete("/:id/cards/:cardId", removeCardValidator, validate, removeCardController.handle);

export default routes;
