import * as register from "./register";
import * as login from "./login";

export const UserController = {
    ...register,
    ...login
};