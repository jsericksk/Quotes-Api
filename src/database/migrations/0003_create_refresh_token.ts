import { Knex } from "knex";
import { Table } from "../Table";
import { v4 as uuidv4 } from "uuid";

export async function up(knex: Knex) {
    return knex
        .schema
        .createTable(Table.refreshToken, table => {
            table.uuid("id").primary().defaultTo(uuidv4());
            table.string("refreshToken").notNullable();
            table
                .integer("userId")
                .index()
                .references("id")
                .inTable(Table.user)
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
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