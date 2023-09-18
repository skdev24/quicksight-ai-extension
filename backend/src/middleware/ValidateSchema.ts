import Joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";

export const validateSchema = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      return res.status(422).json({ error });
    }
  };
};

export const Schema = {
  ai: {
    summary: Joi.object({
      highlightedText: Joi.string().required(),
    }),
  },
};
