import { Table } from "../../database/Tables";
import { Knex } from "../../database/knex/Knex";
import { Quote } from "../../models/Quote";

export class QuoteService {

    async getAll(page: number, limit: number, filter: string, id = 0): Promise<Quote[] | Error> {
        try {
            const result = await Knex(Table.Quotes)
                .select("*")
                .where("id", Number(id))
                .orWhere("quote", "like", `%${filter}%`)
                .offset((page - 1) * limit)
                .limit(limit);

            if (id > 0 && result.every(item => item.id !== id)) {
                const resultById = await Knex(Table.Quotes)
                    .select("*")
                    .where("id", "=", id)
                    .first();

                if (resultById) return [...result, resultById];
            }

            return result;
        } catch (error) {
            return new Error("Unknown error getting all quote");
        }
    }

    async getById(id: number): Promise<Quote | Error> {
        try {
            const quote = await Knex(Table.Quotes)
                .select("*")
                .where("id", "=", id)
                .first();

            if (quote) return quote;

            return new Error("Error getting quote");
        } catch (error) {
            return new Error("Unknown error getting quote");
        }
    }

    async create(quote: Omit<Quote, "id">): Promise<number | Error> {
        try {
            const [result] = await Knex(Table.Quotes).insert(quote).returning("id");

            if (typeof result === "object") {
                return result.id;
            } else if (typeof result === "number") {
                return result;
            }

            return new Error("Error creating quote");
        } catch (error) {
            return new Error("Unknown error creating quote");
        }
    }

    async updateById(id: number, quote: Omit<Quote, "id">): Promise<void | Error> {
        try {
            const result = await Knex(Table.Quotes)
                .update(quote)
                .where("id", "=", id);

            if (result > 0) return;

            return new Error("Error updating quote");
        } catch (error) {
            return new Error("Unknown error updating quote");
        }
    }

    async deleteById(id: number): Promise<void | Error> {
        try {
            const result = await Knex(Table.Quotes)
                .where("id", "=", id)
                .del();

            if (result > 0) return;

            return new Error("Error deleting quote");
        } catch (error) {
            return new Error("Unknown error deleting quote");
        }
    }
}