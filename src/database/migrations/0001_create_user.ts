import { Knex } from "knex";
import { Table } from "../Table";

export async function up(knex: Knex) {
    return knex
        .schema
        .createTable(Table.user, table => {
            table.increments("id").primary().index();
            table.string("email").index().notNullable().unique().checkLength(">=", 6);
            table.string("username").notNullable().checkLength(">=", 3);
            table.string("password").notNullable().checkLength(">=", 6);
        })
        .then(() => {
            console.log(`# Created table ${Table.user}`);
        });
}

export async function down(knex: Knex) {
    return knex
        .schema
        .dropTable(Table.user)
        .then(() => {
            console.log(`# Dropped table ${Table.user}`);
        });
}