import { Router } from "express";
import { controllerMiddleware } from "../middlewares/controller.middleware.js";
import { createFightValid } from "../middlewares/fight.validation.middleware.js";
import { fightService } from "../services/fightService.js";

const router = Router();

router.get(
  "/",
  controllerMiddleware(() => fightService.getAll())
);

router.get(
  "/:id",
  controllerMiddleware((req) => fightService.getById(req.params.id))
);

router.post(
  "/",
  createFightValid,
  controllerMiddleware((req) => fightService.create(req.body))
);

export { router };
