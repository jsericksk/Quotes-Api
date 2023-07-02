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
    QUOTE_NOT_FOUND: "quote_not_found",
    QUOTE_NOT_FOUND_IN_SEARCH: "quote_not_found_in_search"
};

export const ErrorConstants = {
    QUOTE_NOT_FOUND: "There is no quote with the given id",
    QUOTE_NOT_FOUND_IN_SEARCH: "No quote found"
};