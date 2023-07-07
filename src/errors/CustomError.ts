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
    EMAIL_ALREADY_EXISTS: "email_already_exists",
    USERNAME_ALREADY_EXISTS: "username_already_exists",
    SEARCH_WITHOUT_RESULTS: "search_without_results",
    USER_WITHOUT_POSTS: "user_without_posts",
    INVALID_PAGE: "invalid_page"
};

export const ErrorMessageConstants = {
    QUOTE_NOT_FOUND: "There is no quote with the given id",
    SEARCH_WITHOUT_RESULTS: "No quote found"
};