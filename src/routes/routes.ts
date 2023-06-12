import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { JWTService } from "../services/auth/JWTService";
import { AuthRoute } from "../commom/RouteConstants";
import { UserAuthController } from "../controllers/auth/UserAuthController";
import { UserAuthReqValidation } from "../controllers/auth/UserAuthReqValidation";

const router = Router();

const userAuthReqValidation = new UserAuthReqValidation();
const userAuthController = new UserAuthController();
router.post(AuthRoute.register, userAuthReqValidation.validateRegisterRequest, userAuthController.register);
router.post(AuthRoute.login, userAuthReqValidation.validateLoginRequest, userAuthController.login);

export { router };