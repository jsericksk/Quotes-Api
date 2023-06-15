import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { simpleError } from "../../errors/simpleError";
import { JWTService, JWTError, JwtData } from "../../services/auth/JWTService";
import { PasswordCrypto } from "../../services/auth/PasswordCrypto";
import { User } from "../../models/User";
import { UserAuthService } from "../../services/auth/UserAuthService";

export class UserAuthController {

    constructor(private userAuthService: UserAuthService) { }

    register = async (req: Request, res: Response): Promise<Response> => {
        const user = await this.userAuthService.register(req.body);

        if (user instanceof Error) {
            return res.status(500).json(simpleError(user.message));
        }

        return res.status(StatusCodes.CREATED).json(user);
    };

    login = async (req: Request, res: Response): Promise<Response> => {
        const credentials = req.body as Omit<User, "id" | "username">;

        const user = await this.userAuthService.getUserByEmail(credentials.email);
        if (user instanceof Error) {
            return res.status(StatusCodes.UNAUTHORIZED).json(simpleError("Invalid email or password"));
        }

        const passwordMatch = await new PasswordCrypto().verifyPassword(credentials.password, user.password);
        if (passwordMatch) {
            const jwtData: JwtData = {
                uid: user.id,
                username: user.username,
                email: user.email
            };
            const accessToken = new JWTService().generateToken(jwtData);
            if (accessToken === JWTError.JWTSecretNotFound || accessToken === JWTError.UnknownError) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(simpleError("Error generating access token"));
            }
            return res.status(StatusCodes.OK).json({ accessToken });
        }

        return res.status(StatusCodes.UNAUTHORIZED).json(simpleError("Invalid email or password"));
    };
}