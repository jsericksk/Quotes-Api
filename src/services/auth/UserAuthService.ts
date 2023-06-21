import { Table } from "../../database/Table";
import { Knex } from "../../database/knex/Knex";
import { RefreshToken } from "../../models/RefreshToken";
import { User } from "../../models/User";
import { JWTError, JWTService, JwtData } from "./JWTService";
import { PasswordCrypto } from "./PasswordCrypto";

export class UserAuthService {

    async register(user: Omit<User, "id">): Promise<number | Error> {
        try {
            const userEmail = await this.getUserByEmail(user.email);
            if ("email" in userEmail) {
                return new Error("Email not available");
            }

            const hashedPassword = await new PasswordCrypto().hashPassword(user.password);
            user.password = hashedPassword;
            const [result] = await Knex(Table.user).insert(user).returning("id");

            if (typeof result === "object") {
                return result.id;
            } else if (typeof result === "number") {
                return result;
            }

            return new Error("Error registering user");
        } catch (error) {
            return new Error("Unknown error when registering the user");
        }
    }

    async getUserByEmail(email: string): Promise<User | Error> {
        try {
            const result = await Knex(Table.user)
                .select("*")
                .where("email", "=", email)
                .first();

            if (result) return result;

            return new Error("User not found");
        } catch (error) {
            return new Error("Error fetching user");
        }
    }

    async generateAccessToken(refreshToken: string): Promise<object | Error> {
        const jwtService = new JWTService();
        const jwtDataOrError = jwtService.verifyRefreshToken(refreshToken);
        if (jwtDataOrError === JWTError.JWTSecretNotFound) {
            return new Error("Token secret key not found");
        }
        if (jwtDataOrError === JWTError.InvalidToken) {
            return new Error("Invalid refresh token");
        }
        if (jwtDataOrError === JWTError.TokenExpired) {
            return new Error("Refresh token expired");
        }
        if (jwtDataOrError === JWTError.UnknownError) {
            return new Error("Error verifying refresh token");
        }

        const userId = jwtDataOrError.uid;
        const existingRefreshToken = await this.getRefreshToken(userId);
        if (existingRefreshToken instanceof Error || existingRefreshToken.refreshToken !== refreshToken) {
            return new Error("Invalid refresh token");
        }

        const updatedRefreshTokenResult = await Knex(Table.refreshToken)
            .where("userId", userId)
            .update({ refreshToken });
        if (updatedRefreshTokenResult > 0) {
            const newAccessToken = jwtService.generateAccessToken(jwtDataOrError);
            const newRefreshToken = jwtService.generateRefreshToken(jwtDataOrError);
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        }

        return new Error("Error generating refresh token");
    }

    async saveOrUpdateUserRefreshToken(userId: number, refreshToken: string): Promise<void | Error> {
        try {
            const existingRefreshToken = await this.getRefreshToken(userId);
            if (!(existingRefreshToken instanceof Error)) {
                await Knex(Table.refreshToken)
                    .where("userId", userId)
                    .update({ refreshToken });
            } else {
                const newRefreshToken: Omit<RefreshToken, "id"> = {
                    refreshToken: refreshToken,
                    userId: userId
                };
                await Knex(Table.refreshToken).insert(newRefreshToken);
            }
        } catch (error) {
            return new Error("Unknown error saving refresh token");
        }
    }

    private async getRefreshToken(userId: number): Promise<RefreshToken | Error> {
        try {
            const refreshToken = await Knex(Table.refreshToken)
                .select("*")
                .where("id", userId)
                .first();
            if (refreshToken) return refreshToken;

            return new Error("Refresh token not found");
        } catch (error) {
            return new Error("Error fetching refresh token");
        }
    }
}