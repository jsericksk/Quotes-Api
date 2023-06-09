
import * as jwt from "jsonwebtoken";
import "dotenv/config";

interface JwtData {
    uid: number;
}

export enum JWTError {
    JWTSecretNotFound = "JwtSecretNotFound",
    InvalidToken = "InvalidToken",
    UnknownError = "UnknownError"
}

const secretKey = process.env.JWT_SECRET;

function generateToken(jwtData: JwtData): string | JWTError {
    if (!secretKey) {
        return JWTError.JWTSecretNotFound;
    }

    const token = jwt.sign(jwtData, secretKey, { expiresIn: "24h" });
    return token;
}

function verifyToken(token: string): JwtData | JWTError {
    if (!secretKey) {
        return JWTError.JWTSecretNotFound;
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        if (typeof decoded === "string") {
            return JWTError.InvalidToken;
        }
        return decoded as JwtData;
    } catch (error) {
        return JWTError.UnknownError;
    }
}

export const JWTService = {
    generateToken,
    verifyToken
};