import { body, param } from "express-validator";

export const createTeamValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Nome é obrigatório")
    .isLength({ min: 2, max: 100 }).withMessage("Nome deve ter entre 2 e 100 caracteres"),
  body("color")
    .trim()
    .notEmpty().withMessage("Cor é obrigatória")
    .isLength({ min: 3, max: 20 }).withMessage("Cor deve ter entre 3 e 20 caracteres"),
  body("year")
    .optional()
    .isInt({ min: 1900, max: 2100 }).withMessage("Ano deve estar entre 1900 e 2100"),
  body("sponsor")
    .optional()
    .isLength({ max: 100 }).withMessage("Patrocinador deve ter no máximo 100 caracteres"),
];

export const updateTeamValidator = [
  param("id")
    .isUUID().withMessage("ID do time inválido"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("Nome deve ter entre 2 e 100 caracteres"),
  body("color")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage("Cor deve ter entre 3 e 20 caracteres"),
  body("year")
    .optional({ values: "null" })
    .isInt({ min: 1900, max: 2100 }).withMessage("Ano deve estar entre 1900 e 2100"),
  body("sponsor")
    .optional({ values: "null" })
    .isLength({ max: 100 }).withMessage("Patrocinador deve ter no máximo 100 caracteres"),
];

export const teamIdParamValidator = [
  param("id")
    .isUUID().withMessage("ID do time inválido"),
];
