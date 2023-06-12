import { Table } from "../../database/Tables";
import { Knex } from "../../database/knex/Knex";
import { User } from "../../models/User";
import { PasswordCrypto } from "../auth/PasswordCrypto";
import * as getUserByEmail from "./getUserByEmail";
import * as registerUser from "./registerUser";

export const UserService2 = {
    ...registerUser,
    ...getUserByEmail
};
