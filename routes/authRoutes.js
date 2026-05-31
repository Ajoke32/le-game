import { Router } from "express";
import { controllerMiddleware } from "../middlewares/controller.middleware.js";
import { authService } from "../services/authService.js";

const router = Router();

router.post(
  "/login",
  controllerMiddleware((req) => authService.login(req.body))
);

export { router };
