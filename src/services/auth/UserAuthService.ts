import { User } from "../../models/User";
import { UserAuthRepository } from "../../repositories/auth/UserAuthRepository";

export class UserAuthService {

    constructor(private userAuthRepository: UserAuthRepository) { }

    async register(user: Omit<User, "id">): Promise<number | Error> {
        try {
            const registeredUserId = await this.userAuthRepository.register(user);
            return registeredUserId;
        } catch (error) {
            if (error instanceof Error) {
                return new Error(error.message);
            }
            return new Error("Unknown error when registering the user");
        }
    }

    async getUserByEmail(email: string): Promise<User | Error> {
        try {
            const user = await this.userAuthRepository.getUserByEmail(email);
            if (user) return user;

            return new Error("User not found");
        } catch (error) {
            if (error instanceof Error) {
                return new Error(error.message);
            }
            return new Error("Error fetching user");
        }
    }

    async generateAccessToken(refreshToken: string): Promise<object | Error> {
        try {
            const tokens = await this.userAuthRepository.generateAccessToken(refreshToken);
            return tokens;
        } catch (error) {
            if (error instanceof Error) {
                return new Error(error.message);
            }
            return new Error("Unknown error generating tokens");
        }
    }

    async saveOrUpdateUserRefreshToken(userId: number, refreshToken: string): Promise<void | Error> {
        try {
            await this.userAuthRepository.saveOrUpdateUserRefreshToken(userId, refreshToken);
        } catch (error) {
            return new Error("Unknown error saving refresh token");
        }
    }
}