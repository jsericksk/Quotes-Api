import { User } from "../../models/User";
import { UserAuthRepository } from "../../repositories/auth/UserAuthRepository";
import { CustomError } from "../../errors/CustomError";
import { StatusCodes } from "http-status-codes";

export class UserAuthService {

    constructor(private userAuthRepository: UserAuthRepository) { }

    async register(user: Omit<User, "id">): Promise<number | CustomError> {
        try {
            const registeredUserId = await this.userAuthRepository.register(user);
            return registeredUserId;
        } catch (error) {
            if (error instanceof CustomError) {
                return new CustomError(error.message, error.statusCode, error.errorCode);
            }
            return new CustomError("Unknown error when registering the user", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getUserByEmailOrUsername(emailOrUsername: string): Promise<User | CustomError> {
        try {
            const user = await this.userAuthRepository.getUserByEmailOrUsername(emailOrUsername);
            if (user) return user;

            return new CustomError("User not found", StatusCodes.NOT_FOUND);
        } catch (error) {
            if (error instanceof CustomError) {
                return new CustomError(error.message, error.statusCode, error.errorCode);
            }
            return new CustomError("Error fetching user", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async generateAccessToken(refreshToken: string): Promise<object | CustomError> {
        try {
            const tokens = await this.userAuthRepository.generateAccessToken(refreshToken);
            return tokens;
        } catch (error) {
            if (error instanceof CustomError) {
                return new CustomError(error.message, error.statusCode, error.errorCode);
            }
            return new CustomError("Unknown error generating tokens", StatusCodes.UNAUTHORIZED);
        }
    }

    async saveOrUpdateUserRefreshToken(userId: number, refreshToken: string): Promise<void | CustomError> {
        try {
            await this.userAuthRepository.saveOrUpdateUserRefreshToken(userId, refreshToken);
        } catch (error) {
            return new CustomError("Unknown error saving refresh token", StatusCodes.UNAUTHORIZED);
        }
    }
}