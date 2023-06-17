import { StatusCodes } from "http-status-codes";
import { AuthRoute, QuoteRoute } from "../../src/commom/RouteConstants";
import { User } from "../../src/models/User";
import { testServer } from "../jest.setup";
import { Quote } from "../../src/models/Quote";

describe("Create - Quotes route", () => {
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

    it("Should create a quote successfully", async () => {
        const quote: Omit<Quote, "id"> = {
            quote: "A imaginação é mais importante que o conhecimento.",
            author: "Albert Einstein"
        };

        const res = await testServer
            .post(QuoteRoute.create)
            .set(authorizationHeader)
            .send(quote);

        expect(res.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof res.body).toEqual("number");
    });

    it("Should give unauthorized error when creating without accessToken", async () => {
        const quote: Omit<Quote, "id"> = {
            quote: "A imaginação é mais importante que o conhecimento.",
            author: "Albert Einstein"
        };

        const res = await testServer
            .post(QuoteRoute.create)
            .send(quote);

        expect(res.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    });

    it("Should give bad request error when trying to create with empty fields", async () => {
        const res = await testServer
            .post(QuoteRoute.create)
            .set(authorizationHeader)
            .send({});

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty("errors.body.quote");
        expect(res.body).toHaveProperty("errors.body.author");
    });

    it("Should give bad request error when trying to create with a quote that is too short", async () => {
        const quote: Omit<Quote, "id"> = {
            quote: "Yeap",
            author: "Unknown"
        };
        
        const res = await testServer
            .post(QuoteRoute.create)
            .set(authorizationHeader)
            .send(quote);

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty("errors.body.quote");
    });
});