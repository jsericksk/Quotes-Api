import { StatusCodes } from "http-status-codes";
import { testServer } from "../../jest.setup";
import { AuthRoute } from "../../../src/commom/RouteConstants";
import { User } from "../../../src/models/User";

const user: Omit<User, "id"> = {
    email: "john@gmail.com",
    username: "john",
    password: "123456",
};

describe(
    "Login - User auth route", () => {
        beforeAll(async () => {
            await testServer.post(AuthRoute.register).send(user);
        });

        it("Should successfully login and return access token", async () => {
            const res = await testServer.post(AuthRoute.login).send(user);

            expect(res.statusCode).toEqual(StatusCodes.OK);
            expect(res.body).toHaveProperty("accessToken");
        });

        it("Should give error when trying to login with a invalid email and short password", async () => {
            const res = await testServer
                .post(AuthRoute.login)
                .send({ email: "marygmail.com", password: "123" });

            expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
            expect(res.body).toHaveProperty("errors.body.email");
            expect(res.body).toHaveProperty("errors.body.password");
        });

        it("Should give error when trying to login with a wrong password", async () => {
            const res = await testServer
                .post(AuthRoute.login)
                .send({ email: "john@gmail.com", password: "12345678" });

            expect(res.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
            expect(res.body).toHaveProperty("error");
        });
    }
);