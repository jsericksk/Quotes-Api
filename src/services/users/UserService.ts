import * as getUserByEmail from "./getUserByEmail";
import * as registerUser from "./registerUser";

export const UserService = {
    ...registerUser,
    ...getUserByEmail
};