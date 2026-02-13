import { body, param } from "express-validator";

const POSITIONS = ["GK", "DEF", "MID", "FWD"];
const FIELD_ROLES = ["GK", "RL", "RCB", "LCB", "LL", "RM", "CM", "LM", "RW", "ST", "LW"];

export const createPlayerValidator = [
  param("teamId")
    .isUUID().withMessage("ID do time inválido"),
  body("number")
    .notEmpty().withMessage("Número é obrigatório")
    .isInt({ min: 1, max: 99 }).withMessage("Número deve estar entre 1 e 99"),
  body("name")
    .trim()
    .notEmpty().withMessage("Nome é obrigatório")
    .isLength({ min: 2, max: 100 }).withMessage("Nome deve ter entre 2 e 100 caracteres"),
  body("birth_date")
    .notEmpty().withMessage("Data de nascimento é obrigatória")
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("Formato esperado: YYYY-MM-DD")
    .custom((value) => {
      if (isNaN(new Date(value).getTime())) throw new Error("Data inválida");
      return true;
    }),
  body("position")
    .notEmpty().withMessage("Posição é obrigatória")
    .isIn(POSITIONS).withMessage(`Posição deve ser uma de: ${POSITIONS.join(", ")}`),
  body("field_role")
    .optional()
    .isIn(FIELD_ROLES).withMessage(`Posição no campo deve ser uma de: ${FIELD_ROLES.join(", ")}`),
];

export const updatePlayerValidator = [
  param("id")
    .isUUID().withMessage("ID do jogador inválido"),
  body("number")
    .optional()
    .isInt({ min: 1, max: 99 }).withMessage("Número deve estar entre 1 e 99"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("Nome deve ter entre 2 e 100 caracteres"),
  body("birth_date")
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("Formato esperado: YYYY-MM-DD")
    .custom((value) => {
      if (isNaN(new Date(value).getTime())) throw new Error("Data inválida");
      return true;
    }),
  body("position")
    .optional()
    .isIn(POSITIONS).withMessage(`Posição deve ser uma de: ${POSITIONS.join(", ")}`),
  body("field_role")
    .optional({ values: "null" })
    .isIn(FIELD_ROLES).withMessage(`Posição no campo deve ser uma de: ${FIELD_ROLES.join(", ")}`),
];

export const playerIdParamValidator = [
  param("id")
    .isUUID().withMessage("ID do jogador inválido"),
];
