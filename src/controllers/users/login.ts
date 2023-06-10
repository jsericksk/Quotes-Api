import { Request, Response } from "express";

import { User } from "../../models/User";
import { zodValidation } from "../../middlewares/zodValidation";
import { z } from "zod";
import { UserService } from "../../services/users/UserService";
import { StatusCodes } from "http-status-codes";
import { simpleError } from "../../errors/simpleError";
import { PasswordCrypto } from "../../services/auth/PasswordCrypto";
import { JWTError, JWTService } from "../../services/auth/JWTService";

interface BodyProps extends Omit<User, "id" | "username"> { }

export const loginValidation = zodValidation((customSchema) => ({
    body: customSchema<BodyProps>(
        z.object({
            email: z.string().email().min(6),
            password: z.string().min(6),
        })
    ),
}));

export async function login(req: Request<{}, {}, BodyProps>, res: Response) {
    const credentials = req.body;

    const user = await UserService.getUserByEmail(credentials.email);
    if (user instanceof Error) {
        return res.status(StatusCodes.UNAUTHORIZED).json(simpleError("Invalid email or password"));
    }

    const passwordMatch = await PasswordCrypto.verifyPassword(credentials.password, user.password);
    if (passwordMatch) {
        const accessToken = JWTService.generateToken({ uid: user.id });
        if (accessToken === JWTError.JWTSecretNotFound || accessToken === JWTError.UnknownError) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(simpleError("Error generating access token"));
        }
        return res.status(StatusCodes.OK).json({ accessToken });
    }

    return res.status(StatusCodes.UNAUTHORIZED).json(simpleError("Invalid email or password"));
}