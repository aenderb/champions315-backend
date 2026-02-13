import { body, param } from "express-validator";

const CARD_TYPES = ["YELLOW", "RED"];

export const createMatchValidator = [
  param("teamId")
    .isUUID().withMessage("ID do time inválido"),
  body("opponent_name")
    .trim()
    .notEmpty().withMessage("Nome do adversário é obrigatório")
    .isLength({ min: 2, max: 100 }).withMessage("Nome do adversário deve ter entre 2 e 100 caracteres"),
  body("team_score")
    .notEmpty().withMessage("Placar do time é obrigatório")
    .isInt({ min: 0 }).withMessage("Placar do time deve ser >= 0"),
  body("opponent_score")
    .notEmpty().withMessage("Placar do adversário é obrigatório")
    .isInt({ min: 0 }).withMessage("Placar do adversário deve ser >= 0"),
  body("date")
    .notEmpty().withMessage("Data é obrigatória")
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("Formato esperado: YYYY-MM-DD")
    .custom((value) => {
      if (isNaN(new Date(value).getTime())) throw new Error("Data inválida");
      return true;
    }),
  body("notes")
    .optional()
    .isLength({ max: 500 }).withMessage("Notas devem ter no máximo 500 caracteres"),
  body("cards")
    .optional()
    .isArray().withMessage("Cards deve ser um array"),
  body("cards.*.player_id")
    .optional()
    .isUUID().withMessage("ID do jogador inválido"),
  body("cards.*.type")
    .optional()
    .isIn(CARD_TYPES).withMessage(`Tipo do cartão deve ser: ${CARD_TYPES.join(", ")}`),
  body("cards.*.minute")
    .optional()
    .isInt({ min: 0, max: 120 }).withMessage("Minuto deve estar entre 0 e 120"),
];

export const updateMatchValidator = [
  param("id")
    .isUUID().withMessage("ID da partida inválido"),
  body("opponent_name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("Nome do adversário deve ter entre 2 e 100 caracteres"),
  body("team_score")
    .optional()
    .isInt({ min: 0 }).withMessage("Placar do time deve ser >= 0"),
  body("opponent_score")
    .optional()
    .isInt({ min: 0 }).withMessage("Placar do adversário deve ser >= 0"),
  body("date")
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("Formato esperado: YYYY-MM-DD")
    .custom((value) => {
      if (isNaN(new Date(value).getTime())) throw new Error("Data inválida");
      return true;
    }),
  body("notes")
    .optional({ values: "null" })
    .isLength({ max: 500 }).withMessage("Notas devem ter no máximo 500 caracteres"),
];

export const addCardValidator = [
  param("id")
    .isUUID().withMessage("ID da partida inválido"),
  body("player_id")
    .notEmpty().withMessage("ID do jogador é obrigatório")
    .isUUID().withMessage("ID do jogador inválido"),
  body("type")
    .notEmpty().withMessage("Tipo do cartão é obrigatório")
    .isIn(CARD_TYPES).withMessage(`Tipo do cartão deve ser: ${CARD_TYPES.join(", ")}`),
  body("minute")
    .optional()
    .isInt({ min: 0, max: 120 }).withMessage("Minuto deve estar entre 0 e 120"),
];

export const matchIdParamValidator = [
  param("id")
    .isUUID().withMessage("ID da partida inválido"),
];

export const removeCardValidator = [
  param("id")
    .isUUID().withMessage("ID da partida inválido"),
  param("cardId")
    .isUUID().withMessage("ID do cartão inválido"),
];
