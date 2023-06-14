export interface Quote {
    id: number,
    quote: string,
    author: string,
    postedBy: PostedBy,
    publicationDate?: Date
}

export interface PostedBy {
    userId: number;
    username: string;
}