import { body, param } from "express-validator";

export const signupValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Nome é obrigatório")
    .isLength({ min: 2, max: 100 }).withMessage("Nome deve ter entre 2 e 100 caracteres"),
  body("email")
    .trim()
    .notEmpty().withMessage("E-mail é obrigatório")
    .isEmail().withMessage("E-mail inválido"),
  body("password")
    .notEmpty().withMessage("Senha é obrigatória")
    .isLength({ min: 6 }).withMessage("Senha deve ter no mínimo 6 caracteres"),
];

export const signinValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("E-mail é obrigatório")
    .isEmail().withMessage("E-mail inválido"),
  body("password")
    .notEmpty().withMessage("Senha é obrigatória")
    .isLength({ min: 6 }).withMessage("Senha deve ter no mínimo 6 caracteres"),
];

export const getUserByIdValidator = [
  param("id")
    .isUUID().withMessage("ID inválido"),
];
