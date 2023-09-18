import express from "express";
import { getSummaryByAi } from "../controller/ai";
import { Schema, validateSchema } from "../middleware/ValidateSchema";

export default (router: express.Router) => {
  router.post("/ai/summary", validateSchema(Schema.ai.summary), getSummaryByAi);
};
