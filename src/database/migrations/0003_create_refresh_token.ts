import { Knex } from "knex";
import { Table } from "../Table";

export async function up(knex: Knex) {
    return knex
        .schema
        .createTable(Table.refreshToken, table => {
            table.integer("id").primary().index();
            table.string("refreshToken").notNullable();
        })
        .then(() => {
            console.log(`# Created table ${Table.refreshToken}`);
        });
}

export async function down(knex: Knex) {
    return knex
        .schema
        .dropTable(Table.refreshToken)
        .then(() => {
            console.log(`# Dropped table ${Table.refreshToken}`);
        });
}