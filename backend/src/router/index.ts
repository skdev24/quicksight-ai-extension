import express from "express";

import ai from "./ai";

const router = express.Router();

export default (): express.Router => {
  ai(router);
  return router;
};
