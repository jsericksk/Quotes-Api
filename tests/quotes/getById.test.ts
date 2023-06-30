import { StatusCodes } from "http-status-codes";
import { QuoteRoute } from "../../src/commom/RouteConstants";
import { testServer } from "../jest.setup";
import { Quote } from "../../src/models/Quote";
import { TestUtils } from "../utils/TestUtils";

describe("GetById - Quotes route", () => {
    const testUtils = new TestUtils();
    let authorizationHeader = {};
    const quote: Omit<Quote, "id"> = {
        quote: "A imaginação é mais importante que o conhecimento.",
        author: "Albert Einstein"
    };

    beforeAll(async () => {
        const registeredUserAccessToken = await testUtils.registerUser();
        authorizationHeader = { Authorization: `Bearer ${registeredUserAccessToken}` };
    });

    it("Should get a quote by id successfully", async () => {
        const resCreate = await testServer
            .post(QuoteRoute.create)
            .set(authorizationHeader)
            .send(quote);
        const quoteId = resCreate.body.id;
        const resGetById = await testServer
            .get(QuoteRoute.routeForTests + quoteId)
            .set(authorizationHeader)
            .send();

        expect(resGetById.statusCode).toEqual(StatusCodes.OK);
        expect(resGetById.body).toHaveProperty("id");
        expect(resGetById.body).toHaveProperty("quote");
        expect(resGetById.body).toHaveProperty("author");
        expect(resGetById.body).toHaveProperty("publicationDate");
        expect(resGetById.body).toHaveProperty("postedByUsername");
        expect(resGetById.body).toHaveProperty("postedByUserId");
    });

    it("Should give an unauthorized error when trying to get by id without an accessToken", async () => {
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

    it("Should give a bad request error when trying to get by id with an invalid quote id", async () => {
        const res = await testServer
            .get(QuoteRoute.routeForTests + "blablabla")
            .set(authorizationHeader)
            .send();

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty("errors.params.id");
    });

    it("Should give an error when trying to get by id with a quote that does not exist", async () => {
        const res = await testServer
            .get(QuoteRoute.routeForTests + 1000)
            .set(authorizationHeader)
            .send();

        expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(res.body).toHaveProperty("error");
    });
});