export interface Quote {
    id: number,
    quote: string,
    author: string,
    postedByUsername?: string,
    postedByUserId?: number,
    publicationDate?: Date
}