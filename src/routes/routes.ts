import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { JWTService } from "../services/auth/JWTService";
import { UserController } from "../controllers/users/UserController";
import { AuthRoute } from "../commom/RouteConstants";
import { UserAuthController } from "../controllers/auth/UserAuthController";

const router = Router();

const userAuthController = new UserAuthController();
router.post(AuthRoute.register, UserController.registerValidation, userAuthController.register);
router.post(AuthRoute.login, UserController.loginValidation, userAuthController.login);

export { router };