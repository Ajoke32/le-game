import { Router } from "express";
import { controllerMiddleware } from "../middlewares/controller.middleware.js";
import { userService } from "../services/userService.js";
import {
  createUserValid,
  updateUserValid,
} from "../middlewares/user.validation.middleware.js";

const router = Router();

router.get(
  "/",
  controllerMiddleware(() => userService.getAll())
);

router.get(
  "/:id",
  controllerMiddleware((req) => userService.getById(req.params.id))
);

router.post(
  "/",
  createUserValid,
  controllerMiddleware((req) => userService.create(req.body))
);

router.patch(
  "/:id",
  updateUserValid,
  controllerMiddleware((req) => userService.update(req.params.id, req.body))
);

router.delete(
  "/:id",
  controllerMiddleware((req) => userService.delete(req.params.id))
);

export { router };
