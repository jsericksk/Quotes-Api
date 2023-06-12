import { Table } from "../../database/Tables";
import { Knex } from "../../database/knex/Knex";
import { User } from "../../models/User";
import { PasswordCrypto } from "./PasswordCrypto";

export class UserAuthService {

    async register(user: Omit<User, "id">): Promise<number | Error> {
        try {
            const userEmail = await this.getUserByEmail(user.email);
            if ("email" in userEmail) {
                return new Error("Email not available.");
            }

            const hashedPassword = await new PasswordCrypto().hashPassword(user.password);
            user.password = hashedPassword;
            const [result] = await Knex(Table.Users).insert(user).returning("id");

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
            const result = await Knex(Table.Users)
                .select("*")
                .where("email", "=", email)
                .first();

            if (result) return result;

            return new Error("User not found");
        } catch (error) {
            return new Error("Error fetching user");
        }
    }
}