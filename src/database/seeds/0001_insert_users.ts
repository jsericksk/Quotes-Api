import { Knex } from "knex";
import { Table } from "../Table";
import { User } from "../../models/User";

export async function seed(knex: Knex) {
    const hasData = await knex(Table.users).select().first();
    if (hasData) return;
    await knex(Table.users).insert(users);
}

const users: Omit<User, "id">[] = [
    {
        email: "test_user1@gmail.com",
        username: "John - Test",
        password: "$2a$10$bLBU0djn2psZCYnEZCA0NO1m7GtWMK6.KNnCJuLT6W7tuXcE9DD/a"
    },
    {
        email: "test_user2@gmail.com",
        username: "Anna - Test",
        password: "$2a$10$fhUtPKpqmlDqTF/KEGvoH.vShwVZIr0N9ll2CcbR54Pwskzj2m5Du"
    },
    {
        email: "test_user3@gmail.com",
        username: "Mary - Test",
        password: "$2a$10$S2i3RTQBQn0ti3RX.phoueL.bRKtlS5RT1cIIH4mV6./R9pm5umqe"
    },
];