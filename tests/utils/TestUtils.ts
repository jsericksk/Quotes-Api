import { AuthRoute } from "../../src/commom/RouteConstants";
import { User } from "../../src/models/User";
import { testServer } from "../jest.setup";

export class TestUtils {

    async registerUser(): Promise<string> {
        const user: Omit<User, "id"> = {
            email: "john@gmail.com",
            username: "john",
            password: "123456",
        };
        await testServer.post(AuthRoute.register).send(user);
        const loginRes = await testServer.post(AuthRoute.login).send(user);
        const accessToken = loginRes.body.accessToken;
        return accessToken;
    }
}