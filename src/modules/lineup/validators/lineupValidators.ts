import { body, param } from "express-validator";

export const createLineupValidator = [
  param("teamId")
    .isUUID().withMessage("ID do time inválido"),
  body("name")
    .trim()
    .notEmpty().withMessage("Nome é obrigatório")
    .isLength({ min: 2, max: 100 }).withMessage("Nome deve ter entre 2 e 100 caracteres"),
  body("formation")
    .optional()
    .isLength({ min: 3, max: 20 }).withMessage("Formação deve ter entre 3 e 20 caracteres"),
  body("starter_ids")
    .isArray({ min: 9, max: 9 }).withMessage("A escalação deve ter exatamente 9 titulares"),
  body("starter_ids.*")
    .isUUID().withMessage("ID de titular inválido"),
  body("bench_ids")
    .isArray({ max: 30 }).withMessage("Máximo de 30 reservas"),
  body("bench_ids.*")
    .isUUID().withMessage("ID de reserva inválido"),
];

export const updateLineupValidator = [
  param("id")
    .isUUID().withMessage("ID da escalação inválido"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("Nome deve ter entre 2 e 100 caracteres"),
  body("formation")
    .optional()
    .isLength({ min: 3, max: 20 }).withMessage("Formação deve ter entre 3 e 20 caracteres"),
  body("starter_ids")
    .optional()
    .isArray({ min: 9, max: 9 }).withMessage("A escalação deve ter exatamente 9 titulares"),
  body("starter_ids.*")
    .optional()
    .isUUID().withMessage("ID de titular inválido"),
  body("bench_ids")
    .optional()
    .isArray({ max: 30 }).withMessage("Máximo de 30 reservas"),
  body("bench_ids.*")
    .optional()
    .isUUID().withMessage("ID de reserva inválido"),
];

export const lineupIdParamValidator = [
  param("id")
    .isUUID().withMessage("ID da escalação inválido"),
];
