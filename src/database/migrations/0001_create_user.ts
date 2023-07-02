import { Knex } from "knex";
import { Table } from "../Table";
import { AuthInputConstraint } from "../../commom/InputConstraints";

export async function up(knex: Knex) {
    return knex
        .schema
        .createTable(Table.users, table => {
            table.increments("id").primary().index();
            table.string("email", AuthInputConstraint.email.max)
                .index()
                .notNullable()
                .unique()
                .checkLength(">=", AuthInputConstraint.email.min);
            table
                .string("username", AuthInputConstraint.username.max)
                .index()
                .notNullable()
                .unique()
                .checkLength(">=", AuthInputConstraint.username.min);
            table.string("password").notNullable().checkLength(">=", AuthInputConstraint.password.min);
        })
        .then(() => {
            console.log(`# Created table ${Table.users}`);
        });
}

export async function down(knex: Knex) {
    return knex
        .schema
        .dropTableIfExists(Table.users)
        .then(() => {
            console.log(`# Dropped table ${Table.users}`);
        });
}