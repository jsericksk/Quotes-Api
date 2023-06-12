import { Table } from "../../database/Tables";
import { Knex } from "../../database/knex/Knex";
import { User } from "../../models/User";
import { PasswordCrypto } from "../auth/PasswordCrypto";
import { UserService2 } from "./UserService";

export async function registerUser(user: Omit<User, "id">): Promise<number | Error> {
    try {
        const userEmail = await UserService2.getUserByEmail(user.email);
        if ("email" in userEmail ) {
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