export const AuthInputConstraint = {
    email: {
        min: 6,
        max: 270
    },
    username: {
        min: 3,
        max: 50
    },
    password: {
        min: 6
    }
};

export const QuoteInputConstraint = {
    quote: {
        min: 7,
        max: 1000
    },
    author: {
        min: 1,
        max: 80
    }
};