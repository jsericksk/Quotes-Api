import { StatusCodes } from "http-status-codes";
import { Table } from "../../database/Table";
import { Knex } from "../../database/knex/Knex";
import { CustomError, ErrorCode, ErrorMessageConstants } from "../../errors/CustomError";
import { Quote } from "../../models/Quote";
import { QuotesRepository } from "./QuotesRepository";

export class QuotesRepositoryImpl implements QuotesRepository {

    async getAll(page: number, limit: number, filter: string, userId?: number): Promise<Quote[]> {
        const query = Knex(Table.quotes).select("*").where("quote", "like", `%${filter}%`);
        if (userId) {
            query.andWhere("postedByUserId", userId);
        }
        const quotes = await query
            .orderBy("publicationDate", "desc")
            .offset((page - 1) * limit)
            .limit(limit);

        if (userId) {
            const isSearch = (filter !== "");
            if (quotes.length == 0) {
                if (isSearch) {
                    throw new CustomError("No quote found", StatusCodes.NOT_FOUND, ErrorCode.SEARCH_WITHOUT_RESULTS);
                }
                throw new CustomError("No quote found for this user", StatusCodes.NOT_FOUND, ErrorCode.USER_WITHOUT_POSTS);
            }
        }
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

    async create(quote: Omit<Quote, "id">): Promise<Quote> {
        const [result] = await Knex(Table.quotes).insert(quote).returning("*");
        return result;
    }

    async updateById(quoteId: number, loggedInUserId: number, quote: Omit<Quote, "id">): Promise<void> {
        const isQuoteOwnedByLoggedInUser = await this.isQuoteOwnedByLoggedInUser(quoteId, loggedInUserId);
        if (!isQuoteOwnedByLoggedInUser) {
            throw new CustomError(ErrorMessageConstants.QUOTE_NOT_FOUND, StatusCodes.NOT_FOUND);
        }
        const result = await Knex(Table.quotes)
            .update(quote)
            .where("id", quoteId);
        if (result > 0) return;

        throw new CustomError("Error updating quote", StatusCodes.INTERNAL_SERVER_ERROR);
    }

    async deleteById(quoteId: number, loggedInUserId: number): Promise<void> {
        const isQuoteOwnedByLoggedInUser = await this.isQuoteOwnedByLoggedInUser(quoteId, loggedInUserId);
        if (!isQuoteOwnedByLoggedInUser) {
            throw new CustomError(ErrorMessageConstants.QUOTE_NOT_FOUND, StatusCodes.NOT_FOUND);
        }
        const result = await Knex(Table.quotes)
            .where("id", quoteId)
            .del();
        if (result > 0) return;

        throw new CustomError("Error updating quote", StatusCodes.INTERNAL_SERVER_ERROR);
    }

    async count(filter: string, userId?: number): Promise<number | null> {
        const query = Knex(Table.quotes).where("quote", "like", `%${filter}%`);
        if (userId) {
            query.andWhere("postedByUserId", userId);
        }
        const [{ count }] = await query.count<{ count: number }[]>("* as count");
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