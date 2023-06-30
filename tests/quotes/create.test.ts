import { StatusCodes } from "http-status-codes";
import { QuoteRoute } from "../../src/commom/RouteConstants";
import { testServer } from "../jest.setup";
import { Quote } from "../../src/models/Quote";
import { TestUtils } from "../utils/TestUtils";

describe("Create - Quotes route", () => {
    const testUtils = new TestUtils();
    let authorizationHeader = {};

    beforeAll(async () => {
        const registeredUserAccessToken = await testUtils.registerUser();
        authorizationHeader = { Authorization: `Bearer ${registeredUserAccessToken}` };
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
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("quote");
        expect(res.body).toHaveProperty("author");
        expect(res.body).toHaveProperty("postedByUsername");
        expect(res.body).toHaveProperty("postedByUserId");
        expect(res.body).toHaveProperty("publicationDate");
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