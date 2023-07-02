export const simpleError = (message: string, errorCode = "") => {
    if (errorCode.length > 0) {
        return { error: message, error_code: errorCode };
    }
    return { error: message };
};