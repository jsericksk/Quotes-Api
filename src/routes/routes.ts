import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { JWTService } from "../services/auth/JWTService";
import { UserController } from "../controllers/users/UserController";
import { AuthRoute } from "../commom/RouteConstants";

const router = Router();

router.post(AuthRoute.register, UserController.registerValidation, UserController.register);
router.post(AuthRoute.login, UserController.loginValidation, UserController.login);

export { router };