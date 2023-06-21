import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JWTService } from "../services/auth/JWTService";
import { simpleError } from "../errors/simpleError";

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(StatusCodes.UNAUTHORIZED).json(simpleError("Unauthorized"));
    }
    const [type, token] = authorization.split(" ");
    if (type !== "Bearer") {
        return res.status(StatusCodes.UNAUTHORIZED).json(simpleError("Unauthorized"));
    }
    const jwtDataOrError = new JWTService().verifyAccessToken(token);
    if (jwtDataOrError instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(simpleError(jwtDataOrError.message));
    }

    req.headers.userId = jwtDataOrError.uid.toString();
    req.headers.username = jwtDataOrError.username;
    req.headers.email = jwtDataOrError.email;

    return next();
}