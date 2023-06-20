import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JWTError, JWTService } from "../services/auth/JWTService";
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

    const jwtData = new JWTService().verifyAccessToken(token);

    if (jwtData === JWTError.JWTSecretNotFound) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(simpleError("Error verifying token"));
    }

    if (jwtData === JWTError.InvalidToken) {
        return res.status(StatusCodes.UNAUTHORIZED).json(simpleError("Invalid token"));
    }

    if (jwtData === JWTError.TokenExpired) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(simpleError("Expired token"));
    }

    if (jwtData === JWTError.UnknownError) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(simpleError("Error verifying token"));
    }

    req.headers.userId = jwtData.uid.toString();
    req.headers.username = jwtData.username;
    req.headers.email = jwtData.email;

    return next();
}