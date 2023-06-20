export const AuthRoute = {
    register: "/auth/register",
    login: "/auth/login",
    refreshToken: "/auth/refresh-token"
};

export const QuoteRoute = {
    getAll: "/quotes",
    getById: "/quotes/:id",
    create: "/quotes",
    update: "/quotes/:id",
    delete: "/quotes/:id",
    routeForTests: "/quotes/",
};