import { StatusCodes } from "http-status-codes";
import { AuthRoute, QuoteRoute } from "../../src/commom/RouteConstants";
import { User } from "../../src/models/User";
import { testServer } from "../jest.setup";
import { Quote } from "../../src/models/Quote";
import { TestUtils } from "../utils/TestUtils";

describe("DeleteById - Quotes route", () => {
    const testUtils = new TestUtils();
    let authorizationHeader = {};
    let quoteIdPostedByJohn: number;

    beforeAll(async () => {
        const registeredUserAccessToken = await testUtils.registerUser();
        authorizationHeader = { Authorization: `Bearer ${registeredUserAccessToken}` };

        const quote: Omit<Quote, "id"> = {
            quote: "A imaginação é mais importante que o conhecimento.",
            author: "Albert Einstein"
        };
        const resCreate = await testServer
            .post(QuoteRoute.create)
            .set(authorizationHeader)
            .send(quote);
        quoteIdPostedByJohn = resCreate.body.id;
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
        const quoteId = resCreate.body.id;
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
        const quoteId = resCreate.body.id;
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
        const resLogin = await testServer.post(AuthRoute.login).send(user);
        const accessToken = resLogin.body.accessToken;
        const maryAuthorizationHeader = { Authorization: `Bearer ${accessToken}` };

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