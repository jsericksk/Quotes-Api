import { StatusCodes } from "http-status-codes";
import { QuoteRoute } from "../../src/commom/RouteConstants";
import { testServer } from "../jest.setup";
import { TestUtils } from "../utils/TestUtils";

describe("GetAll - Quotes route", () => {
    const testUtils = new TestUtils();
    let authorizationHeader = {};

    beforeAll(async () => {
        const registeredUserAccessToken = await testUtils.registerUser();
        authorizationHeader = { Authorization: `Bearer ${registeredUserAccessToken}` };
    });

    it("Should get all quotes successfully", async () => {
        const res = await testServer
            .get(QuoteRoute.getAll)
            .set(authorizationHeader)
            .send();

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toHaveProperty("info.count");
        expect(res.body).toHaveProperty("info.pages");
        expect(res.body).toHaveProperty("info.next");
        expect(res.body).toHaveProperty("info.previous");
        expect(Array.isArray(res.body.results)).toBe(true);
    });

    it("Should get quotes successfully with valid page query", async () => {
        const res = await testServer
            .get(QuoteRoute.getAll + "?page=2")
            .set(authorizationHeader)
            .send();

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toHaveProperty("info.count");
        expect(res.body).toHaveProperty("info.pages");
        expect(res.body).toHaveProperty("info.next");
        expect(res.body).toHaveProperty("info.previous");
        expect(Array.isArray(res.body.results)).toBe(true);
    });

    it("Should get quotes successfully with valid filter query", async () => {
        const res = await testServer
            .get(QuoteRoute.getAll + "?filter=vida")
            .set(authorizationHeader)
            .send();

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toHaveProperty("info.count");
        expect(res.body).toHaveProperty("info.pages");
        expect(res.body).toHaveProperty("info.next");
        expect(res.body).toHaveProperty("info.previous");
        expect(Array.isArray(res.body.results)).toBe(true);
    });

    it("Should get quotes successfully with valid page and filter query", async () => {
        const res = await testServer
            .get(QuoteRoute.getAll + "?page=1&filter=vida")
            .set(authorizationHeader)
            .send();

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toHaveProperty("info.count");
        expect(res.body).toHaveProperty("info.pages");
        expect(res.body).toHaveProperty("info.next");
        expect(res.body).toHaveProperty("info.previous");
        expect(Array.isArray(res.body.results)).toBe(true);
    });

    it("Should get quotes successfully with next page info", async () => {
        const res1 = await testServer
            .get(QuoteRoute.getAll + "?page=1")
            .set(authorizationHeader)
            .send();
        expect(res1.statusCode).toEqual(StatusCodes.OK);
        expect(res1.body).toHaveProperty("info.count");
        expect(res1.body).toHaveProperty("info.pages");
        expect(res1.body).toHaveProperty("info.next");
        expect(res1.body).toHaveProperty("info.previous");
        expect(Array.isArray(res1.body.results)).toBe(true);

        const nextPageRoute = res1.body.info.next;
        const res2 = await testServer
            .get(nextPageRoute)
            .set(authorizationHeader)
            .send();
        expect(res2.statusCode).toEqual(StatusCodes.OK);
        expect(res2.body).toHaveProperty("info.count");
        expect(res2.body).toHaveProperty("info.pages");
        expect(res2.body).toHaveProperty("info.next");
        expect(res2.body).toHaveProperty("info.previous");
        expect(Array.isArray(res2.body.results)).toBe(true);
    });

    it("Should get quotes successfully with previous page info", async () => {
        const res1 = await testServer
            .get(QuoteRoute.getAll + "?page=2")
            .set(authorizationHeader)
            .send();
        expect(res1.statusCode).toEqual(StatusCodes.OK);
        expect(res1.body).toHaveProperty("info.count");
        expect(res1.body).toHaveProperty("info.pages");
        expect(res1.body).toHaveProperty("info.next");
        expect(res1.body).toHaveProperty("info.previous");
        expect(Array.isArray(res1.body.results)).toBe(true);

        const previousPageRoute = res1.body.info.previous;
        const res2 = await testServer
            .get(previousPageRoute)
            .set(authorizationHeader)
            .send();
        expect(res2.statusCode).toEqual(StatusCodes.OK);
        expect(res2.body).toHaveProperty("info.count");
        expect(res2.body).toHaveProperty("info.pages");
        expect(res2.body).toHaveProperty("info.next");
        expect(res2.body).toHaveProperty("info.previous");
        expect(Array.isArray(res2.body.results)).toBe(true);
    });

    it("Should give an unauthorized error when trying to get quotes without an accessToken", async () => {
        const resGetById = await testServer
            .get(QuoteRoute.getAll)
            .send();
        expect(resGetById.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    });

    it("Should give a bad request error when trying to get quotes with invalid page query", async () => {
        const res1 = await testServer
            .get(QuoteRoute.getAll + "?page=blablabla")
            .set(authorizationHeader)
            .send();
        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty("errors.query.page");

        const res2 = await testServer
            .get(QuoteRoute.getAll + "?page=-1")
            .set(authorizationHeader)
            .send();
        expect(res2.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res2.body).toHaveProperty("errors.query.page");
    });

    it("Should give a not found error when trying to get quotes with the page not containing any more items", async () => {
        const res = await testServer
            .get(QuoteRoute.getAll + "?page=10")
            .set(authorizationHeader)
            .send();
        expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(res.body).toHaveProperty("error");
    });

    it("Should give a not found error when trying to get quotes with a filter that doesn't contain quotes", async () => {
        const res = await testServer
            .get(QuoteRoute.getAll + "?filter=blablabla")
            .set(authorizationHeader)
            .send();
        expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(res.body).toHaveProperty("error");
    });
});