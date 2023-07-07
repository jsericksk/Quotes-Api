export class CustomError extends Error {
    statusCode: number;
    errorCode: string;

    constructor(message: string, statusCode: number, errorMessageCode = "") {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorMessageCode;
    }
}

export const ErrorCode = {
    EMAIL_NOT_AVAILABLE: "email_not_available",
    USERNAME_NOT_AVAILABLE: "username_not_available",
    SEARCH_WITHOUT_RESULTS: "search_without_results",
    USER_WITHOUT_POSTS: "user_without_posts",
    INVALID_PAGE: "invalid_page"
};

export const ErrorMessageConstants = {
    QUOTE_NOT_FOUND: "There is no quote with the given id",
    SEARCH_WITHOUT_RESULTS: "No quote found"
};