import { StatusCodes } from "http-status-codes";
import { testServer } from "../../jest.setup";
import { AuthRoute } from "../../../src/commom/RouteConstants";
import { User } from "../../../src/models/User";

describe(
    "Register - User auth route", () => {
        it("Should successfully register the user", async () => {
            const user: Omit<User, "id"> = {
                email: "john@gmail.com",
                username: "john",
                password: "123456",
            };

            const res = await testServer
                .post(AuthRoute.register)
                .send(user);
            expect(res.statusCode).toEqual(StatusCodes.CREATED);
            expect(typeof res.body).toEqual("number");
        });

        it("Should give error when trying to register without filling fields", async () => {
            const res = await testServer
                .post(AuthRoute.register)
                .send({});
            expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
            expect(res.body).toHaveProperty("errors.body.email");
            expect(res.body).toHaveProperty("errors.body.username");
            expect(res.body).toHaveProperty("errors.body.password");
        });

        it("Should give error when trying to register with duplicate email", async () => {
            const user: Omit<User, "id"> = {
                email: "mary@gmail.com",
                username: "mary",
                password: "123456",
            };

            const res1 = await testServer
                .post(AuthRoute.register)
                .send(user);
            expect(res1.statusCode).toEqual(StatusCodes.CREATED);
            expect(typeof res1.body).toEqual("number");

            const res2 = await testServer
                .post(AuthRoute.register)
                .send(user);
            expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(res2.body).toHaveProperty("error");
        });

        it("Should give error when trying to register with invalid email", async () => {
            const user: Omit<User, "id"> = {
                email: "johngmail.com",
                username: "john",
                password: "123456",
            };

            const res = await testServer
                .post(AuthRoute.register)
                .send(user);

            expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
            expect(res.body).toHaveProperty("errors.body.email");
        });

        it("Should give error when trying to register with a username that is too short", async () => {
            const user: Omit<User, "id"> = {
                email: "john@gmail.com",
                username: "jo",
                password: "123456",
            };

            const res = await testServer
                .post(AuthRoute.register)
                .send(user);

            expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
            expect(res.body).toHaveProperty("errors.body.username");
        });

        it("Should give error when trying to register with a password that is too short", async () => {
            const user: Omit<User, "id"> = {
                email: "john@gmail.com",
                username: "john",
                password: "123",
            };

            const res = await testServer
                .post(AuthRoute.register)
                .send(user);

            expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
            expect(res.body).toHaveProperty("errors.body.password");
        });
    }
);