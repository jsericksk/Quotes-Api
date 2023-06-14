import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { JWTService } from "../services/auth/JWTService";
import { AuthRoute } from "../commom/RouteConstants";
import { UserAuthController } from "../controllers/auth/UserAuthController";
import { UserAuthRequestValidation } from "../controllers/auth/UserAuthRequesValidation";
import { UserAuthService } from "../services/auth/UserAuthService";

const router = Router();

const userAuthReqValidation = new UserAuthRequestValidation();
const userAuthController = new UserAuthController(new UserAuthService());
router.post(AuthRoute.register, userAuthReqValidation.validateRegister, userAuthController.register);
router.post(AuthRoute.login, userAuthReqValidation.validateLogin, userAuthController.login);

export { router };