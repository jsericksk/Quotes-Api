import { Quote } from "../../../models/Quote";
import { RefreshToken } from "../../../models/RefreshToken";
import { User } from "../../../models/User";

declare module "knex/types/tables" {
    interface Tables {
        users: User
        quotes: Quote
        refreshTokens: RefreshToken
    }
}