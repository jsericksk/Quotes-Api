import { User } from "../../models/User";

export interface UserAuthRepository {
    register(user: Omit<User, "id">): Promise<number>
    getUserByEmail(email: string): Promise<User | null>
    generateAccessToken(refreshToken: string): Promise<object>
    saveOrUpdateUserRefreshToken(userId: number, refreshToken: string): Promise<void>
}