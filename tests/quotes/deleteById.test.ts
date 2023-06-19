import { StatusCodes } from "http-status-codes";
import { AuthRoute, QuoteRoute } from "../../src/commom/RouteConstants";
import { User } from "../../src/models/User";
import { testServer } from "../jest.setup";
import { Quote } from "../../src/models/Quote";

describe("DeleteById - Quotes route", () => {
    let authorizationHeader = {};

    beforeAll(async () => {
        const user: Omit<User, "id"> = {
            email: "john@gmail.com",
            username: "john",
            password: "123456",
        };
        await testServer.post(AuthRoute.register).send(user);
        const loginRes = await testServer.post(AuthRoute.login).send(user);
        const accessToken = loginRes.body.accessToken;
        authorizationHeader = { Authorization: `Bearer ${accessToken}` };

        // Create two quotes
        const quote1: Omit<Quote, "id"> = {
            quote: "Seja a mudança que você quer ver no mundo.",
            author: "Mahatma Gandhi",
        };
        const quote2: Omit<Quote, "id"> = {
            quote: "Seja a mudança que você quer ver no mundo.",
            author: "Mahatma Gandhi",
        };
        await testServer.post(QuoteRoute.create).set(authorizationHeader).send(quote1);
        await testServer.post(QuoteRoute.create).set(authorizationHeader).send(quote2);
    });

    it("Should delete a quote successfully", async () => {
        const quote: Omit<Quote, "id"> = {
            quote: "A imaginação é mais importante que o conhecimento.",
            author: "Albert Einstein"
        };
        const resCreate = await testServer
            .post(QuoteRoute.create)
            .set(authorizationHeader)
            .send(quote);
        const quoteId = resCreate.body;
        const resDeleteById = await testServer
            .delete(QuoteRoute.routeForTests + quoteId)
            .set(authorizationHeader)
            .send();

        expect(resDeleteById.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });

    it("Should give an unauthorized error when trying to delete by id without an accessToken", async () => {
        const resCreate = await testServer
            .post(QuoteRoute.create)
            .set(authorizationHeader)
            .send();
        const quoteId = resCreate.body;
        const resDeleteById = await testServer
            .delete(QuoteRoute.routeForTests + quoteId)
            .send();

        expect(resDeleteById.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    });

    it("Should give a bad request error when trying to delete by id with an invalid quote id", async () => {
        const res = await testServer
            .delete(QuoteRoute.routeForTests + "blabla")
            .set(authorizationHeader)
            .send();

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty("errors.params.id");
    });

    it("Should give an error when trying to delete a quote that does not exist", async () => {
        const res = await testServer
            .delete(QuoteRoute.routeForTests + 200)
            .set(authorizationHeader)
            .send();

        expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(res.body).toHaveProperty("error");
    });

    it("Should give an error when trying to delete a quote that does not belong to the logged-in user", async () => {
        const user: Omit<User, "id"> = {
            email: "mary@gmail.com",
            username: "mary",
            password: "123456",
        };
        await testServer.post(AuthRoute.register).send(user);
        const loginRes = await testServer.post(AuthRoute.login).send(user);
        const accessToken = loginRes.body.accessToken;
        const maryAuthorizationHeader = { Authorization: `Bearer ${accessToken}` };
        const quoteIdPostedByJohn = 1;

        // Try to delete quote posted by user John logged in as user Mary
        const resDeleteQuoteFromAnotherUser = await testServer
            .delete(QuoteRoute.routeForTests + quoteIdPostedByJohn)
            .set(maryAuthorizationHeader)
            .send();
        expect(resDeleteQuoteFromAnotherUser.statusCode).toEqual(StatusCodes.NOT_FOUND);

        // Quote exists
        const resGetQuoteById = await testServer
            .get(QuoteRoute.routeForTests + quoteIdPostedByJohn)
            .set(maryAuthorizationHeader)
            .send();
        expect(resGetQuoteById.statusCode).toEqual(StatusCodes.OK);
        expect(resGetQuoteById.body).toHaveProperty("quote");
        expect(resGetQuoteById.body).toHaveProperty("author");

        // User John tries to delete the quote and everything works ok
        const resDeleteQuoteOk = await testServer
            .delete(QuoteRoute.routeForTests + quoteIdPostedByJohn)
            .set(authorizationHeader)
            .send();
        expect(resDeleteQuoteOk.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });
});