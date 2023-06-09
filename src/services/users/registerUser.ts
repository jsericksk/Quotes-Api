import { Table } from "../../database/Tables";
import { Knex } from "../../database/knex/Knex";
import { User } from "../../models/User";
import { UserService } from "./UserService";

export async function registerUser(user: Omit<User, "id">): Promise<number | Error> {
    try {
        const userEmail = await UserService.getUserByEmail(user.email);
        if ("email" in userEmail ) {
            return new Error("Email not available.");
        }

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