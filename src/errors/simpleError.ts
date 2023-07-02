export const simpleError = (message: string, errorCode = "unspecified") => {
    return { error: message, error_code: errorCode };
};