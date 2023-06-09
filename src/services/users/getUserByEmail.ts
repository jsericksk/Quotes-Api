import { Table } from "../../database/Tables";
import { Knex } from "../../database/knex/Knex";
import { User } from "../../models/User";

export async function getUserByEmail(email: string): Promise<User | Error> {
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