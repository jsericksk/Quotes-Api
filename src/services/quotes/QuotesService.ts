import { StatusCodes } from "http-status-codes";
import { CustomError, ErrorCode, ErrorMessageConstants } from "../../errors/CustomError";
import { Quote } from "../../models/Quote";
import { QuotesRepository } from "../../repositories/quotes/QuotesRepository";

export class QuotesService {

    constructor(private quotesRepository: QuotesRepository) { }

    async getAll(page: number, limit: number, filter: string): Promise<Quote[] | CustomError> {
        try {
            const quotes = await this.quotesRepository.getAll(page, limit, filter);
            return quotes;
        } catch (error) {
            return new CustomError("Error getting all quotes", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getById(id: number): Promise<Quote | CustomError> {
        try {
            const quote = await this.quotesRepository.getById(id);
            if (quote) return quote;

            return new CustomError(ErrorMessageConstants.QUOTE_NOT_FOUND, StatusCodes.NOT_FOUND);
        } catch (error) {
            if (error instanceof CustomError) {
                return new CustomError(error.message, error.statusCode);
            }
            return new CustomError("Unknown error getting quote", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async create(quote: Omit<Quote, "id">): Promise<Quote | CustomError> {
        try {
            const createdQuoteId = await this.quotesRepository.create(quote);
            return createdQuoteId;
        } catch (error) {
            return new CustomError("Error creating quote", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async updateById(quoteId: number, loggedInUserId: number, quote: Omit<Quote, "id">): Promise<void | CustomError> {
        try {
            await this.quotesRepository.updateById(quoteId, loggedInUserId, quote);
        } catch (error) {
            if (error instanceof CustomError) {
                return new CustomError(error.message, error.statusCode, error.errorCode);
            }
            return new CustomError("Unknown error updating quote", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteById(quoteId: number, loggedInUserId: number): Promise<void | CustomError> {
        try {
            await this.quotesRepository.deleteById(quoteId, loggedInUserId);
        } catch (error) {
            if (error instanceof CustomError) {
                return new CustomError(error.message, error.statusCode, error.errorCode);
            }
            return new CustomError("Unknown error deleting quote", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async count(filter = ""): Promise<number | CustomError> {
        try {
            const count = await this.quotesRepository.count(filter);
            if (count) return count;

            return new CustomError(ErrorMessageConstants.SEARCH_WITHOUT_RESULTS, StatusCodes.NOT_FOUND, ErrorCode.SEARCH_WITHOUT_RESULTS);
        } catch (error) {
            if (error instanceof CustomError) {
                return new CustomError(error.message, error.statusCode, error.errorCode);
            }
            return new CustomError("Unknown error when querying the total number of quotes", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}