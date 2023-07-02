import { Table } from "../../database/Table";
import { Knex } from "../../database/knex/Knex";
import { RefreshToken } from "../../models/RefreshToken";
import { User } from "../../models/User";
import { JWTService, JwtData } from "../../services/auth/utils/JWTService";
import { PasswordCrypto } from "../../services/auth/utils/PasswordCrypto";
import { UserAuthRepository } from "./UserAuthRepository";
import { v4 as uuidv4 } from "uuid";

export class UserAuthRepositoryImpl implements UserAuthRepository {

    async register(user: Omit<User, "id">): Promise<number> {
        const existingUserWithEmail = await this.getUserByEmailOrUsername(user.email);
        const existingUserWithUsername = await this.getUserByEmailOrUsername(user.username);
        if (existingUserWithEmail) {
            throw new Error("Email not available");
        }
        if (existingUserWithUsername) {
            throw new Error("Username not available");
        }

        const hashedPassword = await new PasswordCrypto().hashPassword(user.password);
        user.password = hashedPassword;
        const [result] = await Knex(Table.users).insert(user).returning("id");

        if (typeof result === "object") {
            return result.id;
        } else if (typeof result === "number") {
            return result;
        }

        throw new Error("Error registering user");
    }

    async getUserByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
        const user = await Knex(Table.users)
            .select("*")
            .where("email", emailOrUsername)
            .orWhere("username", emailOrUsername)
            .first();
        if (user) return user;

        return null;
    }

    async generateAccessToken(refreshToken: string): Promise<object> {
        const jwtService = new JWTService();
        const jwtDataOrError = jwtService.verifyRefreshToken(refreshToken);
        if (jwtDataOrError instanceof Error) {
            throw new Error(jwtDataOrError.message);
        }
        const userId = jwtDataOrError.uid;
        const existingRefreshToken = await Knex(Table.refreshTokens)
            .select("*")
            .where("userId", userId)
            .first();
        if (!existingRefreshToken || existingRefreshToken.refreshToken !== refreshToken) {
            throw new Error("Invalid refresh token");
        }

        const newJwtData: JwtData = {
            uid: userId,
            username: jwtDataOrError.username,
            email: jwtDataOrError.email
        };
        const newAccessToken = jwtService.generateAccessToken(newJwtData);
        const newRefreshToken = jwtService.generateRefreshToken(newJwtData);

        if (newAccessToken instanceof Error || newRefreshToken instanceof Error) {
            throw new Error("Error generating tokens");
        }

        const updatedRefreshToken: RefreshToken = {
            id: existingRefreshToken.id,
            refreshToken: newRefreshToken,
            userId: userId
        };
        const updateResult = await Knex(Table.refreshTokens)
            .where("userId", userId)
            .update(updatedRefreshToken);
        if (updateResult > 0) {
            const tokens = { accessToken: newAccessToken, refreshToken: newRefreshToken };
            return tokens;
        }
        throw new Error("Error generating tokens");
    }

    async saveOrUpdateUserRefreshToken(userId: number, refreshToken: string): Promise<void> {
        const existingRefreshToken = await Knex(Table.refreshTokens)
            .select("*")
            .where("userId", userId)
            .first();
        if (existingRefreshToken) {
            const updatedRefreshtoken: RefreshToken = {
                id: existingRefreshToken.id,
                refreshToken: refreshToken,
                userId: userId
            };
            await Knex(Table.refreshTokens).where("userId", userId).update(updatedRefreshtoken);
        } else {
            const newRefreshToken: RefreshToken = {
                id: uuidv4(),
                refreshToken: refreshToken,
                userId: userId
            };
            await Knex(Table.refreshTokens).insert(newRefreshToken);
        }
    }
}