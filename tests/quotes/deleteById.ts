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
    });

    it("Should delete quote successfully", async () => {
        const quote: Omit<Quote, "id"> = {
            quote: "A imaginação é mais importante que o conhecimento.",
            author: "Albert Einstein"
        };
        const resCreate = await testServer
            .post(QuoteRoute.create)
            .set(authorizationHeader)
            .send(quote);
        const quoteId = resCreate.body;
        const resUpdateById = await testServer
            .delete(QuoteRoute.routeForTests + quoteId)
            .set(authorizationHeader)
            .send();

        expect(resUpdateById.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });

    it("Should give unauthorized error when trying delete by id without accessToken", async () => {
        const resCreate = await testServer
            .post(QuoteRoute.create)
            .set(authorizationHeader)
            .send();
        const quoteId = resCreate.body;
        const resUpdateById = await testServer
            .delete(QuoteRoute.routeForTests + quoteId)
            .send();

        expect(resUpdateById.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    });

    it("Should give bad request error when trying delete by id with invalid quote id", async () => {
        const res = await testServer
            .delete(QuoteRoute.routeForTests + "blabla")
            .set(authorizationHeader)
            .send();

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty("errors.params.id");
    });

    it("Should give error when trying delete quote that not exists", async () => {
        const res = await testServer
            .delete(QuoteRoute.routeForTests + 200)
            .set(authorizationHeader)
            .send();

        expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(res.body).toHaveProperty("error");
    });
});