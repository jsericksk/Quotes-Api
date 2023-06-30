import { Quote } from "../../models/Quote";

export interface QuotesRepository {
    getAll(page: number, limit: number, filter: string): Promise<Quote[]>
    getById(id: number): Promise<Quote | null>
    create(quote: Omit<Quote, "id">): Promise<Quote>
    updateById(quoteId: number, loggedInUserId: number, quote: Omit<Quote, "id">): Promise<void>
    deleteById(quoteId: number, loggedInUserId: number): Promise<void>
    count(filter: string): Promise<number | null>
}