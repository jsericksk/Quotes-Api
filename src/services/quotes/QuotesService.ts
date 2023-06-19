import { QUOTE_NOT_FOUND } from "../../commom/Constants";
import { Table } from "../../database/Table";
import { Knex } from "../../database/knex/Knex";
import { Quote } from "../../models/Quote";

export class QuotesService {

    async getAll(page: number, limit: number, filter: string): Promise<Quote[] | Error> {
        try {
            const result = await Knex(Table.quote)
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
            const quote = await Knex(Table.quote)
                .select("*")
                .where("id", id)
                .first();

            if (quote) return quote;

            return new Error(QUOTE_NOT_FOUND);
        } catch (error) {
            return new Error("Unknown error getting quote");
        }
    }

    async create(quote: Omit<Quote, "id">): Promise<number | Error> {
        try {
            const [result] = await Knex(Table.quote).insert(quote).returning("id");

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

    async updateById(quoteId: number, loggedInUserId: number, quote: Omit<Quote, "id">): Promise<void | Error> {
        try {
            const isQuoteOwnedByLoggedInUser = await this.isQuoteOwnedByLoggedInUser(quoteId, loggedInUserId);
            if (!isQuoteOwnedByLoggedInUser) {
                return new Error(QUOTE_NOT_FOUND);
            }

            const result = await Knex(Table.quote)
                .update(quote)
                .where("id", quoteId);

            if (result > 0) return;

            return new Error(QUOTE_NOT_FOUND);
        } catch (error) {
            return new Error("Unknown error updating quote");
        }
    }

    async deleteById(quoteId: number, loggedInUserId: number): Promise<void | Error> {
        try {
            const isQuoteOwnedByLoggedInUser = await this.isQuoteOwnedByLoggedInUser(quoteId, loggedInUserId);
            if (!isQuoteOwnedByLoggedInUser) {
                return new Error(QUOTE_NOT_FOUND);
            }

            const result = await Knex(Table.quote)
                .where("id", quoteId)
                .del();

            if (result > 0) return;

            return new Error(QUOTE_NOT_FOUND);
        } catch (error) {
            return new Error("Unknown error deleting quote");
        }
    }

    private async isQuoteOwnedByLoggedInUser(quoteId: number, loggedInUserId: number): Promise<boolean> {
        const quoteFound = await this.getById(quoteId);
        if (!(quoteFound instanceof Error)) {
            return quoteFound.postedByUserId === loggedInUserId;
        }
        return false;
    }

    async count(filter = ""): Promise<number | Error> {
        try {
            const [{ count }] = await Knex(Table.quote)
                .where("quote", "like", `%${filter}%`)
                .count<[{ count: number }]>("* as count");

            if (Number.isInteger(Number(count))) return Number(count);

            return new Error("Error when querying the total number of records");
        } catch (error) {
            return new Error("Unknown error when querying the total number of records");
        }
    }
}