
import * as jwt from "jsonwebtoken";
import "dotenv/config";

export interface JwtData {
    uid: number,
    username: string,
    email: string
}

export enum JWTError {
    JWTSecretNotFound = "JwtSecretNotFound",
    InvalidToken = "InvalidToken",
    UnknownError = "UnknownError"
}

export class JWTService {
    private secretKey = process.env.JWT_SECRET;
    
    generateToken(jwtData: JwtData): string | JWTError {
        if (!this.secretKey) {
            return JWTError.JWTSecretNotFound;
        }

        const token = jwt.sign(jwtData, this.secretKey, { expiresIn: "24h" });
        return token;
    }

    verifyToken(token: string): JwtData | JWTError {
        if (!this.secretKey) {
            return JWTError.JWTSecretNotFound;
        }

        try {
            const decoded = jwt.verify(token, this.secretKey);
            if (typeof decoded === "string") {
                return JWTError.InvalidToken;
            }
            return decoded as JwtData;
        } catch (error) {
            return JWTError.UnknownError;
        }
    }
}