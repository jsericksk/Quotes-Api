import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { simpleError } from "../../errors/simpleError";
import { JWTService, JwtData } from "../../services/auth/utils/JWTService";
import { PasswordCrypto } from "../../services/auth/utils/PasswordCrypto";
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

            if (accessToken instanceof Error) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
                    simpleError("Error generating access token: " + accessToken.message)
                );
            }
            if (refreshToken instanceof Error) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
                    simpleError("Error generating refresh token: " + refreshToken.message)
                );
            }

            await this.userAuthService.saveOrUpdateUserRefreshToken(user.id, refreshToken);
            return res.status(StatusCodes.OK).json({ accessToken: accessToken, refreshToken: refreshToken });
        }

        return res.status(StatusCodes.UNAUTHORIZED).json(simpleError("Invalid email or password"));
    };

    generateRefreshToken = async (req: Request, res: Response): Promise<Response> => {
        const { refreshToken } = req.body;
        const result = await this.userAuthService.generateAccessToken(refreshToken);
        if (result instanceof Error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(simpleError(result.message));
        }
        return res.status(StatusCodes.OK).json(result);
    };
}