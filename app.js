import cors from "cors";
import express from "express";
import { errorHandlingMiddleware } from "./middlewares/error.middleware.js";
import { responseMiddleware } from "./middlewares/response.middleware.js";
import { initRoutes } from "./routes/routes.js";

import "./config/db.js";

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  initRoutes(app);

  app.use([responseMiddleware, errorHandlingMiddleware]);

  app.use("/", express.static("./client/dist"));

  return app;
};

const app = createApp();

export { app, createApp };
