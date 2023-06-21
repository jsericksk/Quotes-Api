import * as jwt from "jsonwebtoken";
import "dotenv/config";

export interface JwtData {
    uid: number,
    username: string,
    email: string,
    iat?: number,
    exp?: number
}

const ErrorMesage = {
    JWT_SECRET_NOT_FOUND: "Token secret key not found",
    INVALID_TOKEN: "Invalid token",
    TOKEN_EXPIRED: "Token expired",
    UNKNOWN_ERROR: "Unknown error generating token"
};

export class JWTService {
    private accessTokenSecretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
    private refreshTokenSecretKey = process.env.REFRESH_TOKEN_SECRET_KEY;

    generateAccessToken(jwtData: JwtData): string | Error {
        if (!this.accessTokenSecretKey) {
            return new Error(ErrorMesage.JWT_SECRET_NOT_FOUND);
        }
        const token = jwt.sign(jwtData, this.accessTokenSecretKey, { expiresIn: "24h" });
        return token;
    }

    verifyAccessToken(token: string): JwtData | Error {
        if (!this.accessTokenSecretKey) {
            return new Error(ErrorMesage.JWT_SECRET_NOT_FOUND);
        }
        return this.getTokenOrError(token, this.accessTokenSecretKey);
    }

    generateRefreshToken(jwtData: JwtData): string | Error {
        if (!this.refreshTokenSecretKey) {
            return new Error(ErrorMesage.JWT_SECRET_NOT_FOUND);
        }
        const token = jwt.sign(jwtData, this.refreshTokenSecretKey, { expiresIn: "7d" });
        return token;
    }

    verifyRefreshToken(token: string): JwtData | Error {
        if (!this.refreshTokenSecretKey) {
            return new Error(ErrorMesage.JWT_SECRET_NOT_FOUND);
        }
        return this.getTokenOrError(token, this.refreshTokenSecretKey);
    }

    private getTokenOrError(token: string, secretKey: string): JwtData | Error {
        try {
            const decoded = jwt.verify(token, secretKey);
            if (typeof decoded === "string") {
                return new Error(ErrorMesage.INVALID_TOKEN);
            }
            return decoded as JwtData;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return new Error(ErrorMesage.TOKEN_EXPIRED);
            }
            return new Error(ErrorMesage.UNKNOWN_ERROR);
        }
    }
}