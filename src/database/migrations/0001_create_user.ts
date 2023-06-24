import { Knex } from "knex";
import { Table } from "../Table";

export async function up(knex: Knex) {
    return knex
        .schema
        .createTable(Table.users, table => {
            table.increments("id").primary().index();
            table.string("email", 270).index().notNullable().unique().checkLength(">=", 6);
            table.string("username", 50).notNullable().checkLength(">=", 3);
            table.string("password").notNullable().checkLength(">=", 6);
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