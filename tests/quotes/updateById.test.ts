import { StatusCodes } from "http-status-codes";
import { AuthRoute, QuoteRoute } from "../../src/commom/RouteConstants";
import { User } from "../../src/models/User";
import { testServer } from "../jest.setup";
import { Quote } from "../../src/models/Quote";
import { TestUtils } from "../utils/TestUtils";

describe("UpdateById - Quotes route", () => {
    const testUtils = new TestUtils();
    let authorizationHeader = {};
    const quote: Omit<Quote, "id"> = {
        quote: "A imaginação é mais importante que o conhecimento.",
        author: "Albert Einstein"
    };

    beforeAll(async () => {
        const registeredUserAccessToken = await testUtils.registerUser();
        authorizationHeader = { Authorization: `Bearer ${registeredUserAccessToken}` };
        await testUtils.createQuotes(registeredUserAccessToken);
    });

    it("Should udpate a quote successfully", async () => {
        const resCreate = await testServer
            .post(QuoteRoute.create)
            .set(authorizationHeader)
            .send(quote);
        const quoteId = resCreate.body;
        const resUpdateById = await testServer
            .put(QuoteRoute.routeForTests + quoteId)
            .set(authorizationHeader)
            .send({ quote: "Frase modificada", author: "John" });

        expect(resUpdateById.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });

    it("Should give an unauthorized error when trying to update by id without an accessToken", async () => {
        const resCreate = await testServer
            .post(QuoteRoute.create)
            .set(authorizationHeader)
            .send(quote);
        const quoteId = resCreate.body;
        const resUpdateById = await testServer
            .put(QuoteRoute.routeForTests + quoteId)
            .send();

        expect(resUpdateById.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    });

    it("Should give a bad request error when trying to update by id with empty fields", async () => {
        const resCreate = await testServer
            .post(QuoteRoute.create)
            .set(authorizationHeader)
            .send(quote);
        const quoteId = resCreate.body;
        const resUpdateById = await testServer
            .put(QuoteRoute.routeForTests + quoteId)
            .set(authorizationHeader)
            .send();

        expect(resUpdateById.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(resUpdateById.body).toHaveProperty("errors.body.quote");
        expect(resUpdateById.body).toHaveProperty("errors.body.author");
    });

    it("Should give a bad request error when trying to update by id with an invalid quote id", async () => {
        const res = await testServer
            .put(QuoteRoute.routeForTests + "blabla")
            .set(authorizationHeader)
            .send({ quote: "Frase modificada", author: "John" });

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty("errors.params.id");
    });

    it("Should give an error when trying to update a quote that does not exist", async () => {
        const res = await testServer
            .put(QuoteRoute.routeForTests + 200)
            .set(authorizationHeader)
            .send({ quote: "Frase modificada", author: "John" });

        expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(res.body).toHaveProperty("error");
    });

    it("Should give an error when trying to update a quote that does not belong to the logged-in user", async () => {
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

        // Try to update quote posted by user John logged in as user Mary
        const resUpdateQuoteFromAnotherUser = await testServer
            .put(QuoteRoute.routeForTests + quoteIdPostedByJohn)
            .set(maryAuthorizationHeader)
            .send({ quote: "Frase modificada", author: "John" });
        expect(resUpdateQuoteFromAnotherUser.statusCode).toEqual(StatusCodes.NOT_FOUND);

        // Quote exists
        const resGetQuoteById = await testServer
            .get(QuoteRoute.routeForTests + quoteIdPostedByJohn)
            .set(maryAuthorizationHeader)
            .send();
        expect(resGetQuoteById.statusCode).toEqual(StatusCodes.OK);
        expect(resGetQuoteById.body).toHaveProperty("quote");
        expect(resGetQuoteById.body).toHaveProperty("author");

        // User John tries to update the quote and everything works ok
        const resUpdate = await testServer
            .put(QuoteRoute.routeForTests + quoteIdPostedByJohn)
            .set(authorizationHeader)
            .send({
                quote: "Frase modificada",
                author: "John"
            });
        expect(resUpdate.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });
});