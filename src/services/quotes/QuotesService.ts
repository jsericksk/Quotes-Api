import { ErrorConstants } from "../../errors/ErrorConstants";
import { Quote } from "../../models/Quote";
import { QuotesRepository } from "../../repositories/quotes/QuotesRepository";

export class QuotesService {

    constructor(private quotesRepository: QuotesRepository) { }

    async getAll(page: number, limit: number, filter: string): Promise<Quote[] | Error> {
        try {
            const quotes = await this.quotesRepository.getAll(page, limit, filter);
            return quotes;
        } catch (error) {
            if (error instanceof Error) {
                return new Error(error.message);
            }
            return new Error("Unknown error getting all quote");
        }
    }

    async getById(id: number): Promise<Quote | Error> {
        try {
            const quote = await this.quotesRepository.getById(id);
            if (quote) return quote;

            return new Error(ErrorConstants.QUOTE_NOT_FOUND);
        } catch (error) {
            if (error instanceof Error) {
                return new Error(error.message);
            }
            return new Error("Unknown error getting quote");
        }
    }

    async create(quote: Omit<Quote, "id">): Promise<number | Error> {
        try {
            const createdQuoteId = await this.quotesRepository.create(quote);
            return createdQuoteId;
        } catch (error) {
            if (error instanceof Error) {
                return new Error(error.message);
            }
            return new Error("Unknown error creating quote");
        }
    }

    async updateById(quoteId: number, loggedInUserId: number, quote: Omit<Quote, "id">): Promise<void | Error> {
        try {
            await this.quotesRepository.updateById(quoteId, loggedInUserId, quote);
        } catch (error) {
            if (error instanceof Error) {
                return new Error(error.message);
            }
            return new Error("Unknown error updating quote");
        }
    }

    async deleteById(quoteId: number, loggedInUserId: number): Promise<void | Error> {
        try {
            await this.quotesRepository.deleteById(quoteId, loggedInUserId);
        } catch (error) {
            if (error instanceof Error) {
                return new Error(error.message);
            }
            return new Error("Unknown error deleting quote");
        }
    }

    async count(filter = ""): Promise<number | Error> {
        try {
            const count = await this.quotesRepository.count(filter);
            if (count) return count;

            return new Error(ErrorConstants.QUOTE_NOT_FOUND_IN_SEARCH);
        } catch (error) {
            if (error instanceof Error) {
                return new Error(error.message);
            }
            return new Error("Unknown error when querying the total number of quotes");
        }
    }
}