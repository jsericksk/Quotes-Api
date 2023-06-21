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
        const existingRefreshToken = await Knex(Table.refreshToken)
            .select("*")
            .where("userId", userId)
            .first();
        if (!existingRefreshToken || existingRefreshToken.refreshToken !== refreshToken) {
            return new Error("Invalid refresh token");
        }

        const newJwtData: JwtData = {
            uid: userId,
            username: jwtDataOrError.username,
            email: jwtDataOrError.email
        };
        const newAccessToken = jwtService.generateAccessToken(newJwtData);
        const newRefreshToken = jwtService.generateRefreshToken(newJwtData);

        const updatedRefreshToken: RefreshToken = {
            id: existingRefreshToken.id,
            refreshToken: newRefreshToken,
            userId: userId
        };
        const updateResult = await Knex(Table.refreshToken)
            .where("userId", userId)
            .update(updatedRefreshToken);
        if (updateResult > 0) {
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        }

        return new Error("Error generating refresh token");
    }

    async saveOrUpdateUserRefreshToken(userId: number, refreshToken: string): Promise<void | Error> {
        try {
            const existingRefreshToken = await Knex(Table.refreshToken)
                .select("*")
                .where("userId", userId)
                .first();
            if (existingRefreshToken) {
                const updatedRefreshtoken: RefreshToken = {
                    id: existingRefreshToken.id,
                    refreshToken: refreshToken,
                    userId: userId
                };
                await Knex(Table.refreshToken)
                    .where("userId", userId)
                    .update(updatedRefreshtoken);
            } else {
                const newRefreshToken: Omit<RefreshToken, "id"> = {
                    refreshToken: refreshToken,
                    userId: userId
                };
                await Knex(Table.refreshToken).insert(newRefreshToken);
            }
        } catch (error) {
            console.log("Error saving refresh token: " + error);
            return new Error("Unknown error saving refresh token");
        }
    }
}