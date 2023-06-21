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
            const jwtSwtService = new JWTService();
            const accessToken = jwtSwtService.generateAccessToken(jwtData);
            const refreshToken = jwtSwtService.generateRefreshToken(jwtData);

            if (accessToken === JWTError.JWTSecretNotFound || accessToken === JWTError.UnknownError) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(simpleError("Error generating access token"));
            }
            if (refreshToken === JWTError.JWTSecretNotFound || refreshToken === JWTError.UnknownError) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(simpleError("Error generating refresh token"));
            }
            
            await this.userAuthService.saveOrUpdateUserRefreshToken(user.id, refreshToken);
            return res.status(StatusCodes.OK).json({ access_token: accessToken, refresh_token: refreshToken });
        }

        return res.status(StatusCodes.UNAUTHORIZED).json(simpleError("Invalid email or password"));
    };
}