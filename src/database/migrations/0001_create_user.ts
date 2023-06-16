import { Knex } from "knex";
import { Table } from "../Table";

export async function up(knex: Knex) {
    return knex
        .schema
        .createTable(Table.Users, table => {
            table.bigIncrements("id").primary().index();
            table.string("email").notNullable().unique().checkLength(">=", 6);
            table.string("username").notNullable().checkLength(">=", 3);
            table.string("password").index().notNullable().checkLength(">=", 6);
        })
        .then(() => {
            console.log(`# Created table ${Table.Users}`);
        });
}

export async function down(knex: Knex) {
    return knex
        .schema
        .dropTable(Table.Users)
        .then(() => {
            console.log(`# Dropped table ${Table.Users}`);
        });
}