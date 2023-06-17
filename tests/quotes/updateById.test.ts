import { StatusCodes } from "http-status-codes";
import { AuthRoute, QuoteRoute } from "../../src/commom/RouteConstants";
import { User } from "../../src/models/User";
import { testServer } from "../jest.setup";
import { Quote } from "../../src/models/Quote";

describe("UpdateById - Quotes route", () => {
    let authorizationHeader = {};
    const quote: Omit<Quote, "id"> = {
        quote: "A imaginação é mais importante que o conhecimento.",
        author: "Albert Einstein"
    };

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
    });

    it("Should udpate quote successfully", async () => {
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

    it("Should give unauthorized error when trying update by id without accessToken", async () => {
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

    it("Should give bad request error when trying update by id with empty fields", async () => {
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

    it("Should give bad request error when trying update by id with invalid quote id", async () => {
        const res = await testServer
            .put(QuoteRoute.routeForTests + "blabla")
            .set(authorizationHeader)
            .send({ quote: "Frase modificada", author: "John" });

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty("errors.params.id");
    });

    it("Should give error when trying update quote that not exists", async () => {
        const res = await testServer
            .put(QuoteRoute.routeForTests + 200)
            .set(authorizationHeader)
            .send({ quote: "Frase modificada", author: "John" });

        expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(res.body).toHaveProperty("error");
    });
});