export const AuthRoute = {
    register: "/auth/register",
    login: "/auth/login",
};

export const QuoteRoute = {
    create: "/quotes",
    getAll: "/quotes",
    getAllFromUser: "/quotes/user/:userId",
    getById: "/quotes/:id",
    update: "/quotes/:id",
    delete: "/quotes/:id",
};