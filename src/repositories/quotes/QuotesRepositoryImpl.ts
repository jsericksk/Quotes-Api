import { QUOTE_NOT_FOUND } from "../../commom/Constants";
import { Table } from "../../database/Table";
import { Knex } from "../../database/knex/Knex";
import { Quote } from "../../models/Quote";
import { QuotesRepository } from "./QuotesRepository";

export class QuotesRepositoryImpl implements QuotesRepository {

    async getAll(page: number, limit: number, filter: string): Promise<Quote[]> {
        const quotes = await Knex(Table.quotes)
            .select("*")
            .where("quote", "like", `%${filter}%`)
            .orderBy("publicationDate", "desc")
            .offset((page - 1) * limit)
            .limit(limit);

        return quotes;
    }

    async getById(id: number): Promise<Quote | null> {
        const quote = await Knex(Table.quotes)
            .select("*")
            .where("id", id)
            .first();
        if (quote) return quote;

        return null;
    }

    async create(quote: Omit<Quote, "id">): Promise<number> {
        const [result] = await Knex(Table.quotes).insert(quote).returning("id");
        if (typeof result === "object") {
            return result.id;
        }
        return result;
    }

    async updateById(quoteId: number, loggedInUserId: number, quote: Omit<Quote, "id">): Promise<void> {
        const isQuoteOwnedByLoggedInUser = await this.isQuoteOwnedByLoggedInUser(quoteId, loggedInUserId);
        if (!isQuoteOwnedByLoggedInUser) {
            throw new Error(QUOTE_NOT_FOUND);
        }
        const result = await Knex(Table.quotes)
            .update(quote)
            .where("id", quoteId);
        if (result > 0) return;

        throw new Error("Error updating quote");
    }

    async deleteById(quoteId: number, loggedInUserId: number): Promise<void> {
        const isQuoteOwnedByLoggedInUser = await this.isQuoteOwnedByLoggedInUser(quoteId, loggedInUserId);
        if (!isQuoteOwnedByLoggedInUser) {
            throw new Error(QUOTE_NOT_FOUND);
        }
        const result = await Knex(Table.quotes)
            .where("id", quoteId)
            .del();
        if (result > 0) return;

        throw new Error("Error deleting quote");
    }

    async count(filter: string): Promise<number | null> {
        const [{ count }] = await Knex(Table.quotes)
            .where("quote", "like", `%${filter}%`)
            .count<[{ count: number }]>("* as count");
        if (Number.isInteger(Number(count))) {
            return Number(count);
        }
        return null;
    }

    private async isQuoteOwnedByLoggedInUser(quoteId: number, loggedInUserId: number): Promise<boolean> {
        const quoteFound = await this.getById(quoteId);
        if (quoteFound) {
            return quoteFound.postedByUserId === loggedInUserId;
        }
        return false;
    }
}