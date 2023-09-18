import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";

import router from "./router";

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config();

const app = express();

app.use(cors());

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("Server listening on http://localhost:8080");
});

app.use("/", router());
