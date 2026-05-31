import { Router } from "express";
import { controllerMiddleware } from "../middlewares/controller.middleware.js";
import { fighterService } from "../services/fighterService.js";
import {
  createFighterValid,
  updateFighterValid,
} from "../middlewares/fighter.validation.middleware.js";

const router = Router();

router.get(
  "/",
  controllerMiddleware(() => fighterService.getAll())
);

router.get(
  "/:id",
  controllerMiddleware((req) => fighterService.getById(req.params.id))
);

router.post(
  "/",
  createFighterValid,
  controllerMiddleware((req) => fighterService.create(req.body))
);

router.patch(
  "/:id",
  updateFighterValid,
  controllerMiddleware((req) => fighterService.update(req.params.id, req.body))
);

router.delete(
  "/:id",
  controllerMiddleware((req) => fighterService.delete(req.params.id))
);

export { router };
