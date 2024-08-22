import { Response, Request } from "express";

import joi from "joi";

const ValidateUserCreationWithJoi = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    const schema = joi.object({
      firstName: joi.string().required(),
      lastName: joi.string().required(),
      email: joi.string().email().required(),
      password: joi
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9@#]{3,30}$"))
        .required(),
    });

    await schema.validateAsync(req.body, { abortEarly: true });

    next();
  } catch (error: any) {
    return res.status(422).json({
      message: error.message,
      success: false,
    });
  }
};

const LoginValidation = async (req: Request, res: Response, next: any) => {
  try {
    const schema = joi.object({
      password: joi.string().required(),
      email: joi.string().email().required(),
    });

    await schema.validateAsync(req.body, { abortEarly: true });

    next();
  } catch (error: any) {
    return res.status(422).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = {
  ValidateUserCreationWithJoi,
  LoginValidation,
};
