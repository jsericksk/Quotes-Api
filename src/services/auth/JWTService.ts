import * as jwt from "jsonwebtoken";
import "dotenv/config";

export interface JwtData {
    uid: number,
    username: string,
    email: string,
    iat?: number,
    exp?: number
}

export enum JWTError {
    JWTSecretNotFound = "JwtSecretNotFound",
    InvalidToken = "InvalidToken",
    TokenExpired = "TokenExpiredError",
    UnknownError = "UnknownError"
}

export class JWTService {
    private accessTokenSecretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
    private refreshTokenSecretKey = process.env.REFRESH_TOKEN_SECRET_KEY;

    generateAccessToken(jwtData: JwtData): string | JWTError {
        if (!this.accessTokenSecretKey) {
            return JWTError.JWTSecretNotFound;
        }
        const token = jwt.sign(jwtData, this.accessTokenSecretKey, { expiresIn: "24h" });
        return token;
    }

    verifyAccessToken(token: string): JwtData | JWTError {
        if (!this.accessTokenSecretKey) {
            return JWTError.JWTSecretNotFound;
        }
        return this.getTokenOrError(token, this.accessTokenSecretKey);
    }

    generateRefreshToken(jwtData: JwtData): string | JWTError {
        if (!this.refreshTokenSecretKey) {
            return JWTError.JWTSecretNotFound;
        }
        const token = jwt.sign(jwtData, this.refreshTokenSecretKey, { expiresIn: "7d" });
        return token;
    }

    verifyRefreshToken(token: string): JwtData | JWTError {
        if (!this.refreshTokenSecretKey) {
            return JWTError.JWTSecretNotFound;
        }
        return this.getTokenOrError(token, this.refreshTokenSecretKey);
    }

    private getTokenOrError(token: string, secretKey: string): JwtData | JWTError {
        try {
            const decoded = jwt.verify(token, secretKey);
            if (typeof decoded === "string") {
                return JWTError.InvalidToken;
            }
            return decoded as JwtData;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return JWTError.TokenExpired;
            }
            return JWTError.UnknownError;
        }
    }
}