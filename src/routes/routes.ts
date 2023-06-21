import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { JWTService } from "../services/auth/JWTService";
import { AuthRoute, QuoteRoute } from "../commom/RouteConstants";
import { UserAuthController } from "../controllers/auth/UserAuthController";
import { UserAuthRequestValidation } from "../controllers/auth/UserAuthRequesValidation";
import { UserAuthService } from "../services/auth/UserAuthService";
import { QuotesController } from "../controllers/quotes/QuotesController";
import { QuotesService } from "../services/quotes/QuotesService";
import { QuotesRequestValidation } from "../controllers/quotes/QuotesRequestValidation";

const router = Router();

const userAuthRequestValidation = new UserAuthRequestValidation();
const userAuthController = new UserAuthController(new UserAuthService());
router.post(AuthRoute.register, userAuthRequestValidation.validateRegister, userAuthController.register);
router.post(AuthRoute.login, userAuthRequestValidation.validateLogin, userAuthController.login);
router.post(AuthRoute.refreshToken, userAuthRequestValidation.validateRefreshToken, userAuthController.generateRefreshToken);

const quotesRequestValidation = new QuotesRequestValidation();
const quotesController = new QuotesController(new QuotesService());
router.get(QuoteRoute.getAll, ensureAuthenticated, quotesRequestValidation.validateGetAll, quotesController.getAll);
router.get(QuoteRoute.getById, ensureAuthenticated, quotesRequestValidation.validateGetById, quotesController.getById);
router.post(QuoteRoute.create, ensureAuthenticated, quotesRequestValidation.validateCreate, quotesController.create);
router.put(QuoteRoute.update, ensureAuthenticated, quotesRequestValidation.validateUpdateById, quotesController.updateById);
router.delete(QuoteRoute.delete, ensureAuthenticated, quotesRequestValidation.validateDeleteById, quotesController.deleteById);

export { router };