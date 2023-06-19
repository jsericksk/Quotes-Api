import { AuthRoute, QuoteRoute } from "../../src/commom/RouteConstants";
import { Quote } from "../../src/models/Quote";
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

    async createQuotes(accessToken: string) {
        const quote1: Omit<Quote, "id"> = {
            quote: "Seja a mudança que você quer ver no mundo.",
            author: "Mahatma Gandhi",
        };
        const quote2: Omit<Quote, "id"> = {
            quote: "Seja a mudança que você quer ver no mundo.",
            author: "Mahatma Gandhi",
        };
        await testServer.post(QuoteRoute.create).set({ Authorization: `Bearer ${accessToken}` }).send(quote1);
        await testServer.post(QuoteRoute.create).set({ Authorization: `Bearer ${accessToken}` }).send(quote2);
    }
}