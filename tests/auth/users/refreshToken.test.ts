import { StatusCodes } from "http-status-codes";
import { testServer } from "../../jest.setup";
import { AuthRoute, QuoteRoute } from "../../../src/commom/RouteConstants";
import { User } from "../../../src/models/User";

describe(
    "Refresh Token - User auth route", () => {
        const user: Omit<User, "id"> = {
            email: "john@gmail.com",
            username: "john",
            password: "123456",
        };

        beforeAll(async () => {
            await testServer.post(AuthRoute.register).send(user);
        });

        it("Should successfully generate access token and refresh token", async () => {
            await testServer.post(AuthRoute.register).send(user);
            const resLogin = await testServer.post(AuthRoute.login).send(user);
            expect(resLogin.body).toHaveProperty("accessToken");
            expect(resLogin.body).toHaveProperty("refreshToken");

            const refreshToken = resLogin.body.refreshToken;
            const resRefreshToken = await testServer.post(AuthRoute.refreshToken).send({ refreshToken });
            expect(resRefreshToken.statusCode).toEqual(StatusCodes.OK);
            expect(resRefreshToken.body).toHaveProperty("accessToken");
            expect(resRefreshToken.body).toHaveProperty("refreshToken");

            const newAccessToken = resRefreshToken.body.accessToken;
            const resCreate = await testServer
                .post(QuoteRoute.create)
                .set({ Authorization: `Bearer ${newAccessToken}` })
                .send({ quote: "Frase de teste", author: "John" });
            expect(resCreate.statusCode).toEqual(StatusCodes.CREATED);
        });

        it("Should give bad request error when trying to generate refresh token without a refresh token", async () => {
            const res = await testServer.post(AuthRoute.refreshToken).send();

            expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
            expect(res.body).toHaveProperty("errors.body.refreshToken");
        });

        it("Should give error when trying to use invalid refresh token", async () => {
            const res = await testServer.post(AuthRoute.refreshToken).send({ refreshToken: "Blablablabla" });
            expect(res.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
            expect(res.body).toHaveProperty("error");
        });

        it("Should give error when trying to use refresh token as access token", async () => {
            await testServer.post(AuthRoute.register).send(user);
            const resLogin = await testServer.post(AuthRoute.login).send(user);
            const refreshToken = resLogin.body.refreshToken;
            const resRefreshToken = await testServer.post(AuthRoute.refreshToken).send({ refreshToken });
            const generatedRefreshToken = resRefreshToken.body.refreshToken;

            const resCreate = await testServer
                .post(QuoteRoute.create)
                .set({ Authorization: `Bearer ${generatedRefreshToken}` })
                .send({ quote: "Frase de teste", author: "John" });
            expect(resCreate.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
            expect(resCreate.body).toHaveProperty("error");
        });
    }
);