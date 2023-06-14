import { Quote } from "../../../models/Quote";
import { User } from "../../../models/User";

declare module "knex/types/tables" {
    interface Tables {
        user: User
        quote: Quote
    }
}