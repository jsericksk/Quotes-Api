import { QUOTE_NOT_FOUND } from "../../commom/Constants";
import { Table } from "../../database/Table";
import { Knex } from "../../database/knex/Knex";
import { Quote } from "../../models/Quote";

export class QuotesService {

    async getAll(page: number, limit: number, filter: string): Promise<Quote[] | Error> {
        try {
            const result = await Knex(Table.Quotes)
                .select("*")
                .where("quote", "like", `%${filter}%`)
                .orderBy("publicationDate", "desc")
                .offset((page - 1) * limit)
                .limit(limit);

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

            return new Error(QUOTE_NOT_FOUND);
        } catch (error) {
            return new Error("Unknown error getting quote");
        }
    }

    async create(quote: Omit<Quote, "id">): Promise<number | Error> {
        try {
            const quoteToCreate: Omit<Quote, "id"> = {
                ...quote,
                publicationDate: new Date()
            };

            const [result] = await Knex(Table.Quotes).insert(quoteToCreate).returning("id");

            if (typeof result === "object") {
                return result.id;
            } else if (typeof result === "number") {
                return result;
            }

            return new Error("Error creating quote");
        } catch (error) {
            console.log(error);
            return new Error("Unknown error creating quote");
        }
    }

    async updateById(id: number, quote: Omit<Quote, "id">): Promise<void | Error> {
        try {
            const result = await Knex(Table.Quotes)
                .update(quote)
                .where("id", id);

            if (result > 0) return;

            return new Error(QUOTE_NOT_FOUND);
        } catch (error) {
            return new Error("Unknown error updating quote");
        }
    }

    async deleteById(id: number): Promise<void | Error> {
        try {
            const result = await Knex(Table.Quotes)
                .where("id", id)
                .del();

            if (result > 0) return;

            return new Error(QUOTE_NOT_FOUND);
        } catch (error) {
            return new Error("Unknown error deleting quote");
        }
    }

    async count(filter = ""): Promise<number | Error> {
        try {
            const [{ count }] = await Knex(Table.Quotes)
                .where("quote", "like", `%${filter}%`)
                .count<[{ count: number }]>("* as count");

            if (Number.isInteger(Number(count))) return Number(count);

            return new Error("Error when querying the total number of records");
        } catch (error) {
            return new Error("Unknown error when querying the total number of records");
        }
    }
}