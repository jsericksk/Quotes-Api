import { Knex } from "knex";
import { Table } from "../Table";
import { v4 as uuidv4 } from "uuid";

export async function up(knex: Knex) {
    return knex
        .schema
        .createTable(Table.refreshTokens, table => {
            table.uuid("id").primary().defaultTo(uuidv4());
            table.string("refreshToken").notNullable();
            table
                .integer("userId")
                .index()
                .references("id")
                .inTable(Table.users)
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
        })
        .then(() => {
            console.log(`# Created table ${Table.refreshTokens}`);
        });
}

export async function down(knex: Knex) {
    return knex
        .schema
        .dropTableIfExists(Table.refreshTokens)
        .then(() => {
            console.log(`# Dropped table ${Table.refreshTokens}`);
        });
}