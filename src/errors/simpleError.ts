export const simpleError = (message: string, errorCode = "") => {
    if (errorCode.length === 0) {
        errorCode = "unspecified";
    }
    return { error: message, error_code: errorCode };
};