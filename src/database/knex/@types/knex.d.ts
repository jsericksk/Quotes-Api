import { Quote } from "../../../models/Quote";
import { RefreshToken } from "../../../models/RefreshToken";
import { User } from "../../../models/User";

declare module "knex/types/tables" {
    interface Tables {
        user: User
        quote: Quote
        refreshToken: RefreshToken
    }
}