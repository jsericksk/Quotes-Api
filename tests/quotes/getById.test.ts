import { StatusCodes } from "http-status-codes";
import { AuthRoute, QuoteRoute } from "../../src/commom/RouteConstants";
import { User } from "../../src/models/User";
import { testServer } from "../jest.setup";
import { Quote } from "../../src/models/Quote";

describe("GetById - Quotes route", () => {
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

    it("Should get quote by id successfully", async () => {
        const resCreate = await testServer
            .post(QuoteRoute.create)
            .set(authorizationHeader)
            .send(quote);
        const quoteId = resCreate.body;
        const resGetById = await testServer
            .get(QuoteRoute.routeForTests + quoteId)
            .set(authorizationHeader)
            .send();

        expect(resGetById.statusCode).toEqual(StatusCodes.OK);
        expect(resGetById.body).toHaveProperty("quote");
        expect(resGetById.body).toHaveProperty("author");
        expect(resGetById.body).toHaveProperty("publicationDate");
        expect(resGetById.body).toHaveProperty("postedByUsername");
        expect(resGetById.body).toHaveProperty("postedByUserId");
    });

    it("Should give unauthorized error when trying get by id without accessToken", async () => {
        const resCreate = await testServer
            .post(QuoteRoute.create)
            .set(authorizationHeader)
            .send(quote);
        const quoteId = resCreate.body;
        const resGetById = await testServer
            .get(QuoteRoute.routeForTests + quoteId)
            .send();

        expect(resGetById.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    });

    it("Should give bad request error when trying get by id with invalid quote id", async () => {
        const res = await testServer
            .get(QuoteRoute.routeForTests + "blablabla")
            .set(authorizationHeader)
            .send();

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty("errors.params.id");
    });

    it("Should give error when trying get by id with quote that not exists", async () => {
        const res = await testServer
            .get(QuoteRoute.routeForTests + 1000)
            .set(authorizationHeader)
            .send();

        expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res.body).toHaveProperty("error");
    });
});