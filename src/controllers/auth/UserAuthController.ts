import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { simpleError } from "../../errors/simpleError";
import { JWTService, JWTError } from "../../services/auth/JWTService";
import { PasswordCrypto } from "../../services/auth/PasswordCrypto";
import { UserService } from "../../services/users/UserService";
import { User } from "../../models/User";

export class UserAuthController {

    async register(req: Request, res: Response): Promise<Response> {
        const user = await UserService.registerUser(req.body);

        if (user instanceof Error) {
            return res.status(500).json(simpleError(user.message));
        }

        return res.status(StatusCodes.CREATED).json(user);
    }
    
    async login(req: Request, res: Response): Promise<Response> {
        const credentials = req.body as Omit<User, "id" | "username">;

        const user = await UserService.getUserByEmail(credentials.email);
        if (user instanceof Error) {
            return res.status(StatusCodes.UNAUTHORIZED).json(simpleError("Invalid email or password"));
        }

        const passwordMatch = await new PasswordCrypto().verifyPassword(credentials.password, user.password);
        if (passwordMatch) {
            const accessToken = new JWTService().generateToken({ uid: user.id });
            if (accessToken === JWTError.JWTSecretNotFound || accessToken === JWTError.UnknownError) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(simpleError("Error generating access token"));
            }
            return res.status(StatusCodes.OK).json({ accessToken });
        }

        return res.status(StatusCodes.UNAUTHORIZED).json(simpleError("Invalid email or password"));
    }
}